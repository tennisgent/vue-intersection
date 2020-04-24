# vue-intersection

### Installation

```
yarn add vue-intersection
```
or
```
npm i --save vue-intersection
```

### Basic Usage

```html
<template>
    <IntersectionRoot :threshold="threshold" :rootMargin="rootMargin">
      <IntersectionChild
        v-for="child in children"
        :key="child.id"
        @enter="child.visible = true"
        @leave="child.visible = false"
      >
        {{ child.id }} is {{ child.visible ? '' : 'not' }} visible
      </IntersectionChild>
    </IntersectionRoot>
  </div>
</template>
<script>
import { IntersectionRoot, IntersectionChild } from 'vue-intersection'

export default {
    name: "MyComponent",
    components: { IntersectionRoot, IntersectionChild },
    data() {
        return {
            threshold: 1,
            rootMargin: "0px",
            children: new Array(50)
                .fill(0)
                .map((x, i) => ({ id: i + 1, visible: false }))
            };
        };
    }
}
</script>
```

### Demo

You can see a series of live demos below: 

- [Basic Usage](https://tennisgent.github.io/vue-intersection/demo/index.html)