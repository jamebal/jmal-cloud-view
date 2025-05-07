// import Vue from 'vue'
import tippy from 'tippy.js';
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/tippy.css';

// v-draw-rectangle 画矩形选区
Vue.directive('drawRectangle', {
  bind(el, binding, vnode, oldVnode) {
    let $$ = function (id) {
      return document.getElementById(id)
    }
    let draw = el
    let wId = "rectangle1"
    let startX = 0, startY = 0
    let flag = false
    let retcLeft = 0, retcTop = 0, retcHeight = 0, retcWidth = 0
    draw.onmousedown = function (e) {
      flag = true
      let evt = window.event || e
      let scrollTop = draw.scrollTop || draw.scrollTop
      let scrollLeft = draw.scrollLeft || draw.scrollLeft
      startX = evt.clientX + scrollLeft
      startY = evt.clientY + scrollTop
      let div = document.createElement("div")
      div.id = wId
      div.className = "draw-rectangle"
      div.style.left = evt.x + "px"
      div.style.top = evt.y + "px"
      div.style.position = 'fixed'
      div.style.border = '1px dashed #2898ff'
      div.style.width = '0px'
      div.style.height = '0px'
      div.style.left = '0px'
      div.style.top = '0px'
      div.style.overflow = 'hidden'
      draw.appendChild(div)

      document.onmousemove = function (e) {
        if (flag) {
          let evt = window.event || e
          let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft
          retcLeft = (startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : startX)
          retcTop = (startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : startY)
          retcHeight = Math.abs(startY - evt.clientY - scrollTop)
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
          $$(wId).style.left = retcLeft + 'px'
          $$(wId).style.top = retcTop + 'px'
          $$(wId).style.width = retcWidth + 'px'
          $$(wId).style.height = retcHeight + 'px'
          $$(wId).style.backgroundColor = '#f2f5fa55'
        }
      }

    }

    document.onmouseup = function (e) {
      flag = false
      if ($$(wId)) {
        draw.removeChild($$(wId))
        if (retcWidth > 1 && retcHeight > 1) {
        }
      }
      return false
    }
  }
})

// v-aplayerDrag: 音乐播放拖拽
Vue.directive('aplayerDrag', {
  bind(el, binding, vnode, oldVnode) {
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector('.aplayer-music');
    const dragDom = el;
    // dragDom.style.transform = "translate(" + binding.value.x + "px," + binding.value.y + "px)";
    dragDom.style.left = binding.value.x + "px"
    dragDom.style.top = binding.value.y + "px"
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    // 鼠标按下事件
    dragDom.addEventListener('touchstart', touchstart, false);
    dragDom.addEventListener('touchmove', touchmove, false);
    let disX, disY, styL, styT;

    function touchstart(e) {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      disX = e.touches[0].clientX - dialogHeaderEl.offsetLeft;
      disY = e.touches[0].clientY - dialogHeaderEl.offsetTop;
      styL = binding.value.x
      styT =  binding.value.y
    }

    // 鼠标拖拽事件
    function touchmove(e) {
      e.preventDefault()
      // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
      const l = e.touches[0].clientX - disX;
      const t = e.touches[0].clientY - disY;
      let finallyL = l + styL;
      let finallyT = t + styT;
      // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
      if (finallyL < 0) {//// 左边
        finallyL = 0
      } else if (finallyL > document.body.clientWidth - dragDom.clientWidth) {///右边
        finallyL = document.body.clientWidth - dragDom.clientWidth
      }
      if (finallyT < 0) {////顶部
        finallyT = 0
      } else if (finallyT > document.body.clientHeight - dragDom.clientHeight) (///底部
        finallyT = document.body.clientHeight - dragDom.clientHeight
      )
      dragDom.style.left = finallyL + "px"
      dragDom.style.top = finallyT + "px"
      //将此时的位置传出去
      binding.value.x = finallyL;
      binding.value.y = finallyT;
    }

    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft + 81;
      const disY = e.clientY - dialogHeaderEl.offsetTop + 14;
      styL = binding.value.x
      styT =  binding.value.y
      // 鼠标拖拽事件
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        let finallyL = l + styL;
        let finallyT = t + styT;
        // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
        if (finallyL < 0) {//// 左边
          finallyL = 0
        } else if (finallyL > document.body.clientWidth - dragDom.clientWidth) {///右边
          finallyL = document.body.clientWidth - dragDom.clientWidth
        }

        if (finallyT < 0) {////顶部
          finallyT = 0
        } else if (finallyT > document.body.clientHeight - dragDom.clientHeight) (///底部
          finallyT = document.body.clientHeight - dragDom.clientHeight
        )
        dragDom.style.left = finallyL + "px"
        dragDom.style.top = finallyT + "px"
        //将此时的位置传出去
        binding.value.x = finallyL;
        binding.value.y = finallyT;
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
        // e.preventDefault()
        // e.stopPropagation()
        return false
      };
    }
  }
})


// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    let dialogWidth = document.body.clientWidth * binding.value.dialogWidthPercent
    let x = (document.body.clientWidth - dialogWidth) / 2
    let y = (document.body.clientHeight - document.body.clientHeight * binding.value.dialogWidthPercent) / 2
    dragDom.style.transform = "translate(" + x + "px," + y + "px)";
    //dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      // 获取到的值带px 正则匹配替换
      let styL, styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100) + x;
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100) + y;
      } else {
        styL = +sty.left.replace(/\px/g, '') + x;
        styT = +sty.top.replace(/\px/g, '') + y;
      }
      ;
      // 鼠标拖拽事件
      document.onmousemove = function (e) {
        // 全屏禁止拖动
        if ((dragDom.offsetParent.clientWidth - dragDom.clientWidth) === 0) {
          return
        }
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        let finallyL = l + styL;
        let finallyT = t + styT;
        // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
        if (finallyL < 0) {////顶部
          finallyL = 0
        } else if (finallyL > dragDom.offsetParent.clientWidth - dragDom.clientWidth) {///底部
          finallyL = dragDom.offsetParent.clientWidth - dragDom.clientWidth
        }

        if (finallyT < 0) {////顶部
          finallyT = 0
        } else if (finallyT > dragDom.offsetParent.clientHeight - dragDom.clientHeight) (///底部
          finallyT = dragDom.offsetParent.clientHeight - dragDom.clientHeight
        )
        x = finallyL;
        y = finallyT;
        dragDom.style.transform = "translate(" + finallyL + "px," + finallyT + "px)";
        //将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = binding.value.$el.querySelector('.el-dialog')

    el.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft

      document.onmousemove = function (e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

const TOOLTIP_INSTANCE_KEY = '_tippyInstance'; // 用于在元素上存储 Tippy 实例

// 默认 Tippy 配置
const defaultTippyOptions = {
  delay: 0, // 默认即时显示
  arrow: true,
  placement: 'top',
  // 在这里可以添加更多你希望的全局默认配置
  // theme: 'light',
  // animation: 'scale',
};

/**
 * 解析指令的绑定值，返回 Tippy 配置对象
 * @param {*} value - binding.value
 * @returns {object | null} - 返回 Tippy 配置对象，如果无效则返回 null
 */
function parseOptions(value) {
  let options = {};
  if (typeof value === 'string') {
    // 如果值是字符串，将其作为 content
    options.content = value;
  } else if (typeof value === 'object' && value !== null) {
    // 如果值是对象，直接使用（允许覆盖默认值）
    // 确保至少有 content 属性，除非 Tippy 允许无 content (通常不允许或表现怪异)
    if (value.content === undefined || value.content === null) {
      // console.warn('v-tooltip object value must contain a "content" property.');
      // 允许 content 为空字符串 ''
      if (value.content !== '') {
        console.warn('v-tooltip object value is missing a "content" property.');
        return null;
      }
    }
    options = { ...value }; // 复制对象，避免直接修改原始绑定对象
  } else {
    // 无效的值
    console.warn('v-tooltip directive requires a string or an object value.');
    return null;
  }
  return options;
}


Vue.directive('tooltip', {
  /**
   * 元素首次插入 DOM 时调用
   */
  inserted(el, binding) {
    const userOptions = parseOptions(binding.value);
    if (userOptions === null) return; // 值无效，不初始化

    // 合并默认配置和用户提供的配置
    const finalOptions = { ...defaultTippyOptions, ...userOptions };

    // 创建 Tippy 实例并存储在元素上
    el[TOOLTIP_INSTANCE_KEY] = tippy(el, finalOptions);
    // console.log('Tippy initialized:', el, finalOptions);
  },

  /**
   * 组件 VNode 更新后调用 (包括子 VNode)
   * 这是处理绑定值变化比较可靠的地方
   */
  componentUpdated(el, binding) {
    const instance = el[TOOLTIP_INSTANCE_KEY];

    // 检查绑定值是否有实际变化
    // 注意：对于对象，这仍然是浅比较。
    // 如果对象内部属性变了但引用没变，这里可能判断为 false。
    // 解决方法是在父组件中确保每次更新都传递新的对象引用。
    if (binding.value === binding.oldValue && typeof binding.value === 'object') {
      // 如果值是对象且引用未变，我们仍然尝试更新，以防内部属性变化
      // （这是对 Vue 浅比较的弥补，但依赖父组件正确传递数据）
      // console.log('Object reference unchanged, but attempting update');
    } else if (binding.value === binding.oldValue) {
      // 如果值是字符串或其他基础类型，且值未变，则无需更新
      // console.log('Value unchanged, skipping update.');
      return;
    }


    const userOptions = parseOptions(binding.value);

    if (instance) {
      // 如果实例存在
      if (userOptions === null) {
        // 新值无效，销毁现有实例
        // console.log('Destroying Tippy due to invalid new value.');
        instance.destroy();
        el[TOOLTIP_INSTANCE_KEY] = null; // 清除引用
      } else {
        // 新值有效，更新实例的 props
        // console.log('Updating Tippy props:', userOptions);
        // setProps 会智能地合并传入的选项与现有选项
        instance.setProps(userOptions);
      }
    } else if (userOptions !== null) {
      // 如果实例不存在 (可能之前的值无效或被销毁了)，但新值有效，则重新创建
      // console.log('Re-initializing Tippy with new valid value.');
      const finalOptions = { ...defaultTippyOptions, ...userOptions };
      el[TOOLTIP_INSTANCE_KEY] = tippy(el, finalOptions);
    }
  },

  /**
   * 元素解绑时调用
   */
  unbind(el) {
    const instance = el[TOOLTIP_INSTANCE_KEY];
    if (instance) {
      // console.log('Destroying Tippy on unbind.');
      instance.destroy();
    }
    // 删除存储的实例引用，防止内存泄漏
    delete el[TOOLTIP_INSTANCE_KEY];
  }
});

// 除某元素外的点击事件
Vue.directive('clickoutside', { // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }

    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {
  },
  unbind(el, binding) { // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
})

