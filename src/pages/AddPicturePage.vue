<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">创建图片</h2>

    <!-- 图片上传组件 -->
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />

    <!-- 图片信息表单 -->
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>

      <a-form-item label="简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="标签">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          :options="tagOptions"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="submitting">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost, listPictureTagCategoryUsingGet, getPictureVoByIdUsingGet } from '@/service/api/pictureController'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const picture = ref<API.PictureVO>()
const submitting = ref(false)

// 表单数据
const pictureForm = ref({
  name: '',
  introduction: '',
  category: '',
  tags: [] as string[],
})

// 分类和标签选项（从后端获取）
const categoryOptions = ref<{ value: string }[]>([])
const tagOptions = ref<{ value: string }[]>([])

// 获取标签和分类列表
const fetchTagCategory = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet()
    if (res.code === 0 && res.data) {
      // 转换为 options 格式
      categoryOptions.value = (res.data.categoryList || []).map((item) => ({ value: item }))
      tagOptions.value = (res.data.tagList || []).map((item) => ({ value: item }))
    }
  } catch (error) {
    console.error('获取标签分类失败', error)
  }
}

// 获取旧图片数据（编辑模式）
const getOldPicture = async () => {
  const id = route.query.id
  if (id) {
    try {
      const res = await getPictureVoByIdUsingGet({ id: Number(id) })
      console.log('获取图片数据返回:', res)
      if (res.code === 0 && res.data) {
        const oldPicture = res.data
        picture.value = oldPicture
        // 填充表单
        pictureForm.value.name = oldPicture.name || ''
        pictureForm.value.introduction = oldPicture.introduction || ''
        pictureForm.value.category = oldPicture.category || ''
        pictureForm.value.tags = oldPicture.tags || []
      } else {
        message.error('获取图片失败：' + res.message)
      }
    } catch (error) {
      console.error('获取图片失败:', error)
      message.error('获取图片失败')
    }
  }
}

// 页面加载时获取标签分类
onMounted(() => {
  fetchTagCategory()
  getOldPicture()
})

// 图片上传成功回调
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  // 自动填充已有信息
  if (newPicture.name) pictureForm.value.name = newPicture.name
  if (newPicture.introduction) pictureForm.value.introduction = newPicture.introduction
  if (newPicture.category) pictureForm.value.category = newPicture.category
  if (newPicture.tags) pictureForm.value.tags = newPicture.tags
}

// 提交表单
const handleSubmit = async () => {
  if (!picture.value?.id) {
    message.error('请先上传图片')
    return
  }

  submitting.value = true
  try {
    const res = await editPictureUsingPost({
      id: picture.value.id,
      name: pictureForm.value.name,
      introduction: pictureForm.value.introduction,
      category: pictureForm.value.category,
      tags: pictureForm.value.tags,
    })

    if (res.code === 0) {
      message.success('创建成功')
      router.push('/')
    } else {
      message.error('创建失败：' + res.message)
    }
  } catch (error) {
    message.error('创建失败：' + (error as Error).message)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
#addPicturePage {
  padding: 24px;
  max-width: 600px;
}
</style>
