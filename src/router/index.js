import { createRouter, createWebHistory } from "vue-router";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout.vue";

import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "",
      component: DashboardLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
