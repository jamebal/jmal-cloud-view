<template>
  <div class="three-preview-container">
    <div v-if="loading" class="overlay loading-overlay">
      <common-loading :text="loadProgress > 0 ? `加载中 ${loadProgress}%` : '准备场景...'" />
    </div>

    <div v-if="errorMsg" class="overlay error-overlay">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMsg }}</span>
      </div>
    </div>

    <div class="info-panel" v-if="!loading && !errorMsg && modelSize">
      <div class="info-row">
        <span class="label">尺寸:</span>
        <span class="value">{{ modelSize.x }} x {{ modelSize.y }} x {{ modelSize.z }} mm</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="controls-panel" v-if="!loading && !errorMsg">
      <div class="control-btn color-btn-wrapper" title="修改模型颜色">
        <span class="color-dot" :style="{ backgroundColor: modelColor }"></span>
        <span>换色</span>
        <input
          type="color"
          v-model="modelColor"
          @input="handleColorChange"
          class="hidden-color-input"
        />
      </div>

      <button
        class="control-btn"
        :class="{ active: showWireframe }"
        @click="toggleWireframe"
        title="显示三角网格"
      >
        线框
      </button>

      <button
        class="control-btn"
        :class="{ active: isAutoRotating }"
        @click="toggleAutoRotate"
        title="自动旋转展示"
      >
        旋转
      </button>

      <button
        class="control-btn"
        :class="{ active: showHelpers }"
        @click="toggleHelpers"
        title="显示地面网格与坐标轴"
      >
        网格
      </button>

      <button class="control-btn" @click="resetView" title="重置视角">
        重置
      </button>

      <button class="control-btn" @click="takeSnapshot" title="下载截图">
        截图
      </button>
    </div>

    <div ref="canvasContainer" class="canvas-wrapper"></div>
  </div>
</template>

<script>
import CommonLoading from '@/components/loading/CommonLoading.vue'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';

export default {
  name: "ThreeModelPreview",
  components: { CommonLoading },
  props: {
    fileUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      loadProgress: 0,
      errorMsg: '',

      // 状态与设置
      showWireframe: false,
      isAutoRotating: false,
      showHelpers: false,
      modelColor: '#42b983', // 默认颜色

      modelSize: null,

      // Three.js 对象
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      currentModel: null,
      axesHelper: null,
      gridHelper: null,
      cameraLight: null,

      resizeObserver: null,
      animationId: null,
      initialCameraState: null,
    };
  },
  watch: {
    fileUrl: {
      handler(val) {
        if (val) this.reloadModel();
      },
      immediate: false
    }
  },
  mounted() {
    this.initThree();
    this.observeResize();
    if (this.fileUrl) {
      this.loadModel();
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.cleanup();
  },
  methods: {
    initThree() {
      this.$emit('onReady');
      const container = this.$refs.canvasContainer;
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;

      this.scene = new THREE.Scene();
      this.scene.background = null;

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
      this.camera.position.set(10, 10, 10);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.innerHTML = '';
      container.appendChild(this.renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      this.cameraLight = new THREE.DirectionalLight(0xffffff, 0.8);
      this.camera.add(this.cameraLight);
      this.scene.add(this.camera);

      this.axesHelper = new THREE.AxesHelper(100);
      this.axesHelper.visible = false;
      this.scene.add(this.axesHelper);

      this.gridHelper = new THREE.GridHelper(500, 50, 0x888888, 0xdddddd);
      this.gridHelper.visible = false;
      this.gridHelper.position.y = -0.05;
      this.scene.add(this.gridHelper);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      this.animate();
    },

    loadModel() {
      if (!this.fileUrl) return;

      this.loading = true;
      this.errorMsg = '';
      this.loadProgress = 0;
      this.showWireframe = false;
      this.modelSize = null;

      this.clearScene();

      const ext = this.fileUrl.split('.').pop().toLowerCase();

      const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
          this.loadProgress = Math.round((xhr.loaded / xhr.total) * 100);
        }
      };

      const onError = (e) => {
        console.error("ThreeLoadError:", e);
        this.errorMsg = '模型加载失败';
        this.loading = false;
      };

      if (ext === 'stl') {
        const loader = new STLLoader();
        loader.load(this.fileUrl, (geometry) => {
          geometry.center();

          // 使用当前选中的颜色
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.modelColor),
            roughness: 0.5,
            metalness: 0.1,
            side: THREE.DoubleSide
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.rotation.x = -Math.PI / 2;
          mesh.updateMatrixWorld();

          this.addToSceneAndFit(mesh);
        }, onProgress, onError);

      } else if (ext === '3mf') {
        const loader = new ThreeMFLoader();
        loader.load(this.fileUrl, (group) => {
          group.rotation.x = -Math.PI / 2;
          group.updateMatrixWorld();
          // 3MF 可能自带颜色
          this.addToSceneAndFit(group);
        }, onProgress, onError);
      } else {
        this.errorMsg = `不支持的格式: .${ext}`;
        this.loading = false;
      }
    },

    handleColorChange(event) {
      const colorHex = event.target.value;
      this.modelColor = colorHex;
      if (!this.currentModel) return;
      this.currentModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(mat => {
            // 只改颜色，保留其他属性
            mat.color.set(colorHex);
          });
        }
      });
    },

    addToSceneAndFit(object) {
      this.currentModel = object;
      this.scene.add(object);

      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      if (size.length() === 0) {
        this.errorMsg = '模型为空';
        this.loading = false;
        return;
      }

      this.modelSize = {
        x: Number(size.x.toFixed(2)),
        y: Number(size.y.toFixed(2)),
        z: Number(size.z.toFixed(2))
      };

      object.position.x += (object.position.x - center.x);
      object.position.y += (object.position.y - center.y);
      object.position.z += (object.position.z - center.z);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2.0;

      this.camera.near = maxDim / 1000;
      this.camera.far = maxDim * 100;
      this.camera.updateProjectionMatrix();

      const initPos = new THREE.Vector3(maxDim, maxDim, cameraZ);
      this.camera.position.copy(initPos);
      this.camera.lookAt(0, 0, 0);

      this.controls.target.set(0, 0, 0);
      this.controls.maxDistance = maxDim * 50;
      this.controls.minDistance = maxDim / 10;
      this.controls.update();

      this.initialCameraState = {
        position: initPos.clone(),
        target: new THREE.Vector3(0, 0, 0),
        zoom: this.camera.zoom
      };

      if (this.gridHelper) {
        const gridSize = maxDim * 4;
        this.gridHelper.scale.set(gridSize/500, 1, gridSize/500);
        this.axesHelper.scale.set(maxDim, maxDim, maxDim);
      }

      this.loading = false;
    },

    toggleWireframe() {
      this.showWireframe = !this.showWireframe;
      if (!this.currentModel) return;
      this.currentModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(mat => {
            mat.wireframe = this.showWireframe;
          });
        }
      });
    },

    toggleAutoRotate() {
      this.isAutoRotating = !this.isAutoRotating;
      if (this.controls) {
        this.controls.autoRotate = this.isAutoRotating;
        this.controls.autoRotateSpeed = 2.0;
      }
    },

    toggleHelpers() {
      this.showHelpers = !this.showHelpers;
      if (this.axesHelper) this.axesHelper.visible = this.showHelpers;
      if (this.gridHelper) this.gridHelper.visible = this.showHelpers;
    },

    resetView() {
      if (!this.initialCameraState || !this.controls) return;
      this.isAutoRotating = false;
      this.controls.autoRotate = false;
      this.camera.position.copy(this.initialCameraState.position);
      this.controls.target.copy(this.initialCameraState.target);
      this.controls.update();
    },

    takeSnapshot() {
      if (!this.renderer) return;
      this.renderer.render(this.scene, this.camera);
      try {
        const imgData = this.renderer.domElement.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `preview-${Date.now()}.png`;
        link.href = imgData;
        link.click();
      } catch (e) { console.error(e) }
    },

    observeResize() {
      this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (width && height) this.handleResize(width, height);
        }
      });
      this.resizeObserver.observe(this.$refs.canvasContainer);
    },

    handleResize(width, height) {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    clearScene() {
      if (this.currentModel) {
        this.scene.remove(this.currentModel);
        this.currentModel.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
              else child.material.dispose();
            }
          }
        });
        this.currentModel = null;
      }
    },

    cleanup() {
      cancelAnimationFrame(this.animationId);
      this.clearScene();
      if (this.renderer) this.renderer.dispose();
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
    },

    animate() {
      if (!this.renderer) return;
      this.animationId = requestAnimationFrame(this.animate);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },

    reloadModel() {
      this.loadModel();
    }
  }
}
</script>

<style scoped>
.three-preview-container {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 400px;
  background-color: var(--model-preview-bg-color);
  overflow: hidden;
  user-select: none;
}

.canvas-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  outline: none;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
.loading-overlay, .error-overlay { pointer-events: auto; }
.error-overlay { background: var(--apple-shadow-color); }
.error-content { color: #f56c6c; font-weight: bold; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.error-icon { font-size: 32px; }

.info-panel {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 20;
  background: var(--text-secondary-color);
  backdrop-filter: blur(4px);
  color: var(--bg-color);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: Consolas, monospace;
  pointer-events: none;
}
.info-row { display: flex; gap: 8px; }
.label { opacity: 0.7; }

/* 工具栏 */
.controls-panel {
  position: absolute;
  top: 15px;
  right: 100px;
  z-index: 20;
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 67px;
  height: 33px;
  border: 1px solid var(--model-preview-control-btn-border-color);
  background-color: var(--model-preview-control-btn-bg-color);
  color: var(--text-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* 为 input 定位用 */
}

.control-btn:hover {
  color: #409eff;
  border-color: var(--model-preview-control-btn-hover-border-color);
  background-color: var(--model-preview-control-btn-hover-bg-color);
}

.control-btn.active {
  color: var(--text-color);
  background-color: #409eff;
  border-color: #409eff;
}

/* --- 特殊处理：颜色选择器按钮 --- */
.color-btn-wrapper {
  gap: 5px; /* 圆点和文字的间距 */
  overflow: hidden; /* 防止 hidden-input 溢出 */
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  display: inline-block;
}

.hidden-color-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
}
</style>
