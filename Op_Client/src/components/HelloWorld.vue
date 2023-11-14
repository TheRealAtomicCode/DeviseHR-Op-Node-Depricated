<script setup lang="ts">
import TopNav from '@/components/TopNav.vue';
import SideNave from '@/components/SideNav.vue';
defineProps<{
  msg: string;
}>();
</script>

<template>
  <TopNav />
  <SideNave />
  <!-- <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
  </div> -->
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}
</style>
