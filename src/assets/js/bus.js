// import Vue from 'vue';

export const EventBus = new Vue();

export default {
  on(event, callback) {
    EventBus.$on(event, callback);
  },
  off(event, callback) {
    EventBus.$off(event, callback);
  },
  emit(event, ...args) {
    EventBus.$emit(event, ...args);
  },
  notify(any) {
    EventBus.$notify(any)
  }
};
