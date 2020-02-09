<template>
  <!-- 组件代码 -->
  <span>
    <!--<el-popover ref="popover5" v-model="visible" placement="top" width="160">-->
    <!--<p>{{ content }}</p>-->
    <!--<div style="text-align: right; margin: 0">-->
    <!--<el-button size="mini" type="text" @click="visible = false">取消</el-button>-->
    <!--<el-button type="danger" size="mini" @click="deleteItem(id)">确定</el-button>-->
    <!--</div>-->
    <!--</el-popover>-->
    <!--<el-button v-popover:popover5 type="text" icon-class="more">fff</el-button>-->

    <el-popover
      ref="popover"
      class="popover-content"
      style="padding: 0"
      placement="bottom"
      @show="showMenu(row,selects)"
    >
      <div class="newFileMenu" style="display: block;">
        <ul v-for="(item,index) in data" :key="item.label">
          <li
            v-if="item.operation === 'favorite'"
            @click="item.click(item.operation)"
            @mouseover.prevent="item.mouseover(index)"
            @mouseleave.prevent="item.mouseleave(index)"
          >
            <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
          <li
            v-else
            @click="item.click(item.operation)"
          >
            <label class="menuitem"><svg-icon :icon-class="item.iconClass" /><span class="menuitem text">{{ item.label }}</span>
            </label>
          </li>
        </ul>
      </div>
    </el-popover>
    <svg-icon v-popover:popover class="button-class" icon-class="more" />
  </span>
</template>

<script>
import Bus from '@/assets/js/bus'
export default {
  name: 'MenuPopover',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: true
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    },
    selects: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    showMenu(row, selects) {
      selects[0] = row
      Bus.$emit('clickMore', selects)
    },
    test() {
      console.log(8769)
    }
  }
}
</script>
<style lang="scss" scoped>
  .newFileMenu ul {
    list-style: none;
    padding-inline-start: 0px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .newFileMenu li {
    cursor: pointer;
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .newFileMenu li:hover {
    cursor: pointer;
    border-radius: 5px;
    background-color: #409eff14;
  }
  .newFileMenu li > .menuitem {
    cursor: pointer;
    line-height: 44px;
    margin-left: 10%;
  }
  .newFileMenu li > .menuitem > .text {
    cursor: pointer;
    margin-left: 8%;font-weight: normal;
  }
  .newFileMenu li > .menuitem > .svg-icon {
    cursor: pointer;
    font-size: 20px;
  }
   /deep/ .el-popover {
    padding: 0;
  }
</style>

