<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const lists = ref<any[]>([]);
const router = useRouter();
const authStore = useAuthStore();
const activeMenu = ref<string | null>(null);

const fetchArchivedLists = async () => {
  try {
    const res = await axios.get("http://localhost:3000/lists/archived");
    lists.value = res.data;
  } catch (error) {
    console.error("Error fetching archived lists:", error);
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
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold">Archived Lists</h2>
        <p class="text-gray-600">Manage your archived shopping lists.</p>
      </div>
      <button
        @click="router.push('/')"
        class="text-indigo-600 hover:text-indigo-800 font-medium"
      >
        &larr; Back to Dashboard
      </button>
    </div>

    <div v-if="lists.length === 0" class="text-gray-500">
      No archived lists found.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="list in lists"
        :key="list.id"
        class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 relative"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg text-gray-700">{{ list.name }}</h3>
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
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <button
                @click="unarchiveList(list.id)"
                class="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 rounded-t-md"
              >
                Unarchive
              </button>
              <button
                @click="deleteListPermanently(list.id)"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
