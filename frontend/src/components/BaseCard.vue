<script setup lang="ts">
defineProps<{
  clickable?: boolean;
}>();
</script>

<template>
  <div
    class="bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-300"
    :class="{
      'cursor-pointer hover:border-emerald-400 hover:shadow-md active:scale-[0.99]': clickable,
    }"
  >
    <slot />
  </div>
</template>
