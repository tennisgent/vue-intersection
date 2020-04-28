import { shallowMount } from '@vue/test-utils'
import { IntersectionRoot, IntersectionChild } from './'

describe('IntersectionRoot', () => {
    it('should expose $observer through ref', () => {
        const wrapper = shallowMount(IntersectionRoot);
        expect(wrapper.$refs.root).toBeTruthy();
        expect(wrapper.$refs.root.$observer).toBeTruthy();
    });

    it('should allow calling $observer.takeRecords()', () => {
        const wrapper = shallowMount(IntersectionRoot, {
            slots: {
                default: [
                    IntersectionChild,
                    IntersectionChild,
                    IntersectionChild
                ]
            }
        });
        const { $observer } = wrapper.$refs.roots;
        const entries = $observer.takeRecords();
        expect(entries.length).toBe(3);
    });
})