<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

const logout = () => {
  authStore.logout();
  menuOpen.value = false;
  router.push('/login');
};

const goToDashboard = () => {
  menuOpen.value = false;
  router.push('/');
};

// Close menu when clicking outside
const closeMenu = (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.menu-container')) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  authStore.loadUser();
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-indigo-600 text-white shadow-sm sticky top-0 z-20">
      <div class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Title and Dropdown container -->
        <div class="flex items-center gap-3">
          <!-- Burger button -->
          <div class="relative menu-container">
            <button @click="menuOpen = !menuOpen"
              class="p-1 rounded hover:bg-indigo-700 focus:outline-none flex items-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div v-if="menuOpen"
              class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
              <button @click="goToDashboard"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Dashboard
              </button>
              <button @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- User Info & Logout -->
        <div class="flex items-center gap-3" v-if="authStore.user">
          <span class="text-sm font-medium hidden sm:inline-block">{{ authStore.user.name }}</span>
          <span class="text-sm font-medium sm:hidden truncate max-w-20">{{ authStore.user.name }}</span>
          <button @click="logout"
            class="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm transition-colors border border-indigo-500">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
      <router-view />
    </main>
  </div>
</template>
