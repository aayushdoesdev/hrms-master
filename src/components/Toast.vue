<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "success", // success | error | warning
  },
  title: {
    type: String,
    default: "Success",
  },
  message: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 4000,
  },
});

const visible = ref(false);

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
});

const config = computed(() => {
  switch (props.type) {
    case "error":
      return {
        bg: "bg-red-50",
        text: "text-red-900",
        border: "border-red-500",
        iconBg: "bg-red-500",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`,
      };
    case "warning":
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-900",
        border: "border-yellow-500",
        iconBg: "bg-yellow-500",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.658-1.14 1.106-2.043L13.106 4.957c-.526-.872-1.686-.872-2.212 0L2.976 16.957C2.423 17.86 3.027 19 4.082 19z"/>`,
      };
    default:
      return {
        bg: "bg-green-50",
        text: "text-green-900",
        border: "border-green-500",
        iconBg: "bg-green-500",
        icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />`,
      };
  }
});
</script>

<template>
  <transition
    name="fade-slide"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="visible"
      class="fixed bottom-6 right-6 max-w-sm flex items-center gap-4 rounded-md shadow-lg px-4 py-2 pr-6"
      :class="[config.bg, config.text, 'border-l-4', config.border]"
    >
      <div
        class="w-6 h-6 rounded-full flex items-center justify-center"
        :class="config.iconBg"
        v-html="`<svg class='w-4 h-4 text-white' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'>${config.icon}</svg>`"
      />
      <div>
        <p class="font-semibold">{{ title }}</p>
        <p class="text-sm">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>
