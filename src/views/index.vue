<template>
  <img :src="imgUrlData.imgUrl" alt=""/>
</template>
<script setup lang="ts">
const imgUrlData = {
  imgUrl: `${import.meta.env.VITE_IMAGE_URL}/example.png`
}
</script>
<style scoped lang="scss">
</style>