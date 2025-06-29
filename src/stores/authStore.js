import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refresh_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const role = ref(localStorage.getItem('role') || '')
  const isSuperAdmin = ref(localStorage.getItem('is_super_admin') === 'true')

  const isAuthenticated = computed(() => {
    const localToken = localStorage.getItem('token')
    return !!(token.value && localToken)
  })
  const isAdmin = computed(() => role.value === 'admin')
  const isSuper = computed(() => role.value === 'super_admin' || isSuperAdmin.value)

  const loginAdmin = async (payload) => {
    const res = await axios.post(
      'https://hrmapi.xtention.in/master/login',
      payload
    )

    const access = res.data.token?.access_token
    const refresh = res.data.token?.refresh_token
    const userData = res.data.data
    const userRole = userData?.is_super_admin ? 'super_admin' : 'admin'

    localStorage.setItem('token', `Bearer ${access}`)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('role', userRole)
    localStorage.setItem('is_super_admin', userData?.is_super_admin || false)

    token.value = access
    refreshToken.value = refresh
    user.value = userData
    role.value = userRole
    isSuperAdmin.value = userData?.is_super_admin || false

    return res
  }

  const logout = () => {
    token.value = ''
    refreshToken.value = ''
    user.value = null
    role.value = ''
    isSuperAdmin.value = false
    // localStorage.clear()
    // window.location.reload()
  }

  return {
    token,
    refreshToken,
    user,
    role,
    isSuperAdmin,
    isAuthenticated,
    isAdmin,
    isSuper,
    loginAdmin,
    logout
  }
})
