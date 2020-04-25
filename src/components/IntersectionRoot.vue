<template>
  <div ref="root">
    <div data-v__intersection_id="start"> </div>
    <slot></slot>
    <div data-v__intersection_id="end"> </div>
  </div>
</template>

<script>
const ID_ATTR = "data-v__intersection_id";
export default {
  name: "IntersectionRoot",
  props: {
    rootMargin: [Number, String],
    threshold: Number
  },
  data() {
    return {
      observer: null,
      childId: 0,
      childrenById: {}
    };
  },
  methods: {
    registerIntersectionChild(ref, callback) {
      if (!this.observer || !ref || !ref.setAttribute || !callback)
        return false;
      let id = ref.getAttribute(ID_ATTR);
      if (id) {
        this.childrenById[id] = { ref, callback };
        return true;
      }
      id = this.childId++;
      ref.setAttribute(ID_ATTR, id);
      this.childrenById[id] = { ref, callback };
      this.observer.observe(ref);
      return true;
    },
    initializeObserver() {
      if (!window.IntersectionObserver) return false;
      const { rootMargin, threshold, $refs: { root } } = this;
      const callback = entries => {
        entries.forEach(entry => {
          const entryId = entry.target.getAttribute(ID_ATTR);
          const child = this.childrenById[entryId];
          child && child.callback(entry);
        });
      };
      this.observer = new IntersectionObserver(callback, { root, rootMargin, threshold });
      const childKeys = Object.keys(this.childrenById);
      if (childKeys.length > 0) {
        childKeys
          .map(id => this.childrenById[id])
          .forEach(child => {
            this.observer.observe(child.ref);
          });
      }
    }
  },
  provide() {
    return {
      registerIntersectionChild: this.registerIntersectionChild
    };
  },
  mounted() {
    this.initializeObserver();
    ['start','end'].forEach(key => {
      const elem = this.$refs.root.querySelector(`[${ID_ATTR}=${key}]`);
      this.registerIntersectionChild(elem, entry => {
        this.$emit(key, entry);
      });
      this.observer.observe(elem);
    });
  },
  watch: {
    threshold: function(val, old) {
      if (val !== old) this.initializeObserver();
    },
    rootMargin: function(val, old) {
      if (val !== old) this.initializeObserver();
    }
  },
  beforeDestroy() {
    this.observer.disconnect && this.observer.disconnect();
  }
};
</script>