<template>
  <div class="picture-upload">
    <a-tabs v-model:activeKey="uploadMode">
      <a-tab-pane key="file" tab="文件上传">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :max-count="1"
          :before-upload="handleBeforeUpload"
          :custom-request="handleUpload"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 1">
            <loading-outlined v-if="loading" />
            <plus-outlined v-else />
            <div style="margin-top: 8px">{{ loading ? '上传中...' : '上传图片' }}</div>
          </div>
        </a-upload>
      </a-tab-pane>

      <a-tab-pane key="url" tab="URL 上传">
        <div class="url-upload-panel">
          <a-input-search
            v-model:value="pictureUrl"
            class="url-upload"
            placeholder="请输入图片 URL"
            enter-button="提交"
            allow-clear
            :loading="urlUploading"
            @search="handleUrlUpload"
          />
          <img
            v-if="uploadedPreviewUrl"
            class="uploaded-preview"
            :src="uploadedPreviewUrl"
            alt="图片预览"
          />
        </div>
      </a-tab-pane>
    </a-tabs>

    <!-- 图片预览弹窗 -->
    <a-modal
      :open="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img :src="previewImage" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost, uploadPictureUsingPost } from '@/service/api/pictureController'

// 接收父组件传递的 props
const props = defineProps<{
  picture?: API.PictureVO
  onSuccess?: (picture: API.PictureVO) => void
}>()

const fileList = ref<UploadFile[]>([])
const previewVisible = ref(false)
const previewImage = ref('')
const loading = ref(false)
const urlUploading = ref(false)
const pictureUrl = ref('')
const uploadMode = ref<'file' | 'url'>('file')
const uploadedPreviewUrl = computed(() => fileList.value[0]?.url)

// 监听父组件传入的 picture，初始化显示
watch(
  () => props.picture,
  (newVal) => {
    if (newVal?.url) {
      fileList.value = [
        {
          uid: '-1',
          name: 'picture',
          status: 'done',
          url: newVal.url,
        },
      ]
    }
  },
  { immediate: true }
)

// 阻止默认上传行为
const handleBeforeUpload = () => {
  return true
}

// 自定义上传逻辑
const handleUpload = async ({ file }: { file: File }) => {
  loading.value = true
  try {
    // 构造参数，如果有 picture.id 则传入（用于编辑）
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPictureUsingPost(params, {}, file)

    if (res.code === 0 && res.data) {
      message.success('图片上传成功')
      console.log('上传成功，返回数据：', res.data)
      // 更新文件状态为成功，并设置 URL
      fileList.value = [
        {
          uid: '-1',
          name: file.name,
          status: 'done',
          url: res.data.url,
        },
      ]
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data)
    } else {
      message.error('图片上传失败，' + res.message)
      // 上传失败，清空文件列表
      fileList.value = []
    }
  } catch (error) {
    console.error('图片上传失败', error)
    message.error('图片上传失败，' + (error as Error).message)
    // 上传失败，清空文件列表
    fileList.value = []
  }
  loading.value = false
}

const handleUrlUpload = async (value: string) => {
  const fileUrl = value.trim()
  if (!fileUrl) {
    message.warning('请输入图片 URL')
    return
  }

  urlUploading.value = true
  try {
    const res = await uploadPictureByUrlUsingPost({
      fileUrl,
      id: props.picture?.id,
    })

    if (res.code === 0 && res.data) {
      message.success('图片导入成功')
      fileList.value = [
        {
          uid: '-1',
          name: res.data.name || 'url-picture',
          status: 'done',
          url: res.data.url,
        },
      ]
      pictureUrl.value = ''
      props.onSuccess?.(res.data)
    } else {
      message.error('图片导入失败，' + res.message)
    }
  } catch (error) {
    console.error('图片导入失败', error)
    message.error('图片导入失败，' + (error as Error).message)
  } finally {
    urlUploading.value = false
  }
}

// 预览图片
const handlePreview = async (file: UploadFile) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj as File)
  }
  previewImage.value = (file.url || file.preview) as string
  previewVisible.value = true
}

// 文件转 Base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
</script>

<style scoped>
.picture-upload {
  padding: 16px 0;
}

.picture-upload :deep(.ant-tabs-nav) {
  margin-bottom: 24px;
}

.url-upload-panel {
  width: 100%;
}

.url-upload {
  width: 100%;
}

.uploaded-preview {
  display: block;
  width: 100%;
  max-height: 520px;
  margin-top: 24px;
  border-radius: 4px;
  object-fit: contain;
}

/* 上传按钮区域 */
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 152px;
  min-height: 152px;
}

/* 上传完成后的图片容器 */
.picture-upload :deep(.ant-upload-list-item-container) {
  width: 100% !important;
  height: auto !important;
  min-width: 152px;
  min-height: 152px;
}

/* 限制图片最大高度 */
.picture-upload :deep(img) {
  max-width: 100%;
  max-height: 480px;
  object-fit: contain;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
