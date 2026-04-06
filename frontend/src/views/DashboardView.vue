<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import BaseCard from "../components/BaseCard.vue";

const lists = ref<any[]>([]);
const newListName = ref("");
const router = useRouter();
const authStore = useAuthStore();
const activeMenu = ref<string | null>(null);
const isLoading = ref(true);

const fetchLists = async () => {
  try {
    isLoading.value = true;
    const res = await axios.get("http://localhost:3000/lists");
    lists.value = res.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
  } finally {
    isLoading.value = false;
  }
};

const createList = async () => {
  if (!newListName.value.trim()) return;
  try {
    const res = await axios.post("http://localhost:3000/lists", {
      name: newListName.value,
    });
    newListName.value = "";
    lists.value.unshift(res.data);
  } catch (error) {
    console.error("Error creating list:", error);
  }
};

const toggleMenu = (id: string) => {
  activeMenu.value = activeMenu.value === id ? null : id;
};

const archiveList = async (id: string) => {
  if (confirm("Are you sure you want to archive this list?")) {
    try {
      await axios.delete(`http://localhost:3000/lists/${id}`);
      lists.value = lists.value.filter((list) => list.id !== id);
    } catch (error) {
      console.error("Error archiving list:", error);
    }
  }
  activeMenu.value = null;
};

const closeMenu = () => {
  activeMenu.value = null;
};

onMounted(() => {
  authStore.loadUser();
  fetchLists();
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<template>
  <div class="space-y-10">
    <header class="space-y-2">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">
        The Kids Are Hungry...
      </h1>
      <p class="text-lg text-slate-500 font-medium">
        Manage your family's shopping lists in real-time.
      </p>
    </header>

    <section>
      <BaseCard class="p-6 bg-emerald-50/50 border-emerald-100">
        <form @submit.prevent="createList" class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <BaseInput
              v-model="newListName"
              placeholder="What do we need to buy?"
              class="shadow-sm"
            />
          </div>
          <BaseButton type="submit" class="sm:w-32 h-[52px]">
            Create List
          </BaseButton>
        </form>
      </BaseCard>
    </section>

    <section class="space-y-6">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-2xl font-black text-slate-900">Your Lists</h2>
        <span class="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {{ lists.length }} Active
        </span>
      </div>

      <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2">
        <div v-for="i in 4" :key="i" class="h-32 bg-slate-100 animate-pulse rounded-3xl"></div>
      </div>

      <div v-else-if="lists.length === 0" class="py-12 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p class="text-slate-500 font-semibold text-lg">No active lists yet. Create one above!</p>
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
          clickable
          @click="router.push(`/lists/${list.id}`)"
          class="relative p-6 group transition-all"
          :class="{ 'z-20 shadow-xl border-emerald-300 ring-8 ring-emerald-500/5': activeMenu === list.id }"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <h3 class="font-black text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">
                {{ list.name }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
                  {{ list.items?.length || 0 }} items
                </span>
                <span v-if="list.items?.some((i: any) => !i.is_purchased)" class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Action needed
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
                  class="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl py-2 z-10 border border-slate-100 ring-4 ring-black/5"
                >
                  <button
                    @click="archiveList(list.id)"
                    class="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archive
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
