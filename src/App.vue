<template lang="pug">
Logo(:title="title")
h1 Hello world 
</template>
<script>
import Logo from '@/Logo'

const APP_NAME = 'VUE3 WEBPACK BOILERPLATE'

export default {
  setup () {
    return {
      title: APP_NAME
    } 
  },
  components: {
    Logo
  }
}
</script>