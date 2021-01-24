<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    popper-class="al-icon-picker-popper"
    width="400"
    trigger="click"
    @show="showPopover"
    @hide="hidePopover"
  >
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="本地" name="first" >
        <icon-list ref="local" :icon-list="iconList" @select="select"></icon-list>
      </el-tab-pane>
      <el-tab-pane label="iconfont" name="second">
        <icon-list ref="iconfont" :icon-list="iconfontList" @select="select"></icon-list>
      </el-tab-pane>
    </el-tabs>
    <div slot="reference" :class="{'al-icon-picker': true, 'al-icon-picker-open': pickerOpen}"
         @mouseenter="hovering = true"
         @mouseleave="hovering = false">
      <el-input
        type="text"
        clearable
        readonly
        v-model="currentValue"
        placeholder="请选择图标"
      >
        <span slot="prefix" class="el-input__prefix-inner">
            <svg-icon :icon-class="currentValue"></svg-icon>
          </span>
          <span slot="suffix" class="el-input__suffix-inner">
            <i v-if="hovering && currentValue.length > 0"
               class="el-input__icon el-icon-circle-close el-input__clear"
               @mousedown.prevent
               @click.stop.prevent="handleClear"
            ></i>
            <i v-else class="el-select__caret el-input__icon el-icon-arrow-down"></i>
          </span>
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import icons from './requireIcons'
import {iconFonts} from '@/components/Icon/Icon'
import IconList from "@/components/select/iconList";

export default {
  name: 'IconSelect',
  components: {IconList},
  props: {
    value: {
      type: String,
      default: 'sdfsd'
    }
  },
  data() {
    return {
      iconList: icons,
      iconfontList: iconFonts.list,
      currentValue: this.value,
      hasValue: true,
      pickerOpen: false,
      hovering: false,
      activeName: 'first'
    }
  },
  watch: {
    value(val){
      this.currentValue = val
    }
  },
  mounted() {
  },
  methods: {
    showPopover() {
      this.pickerOpen = true
    },
    hidePopover() {
      this.pickerOpen = false
    },
    select(icon){
      console.log('6789')
      this.currentValue = icon
      this.$emit('input', icon)
      this.$refs.popover.doClose()
    },
    handleClear() {
      this.currentValue = ''
      this.$emit('input', '')
    },
    handleTabClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
.al-icon-picker {
  /deep/ .el-input:not(.is-disabled) {
    cursor: pointer;
    .el-input__inner {
      cursor: pointer;
    }
  }
  /deep/ .el-input__suffix {
    .el-icon-arrow-down {
      transition: transform .3s;
    }
  }
}
.al-icon-picker-open {
  /deep/ .el-input__suffix {
    .el-icon-arrow-down {
      transform: rotate(-180deg);
    }
  }
}
</style>
