<script setup lang="ts">
import BasicLayout from '@/layouts/BasicLayout.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
// 页面加载时获取当前登录用户信息
loginUserStore.fetchLoginUser()
</script>

<template>
  <div class="app">
    <BasicLayout />
  </div>
</template>

<style scoped>

</style>
