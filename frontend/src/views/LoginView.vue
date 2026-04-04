<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const isLogin = ref(true);
const name = ref('');
const familyName = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sessionExpired = ref(route.query.expired === 'true');

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    if (isLogin.value) {
      await authStore.login({ email: email.value, password: password.value });
    } else {
      await authStore.register({ 
        name: name.value, 
        familyName: familyName.value, 
        email: email.value, 
        password: password.value 
      });
    }
    router.push('/');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'An error occurred';
  }
};
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-10">
    <div v-if="sessionExpired" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm">
      <p class="font-bold">Session Expired</p>
      <p>Your session has expired. Please log in again to continue.</p>
    </div>

    <div class="flex justify-center mb-6">
      <button 
        @click="isLogin = true" 
        :class="['px-4 py-2 text-sm font-medium rounded-l-md border', isLogin ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700']"
      >
        Log In
      </button>
      <button 
        @click="isLogin = false" 
        :class="['px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b', !isLogin ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700']"
      >
        Register
      </button>
    </div>

    <h2 class="text-2xl font-bold mb-6 text-center">{{ isLogin ? 'Log In' : 'Create an Account' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="!isLogin">
        <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input v-model="name" type="text" required class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="John Doe" />
      </div>
      
      <div v-if="!isLogin">
        <label class="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
        <input v-model="familyName" type="text" required class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="The Does" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" placeholder="you@example.com" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" required class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
      </div>
      
      <div v-if="errorMsg" class="text-red-500 text-sm text-center">
        {{ errorMsg }}
      </div>

      <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
        {{ isLogin ? 'Log In' : 'Register' }}
      </button>
    </form>
  </div>
</template>
