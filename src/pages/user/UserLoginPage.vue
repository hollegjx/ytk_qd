<template>
  <div id="userLoginPage">
    <h2 class="title">gjx云图库 - 用户登录</h2>
    <div class="desc">智能协同云图库</div>
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="handleSubmit"
    >
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>

      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { userLoginUsingPost } from '@/service/api/userController';
import { useLoginUserStore } from '@/stores/useLoginUserStore';

const router = useRouter();
const loginUserStore = useLoginUserStore();

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});

const handleSubmit = async (values: API.UserLoginRequest) => {
  try {
    const res = await userLoginUsingPost(values);
    if (res.code === 0) {
      message.success('登录成功');
      // 重新获取登录态
      await loginUserStore.fetchLoginUser();
      // 跳转到首页
      router.replace('/');
    } else {
      message.error('登录失败：' + res.message);
    }
  } catch (error: any) {
    message.error(error.message || '登录失败');
  }
};
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc{
  text-align: center;
  margin-bottom: 16px;
  color: #bbb;
}

.tips{
  text-align: right;
  color: #bbb;
  font-size: 13px;
  margin-bottom: 16px;
}

</style>
