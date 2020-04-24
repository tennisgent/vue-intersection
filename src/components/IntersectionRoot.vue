<template>
  <div ref="root">
    <slot></slot>
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
      if (ref.getAttribute(ID_ATTR)) return true;
      const id = this.childId++;
      ref.setAttribute(ID_ATTR, id);
      this.childrenById[id] = { ref, callback };
      this.observer.observe(ref);
      return true;
    },
    initializeObserver() {
      if (!window.IntersectionObserver || !this.$refs.root) return false;
      const { rootMargin, threshold, $refs } = this;
      const options = { root: $refs.root, rootMargin, threshold };
      const callback = entries => {
        entries.forEach(entry => {
          const entryId = entry.target.getAttribute(ID_ATTR);
          const child = this.childrenById[entryId];
          child && child.callback(entry);
        });
      };
      this.observer = new IntersectionObserver(callback, options);
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
  },
  watch: {
    threshold: function(val, old) {
      if (val !== old) this.initializeObserver();
    },
    rootMargin: function(val, old) {
      if (val !== old) this.initializeObserver();
    }
  }
};
</script>