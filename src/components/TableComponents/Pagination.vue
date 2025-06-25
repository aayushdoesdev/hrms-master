<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  hasNextPage: { type: Boolean, default: false },
  hasPreviousPage: { type: Boolean, default: false },
});

const emit = defineEmits(["page-change"]);

const goToPage = (direction) => {
  emit("page-change", direction);
};
</script>

<template>
  <div class="flex justify-center items-center pt-4 text-sm dark:bg-black dark:text-white">
    <div class="flex items-center gap-6">
      <button
        @click="goToPage('prev')"
        :disabled="!hasPreviousPage"
        class="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>
      <p class="">Page {{ currentPage }}</p>
      <button
        @click="goToPage('next')"
        :disabled="!hasNextPage"
        class="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
</template>
