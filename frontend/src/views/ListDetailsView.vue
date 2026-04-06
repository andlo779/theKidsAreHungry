<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/auth";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import BaseCard from "../components/BaseCard.vue";

const route = useRoute();
const listId = route.params.id as string;
const authStore = useAuthStore();

const list = ref<any>(null);
const items = ref<any[]>([]);
const newItemName = ref("");
const isLoading = ref(true);

let socket: Socket | null = null;

const fetchListDetails = async () => {
  try {
    isLoading.value = true;
    const res = await axios.get(`http://localhost:3000/lists/${listId}`);
    list.value = res.data;
    items.value = res.data.items || [];
  } catch (error) {
    console.error("Error fetching list details:", error);
  } finally {
    isLoading.value = false;
  }
};

const addItem = async () => {
  if (!newItemName.value.trim()) return;
  try {
    await axios.post("http://localhost:3000/items", {
      list_id: listId,
      name: newItemName.value,
    });
    newItemName.value = "";
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

const toggleItem = async (item: any) => {
  try {
    await axios.patch(`http://localhost:3000/items/${item.id}`, {
      is_purchased: !item.is_purchased,
    });
  } catch (error) {
    console.error("Error toggling item:", error);
  }
};

const deleteItem = async (itemId: string) => {
  try {
    await axios.delete(`http://localhost:3000/items/${itemId}`);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

const pendingItems = computed(() => items.value.filter(i => !i.is_purchased).sort((a, b) => b.id - a.id));
const purchasedItems = computed(() => items.value.filter(i => i.is_purchased).sort((a, b) => b.id - a.id));

onMounted(() => {
  fetchListDetails();

  socket = io("http://localhost:3000", {
    auth: { token: localStorage.getItem("token") },
  });

  socket.on("connect", () => {
    socket?.emit("joinList", listId);
  });

  socket.on("itemCreated", (item) => {
    items.value.push(item);
  });

  socket.on("itemUpdated", (item) => {
    const index = items.value.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items.value[index] = item;
    }
  });

  socket.on("itemDeleted", (itemId) => {
    items.value = items.value.filter((i) => i.id !== itemId);
  });
});

onUnmounted(() => {
  if (socket) {
    socket.emit("leaveList", listId);
    socket.disconnect();
  }
});
</script>

<template>
  <div class="space-y-8 max-w-2xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors mb-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </router-link>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">
          {{ list?.name || 'Loading List...' }}
        </h2>
      </div>
      <div v-if="list" class="flex -space-x-2">
        <!-- Family visualization placeholder -->
        <div class="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 text-xs font-black">
          {{ authStore.user?.name.charAt(0) }}
        </div>
      </div>
    </header>

    <!-- Add Item Bar -->
    <section class="sticky top-[72px] z-10">
      <BaseCard class="p-2 bg-white/80 backdrop-blur-md shadow-lg border-emerald-100 ring-4 ring-emerald-500/5">
        <form @submit.prevent="addItem" class="flex items-center gap-2">
          <div class="flex-1">
            <input
              v-model="newItemName"
              type="text"
              placeholder="Add milk, eggs, bread..."
              class="w-full bg-transparent border-none px-4 py-2.5 text-slate-900 focus:outline-none font-medium placeholder:text-slate-400"
            />
          </div>
          <BaseButton type="submit" class="!rounded-2xl h-11 px-6">
            Add Item
          </BaseButton>
        </form>
      </BaseCard>
    </section>

    <!-- Main List Sections -->
    <div class="space-y-10 pb-20">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-slate-100 animate-pulse rounded-2xl w-full"></div>
      </div>

      <!-- Items to Buy -->
      <section v-else class="space-y-4">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            To Buy
            <span class="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
              {{ pendingItems.length }}
            </span>
          </h3>
        </div>

        <div v-if="pendingItems.length === 0" class="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p class="text-slate-400 font-bold">Nothing to buy! Enjoy your day. ☀️</p>
        </div>

        <transition-group
          v-else
          name="item-list"
          tag="ul"
          class="space-y-3"
        >
          <li
            v-for="item in pendingItems"
            :key="item.id"
            class="group"
          >
            <BaseCard class="p-4 flex items-center justify-between hover:border-emerald-200 transition-all duration-200">
              <div class="flex items-center gap-4 flex-1">
                <button 
                  @click="toggleItem(item)"
                  class="w-6 h-6 rounded-lg border-2 border-slate-200 flex items-center justify-center transition-all duration-200 hover:border-emerald-500 group-hover:scale-110"
                >
                  <div class="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-0 transform scale-50 transition-all duration-200"></div>
                </button>
                <span class="text-slate-900 font-bold transition-all duration-200">
                  {{ item.name }}
                </span>
              </div>
              <button 
                @click="deleteItem(item.id)"
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </BaseCard>
          </li>
        </transition-group>
      </section>

      <!-- Purchased Items -->
      <section v-if="purchasedItems.length > 0" class="space-y-4">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-lg font-black text-slate-400">Purchased</h3>
        </div>

        <transition-group
          name="item-list"
          tag="ul"
          class="space-y-3 opacity-60"
        >
          <li
            v-for="item in purchasedItems"
            :key="item.id"
            class="group"
          >
            <BaseCard class="p-4 bg-slate-50/50 flex items-center justify-between border-slate-100">
              <div class="flex items-center gap-4">
                <button 
                  @click="toggleItem(item)"
                  class="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center transition-all duration-200"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span class="text-slate-500 font-medium line-through">
                  {{ item.name }}
                </span>
              </div>
              <button 
                @click="deleteItem(item.id)"
                class="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </BaseCard>
          </li>
        </transition-group>
      </section>
    </div>
  </div>
</template>

<style scoped>
.item-list-move,
.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.item-list-enter-from,
.item-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.item-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
