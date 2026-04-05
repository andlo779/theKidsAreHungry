<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const lists = ref<any[]>([]);
const newListName = ref("");
const router = useRouter();
const authStore = useAuthStore();
const activeMenu = ref<string | null>(null);

const fetchLists = async () => {
  try {
    const res = await axios.get("http://localhost:3000/lists");
    lists.value = res.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
};

const createList = async () => {
  if (!newListName.value.trim()) return;
  try {
    await axios.post("http://localhost:3000/lists", {
      name: newListName.value,
    });
    newListName.value = "";
    fetchLists();
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
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
        The Kids Are Hungry...
      </h1>
    </div>
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold">Your Shopping Lists</h2>
        <p class="text-gray-600">Select a list or create a new one.</p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
      <form @submit.prevent="createList" class="flex gap-2">
        <input
          v-model="newListName"
          type="text"
          placeholder="New list name..."
          class="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
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
        class="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:border-indigo-500 transition-colors relative"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg text-indigo-700">{{ list.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ list.items?.length || 0 }} items
            </p>
          </div>
          <div class="relative" @click.stop>
            <button
              @click="toggleMenu(list.id)"
              class="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button>
            <div
              v-if="activeMenu === list.id"
              class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <button
                @click="archiveList(list.id)"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
