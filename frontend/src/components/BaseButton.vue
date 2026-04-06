<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
    :class="{
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20': variant === 'primary' || !variant,
      'bg-slate-100 text-slate-700 hover:bg-slate-200': variant === 'secondary',
      'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20': variant === 'danger',
      'bg-transparent text-slate-600 hover:bg-slate-100': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
