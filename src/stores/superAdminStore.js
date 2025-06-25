import { defineStore } from "pinia";
import { makeRequest } from "@/request/request";
import { ref } from "vue";
import endpoints from "@/request/endpoints";
import { toast } from "@/utils/toast";

export const useSuperAdminStore = defineStore("superadmin", () => {
  const loading = ref(true);
  const allSuperAdminData = ref([]);
  const totalSuperAdminLength = ref();
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref("");

  const getallSuperAdmin = async () => {
    loading.value = true;

    try {
      const response = await makeRequest(
        endpoints.getSuperAdmins,
        "GET",
        {},
        {},
        {},
        0,
        null
      );

      allSuperAdminData.value = response?.data;
      totalSuperAdminLength.value = response?.data.length;
      totalPages.value = response?.total_pages;
    } catch (error) {
      console.error("Error in fetching all employes leave data", error);
    } finally {
      loading.value = false;
    }
  };

  const getSuperAdminOtp = async (form) => {
    try {
      const response = await makeRequest(
        endpoints.getSuperAdminOtp,
        "POST",
        form,
        {},
        {},
        0
      );
      return response;
    } catch (error) {
      console.error("Error in getting SuperAdmin otp", error);
    }
  };

  const createSuperAdmin = async (form) => {
    try {
      const response = await makeRequest(
        endpoints.registerSuperAdmin,
        "POST",
        form,
        {},
        {},
        0
      );
      toast.success(response.message);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error in creating SuperAdmin", error);
    }
  };

  const updateSuperAdmin = async (id, form) => {
    try {
      await makeRequest(endpoints.getSuperAdmins, "PUT", form, {}, {}, 0, id);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error in updating SuperAdmin", error);
    }
  };

  const deleteSuperAdmin = async (id) => {
    try {
      await makeRequest(endpoints.getSuperAdmins, "DELETE", {}, {}, {}, 0, id);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error in deleting SuperAdmin", error);
    }
  };

  getallSuperAdmin();

  return {
    allSuperAdminData,
    getallSuperAdmin,
    totalSuperAdminLength,
    updateSuperAdmin,
    createSuperAdmin,
    deleteSuperAdmin,
    getSuperAdminOtp,
    loading,
    page,
    limit,
    totalPages,
  };
});
