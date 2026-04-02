<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const route = useRoute();
const listId = route.params.id as string;

const list = ref<any>(null);
const items = ref<any[]>([]);
const newItemName = ref('');

let socket: Socket | null = null;

const fetchListDetails = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/lists/${listId}`);
    list.value = res.data;
    items.value = res.data.items || [];
  } catch (error) {
    console.error('Error fetching list details:', error);
  }
};

const addItem = async () => {
  if (!newItemName.value.trim()) return;
  try {
    await axios.post('http://localhost:3000/items', {
      list_id: listId,
      name: newItemName.value,
      created_by_id: '00000000-0000-0000-0000-000000000000'
    });
    newItemName.value = '';
    // Let socket handle the addition
  } catch (error) {
    console.error('Error adding item:', error);
  }
};

const toggleItem = async (item: any) => {
  try {
    await axios.patch(`http://localhost:3000/items/${item.id}`, {
      is_purchased: !item.is_purchased
    });
    // Let socket handle the update
  } catch (error) {
    console.error('Error toggling item:', error);
  }
};

onMounted(() => {
  fetchListDetails();

  socket = io('http://localhost:3000');
  
  socket.on('connect', () => {
    socket?.emit('joinList', listId);
  });

  socket.on('itemCreated', (item) => {
    items.value.push(item);
  });

  socket.on('itemUpdated', (item) => {
    const index = items.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items.value[index] = item;
    }
  });

  socket.on('itemDeleted', (itemId) => {
    items.value = items.value.filter(i => i.id !== itemId);
  });
});

onUnmounted(() => {
  if (socket) {
    socket.emit('leaveList', listId);
    socket.disconnect();
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">List Details <span v-if="list">({{ list.name }})</span></h2>
      <router-link to="/" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">&larr; Back to Dashboard</router-link>
    </div>
    
    <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
      <form @submit.prevent="addItem" class="flex gap-2">
        <input 
          v-model="newItemName" 
          type="text" 
          placeholder="Add a new item..." 
          class="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add
        </button>
      </form>
    </div>

    <div class="space-y-4">
      <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
          Items
        </div>
        <div v-if="items.length === 0" class="p-4 text-gray-500">
          No items in this list yet.
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="item in items" :key="item.id" class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
            <div class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                :checked="item.is_purchased"
                @change="toggleItem(item)"
                class="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" 
              />
              <span :class="{'line-through text-gray-400': item.is_purchased, 'text-gray-900 font-medium': !item.is_purchased}">
                {{ item.name }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
