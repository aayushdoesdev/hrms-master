<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { debounce } from "@/utils/debounce";
import { useDepartmentStore } from "@/stores/organisation/departmentStore";
import LottieAnimation from "@/components/LottieAnimation.vue";
import AddEmployeeModal from "./AddEmployeeModal.vue";
import PromotionModal from "./PromotionModal.vue";

// STORES
import { useEmployeeStore } from "@/stores/organisation/employeeStore";

const employeeStore = useEmployeeStore();
const {
  allEmployeeData,
  totalEmployeeLength,
  totalFemaleEmployee,
  totalMaleEmployee,
  showModal,
  showPromotionModal,
  isEditing,
  totalPages,
  editingEmployee,
  editingEmployeeId,
  page,
  limit,
  loading,
} = storeToRefs(employeeStore);

const departmentStore = useDepartmentStore()

const {allDepartmentData} = storeToRefs(departmentStore)

const { clearEditingEmployee } = employeeStore;

// COMPONENTS
import Dropdown from "@/components/Dropdown.vue";
import Table from "@/components/TableComponents/Table.vue";
import TableHeader from "@/components/TableComponents/TableHeader.vue";
import TableBody from "@/components/TableComponents/TableBody.vue";
import TableRow from "@/components/TableComponents/TableRow.vue";
import TableCell from "@/components/TableComponents/TableCell.vue";
import TableHead from "@/components/TableComponents/TableHead.vue";

// Track which dropdown is open
const activeMenuIndex = ref(null);

function toggleMenu(index) {
  activeMenuIndex.value = activeMenuIndex.value === index ? null : index;
}

function handleEdit(employee) {
  employeeStore.setEditingEmployee(employee); // store the employee for editing
  editingEmployeeId.value = employee.id
  showModal.value = true;
}


function handlePromotionEdit(employee) {
  // employeeStore.setEditingEmployee(employee); // store the employee for editing
  editingEmployeeId.value = employee.id
  showPromotionModal.value = true;
}

function handleDelete(employee) {
  console.log("Delete:", employee);
}

const selectedDept = ref("");
const searchQuery = ref("");

const departmentOptions = computed(() => {
  return ["All", ...allDepartmentData.value.map(dept => dept.name)]
})


const openCreateModal = () =>{
  showModal.value = true
  isEditing.value = false
  editingEmployee.value = false
}

const currentPage = computed(() => page.value);

const fetchEmployeeData = () => {
  employeeStore.getallEmployees({
    search_query: searchQuery.value,
    department: selectedDept.value,
    page: page.value,
    limit: limit.value,
  });
};

const debouncedEmployeeData = debounce(fetchEmployeeData, 500);

watch([searchQuery, selectedDept], () => {
  page.value = 1;
  debouncedEmployeeData();
});

watch(page, () => {
  fetchEmployeeData(); // no debounce here
});

const nextPage = () => {
  page.value++;
};

const prevPage = () => {
  if (page.value > 0) page.value--;
};
</script>

<template>
  <main class="flex flex-col gap-2 h-[calc(100vh-120px)]">
    <!-- Top Stats Section -->
    <div class="bg-white p-4 rounded-lg dark:bg-black dark:text-white">
      <div
        class="border-b border-black/15 dark:border-white/15 pb-2 flex items-center justify-between"
      >
        <h1 class="title-text">Employee’s Overview</h1>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 mt-4 gap-4 nrml-text">
        <div class="border-l-4 border-green-500 px-6 py-2">
          <p>Total Employees</p>
          <p class="title-text">{{ totalEmployeeLength || '-' }}</p>
        </div>
        <!-- <div class="border-l-4 border-blue-500 px-6 py-2">
          <p>New Employees</p>
          <p class="title-text">150</p>
        </div> -->
        <div class="border-l-4 border-pink-500 px-6 py-2">
          <p>Female Employees</p>
          <p class="title-text">{{ totalFemaleEmployee || '-' }}</p>
        </div>
        <div class="border-l-4 border-yellow-500 px-6 py-2">
          <p>Male Employees</p>
          <p class="title-text">{{ totalMaleEmployee || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="bg-white dark:bg-black dark:text-white p-4 rounded-lg flex flex-col flex-1 min-h-0 overflow-hidden w-full"
    >
      <div
        class="border-b border-black/15 dark:border-white/15 pb-2 flex items-center justify-between"
      >
        <h1 class="title-text">Employee’s list</h1>
        <button
          @click="openCreateModal"
          class="pi pi-plus text-white bg-blue-500 rounded p-2"
        ></button>
      </div>
      {{ isEditing }}

      <!-- Search Input -->
      <div class="mt-4 flex items-center justify-between">
        <div
          class="border border-black/15 dark:border-white/15 px-2 py-2 rounded-md w-[30%] flex items-center gap-2"
        >
          <i class="pi pi-search text-[13px] opacity-50"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="outline-none sm-text w-full bg-transparent"
            placeholder="Search Employee by name, role, ID or any related keywords"
          />
        </div>

        <div class="nrml-text flex gap-4">
          <!-- <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="Select Status"
          /> -->
          <Dropdown
            v-model="selectedDept"
            :options="departmentOptions"
            placeholder="Select Department"
          />
        </div>
      </div>

      <!-- Table Content (scrollable if overflows) -->
      <div class="mt-4 flex-1 overflow-auto">
        <div v-if="loading" class="w-[300px] mx-auto">
          <LottieAnimation animationPath="/animations/loading.json" />
        </div>

        <div
          v-else-if="!loading && allEmployeeData.length === 0"
          class="w-[250px] mx-auto flex flex-col items-center"
        >
          <LottieAnimation animationPath="/animations/no-data-found.json" />
          <p class="font-bold text-[20px]">No Data Found.</p>
        </div>

        <Table v-if="!loading && allEmployeeData.length > 0">
          <TableHeader>
            <TableRow class="bg-[#e2f4ff] rounded-xl">
              <TableHead class="w-[200px]">Name / Email</TableHead>
              <TableHead>Work email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Source of hire</TableHead>
              <TableHead class="w-[150px]">Pan</TableHead>
              <TableHead>UAN number</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(employee, index) in allEmployeeData" :key="index">
              <TableCell class="font-medium">
                <div class="flex flex-col">
                  <span>{{ employee?.userName || "-" }}</span>
                  <span class="sm-text text-gray-500">{{
                    employee.empId
                  }}</span>
                </div>
              </TableCell>
              <TableCell>{{ employee?.email || "-" }}</TableCell>
              <TableCell>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {{ employee?.department || "-" }}
                </span>
              </TableCell>
              <TableCell>{{ employee?.sourceOfHire || "-" }}</TableCell>
              <TableCell class="text-xs">
                <!-- <div class="flex flex-col">
                  <span>{{ employee?.panAadhar.split(" ")[0] || '-' }}</span>
                  <span class="text-gray-500">{{
                    employee?.panAadhar.split(" ")[1] || '-'
                  }}</span>
                </div> -->
              </TableCell>
              <TableCell>{{ employee?.uanNumber || "-" }}</TableCell>
              <TableCell class="flex gap-3 mt-3">
                <button
                  @click="handlePromotionEdit(employee)"
                  class="pi pi-sparkles text-blue-500 text-[18px]"
                ></button>
                <button
                  @click="handleEdit(employee)"
                  class="pi pi-file-edit text-blue-500 text-[18px]"
                ></button>
                <button class="pi pi-trash text-red-500 text-[18px]"></button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- PAGINATION -->
        <div
          v-if="!loading && allEmployeeData.length > 0"
          class="flex justify-center items-center my-4 gap-4 text-text sm-text"
        >
          <button
            @click="prevPage"
            :disabled="page === 1"
            :class="{
              'p-2 rounded-full bg-gray-400 hover:bg-gray-600 disabled:opacity-50 pi pi-angle-left': true,
              'cursor-pointer': page > 1,
              'cursor-not-allowed': page === 1,
            }"
          ></button>

          <p>Page {{ page }} of {{ totalPages }}</p>

          <button
            @click="nextPage"
            :disabled="allEmployeeData.length < limit"
            :class="{
              'p-2 rounded-full bg-gray-400 hover:bg-gray-600 disabled:opacity-50 pi pi-angle-right': true,
              'cursor-pointer': allEmployeeData.length >= limit,
              'cursor-not-allowed': allEmployeeData.length < limit,
            }"
          ></button>
        </div>
      </div>
    </div>

    <PromotionModal
      v-model="showPromotionModal"
    />

    <AddEmployeeModal
      v-if="showModal"
      v-model="showModal"
      :editing-employee="editingEmployee"
      @close="clearEditingEmployee"
    />
  </main>
</template>
