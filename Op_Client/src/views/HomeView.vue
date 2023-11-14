<script setup lang="ts">
import { useDark } from '@vueuse/core';

const isDark = useDark();

</script>

<template>
  <main>
    <h1 class="flex items-center justify-center min-h-[100vh] bg-[#f5f5f5]">
      Hi From Home Page
    </h1>
  </main>
</template>
