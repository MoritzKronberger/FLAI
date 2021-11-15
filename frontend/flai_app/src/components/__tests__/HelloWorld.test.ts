import { shallowMount } from '@vue/test-utils';
import HelloWorld from '../HelloWorld.vue';

describe('HelloWorld.vue', () => {
  test('renders props.msg when passed', () => {
    const msg = 'new message'
    //@ts-ignore
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})