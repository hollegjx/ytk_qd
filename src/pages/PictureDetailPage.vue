<template>
  <div id="pictureDetailPage">
    <!-- 返回按钮 -->
    <a-button type="link" @click="goBack" class="back-btn">
      <LeftOutlined />
      返回列表
    </a-button>

    <a-row :gutter="24">
      <!-- 左侧：图片预览 -->
      <a-col :xs="24" :md="16">
        <a-card title="图片预览" :loading="loading">
          <img
            v-if="picture.url"
            :src="picture.url"
            :alt="picture.name"
            class="detail-image"
          />
        </a-card>
      </a-col>

      <!-- 右侧：图片信息 -->
      <a-col :xs="24" :md="8">
        <a-card title="图片信息" :loading="loading">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space v-if="picture.user">
                <a-avatar :src="picture.user.userAvatar" :size="24" />
                <span>{{ picture.user.userName || '匿名用户' }}</span>
              </a-space>
              <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category || '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
              <span v-if="!picture.tags?.length">-</span>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat?.toUpperCase() || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
          </a-descriptions>

          <!-- 操作按钮（仅作者或管理员可见） -->
          <a-space v-if="canEdit" class="action-buttons">
            <a-button @click="doEdit">
              <template #icon><EditOutlined /></template>
              编辑
            </a-button>
            <a-button danger @click="doDelete">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { message, Modal } from "ant-design-vue";
import { EditOutlined, DeleteOutlined, LeftOutlined } from "@ant-design/icons-vue";
import {
  getPictureVoByIdUsingGet,
  deletePictureUsingPost,
} from "@/service/api/pictureController";
import { useLoginUserStore } from "@/stores/useLoginUserStore";

const router = useRouter();
const loginUserStore = useLoginUserStore();

// 接收路由参数
const props = defineProps<{
  id: string;
}>();

const picture = ref<API.PictureVO>({});
const loading = ref(false);

// 判断是否有编辑/删除权限（作者本人或管理员）
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser;
  if (!loginUser?.id) return false;
  // 管理员
  if (loginUser.userRole === 1) return true;
  // 作者本人
  return picture.value.userId === Number(loginUser.id);
});

// 返回列表
const goBack = () => {
  router.push("/");
};

// 获取图片详情
const fetchPictureDetail = async () => {
  loading.value = true;
  try {
    const res = await getPictureVoByIdUsingGet({ id: Number(props.id) });
    if (res.code === 0 && res.data) {
      picture.value = res.data;
    } else {
      message.error("获取图片详情失败：" + res.message);
    }
  } catch (error) {
    message.error("获取图片详情失败");
  } finally {
    loading.value = false;
  }
};

// 格式化文件大小
const formatSize = (size?: number) => {
  if (!size) return "-";
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
  return (size / (1024 * 1024)).toFixed(2) + " MB";
};

// 编辑图片
const doEdit = () => {
  router.push(`/picture/add?id=${props.id}`);
};

// 删除图片
const doDelete = () => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这张图片吗？删除后无法恢复。",
    okText: "确认",
    cancelText: "取消",
    onOk: async () => {
      try {
        const res = await deletePictureUsingPost({ id: Number(props.id) });
        if (res.code === 0) {
          message.success("删除成功");
          router.push("/");
        } else {
          message.error("删除失败：" + res.message);
        }
      } catch (error) {
        message.error("删除失败");
      }
    },
  });
};

onMounted(() => {
  fetchPictureDetail();
});
</script>

<style scoped>
#pictureDetailPage {
  padding: 24px;
}

.back-btn {
  margin-bottom: 16px;
  padding-left: 0;
}

.detail-image {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.action-buttons {
  margin-top: 16px;
}
</style>
