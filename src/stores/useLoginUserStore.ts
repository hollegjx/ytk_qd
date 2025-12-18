import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUserUsingGet } from '@/service/api/userController'

export interface LoginUser {
  id?: string
  userName?: string
  userAvatar?: string
  userProfile?: string
  userRole?: number  // 0 = 普通用户, 1 = 管理员
  createTime?: string
}

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<LoginUser>({})
  // 是否已尝试获取过登录信息（避免重复请求）
  const hasFetched = ref(false)

  const setLoginUser = (user: LoginUser) => {
    loginUser.value = user
  }

  const clearLoginUser = () => {
    loginUser.value = {}
    hasFetched.value = false
  }

  // 从后端获取当前登录用户信息
  const fetchLoginUser = async () => {
    hasFetched.value = true
    const res = await getLoginUserUsingGet()
    if (res.code === 0 && res.data) {
      loginUser.value = res.data
    }
  }

  return {
    loginUser,
    hasFetched,
    setLoginUser,
    clearLoginUser,
    fetchLoginUser,
  }
})
