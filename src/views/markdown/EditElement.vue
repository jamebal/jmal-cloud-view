<template>
  <div id="edit-div"
       v-html="innerText"
       :contenteditable="canEdit"
       @focus="isLocked = true"
       @blur="isLocked = false"
       @input="changeText">
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  name: 'EditElement',
  props: {
    value: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      innerText: '',
      isLocked: false,
    }
  },
  watch: {
    value(value){
      if (!this.isLocked || !this.innerText) {
        console.log('value', value)
        this.innerText = value
        document.getElementById('edit-div').innerHTML = value
      }
    }
  },
  methods: {
    changeText(){
      this.$emit('input', this.$el.innerHTML)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.edit-div {
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  &[contenteditable=true]{
    user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
}
</style>
