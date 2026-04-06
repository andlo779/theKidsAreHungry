<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import BaseCard from "../components/BaseCard.vue";

const isLogin = ref(true);
const name = ref("");
const familyName = ref("");
const email = ref("");
const password = ref("");
const errorMsg = ref("");

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const sessionExpired = ref(route.query.expired === "true");

const handleSubmit = async () => {
  errorMsg.value = "";
  try {
    if (isLogin.value) {
      await authStore.login({ email: email.value, password: password.value });
    } else {
      await authStore.register({
        name: name.value,
        familyName: familyName.value,
        email: email.value,
        password: password.value,
      });
    }
    router.push("/");
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || "An error occurred";
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-12 space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">Hungry Kids</h1>
      <p class="text-slate-500 font-medium italic">Shared shopping lists for the whole family.</p>
    </div>

    <BaseCard class="p-8 shadow-xl border-slate-100">
      <div
        v-if="sessionExpired"
        class="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded-xl text-sm font-medium"
      >
        <p class="font-bold">Session Expired</p>
        <p>Please log in again to continue.</p>
      </div>

      <div class="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <button
          @click="isLogin = true"
          :class="[
            'flex-1 py-2 text-sm font-black rounded-xl transition-all duration-200',
            isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          ]"
        >
          Log In
        </button>
        <button
          @click="isLogin = false"
          :class="[
            'flex-1 py-2 text-sm font-black rounded-xl transition-all duration-200',
            !isLogin ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          ]"
        >
          Register
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="!isLogin" class="space-y-6">
          <BaseInput
            v-model="name"
            label="Your Name"
            placeholder="e.g. Mom, Dad, Jane"
            required
          />
          <BaseInput
            v-model="familyName"
            label="Family Name"
            placeholder="e.g. The Smiths"
            required
          />
        </div>

        <BaseInput
          v-model="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          required
        />
        
        <BaseInput
          v-model="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
        />

        <div v-if="errorMsg" class="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold text-center border border-rose-100">
          {{ errorMsg }}
        </div>

        <BaseButton type="submit" class="w-full h-12 text-lg">
          {{ isLogin ? "Welcome Back" : "Join the Family" }}
        </BaseButton>
      </form>
    </BaseCard>

    <p class="text-center text-slate-400 text-sm font-medium">
      {{ isLogin ? "Don't have an account?" : "Already part of a family?" }}
      <button 
        @click="isLogin = !isLogin" 
        class="text-emerald-600 font-bold hover:underline ml-1"
      >
        {{ isLogin ? "Create one" : "Log in" }}
      </button>
    </p>
  </div>
</template>
