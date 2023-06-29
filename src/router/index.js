import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  routes,
  history: createWebHistory(),
  // linkActiveClass: "active",
});

router.beforeEach(async (to, from) => {
  const store = useAuthStore();

  if (to.meta.auth && !store.isAuthenticated) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  } else if (to.meta.guest && store.isAuthenticated) {
    return {
      name: "tasks",
      query: {
        redirect: to.fullPath,
      },
    };
  }
});

export default router;
