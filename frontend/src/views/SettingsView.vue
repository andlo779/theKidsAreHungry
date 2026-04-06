<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import BaseCard from "../components/BaseCard.vue";

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
</script>

<template>
  <div class="space-y-10 max-w-xl mx-auto">
    <header class="space-y-1">
      <h2 class="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
      <p class="text-slate-500 font-medium">Manage your security and family members.</p>
    </header>

    <div class="space-y-6">
      <section class="space-y-4">
        <h3 class="text-xl font-black text-slate-900 px-1">My Family</h3>
        <BaseCard class="divide-y divide-slate-100">
          <div v-if="isLoadingFamily" class="p-6 space-y-4">
            <div v-for="i in 2" :key="i" class="h-12 bg-slate-50 animate-pulse rounded-xl"></div>
          </div>

          <div
            v-else-if="familyMembers.length === 0"
            class="p-12 text-center text-slate-400 font-bold italic"
          >
            No family members found.
          </div>

          <div
            v-else
            v-for="member in familyMembers"
            :key="member.id"
            class="p-4 sm:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors first:rounded-t-3xl last:rounded-b-3xl"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                {{ member.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-slate-900">
                  {{ member.name }}
                  <span
                    v-if="member.id === authStore.user?.id"
                    class="text-emerald-600 text-xs font-black ml-1 uppercase"
                    >(You)</span
                  >
                </div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ member.email }}</div>
              </div>
            </div>
            <div
              class="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest"
            >
              Family
            </div>
          </div>
        </BaseCard>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-black text-slate-900 px-1">Security</h3>
        <BaseCard class="p-6 sm:p-8">
          <form @submit.prevent="updatePassword" class="space-y-6">
            <div
              v-if="errorMessage"
              class="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100"
            >
              {{ errorMessage }}
            </div>
            <div
              v-if="successMessage"
              class="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm font-bold border border-emerald-100"
            >
              {{ successMessage }}
            </div>

            <div class="space-y-4">
              <BaseInput
                v-model="oldPassword"
                type="password"
                label="Current Password"
                placeholder="••••••••"
                required
              />

              <BaseInput
                v-model="newPassword"
                type="password"
                label="New Password"
                placeholder="••••••••"
                required
              />

              <BaseInput
                v-model="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                required
              />
            </div>

            <BaseButton
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12"
            >
              {{ isSubmitting ? "Updating..." : "Update Password" }}
            </BaseButton>
          </form>
        </BaseCard>
      </section>
    </div>
  </div>
</template>
