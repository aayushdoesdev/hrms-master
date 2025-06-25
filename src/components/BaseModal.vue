<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/50 flex justify-center items-end sm:items-center"
        @click.self="close"
      >
        <transition name="slide-up">
          <div
            class="bg-white dark:bg-zinc-900 dark:text-white rounded-t-3xl sm:rounded-xl shadow-xl w-full sm:max-w-xl sm:w-full p-6 relative max-h-[95%] overflow-y-auto no-scrollbar"
          >
            <!-- Close button -->
            <button
              @click="close"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <i class="pi pi-times" />
            </button>

            <!-- Title -->
            <h2 v-if="title" class="text-xl font-semibold mb-4">
              {{ title }}
            </h2>
            <slot name="title" v-else />

            <!-- Modal Content -->
            <div>
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>


<script setup>
defineProps({
  modelValue: Boolean,
  title: String
});

const emit = defineEmits(['update:modelValue']);
const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.10s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Backdrop fade */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide-up transition for modal */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}

</style>
