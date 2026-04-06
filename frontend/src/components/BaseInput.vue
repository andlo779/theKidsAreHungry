<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="space-y-1.5 w-full text-left">
    <label v-if="label" class="block text-sm font-semibold text-slate-700 ml-1">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="handleInput"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      class="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all duration-200 placeholder:text-slate-400"
    />
  </div>
</template>
