<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "IntersectionChild",
  inject: {
    registerIntersectionChild: {
      default: () => null
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.registerIntersectionChild) return false;
      this.registerIntersectionChild(this.$refs.container, entry => {
        this.$emit(entry.isIntersecting ? "enter" : "leave", entry);
      });
    });
  }
};
</script>