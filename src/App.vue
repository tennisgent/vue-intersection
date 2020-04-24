<template>
  <div id="app">
    <div class="header">
      <h2><code>vue-intersection-observer</code></h2>
      <div class="option">
        <div>At top:</div>
        <div><code>{{atStart}}</code></div>
      </div>
      <div class="option">
        <div>At bottom:</div>
        <div><code>{{atEnd}}</code></div>
      </div>
      <div class="option">
        <div><code>rootMargin:</code></div>
        <input type="range" min="0" max="1000" step="20" @change="setMargin">
        <div>{{rootMargin}}</div>
      </div>
      <div class="option">
        <div><code>threshold:</code></div>
        <input type="range" min="0" max="1" step="0.05" v-model="threshold">
        <div>{{threshold}}</div>
      </div>
    </div>

    <h4>Number of currently visible children: {{ children.filter(c => c.visible).length }}</h4>
    <IntersectionRoot :threshold="threshold" :rootMargin="rootMargin" class="container" @start="setStart" @end="setEnd">
      <IntersectionChild
        class="child"
        v-for="child in children"
        :key="child.id"
        :class="{ visible: child.visible }"
        @enter="child.visible = true"
        @leave="child.visible = false"
      >{{ child.id }}</IntersectionChild>
    </IntersectionRoot>
  </div>
</template>

<script>
import { IntersectionRoot, IntersectionChild } from "./components";
export default {
  name: "App",
  components: {
    IntersectionRoot,
    IntersectionChild
  },
  data() {
    return {
      atStart: false,
      atEnd: false,
      threshold: 1,
      rootMargin: "0px",
      children: new Array(50)
        .fill(0)
        .map((x, i) => ({ id: i + 1, visible: false }))
    };
  },
  methods: {
    setMargin(e) {
      this.rootMargin = e.target.value + "px";
    },
    setStart(entry) {
      this.atStart = entry.isIntersecting;
    },
    setEnd(entry) {
      this.atEnd = entry.isIntersecting;
    }
  }
};
</script>

<style>
#app,
#app * {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header {
  max-width: 500px;
  margin: 0 auto;
}
.container {
  margin: 80px;
  padding: 40px;
  border: 1px solid black;
  max-height: 400px;
  overflow: auto;
}
.child {
  width: 100%;
  padding: 20px;
  background: cornflowerblue;
  font-size: 32px;
  font-weight: bold;
}
.visible {
  background: coral;
}
.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.option * {
  width: 100px;
}
.option input {
  flex-grow: 1;
  margin: 0 16px;
}
</style>