<template>
  <div ref="root">
    <slot></slot>
  </div>
</template>

<script>
import debounce from 'debounce'
const ID_ATTR = "data-v__intersection_id";
const genId = () => Math.random().toString(36).substr(2, 9);
export default {
  name: "IntersectionRoot",
  props: ['rootMargin','threshold','startThreshold','endThreshold','debounce'],
  data() {
    return {
      observer: null,
      childId: 0,
      childrenById: {},
      scrollHandler: null,
      atStart: false,
      atEnd: false,
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
      id = ref.getAttribute('id') || genId();
      ref.setAttribute(ID_ATTR, id);
      this.childrenById[id] = { ref, callback };
      this.observer.observe(ref);
      return true;
    },
    initializeObserver() {
      if (typeof IntersectionObserver !== 'function') {
        console.warn('[vue-intersection] IntersectionObserver not available');
        return false;
      }
      const { rootMargin, threshold, $refs } = this;
      const callback = entries => {
        entries.forEach(entry => {
          const entryId = entry.target.getAttribute(ID_ATTR);
          const child = this.childrenById[entryId];
          child && child.callback(entry);
        });
      };
      this.observer = new IntersectionObserver(callback, {
        root: $refs.root,
        rootMargin: rootMargin || '0px',
        threshold: threshold || [0,1],
      });
      const childKeys = Object.keys(this.childrenById);
      if (childKeys.length > 0) {
        childKeys
          .map(id => this.childrenById[id])
          .forEach(child => {
            this.observer.observe(child.ref);
          });
      }
    },
    handleScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      const start = parseInt(this.startThreshold || 0)
      const end = parseInt(this.endThreshold || 0)
      if (scrollTop - start <= 0) {
        this.atStart = true;
        this.$emit('start', e);
      } else if (offsetHeight + scrollTop + end >= scrollHeight) {
        this.atEnd = true;
        this.$emit('end', e);
      } else {
        if (this.atStart) {
          this.atStart = false;
          this.$emit('start-leave', e);
        } else if (this.atEnd) {
          this.atEnd = false;
          this.$emit('end-leave', e);
        }
        this.$emit('middle', e)
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
    this.scrollHandler = debounce(this.handleScroll, this.debounce || 10);
    this.$refs.root.addEventListener('scroll', this.scrollHandler);
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
    this.$refs.root.removeEventListener('scroll', this.scrollHandler);
  }
};
</script>