<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  options: Array,
  placeholder: {
    type: String,
    default: "Select"
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  emit('update:modelValue', option)
  isOpen.value = false
}

function closeOnClickOutside(event) {
  if (!event.target.closest('.dropdown-container')) {
    isOpen.value = false
  }
}

watch(isOpen, (val) => {
  if (val) document.addEventListener('click', closeOnClickOutside)
  else document.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div class="relative dropdown-container">
    <div
      class="flex items-center justify-between gap-2 border border-black/30 dark:border-white/20 px-3 py-2 rounded-lg cursor-pointer min-w-[120px]"
      @click="toggle"
    >
      <p class="truncate">
        {{ modelValue || placeholder }}
      </p>
      <i class="pi pi-angle-down"></i>
    </div>

    <transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-white/20 rounded-md shadow-lg z-10"
      >
        <li
          v-for="option in options"
          :key="option"
          @click="selectOption(option)"
          class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {{ option }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
