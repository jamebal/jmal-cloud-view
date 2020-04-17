
import Vue from 'vue'

// v-draw-rectangle 画矩形选区
Vue.directive('drawRectangle',{
  bind(el,binding,vnode,oldVnode){
    let $$ = function(id){
      return document.getElementById(id)
    }
    let draw = el
    console.log('draw',draw)
    let wId = "rectangle1"
    let startX = 0, startY = 0
    let flag = false
    let retcLeft = 0, retcTop = 0, retcHeight = 0, retcWidth = 0
    draw.onmousedown = function(e){
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

      document.onmousemove = function(e){
        if(flag){
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

    document.onmouseup = function(e){
      flag = false
      if($$(wId)){
        console.log('left',retcLeft, 'top',retcTop, 'width',retcWidth, 'hieght',retcHeight)
        draw.removeChild($$(wId))
        if(retcWidth > 1 && retcHeight > 1){
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
    dragDom.style.transform="translate("+binding.value.x+"px,"+binding.value.y+"px)";
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    // 鼠标按下事件
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft + 81;
      const disY = e.clientY - dialogHeaderEl.offsetTop + 14;
      // 获取到的值带px 正则匹配替换
      let styL, styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)+binding.value.x;
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)+binding.value.y;
      } else {
        styL = +sty.left.replace(/\px/g, '')+binding.value.x;
        styT = +sty.top.replace(/\px/g, '')+binding.value.y;
      };
      // console.log('styL',styL,'styT',styT,'disX',disX,'disY',disY)
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
        dragDom.style.transform="translate("+finallyL+"px,"+finallyT+"px)";
        //将此时的位置传出去
        binding.value.x=finallyL;
        binding.value.y=finallyT;
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
    dragDom.style.transform="translate("+binding.value.x+"px,"+binding.value.y+"px)";
    dialogHeaderEl.style.cursor = 'move';
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
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)+binding.value.x;
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)+binding.value.y;
      } else {
        styL = +sty.left.replace(/\px/g, '')+binding.value.x;
        styT = +sty.top.replace(/\px/g, '')+binding.value.y;
      };
      // 鼠标拖拽事件
      document.onmousemove = function (e) {
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
        binding.value.x=finallyL;
        binding.value.y=finallyT;
        dragDom.style.transform="translate("+finallyL+"px,"+finallyT+"px)";
        //将此时的位置传出去
        //binding.value({x:e.pageX,y:e.pageY})
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

      document.onmousemove = function(e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

