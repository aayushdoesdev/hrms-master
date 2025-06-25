<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import LottieAnimation from "@/components/LottieAnimation.vue";
import { toast } from "@/utils/toast";

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");
const showPassword = ref(false);
const checkTnC = ref(false);
const requested = ref(false);
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    requested.value = true;
    error.value = "";

    const response = await auth.loginAdmin({
      company_email: email.value,
      company_password: password.value,
    });

    if (response.status === 200) {
      toast.success("Logged in successfully");

      const userRole = response.data?.userRole || 'super_admin';
      const userName = response.data?.userName || '';

      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userName);

      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed.";
  } finally {
    requested.value = false;
  }
};
</script>

<template>
  <main class="flex items-center justify-between">
    <!-- Left Image Section -->
    <div class="hidden xl:block bg-black w-[50%] h-screen">
      <img
        src="/images/login-img.webp"
        alt="Login Illustration"
        class="w-full h-full object-cover object-top"
      />
    </div>

    <!-- Right Form Section -->
    <div class="w-full md:w-[80%] xl:w-[50%] mx-auto h-screen">
      <div
        class="flex flex-col mx-auto items-start justify-center h-full w-[90%] md:w-[70%] space-y-4"
      >
        <div class="space-y-0">
          <h2 class="text-[30px] font-bold text-left">
            Welcome Back, Master Admin
          </h2>
          <p class="opacity-60">Please enter your email and password</p>
        </div>

        <!-- Email -->
        <input
          v-model="email"
          type="email"
          placeholder="Company Email"
          class="mb-3 custom-input"
        />

        <!-- Password -->
        <div class="custom-input bg-white px-4 flex items-center justify-between">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Enter Password"
            class="bg-transparent w-full outline-none"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="pi"
            :class="showPassword ? 'pi-eye-slash' : 'pi-eye'"
          ></button>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            v-model="checkTnC"
            id="tnc"
            class="cursor-pointer"
          />
          <label for="tnc" class="cursor-pointer text-[14px]">
            I agree to the
            <a
              href="/terms-and-conditions"
              target="_blank"
              class="hover:underline text-custom-blue"
              >XYZ T&C</a
            >
            and
            <a
              href="/terms-and-conditions"
              target="_blank"
              class="hover:underline text-custom-blue"
              >Privacy Policy</a
            >
          </label>
        </div>

        <!-- Login Button -->
        <button
          @click="login"
          :disabled="!checkTnC || requested"
          :class="[ 
            'w-full py-2 rounded-md mt-3',
            checkTnC
              ? 'bg-[#387ED1] text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <div v-if="requested" class="w-6 mx-auto">
            <lottieAnimation animationPath="/animations/small-loading.json" />
          </div>
          <p v-else>Login</p>
        </button>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </div>
    </div>
  </main>
</template>
