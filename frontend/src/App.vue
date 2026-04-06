<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

const logout = () => {
  authStore.logout();
  menuOpen.value = false;
  router.push("/login");
};

const goToDashboard = () => {
  menuOpen.value = false;
  router.push("/");
};

const goToArchived = () => {
  menuOpen.value = false;
  router.push("/archived");
};

const goToSettings = () => {
  menuOpen.value = false;
  router.push("/settings");
};

// Close menu when clicking outside
const closeMenu = (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".menu-container")) {
    menuOpen.value = false;
  }
};

onMounted(() => {
  authStore.loadUser();
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center"
      >
        <!-- Logo and Menu container -->
        <div class="flex items-center gap-4">
          <div class="relative menu-container">
            <button
              @click="menuOpen = !menuOpen"
              class="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-600 focus:outline-none transition-all duration-200"
              aria-label="Menu"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div
                v-if="menuOpen"
                class="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 z-30 border border-slate-100 ring-4 ring-black/5"
              >
                <button
                  @click="goToDashboard"
                  class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  @click="goToArchived"
                  class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  Archived Lists
                </button>
                <button
                  @click="goToSettings"
                  class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  Settings
                </button>
                <div class="border-t border-slate-50 my-1 mx-2"></div>
                <button
                  @click="logout"
                  class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </transition>
          </div>

          <h1 
            @click="goToDashboard"
            class="text-lg sm:text-xl font-black text-slate-900 tracking-tight cursor-pointer hover:text-emerald-600 transition-colors"
          >
            Hungry Kids
          </h1>
        </div>

        <!-- User Profile -->
        <div class="flex items-center gap-2" v-if="authStore.user">
          <div class="flex flex-col items-end mr-1 hidden sm:flex">
            <span class="text-sm font-bold text-slate-900 leading-none mb-0.5">{{ authStore.user.name }}</span>
            <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{{ authStore.user.familyName || 'Family' }}</span>
          </div>
          <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-600/20">
            {{ authStore.user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
