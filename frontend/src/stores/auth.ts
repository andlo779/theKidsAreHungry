import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null as any,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);
      this.user = {
        id: decoded.sub,
        email: decoded.email,
        family_id: decoded.family_id,
        name: decoded.name,
      };
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
    async login(credentials: any) {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        credentials,
      );
      this.setToken(res.data.access_token);
      this.user = res.data.user;
    },
    async register(data: any) {
      const res = await axios.post("http://localhost:3000/auth/register", data);
      this.setToken(res.data.access_token);
      this.user = res.data.user;
    },
    loadUser() {
      if (this.token) {
        try {
          const decoded: any = jwtDecode(this.token);
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            family_id: decoded.family_id,
            name: decoded.name,
          };
        } catch (e) {
          this.logout();
        }
      }
    },
  },
});
