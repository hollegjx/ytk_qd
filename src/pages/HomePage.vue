<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div id="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="搜索图片"
        enter-button="搜索"
        @search="doSearch"
      />
    </div>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <span class="filter-label">分类：</span>
      <a-space :wrap="true">
        <a-tag
          :color="!searchParams.category ? 'blue' : undefined"
          class="filter-tag"
          @click="onCategoryChange(undefined)"
        >
          全部
        </a-tag>
        <a-tag
          v-for="category in categoryList"
          :key="category"
          :color="searchParams.category === category ? 'blue' : undefined"
          class="filter-tag"
          @click="onCategoryChange(category)"
        >
          {{ category }}
        </a-tag>
      </a-space>
    </div>

    <!-- 标签筛选 -->
    <div class="filter-section">
      <span class="filter-label">标签：</span>
      <a-space :wrap="true">
        <a-tag
          :color="selectedTags.length === 0 ? 'green' : undefined"
          class="filter-tag"
          @click="onTagClear"
        >
          全部
        </a-tag>
        <a-tag
          v-for="tag in tagList"
          :key="tag"
          :color="selectedTags.includes(tag) ? 'green' : undefined"
          class="filter-tag"
          @click="onTagChange(tag)"
        >
          {{ tag }}
        </a-tag>
      </a-space>
    </div>

    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 8 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item>
          <!-- 单张图片 -->
          <router-link :to="`/picture/${picture.id}`">
            <a-card hoverable>
              <template #cover>
                <PictureThumbnail :picture="picture" />
              </template>
              <a-card-meta :title="picture.name">
                <template #description>
                  <a-flex :wrap="'wrap'" :gap="4">
                    <a-tag color="green">
                      {{ picture.category ?? '默认' }}
                    </a-tag>
                    <a-tag v-for="tag in picture.tags" :key="tag">
                      {{ tag }}
                    </a-tag>
                  </a-flex>
                </template>
              </a-card-meta>
            </a-card>
          </router-link>
        </a-list-item>
      </template>
    </a-list>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        :current="searchParams.current"
        :page-size="searchParams.pageSize"
        :total="total"
        show-size-changer
        :page-size-options="['12', '16', '20']"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { message } from "ant-design-vue";
import PictureThumbnail from "@/components/PictureThumbnail.vue";
import {
  listPictureVoByPageUsingPost,
  listPictureTagCategoryUsingGet,
} from "@/service/api/pictureController";

const dataList = ref<API.PictureVO[]>([]);
const total = ref(0);
const loading = ref(false);

// 分类和标签列表
const categoryList = ref<string[]>([]);
const tagList = ref<string[]>([]);
const selectedTags = ref<string[]>([]);

// 搜索参数
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
});

// 获取分类和标签列表
const fetchTagCategory = async () => {
  try {
    const res = await listPictureTagCategoryUsingGet();
    if (res.code === 0 && res.data) {
      categoryList.value = res.data.categoryList || [];
      tagList.value = res.data.tagList || [];
    }
  } catch (error) {
    console.error("获取分类标签失败", error);
  }
};

// 获取数据
const fetchData = async () => {
  loading.value = true;
  try {
    const res = await listPictureVoByPageUsingPost(searchParams);
    if (res.code === 0 && res.data) {
      dataList.value = res.data.records || [];
      total.value = res.data.total || 0;
    } else {
      message.error("获取图片列表失败：" + res.message);
    }
  } catch {
    message.error("获取图片列表失败");
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchTagCategory();
  fetchData();
});

// 搜索
const doSearch = () => {
  searchParams.current = 1;
  fetchData();
};

// 分类筛选
const onCategoryChange = (category: string | undefined) => {
  searchParams.category = category;
  searchParams.current = 1;
  fetchData();
};

// 标签筛选（支持多选）
const onTagChange = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  searchParams.tags = selectedTags.value.length > 0 ? [...selectedTags.value] : undefined;
  searchParams.current = 1;
  fetchData();
};

// 清除标签筛选
const onTagClear = () => {
  selectedTags.value = [];
  searchParams.tags = undefined;
  searchParams.current = 1;
  fetchData();
};

// 分页变化
const onPageChange = (page: number, pageSize: number) => {
  const oldPageSize = searchParams.pageSize || 12;
  searchParams.pageSize = pageSize;
  searchParams.current = oldPageSize !== pageSize ? 1 : page;
  fetchData();
};
</script>

<style scoped>
#homePage {
  padding: 20px;

  #search-bar {
    max-width: 480px;
    margin: 0 auto 16px;
  }

  .filter-section {
    margin-bottom: 16px;

    .filter-label {
      font-weight: 500;
      margin-right: 8px;
    }

    .filter-tag {
      cursor: pointer;
    }
  }

  .pagination-wrapper {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
