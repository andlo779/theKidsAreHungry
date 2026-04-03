<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const lists = ref<any[]>([]);
const newListName = ref('');
const router = useRouter();
const authStore = useAuthStore();

const fetchLists = async () => {
  try {
    const res = await axios.get('http://localhost:3000/lists');
    lists.value = res.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
};

const createList = async () => {
  if (!newListName.value.trim()) return;
  try {
    await axios.post('http://localhost:3000/lists', {
      name: newListName.value
    });
    newListName.value = '';
    fetchLists();
  } catch (error) {
    console.error('Error creating list:', error);
  }
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  authStore.loadUser();
  fetchLists();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold">Your Shopping Lists</h2>
        <p class="text-gray-600">Select a list or create a new one.</p>
        <p v-if="authStore.user" class="text-sm text-indigo-600 mt-1">
          Logged in as {{ authStore.user.name }}
        </p>
      </div>
      <button @click="logout" class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">
        Logout
      </button>
    </div>
    
    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
      <form @submit.prevent="createList" class="flex gap-2">
        <input 
          v-model="newListName" 
          type="text" 
          placeholder="New list name..." 
          class="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Create
        </button>
      </form>
    </div>

    <div v-if="lists.length === 0" class="text-gray-500">
      No lists found. Create one above!
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <div 
        v-for="list in lists" 
        :key="list.id" 
        @click="router.push(`/lists/${list.id}`)"
        class="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <h3 class="font-bold text-lg text-indigo-700">{{ list.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ list.items?.length || 0 }} items
        </p>
      </div>
    </div>
  </div>
</template>
