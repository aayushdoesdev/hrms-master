<script setup>
import { ref } from "vue";
import { useSuperAdminStore } from "@/stores/superAdminStore";

const superAdminStore = useSuperAdminStore();
const { allSuperAdminData } = storeToRefs(superAdminStore);

import Dropdown from "@/components/Dropdown.vue";
import BaseModal from "@/components/BaseModal.vue";
import Table from "@/components/TableComponents/Table.vue";
import TableHeader from "@/components/TableComponents/TableHeader.vue";
import TableBody from "@/components/TableComponents/TableBody.vue";
import TableRow from "@/components/TableComponents/TableRow.vue";
import TableCell from "@/components/TableComponents/TableCell.vue";
import TableHead from "@/components/TableComponents/TableHead.vue";
import { storeToRefs } from "pinia";

// States
const searchQuery = ref("");
const selectedDept = ref(null);

const isEditMode = ref(false);
const editingIndex = ref(null);
const isVerifiedLoading = ref(false)

const showModal = ref(false);
const form = ref({
  companyEmail: "",
  otp: "",
  companyName: "",
  role: "",
  mobile: "",
  company_password: "",
  message: "",
  expiry: "",
  domainOwner: false,
  isUser: false,
});


// Mock department options
const departmentOptions = [
  { label: "HR", value: "hr" },
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
];

const handleEdit = (employee, index) => {
  form.value = {
    companyEmail: employee.companyEmail || "",
    otp: "", // do not pre-fill OTP
    companyName: employee.companyName || "",
    role: "", // not provided in API, add if available
    mobile: employee.mobile || "",
    company_password: "", // never prefill password
    message: employee.message || "",
    expiry: employee.expiry || "",
    domainOwner: employee.domainOwner || false,
    isUser: employee.isUser || false,
  };
  isEditMode.value = true;
  editingIndex.value = index;
  showModal.value = true;
};

const close = () => {
  showModal.value = false;
  isEditMode.value = false;
  editingIndex.value = null;
  form.value = {
    companyEmail: "",
    otp: "",
    companyName: "",
    role: "",
    mobile: "",
    company_password: "",
    message: "",
    expiry: "",
    domainOwner: false,
    isUser: false,
  };
};

const handleView = (employee) => {
  console.log("View", employee);
};

const requestOtp = async () => {
  isVerifiedLoading.value = true
  const payload = {
    companyEmail: form.value.companyEmail,
  };
  try {
    await superAdminStore.getSuperAdminOtp(payload);
  } catch (error) {
    console.error(error);
  } finally{
    isVerifiedLoading.value = false
  }
};

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      const updated = { ...form.value };
      const id = allSuperAdminData.value[editingIndex.value].id;

      // Call API to update
      await superAdminStore.updateSuperAdmin(id, updated);

      // Update local state
      allSuperAdminData.value[editingIndex.value] = {
        ...allSuperAdminData.value[editingIndex.value],
        ...updated
      };
    } else {
      await superAdminStore.createSuperAdmin(form.value);
    }

    showModal.value = false;
    isEditMode.value = false;
    editingIndex.value = null;
  } catch (error) {
    console.error(error);
  }
};


const handleDelete = async(employee) => {
  try {
    await superAdminStore.deleteSuperAdmin(employee.id)
  } catch (error) {
    console.error(error)
  }
}

</script>

<template>
  <main class="flex flex-col gap-2 h-[calc(100vh-20px)]">
    <!-- {{ allSuperAdminData }} -->
    <div
      class="bg-white p-2 rounded-lg flex flex-col flex-1 min-h-0 overflow-hidden w-full"
    >
      <div
        class="border-b border-black/15 dark:border-white/15 pb-2 flex items-center justify-between"
      >
        <h1 class="title-text">Super Admins list</h1>
        <button
          @click="showModal = true"
          class="pi pi-plus text-white bg-blue-500 rounded p-2"
        ></button>
      </div>

      <!-- Search Query -->
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
          <Dropdown
            v-model="selectedDept"
            :options="departmentOptions"
            placeholder="Select Department"
          />
        </div>
      </div>

      <div class="mt-4">
        <Table>
          <TableHeader>
            <TableRow class="bg-[#e2f4ff] rounded-xl">
              <TableHead class="w-[200px]">Admin Id</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <!-- <TableHead>Disable</TableHead> -->
              <TableHead class="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(employee, index) in allSuperAdminData"
              :key="employee.id"
            >
              <TableCell>{{ employee.superId || "-" }}</TableCell>
              <TableCell>{{ employee.companyName || "-" }}</TableCell>
              <TableCell>{{ employee.companyEmail || "-" }}</TableCell>
              <TableCell>-</TableCell>
              <!-- No mobile field in API -->

              <!-- Toggle -->
              <!-- <TableCell>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only"
                    v-model="employee.disabled"
                    @change="toggleStatus(index)"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full relative transition-all"
                  >
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"
                      :class="{ 'translate-x-5': employee.disabled }"
                    ></div>
                  </div>
                </label>
              </TableCell> -->

              <!-- Actions -->
              <TableCell class="flex gap-3 justify-end">
                <button @click="handleView(employee)" title="View">
                  <i class="pi pi-eye text-gray-600 text-[18px]"></i>
                </button>
                <button @click="handleEdit(employee, index)" title="Edit">
                  <i class="pi pi-pencil text-blue-500 text-[18px]"></i>
                </button>
                <button @click="handleDelete(employee)" title="Delete">
                  <i class="pi pi-trash text-red-500 text-[18px]"></i>
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <BaseModal v-model="showModal" title="Add Admin User Info">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold mb-1">Email</label>
          <div class="flex gap-2">
            <input
              v-model="form.companyEmail"
              type="email"
              placeholder="enter admin email"
              class="custom-input flex-1"
            />
            <button
              @click="requestOtp"
              :disabled="isVerifiedLoading"
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {{ isVerifiedLoading ? "Verifing..." : "Verify" }}
            </button>
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1">Otp</label>
          <input
            v-model="form.otp"
            type="text"
            placeholder="enter email otp"
            class="custom-input"
          />
          <p v-if="form.otp.length === 0" class="text-xs text-red-500 mt-1">
            Enter the OTP sent to your email
          </p>
        </div>

        <div>
          <label class="block font-semibold mb-1">Name</label>
          <input
            v-model="form.companyName"
            type="text"
            placeholder="enter admin name"
            class="custom-input"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Role</label>
          <input
            v-model="form.role"
            type="text"
            placeholder="Search Role"
            class="custom-input"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Mobile</label>
          <input
            v-model="form.mobile"
            type="text"
            placeholder="enter admin mobile no"
            class="custom-input"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Password</label>
          <input
            v-model="form.company_password"
            type="password"
            placeholder="enter admin password"
            class="custom-input"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Message</label>
          <input
            v-model="form.message"
            type="text"
            placeholder="enter admin message"
            class="custom-input"
          />
        </div>

        <div>
          <label class="block font-semibold mb-1">Expire At</label>
          <input v-model="form.expiry" type="date" class="custom-input" />
        </div>

        <div class="flex items-center gap-2">
          <label class="font-semibold">Domain Owner</label>
          <input
            type="checkbox"
            v-model="form.domainOwner"
            class="toggle-checkbox"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="font-semibold">Is User</label>
          <input
            type="checkbox"
            v-model="form.isUser"
            class="toggle-checkbox"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button @click="close" class="px-4 py-2 bg-gray-300 text-black rounded">
          Close
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </BaseModal>
  </main>
</template>
