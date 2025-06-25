<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
// import Navbar from "@/components/Navbar.vue";
// import RightSidebar from "@/components/RightSidebar.vue";
// import Notification from "@/views/Notification.vue";
// import MobileNav from "@/components/mobileNavbar/MobileNav.vue";
// import Bottombar from "@/components/Bottombar.vue";

const showNotification = ref(false);

const toggleNotification = () => {
  showNotification.value = !showNotification.value;
};
</script>

<template>
  <main class="flex items-start min-h-screen"> <!-- Bottom padding for mobile nav -->
    <!-- Desktop Sidebar -->
    <div class="hidden xl:block">
      <Sidebar />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 w-full">
      <!-- Desktop Navbar -->
      <div class="hidden xl:block">
        <Navbar @toggle-notification="toggleNotification" />
      </div>

      <!-- Mobile Navbar -->
      <div class="xl:hidden">
        <MobileNav />
      </div>

      <!-- Routed Page Content -->
      <div class="p-2">
        <RouterView />
      </div>
    </div>

    <!-- Desktop Right Sidebar -->
    <div class="hidden xl:block">
      <RightSidebar />
    </div>

    <!-- Notification Slide Panel -->
    <transition name="slide">
      <div
        v-if="showNotification"
        class="fixed top-[60px] right-[80px] w-[400px] h-[calc(100vh-70px)] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 z-50"
      >
        <div class="flex justify-between items-center px-4 py-3 border-b dark:border-zinc-700">
          <h2 class="font-semibold text-lg">Notifications</h2>
          <button
            @click="showNotification = false"
            class="text-gray-500 hover:text-red-500"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="p-4 max-h-[65vh] overflow-y-auto">
          <Notification />
        </div>
      </div>
    </transition>

    <!-- Mobile Bottom Navigation -->
    <!-- <div class="fixed bottom-0 left-0 w-full xl:hidden z-40">
      <Bottombar />
    </div> -->
  </main>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
