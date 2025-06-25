<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const mockRoutes = [
  { name: 'Super Admin', path: '/' },
  { name: 'Departments', path: '/organisation/departments' },
  { name: 'Employees', path: '/organisation/employees' },
  { name: 'Reports', path: '/organisation/reports' },
];

const navigateTo = (path) => {
  router.push(path);
};

const isActiveRoute = (itemPath) => {
  return route.path === itemPath;
};
</script>

<template>
  <section class="bg-black h-screen w-[250px] flex flex-col items-start justify-start py-2 px-4">
    <router-link to="/" class="flex items-center gap-4 mb-8">
      <img src="/svg/logo.svg" alt="logo" class="w-[50px]" />
      <h1 class="text-white font-bold text-[30px]">StarDesk</h1>
    </router-link>

    <div class="w-full space-y-2">
      <button
        v-for="routeItem in mockRoutes"
        :key="routeItem.path"
        @click="navigateTo(routeItem.path)"
        :class="[
          'w-full text-left px-4 py-3 rounded-md font-medium transition',
          isActiveRoute(routeItem.path)
            ? 'bg-blue-600 text-white'
            : 'bg-white bg-opacity-20 text-white hover:bg-opacity-40'
        ]"
      >
        {{ routeItem.name }}
      </button>
    </div>
  </section>
</template>
