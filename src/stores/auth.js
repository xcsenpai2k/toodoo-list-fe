import { defineStore } from "pinia";
import { login, register, logout, getUser } from "../http/auth-api";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user-data")) || null,
    exPath: null,
    errors: null,
  }),

  getters: {
    isAuthenticated() {
      return !!this.token;
    },
  },

  actions: {
    async handleRegister(newUser) {
      try {
        await register(newUser);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
      if (this.errors) {
        await login({
          email: newUser.email,
          password: newUser.password,
        });
      }
    },
    async getCurrentAuthUser() {
      try {
        const res = await getUser();
        this.user = res.data;
        localStorage.setItem("user-data", JSON.stringify(this.user));
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
    async login(credentials) {
      try {
        const response = await login(credentials);
        this.setAuthenCookie(response.data.data.access_token);
        this.token = response.data.data.access_token;
        localStorage.setItem("token", this.token);
        this.user = response.data.data.user;
        await this.getCurrentAuthUser();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
        throw new Error("Invalid credentials. Please try again.");
      }
    },

    async logout() {
      try {
        await logout();
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user-data");
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    },

    getAuthToken() {
      const cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].includes("JWT-TOKEN")) {
          const token = cookies[i].split("=")[1];
          if (token.length > 0) {
            return token;
          }
        }
      }
      return null;
    },

    setAuthenCookie(token) {
      const expireTimeFiveMinutes = new Date(
        new Date().getTime() + 5 * 60 * 1000
      );
      document.cookie =
        "JWT-TOKEN=" +
        token +
        ";expires=" +
        expireTimeFiveMinutes +
        ";path =/ ";
    },
    setExPath(path) {
      this.exPath = path;
    },
  },
});
