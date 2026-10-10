<template>
  <div id="myPicturePage">
    <div class="page-header">
      <div>
        <h2>我的图片</h2>
        <p>草稿可继续完善，待审核或被拒绝的图片不会出现在公共图库。</p>
      </div>
      <a-button type="primary" @click="router.push('/picture/add')">创建图片</a-button>
    </div>

    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item>
          <a-card hoverable>
            <template #cover>
              <PictureThumbnail :picture="picture" />
            </template>
            <a-card-meta :title="picture.name || '未命名图片'">
              <template #description>
                <a-space direction="vertical" :size="6">
                  <a-tag :color="getStatusColor(picture)">{{ getStatusText(picture) }}</a-tag>
                  <span v-if="picture.reviewMessage">{{ picture.reviewMessage }}</span>
                </a-space>
              </template>
            </a-card-meta>
            <template #actions>
              <a @click="editPicture(picture)">{{ isDraft(picture) ? '继续完善' : '编辑' }}</a>
              <router-link :to="`/picture/${picture.id}`">查看</router-link>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-if="!loading && dataList.length === 0" description="还没有上传图片" />
    <a-pagination
      v-if="total > 0"
      class="pagination"
      :current="searchParams.current"
      :page-size="searchParams.pageSize"
      :total="total"
      @change="changePage"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureThumbnail from '@/components/PictureThumbnail.vue'
import { listMyPictureVoByPageUsingPost } from '@/service/api/pictureController'
import {
  PICTURE_REVIEW_STATUS,
  PICTURE_REVIEW_STATUS_TEXT,
  PICTURE_UPLOAD_STATUS,
} from '@/constants/picture'

const router = useRouter()
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(false)
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'desc',
})

const isDraft = (picture: API.PictureVO) => picture.uploadStatus === PICTURE_UPLOAD_STATUS.DRAFT

const getStatusText = (picture: API.PictureVO) => {
  if (isDraft(picture)) return '草稿'
  return PICTURE_REVIEW_STATUS_TEXT[picture.reviewStatus ?? PICTURE_REVIEW_STATUS.REVIEWING] || '未知状态'
}

const getStatusColor = (picture: API.PictureVO) => {
  if (isDraft(picture)) return 'default'
  if (picture.reviewStatus === PICTURE_REVIEW_STATUS.PASS) return 'success'
  if (picture.reviewStatus === PICTURE_REVIEW_STATUS.REJECT) return 'error'
  return 'processing'
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await listMyPictureVoByPageUsingPost(searchParams)
    if (res.code === 0 && res.data) {
      dataList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      message.error('获取我的图片失败：' + res.message)
    }
  } catch {
    message.error('获取我的图片失败')
  } finally {
    loading.value = false
  }
}

const editPicture = (picture: API.PictureVO) => {
  router.push({ path: '/picture/add', query: { id: picture.id } })
}

const changePage = (page: number, pageSize: number) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
#myPicturePage {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header p {
  margin: 8px 0 0;
  color: #777;
}

.pagination {
  margin-top: 24px;
  text-align: right;
}
</style>
