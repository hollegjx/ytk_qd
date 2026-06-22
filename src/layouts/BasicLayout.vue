<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<template>
  <div class="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"><GlobalHeader/></a-layout-header>
      <a-layout-content class="content"><router-view /></a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/hollegjx" target="_blank"> gjxTest</a>

      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.footer {
  background-color: #f2e5e5;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
.header {
  background-color: #f2e5e5;
  padding: 16px;
  margin-bottom: 16px;
}
.content {
  background: linear-gradient(to right, #fefefe, rgba(222, 192, 192, 0.74));
  padding: 20px;
  margin-bottom: 28px;
}


</style>
