<script>
export default {
  name: 'app',
  mounted() {
    this.$storage.setItem('user', { name: 'fang', age: '22' })
    this.$storage.setItem('type', 'human')
    console.log('user =>', this.$storage.getItem('user'))
    console.log('storage =>', this.$storage.getStorage())
    this.$storage.clearItem('user')
    console.log('delete storage =>', this.$storage.getStorage())
  }
}
</script>

<template>
  <router-view></router-view>
</template>

<style>
</style>
