<script setup lang="ts">
// Main layout component
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-indigo-600 text-white shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-bold">The Kids Are Hungry</h1>
        <nav>
          <!-- User status / Logout placeholder -->
        </nav>
      </div>
    </header>

    <main class="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
      <router-view />
    </main>
  </div>
</template>
