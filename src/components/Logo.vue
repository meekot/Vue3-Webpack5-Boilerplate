<template lang="pug">
h1 {{titleComputed}}
div
  img(:src="logo" width="500")
</template>
<script>
import { computed } from '@vue/reactivity'
import logo from '~/assets/images/logo.jpg'
export default {
  name: 'Logo',
  props: {
    title: {
      required: true,
      type: String
    }
  },
  setup (props) {
    const titleComputed = computed(() => '!!!' + props.title + '!!!')
    return {
      titleComputed,  
      logo    
    }
  }
}
</script>