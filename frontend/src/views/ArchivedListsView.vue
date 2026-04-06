<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import BaseButton from "../components/BaseButton.vue";
import BaseCard from "../components/BaseCard.vue";

const lists = ref<any[]>([]);
const router = useRouter();
const authStore = useAuthStore();
const activeMenu = ref<string | null>(null);
const isLoading = ref(true);

const fetchArchivedLists = async () => {
  try {
    isLoading.value = true;
    const res = await axios.get("http://localhost:3000/lists/archived");
    lists.value = res.data;
  } catch (error) {
    console.error("Error fetching archived lists:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleMenu = (id: string) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

const unarchiveList = async (id: string) => {
  try {
    await axios.patch(`http://localhost:3000/lists/${id}/unarchive`);
    lists.value = lists.value.filter((list) => list.id !== id);
  } catch (error) {
    console.error("Error unarchiving list:", error);
  }
  activeMenu.value = null;
};

const deleteListPermanently = async (id: string) => {
  if (
    confirm(
      "Are you sure you want to permanently delete this list? This action cannot be undone.",
    )
  ) {
    try {
      await axios.delete(`http://localhost:3000/lists/${id}/permanent`);
      lists.value = lists.value.filter((list) => list.id !== id);
    } catch (error) {
      console.error("Error permanently deleting list:", error);
    }
  }
  activeMenu.value = null;
};

const closeMenu = () => {
  activeMenu.value = null;
};

onMounted(() => {
  authStore.loadUser();
  fetchArchivedLists();
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<template>
  <div class="space-y-10">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">Archived Lists</h2>
        <p class="text-slate-500 font-medium">Manage your past shopping lists.</p>
      </div>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </router-link>
    </header>

    <section class="space-y-6">
      <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2">
        <div v-for="i in 4" :key="i" class="h-32 bg-slate-100 animate-pulse rounded-3xl"></div>
      </div>

      <div v-else-if="lists.length === 0" class="py-12 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <p class="text-slate-500 font-semibold text-lg">No archived lists found.</p>
      </div>

      <transition-group
        v-else
        tag="div"
        name="list-grid"
        class="grid gap-6 sm:grid-cols-2"
      >
        <BaseCard
          v-for="list in lists"
          :key="list.id"
          class="relative p-6 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          :class="{ 'z-20 shadow-xl !opacity-100 !grayscale-0 border-emerald-300 ring-8 ring-emerald-500/5': activeMenu === list.id }"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <h3 class="font-black text-xl text-slate-700">
                {{ list.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
                  {{ list.items?.length || 0 }} items
                </span>
              </div>
            </div>
            
            <div class="relative" @click.stop>
              <button
                @click="toggleMenu(list.id)"
                class="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200 focus:outline-none"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              <transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div
                  v-if="activeMenu === list.id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 z-10 border border-slate-100 ring-4 ring-black/5"
                >
                  <button
                    @click="unarchiveList(list.id)"
                    class="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Unarchive
                  </button>
                  <button
                    @click="deleteListPermanently(list.id)"
                    class="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Permanently
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </BaseCard>
      </transition-group>
    </section>
  </div>
</template>

<style scoped>
.list-grid-enter-active,
.list-grid-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-grid-enter-from,
.list-grid-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
