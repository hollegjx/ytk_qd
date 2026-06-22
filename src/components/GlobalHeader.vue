<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.svg" alt="logo" />
            <div class="title">gjx云图库</div>
          </div>
        </router-link>
      </a-col>

      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doManuClick"/>
      </a-col>

      <a-col flex="120px">
        <div class="user-login-status">
          <template v-if="loginUser.userName">
            <a-dropdown>
              <a class="user-info" @click.prevent>
                <a-avatar v-if="loginUser.userAvatar" :src="loginUser.userAvatar" :size="28" />
                <a-avatar v-else :size="28">{{ loginUser.userName.slice(-1) }}</a-avatar>
                <span class="user-name">{{ loginUser.userName }}</span>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">个人中心</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </template>
        </div>
      </a-col>

    </a-row>


  </div>
</template>
<script lang="ts" setup>
import { h, ref, computed, type VNode } from 'vue';
import { useRouter } from 'vue-router';
import { HomeOutlined, InfoCircleOutlined, PlusOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { storeToRefs } from 'pinia';
import { userLogoutUsingPost } from '@/service/api/userController';

const loginUserStore = useLoginUserStore();
const { loginUser } = storeToRefs(loginUserStore);

const current = ref<string[]>([]);
const router = useRouter();

// 菜单项类型（扩展 access 字段）
interface MenuItem {
  key: string
  icon?: () => VNode
  label: string | VNode
  title?: string
  access?: number  // undefined=所有人可见, 0=登录可见, 1=管理员可见
}

// 所有菜单项
const allMenuItems: MenuItem[] = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '我的主页',
  },
  {
    key: '/picture/add',
    icon: () => h(PlusOutlined),
    label: '创建图片',
    title: '创建图片',
  },
  {
    key: '/admin/userManage',
    icon: () => h(InfoCircleOutlined),
    label: '用户管理',
    title: '用户管理',
    access: 1,  // 管理员可见
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(PictureOutlined),
    label: '图片管理',
    title: '图片管理',
    access: 1,  // 管理员可见
  },
  {
    key: 'sub1',
    label: h('a', { href: 'https://github.com/', target: '_blank' }, 'GitHub'),
    title: 'GitHub',
  },
]

/**
 * 根据权限过滤菜单
 * @param menuItems 菜单列表
 * @param userRole 用户角色（undefined=未登录, 0=普通用户, 1=管理员）
 */
const filterMenuByAccess = (menuItems: MenuItem[], userRole?: number): MenuItem[] => {
  return menuItems.filter((item) => {
    // 没有 access 字段，所有人可见
    if (item.access === undefined) {
      return true
    }
    // 未登录，隐藏需要权限的菜单
    if (userRole === undefined) {
      return false
    }
    // 管理员可见所有菜单
    if (userRole === 1) {
      return true
    }
    // 普通用户只能看 access <= 0 的菜单
    return item.access <= userRole
  })
}

// 根据用户权限动态计算可见菜单
const items = computed<MenuProps['items']>(() => {
  return filterMenuByAccess(allMenuItems, loginUser.value.userRole)
})

const doManuClick = ({ key }: { key: string }) => {
  // 过滤掉外部链接（GitHub）
  if (key !== 'sub1') {
    router.push({ path: key });
  }
}

const handleLogout = async () => {
  // 前置判断：是否已登录
  if (!loginUser.value.id) {
    message.warning('您尚未登录');
    return;
  }

  try {
    const res = await userLogoutUsingPost();
    if (res.code === 0) {
      loginUserStore.clearLoginUser();
      message.success('已退出登录');
      router.push('/user/login');
    } else {
      message.error('退出失败：' + (res.message || '未知错误'));
    }
  } catch {
    message.error('退出登录失败，请稍后重试');
  }
}

// 路由跳转后，同步菜单高亮状态
router.afterEach((to) => {
  // 只有当路径在菜单中时才更新
  const menuKeys = ['/', '/picture/add', '/admin/userManage', '/admin/pictureManage'];
  if (menuKeys.includes(to.path)) {
    current.value = [to.path];
  }
})

</script>


<style scoped>
.title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  height: 32px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
