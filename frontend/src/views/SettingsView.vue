<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

const authStore = useAuthStore();
const familyMembers = ref<any[]>([]);
const isLoadingFamily = ref(true);

const fetchFamilyMembers = async () => {
  try {
    isLoadingFamily.value = true;
    const res = await axios.get("http://localhost:3000/users/me/family-members");
    familyMembers.value = res.data;
  } catch (error) {
    console.error("Error fetching family members:", error);
  } finally {
    isLoadingFamily.value = false;
  }
};

onMounted(() => {
  authStore.loadUser();
  fetchFamilyMembers();
});

const updatePassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "Please fill out all fields.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New passwords do not match.";
    return;
  }

  try {
    isSubmitting.value = true;
    await axios.patch("http://localhost:3000/users/me/password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    successMessage.value = "Password changed successfully.";
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    console.error("Error changing password:", error);
    let msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    if (Array.isArray(msg)) {
      msg = msg.join(", ");
    } else if (typeof msg === "object") {
      msg = JSON.stringify(msg);
    }

    if (msg === "Incorrect old password") {
      errorMessage.value =
        "The old password you entered is incorrect. Please try again.";
    } else {
      errorMessage.value =
        msg || "An unexpected error occurred while changing your password.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const selectAll = (e: Event) => {
  const target = e.target as HTMLInputElement;
  target.select();
};
</script>

<template>
  <div class="space-y-6 max-w-lg mx-auto">
    <div>
      <h2 class="text-2xl font-bold">Account Settings</h2>
      <p class="text-gray-600">Manage your password and see your family.</p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 class="text-lg font-bold mb-4">My Family</h3>

      <div v-if="isLoadingFamily" class="animate-pulse space-y-4">
        <div class="h-10 bg-gray-100 rounded"></div>
        <div class="h-10 bg-gray-100 rounded"></div>
      </div>

      <div
        v-else-if="familyMembers.length === 0"
        class="text-gray-500 text-sm italic"
      >
        No family members found.
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="member in familyMembers"
          :key="member.id"
          class="py-3 flex items-center justify-between"
        >
          <div>
            <div class="font-medium text-gray-900">
              {{ member.name }}
              <span
                v-if="member.id === authStore.user?.id"
                class="text-gray-400 font-normal text-sm ml-1"
                >(You)</span
              >
            </div>
            <div class="text-sm text-gray-500">{{ member.email }}</div>
          </div>
          <div
            class="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 uppercase tracking-wider"
          >
            Family
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 class="text-lg font-bold mb-4">Change Password</h3>

      <form @submit.prevent="updatePassword" class="space-y-4">
        <div
          v-if="errorMessage"
          class="bg-red-50 text-red-600 p-3 rounded text-sm"
        >
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="bg-green-50 text-green-600 p-3 rounded text-sm"
        >
          {{ successMessage }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Old Password</label
          >
          <input
            v-model="oldPassword"
            type="password"
            required
            @focus="selectAll"
            @click="selectAll"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >New Password</label
          >
          <input
            v-model="newPassword"
            type="password"
            required
            @focus="selectAll"
            @click="selectAll"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Confirm New Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            required
            @focus="selectAll"
            @click="selectAll"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
        >
          {{ isSubmitting ? "Updating..." : "Update Password" }}
        </button>
      </form>
    </div>
  </div>
</template>
