import { mount } from '@vue/test-utils'
import { IntersectionRoot, IntersectionChild } from '../../src/components'

describe('IntersectionRoot', () => {
    beforeAll(() => {
        global.IntersectionObserver = function IntersectionObserver () {
            this.targets = [];
            this.observe = jest.fn(target => {
              this.targets.push(target);
            });
            this.unobserve = jest.fn();
            this.disconnect = jest.fn();
            this.takeRecords = jest.fn(() => this.targets);
          }
    })

    it('should expose $observer through $refs.root', () => {
        const wrapper = mount(IntersectionRoot);
        expect(wrapper.vm.$refs.root).toBeTruthy();
        expect(wrapper.vm.$refs.root.$observer).toBeTruthy();
    });

    it('should allow calling $observer.takeRecords()', () => {
        const wrapper = mount(IntersectionRoot);
        const { $observer } = wrapper.vm.$refs.root;
        const entries = $observer.takeRecords();
        // should return 2 for the "start" and "end" divs
        expect(entries.length).toBe(2);
    });
})