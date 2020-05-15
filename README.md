# vue-intersection

### Summary

`vue-intersection` is a library that implements an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which can be extremely helpful in a variety of scenarios. Probably the most common use case is for [lazy loading images in a long gallery](https://codesandbox.io/s/angry-tdd-0eyq0?file=/src/App.vue) or for [infinitely loading more content](https://codesandbox.io/s/elastic-bell-9kcex?file=/src/App.vue) whenever the user scrolls to the bottom of your page, but it can be used to improve performance of scrollable UIs in any number of ways. You will find some other examples below. Whenever you want to offload an action until a particular element in scrolled into the user's view, this is a great tool to help you do that with a very simple API.

### Installation

```
yarn add vue-intersection
```
or
```
npm i --save vue-intersection
```

### Basic Usage

Simply wrap your container in an `IntersectionRoot` component and then wrap each child element that you want to observe in a `IntersectionChild` component. The the `Child` components do not have to be direct decendents of the `Root`. You can have whatever content you need in between them. And not every child has to be observed. You can instead choose to observe only a few children if that is your use case. Then you can listen to whenever the child enters/leaves the container's viewport by listening to the `@enter` or `@leave` events.

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
            children: Array.from(Array(50).keys())
                .map(id => ({ id, visible: false }))
            };
        };
    }
}
</script>
```

### API Details

#### `IntersectionRoot`

| Prop  | Type  | Default  | Description |
|---|---|---|---|
| `threshold`  | `Array`  | `[0,1]`  | Corresponds to the [`threshold` option](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) on the IntersectionObserver. Note: if you do not include `0` as a threshold value, the `@leave` event will never be fired.   |
| `rootMargin`  | `Number`/`String`  | `"0px"`  | Corresponds to the [`rootMargin` option](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) on the IntersectionObserver   |
| `startThreshold` | `Number`/`String` | `"0px"` | Distance (`px`) from the top of the container for when to fire the `@start` event 
| `endThreshold` | `Number`/`String` | `"0px"` | Distance (`px`) from the bottom of the container for when to fire the `@end` event 

| Event | Type | Arguments | Optional |
| --- | --- | --- | --- |
| `@start` | `Function` | [`scroll` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) | `true` |
| `@end` | `Function` | [`scroll` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) | `true` |
| `@middle` | `Function` | [`scroll` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) | `true` |

#### `IntersectionChild`

| Prop  | Type  | Default  | Description |
|---|---|---|---|
| `id` | `String` | Randomly generated | If a `IntersectionChild` has an `id` property, it will be used as the unique identifier for scroll tracking. It is recommended to provide an `id` as it improves performance slightly. 

| Event  | Type | Arguments  | Description |
|---|---|---|---|
| `@enter`  | `Function` |  [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | Will be fired whenever the child element enters the viewport of the `IntersectionRoot` container |
| `@leave`  | `Function` |  [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | Will be fired whenever the child element leaves the viewport of the `IntersectionRoot` container |


### Demo

You can find additional examples/demos below: 

- [Basic Usage](https://codesandbox.io/s/ecstatic-liskov-bl4xm?file=/src/App.vue)
- [Lazy Loading Images](https://codesandbox.io/s/angry-tdd-0eyq0?file=/src/App.vue)
- [Infinite Scroll](https://codesandbox.io/s/elastic-bell-9kcex?file=/src/App.vue)
- [Delaying Expensive Computations](https://codesandbox.io/s/objective-yalow-eifxv?file=/src/App.vue)

### Browser Support

`vue-intersection` works in all browsers that support the `IntersectionObserver` API, which is essentially every major browser except for IE 11. If you need support for IE 11, you can use any of the [`IntersectionObserver` polyfills](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) that are available. For a list of supported browsers, look [here](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Browser_compatibility).

### Alternative Libraries

- [`heavyy/vue-intersect`](https://github.com/heavyy/vue-intersect)
- [`arnellebalane/vue-intersect`](https://github.com/arnellebalane/vue-intersect)
- [`vue-intersection-observer`](https://www.npmjs.com/package/vue-intersection-observer)
- Vuetify's [`v-intersect`](https://vuetifyjs.com/en/directives/intersect/)
- [`intersection-scroller-vue`](https://www.npmjs.com/package/intersection-scroller-vue)

### Justification

- The main reason I added another library on top of these other options is because each of these above is creates a new `IntersectionObserver` instance for each element that is being observed. So if you're trying to observe a large number of elements in a scrollable list, then that is a lot of observer instances. However, `vue-intersection` was designed such that there is only one observer instance created for each `IntersectionRoot` component, which observes each of the nested `IntersectionChild` elements. Thus, the performance is much better for long lists of elements. 
- Another shortcoming that several of these other libraries have is that they don't provide enough granular support on which container and which target elements to observe. Several of the above only support the root element being the `document.body` element, but often it is helpful to observe scrolling within some other element on your page. `vue-intersection` allows for much more fine-grain control and flexibility while still maintaining a simple API.