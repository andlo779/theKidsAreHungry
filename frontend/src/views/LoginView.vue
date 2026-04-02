<script setup lang="ts">
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Log In or Register</h2>
    
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="you@example.com" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
      </div>
      <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
        Log In / Register
      </button>
    </form>
  </div>
</template>
