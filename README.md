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

### API Details

#### `IntersectionRoot`

| Prop  | Type  | Required  | Description |
|---|---|---|---|
| `threshold`  | `[String,Number]`  | Yes  | Corresponds to the [`threshold` option](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) on the IntersectionObserver   |
| `rootMargin`  | `String`  | Yes  | Corresponds to the [`rootMargin` option](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) on the IntersectionObserver   |

| Event  | Type  | Arguments | Required  | Description |
|---|---|---|---|---|
| `@start`  | `Function` | [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | No  | Will be fired whenever the user scrolls to the top of the `IntersectionRoot` container |
| `@end`  | `Function` |  [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)  | No  | Will be fired whenever the user scrolls to the bottom of the `IntersectionRoot` container |

#### `IntersectionChild`

| Event  | Type | Arguments  | Required  | Description |
|---|---|---|---|---|
| `@enter`  | `Function` |  [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)  | No  | Will be fired whenever the child element enters the viewport for of the `IntersectionRoot` container |
| `@leave`  | `Function` |  [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)  | No  | Will be fired whenever the child element leaves the viewport for of the `IntersectionRoot` container |

### Demo

You wiil find addtional examples/demos below: 

- [Basic Usage](https://tennisgent.github.io/vue-intersection/demo/index.html)
- [Lazy Loading Images](https://codesandbox.io/s/angry-tdd-0eyq0?file=/src/App.vue)
- [Infinite Scroll](https://codesandbox.io/s/elastic-bell-9kcex?file=/src/App.vue)