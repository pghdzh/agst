<template>
  <div class="augusta-gallery">
    <!-- 上传按钮 -->
    <button class="upload-btn magnetic-btn" @click="openUploadModal">
      <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24">
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      上传战利品
    </button>

    <section class="gallery section">
      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="sort-controls">
          <!-- 排序按钮 -->
          <button @click="toggleSort" class="sort-btn magnetic-btn">
            <svg class="sort-icon" width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M3 6h18M6 12h12M9 18h6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            按 {{ sortBy === "like_count" ? "烈阳印记" : "最新" }} 排序
          </button>

          <!-- 筛选按钮 -->
          <div class="filter-controls">
            <button
              class="filter-btn magnetic-btn"
              @click="toggleLikedFilter"
              :class="{ active: showLikedOnly }"
              :disabled="
                isLoadingLikedImages ||
                (likedIds.length === 0 && !showLikedOnly)
              "
              :title="showLikedOnly ? '显示所有藏品' : '只看烈阳印记藏品'"
            >
              <svg
                class="filter-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  :fill="showLikedOnly ? '#ff4757' : 'none'"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <span class="filter-text">
                {{ showLikedOnly ? "所有藏品" : "烈阳印记" }}
              </span>

              <span class="loading-spinner" v-if="isLoadingLikedImages"></span>
            </button>

            <!-- 筛选状态提示 -->
            <transition name="fade">
              <div v-if="showLikedOnly" class="filter-info">
                <span class="info-text">
                  {{
                    likedImages.length > 0
                      ? `已筛选：${likedImages.length} 件烈阳藏品`
                      : "暂无烈阳印记藏品"
                  }}
                  <span v-if="isLoadingLikedImages" class="loading-text"
                    >（磁律共鸣中...）</span
                  >
                </span>
                <button
                  class="clear-filter magnetic-btn"
                  @click="clearLikedFilter"
                  title="清除筛选"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- 画廊网格 -->
      <div class="gallery-grid">
        <!-- 筛选模式空状态 -->
        <div
          v-if="
            showLikedOnly && likedImages.length === 0 && !isLoadingLikedImages
          "
          class="filter-empty"
        >
          <svg class="empty-icon" width="60" height="60" viewBox="0 0 24 24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          <h3>暂无烈阳印记藏品</h3>
          <p>为心仪的藏品施加烈阳印记吧！</p>
        </div>

        <!-- 图片卡片 -->
        <div
          v-for="(img, index) in displayedImages"
          :key="img.id"
          class="card"
          @click="openLightbox(getDisplayedIndex(img.id, index))"
          :class="{
            'liked-card': img.liked,
            visible: img.liked,
            loaded: img.liked,
          }"
        >
          <div class="card-inner">
            <!-- 卡片边框效果 -->
            <div class="card-border">
              <div class="border-glow"></div>
            </div>

            <div class="card-image">
              <img
                :src="img.src"
                :alt="img.alt"
                loading="lazy"
                @load="onImageLoad"
              />
              <div class="image-overlay">
                <span class="overlay-text">点击查看</span>
              </div>
            </div>

            <!-- 卡片底部信息 -->
            <div class="card-footer">
              <div class="footer-content">
                <div class="like-section">
                  <button
                    class="like-btn magnetic-btn"
                    @click.stop="handleLike(img)"
                  >
                    <svg
                      class="heart-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        :fill="img.liked ? '#ff4757' : 'none'"
                        :stroke="img.liked ? '#ff4757' : '#ffd460'"
                        stroke-width="2"
                      />
                    </svg>
                    <span class="like-count">{{ img.likeCount }}</span>
                    <span class="like-label">烈阳印记</span>
                  </button>
                </div>
                <!-- <div class="card-id">
                  <span class="id-label">藏品编号 #{{ img.id }}</span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无限滚动哨兵 -->
      <div ref="sentinel" class="sentinel"></div>

      <!-- 加载状态 -->
      <div class="loading-state" v-if="loading && !showLikedOnly">
        <div class="magnetic-loader">
          <div class="loader-core"></div>
          <div class="loader-ring"></div>
        </div>
        <span>磁律共鸣中，正在加载藏品...</span>
      </div>
      <div class="finished-state" v-if="finished && !showLikedOnly">
        <svg class="finished-icon" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span>已加载所有藏品</span>
      </div>
    </section>

    <!-- 排行榜面板 -->
    <aside class="ranking-panel">
      <div class="panel-header" @click="expanded = !expanded">
        <div class="header-content">
          <svg class="ranking-icon" width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <h3 class="ranking-title">角斗士功勋榜</h3>
        </div>
        <div class="header-stats">
          <span class="total-count">共{{ imageTotal }}件</span>
          <span class="toggle-icon">{{ expanded ? "▾" : "▸" }}</span>
        </div>
      </div>
      <transition name="panel-expand">
        <div v-if="expanded" class="ranking-content">
          <ul class="ranking-list">
            <li
              v-for="(item, idx) in rankingList"
              :key="idx"
              class="ranking-item"
              :class="`rank-${idx + 1}`"
            >
              <div class="item-content">
                <div class="rank-info">
                  <span class="rank-badge">{{ idx + 1 }}</span>
                  <span class="rank-name">{{ item.nickname }}</span>
                </div>
                <div class="rank-stats">
                  <span class="count-badge">{{ item.count }} 件</span>
                  <svg
                    class="trophy-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9H4.5A2.5 2.5 0 0 1 2 6.5v-2A2.5 2.5 0 0 1 4.5 2H6M18 9h1.5A2.5 2.5 0 0 0 22 6.5v-2A2.5 2.5 0 0 0 19.5 2H18M2 11h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9zM9 11l3 8M15 11l-3 8M12 5V2"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </aside>

    <!-- Lightbox 模态框 -->
    <div
      v-if="lightboxOpen"
      class="lightbox"
      @click.self="closeLightbox"
      @wheel.prevent="handleLightboxWheel"
    >
      <!-- 烈阳光环 -->
      <div class="lightbox-halo"></div>

      <!-- 控制栏 -->
      <div class="lightbox-controls">
        <button
          class="lightbox-close magnetic-btn"
          @click="closeLightbox"
          title="关闭"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="lightbox-toolbar">
          <!-- 缩放控制 -->
          <div class="zoom-controls">
            <div class="zoom-buttons">
              <button
                @click.stop="zoomOut"
                :disabled="zoomLevel <= 0.5"
                title="缩小"
                class="magnetic-btn"
              >
                -
              </button>
              <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
              <button
                @click.stop="zoomIn"
                :disabled="zoomLevel >= 3"
                title="放大"
                class="magnetic-btn"
              >
                +
              </button>
              <button
                @click.stop="resetZoom"
                title="重置缩放"
                class="magnetic-btn"
              >
                ↺
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button
              class="lightbox-like-btn magnetic-btn"
              @click.stop="handleLike(currentImage)"
              :class="{ liked: currentImage?.liked }"
              :title="currentImage?.liked ? '已施加烈阳印记' : '施加烈阳印记'"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  :fill="currentImage?.liked ? '#ff4757' : 'none'"
                  :stroke="currentImage?.liked ? '#ff4757' : 'currentColor'"
                  stroke-width="2"
                />
              </svg>
              <span class="like-count">{{ currentImage?.likeCount || 0 }}</span>
            </button>

            <button
              class="lightbox-download-btn magnetic-btn"
              @click.stop="downloadImage"
              title="收藏此藏品"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <polyline
                  points="7 10 12 15 17 10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>

          <!-- 导航信息 -->
          <div class="nav-info">
            <span class="current-index">{{ currentIndex + 1 }}</span>
            <span class="separator">/</span>
            <span class="total-count">{{ images.length }}</span>
          </div>
        </div>
      </div>

      <!-- 图片容器 -->
      <div
        class="lightbox-image-container"
        :style="{
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${panOrigin.x}% ${panOrigin.y}%`,
        }"
        @mousedown="startPan"
        @touchstart="startPan"
        @mousemove="doPan"
        @touchmove="doPan"
        @mouseup="endPan"
        @touchend="endPan"
        @mouseleave="endPan"
      >
        <img
          :src="currentImage?.src"
          :alt="currentImage?.alt"
          :style="{
            cursor: isPanning ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default',
          }"
          @load="onLightboxImageLoad"
        />
      </div>

      <!-- 导航按钮 -->
      <button
        class="lightbox-nav prev magnetic-btn"
        @click.stop="prevImage"
        title="上一件"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <polyline
            points="15 18 9 12 15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <button
        class="lightbox-nav next magnetic-btn"
        @click.stop="nextImage"
        title="下一件"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <polyline
            points="9 18 15 12 9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- 拖拽提示 -->
      <div v-if="zoomLevel > 1 && !isPanning" class="pan-hint">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M9 10l-5 5 5 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M20 4v7a4 4 0 01-4 4H4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <span>拖拽查看细节</span>
      </div>
    </div>

    <!-- 上传弹窗 -->
    <div
      v-if="uploadModalOpen"
      class="upload-modal-overlay"
      @click.self="closeUploadModal"
    >
      <div class="upload-modal">
        <!-- 模态框头部 -->
        <div class="modal-header">
          <h3>贡献你的战利品</h3>
          <button class="modal-close magnetic-btn" @click="closeUploadModal">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <!-- 提示信息 -->
        <div class="modal-tips">
          <div class="tips-header">
            <svg class="tips-icon" width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 16v-4M12 8h.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <h4>角斗场规则</h4>
          </div>
          <ul class="tips-list">
            <li>请确保图片内容符合英雄王的尊严，不得含有不当内容。</li>
            <li>图片尺寸请控制在合理范围内，最大不超过 20MB。</li>
            <li>上传成功即代表我已收到您的贡献，无需重复上传。</li>
            <li>荣耀之路需要耐心，审核可能需要一些时间。</li>
          </ul>
        </div>

        <!-- 统计信息 -->
        <div class="modal-stats">
          <div class="stat-item">
            <span class="stat-label">今日贡献：</span>
            <span class="stat-value">{{ uploadedToday }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">剩余额度：</span>
            <span class="stat-value">{{ remaining }}</span>
          </div>
        </div>

        <!-- 表单 -->
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <svg
                class="label-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              角斗士称号
            </label>
            <input
              v-model="nickname"
              type="text"
              placeholder="输入你的称号（必填）"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg
                class="label-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <polyline
                  points="21 15 16 10 5 21"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              选择战利品（最多 {{ remaining }} 件）
            </label>
            <div class="file-upload">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                class="file-input"
              />
              <div class="upload-area" @click="triggerFileInput">
                <svg
                  class="upload-icon"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <polyline
                    points="17 8 12 3 7 8"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
                <span v-if="!selectedFiles.length">点击或拖放图片</span>
                <span v-else>已选择 {{ selectedFiles.length }} 件</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="modal-actions">
          <button
            @click="submitUpload"
            :disabled="!canSubmit || isUploading"
            class="submit-btn magnetic-btn"
          >
            <span v-if="!isUploading">
              <svg
                class="submit-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              献上战利品
            </span>
            <span v-else>
              <div class="uploading-spinner"></div>
              正在贡献...
            </span>
          </button>
          <button @click="closeUploadModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  nextTick,
  onBeforeUnmount,
  watch,
} from "vue";
import { uploadImages } from "@/api/modules/images";
import { getRankingList } from "@/api/modules/ranking";
import { gsap } from "gsap";
import {
  getImagesLikesList,
  likeImage,
  getImagesByIds,
} from "@/api/modules/imagesLikes";
import { debounce } from "lodash";

// 主题色变量
const themeColors = {
  deepNight: "#060408",
  metalDark: "#1a0e14",
  primaryGlow: "#c64830",
  secondaryGlow: "#ffd460",
  bloodShadow: "#8b001a",
  textPrimary: "#fff7ef",
  textSecondary: "#e1d7bd",
  borderGlow: "rgba(198, 72, 48, 0.4)",
};

// 排序逻辑
const sortBy = ref<"uploaded_at" | "like_count">("like_count");
const order = ref<"asc" | "desc">("desc");

function toggleSort() {
  if (sortBy.value === "uploaded_at") {
    sortBy.value = "like_count";
    order.value = "desc";
  } else {
    sortBy.value = "uploaded_at";
    order.value = "desc";
  }
  pageImage.value = 1;
  images.value = [];
  finished.value = false;
  window.scrollTo(0, 0);
  loadNextPage();
}

// 点赞相关
function getLikedIds(): number[] {
  const data = localStorage.getItem("likedImageIds");
  return data ? JSON.parse(data) : [];
}

function setLikedIds(ids: number[]) {
  localStorage.setItem("likedImageIds", JSON.stringify(ids));
}

// 筛选功能
const showLikedOnly = ref(false);
const likedImages = ref<ImageItem[]>([]);
const isLoadingLikedImages = ref(false);

const likedIds = computed(() => {
  return getLikedIds();
});

// 计算总点赞数
const totalLikes = computed(() => {
  return images.value.reduce((sum, img) => sum + img.likeCount, 0);
});

// 当前显示的图片
const displayedImages = computed(() => {
  if (showLikedOnly.value) {
    return likedImages.value;
  }
  return images.value;
});

// 获取点赞图片
const fetchLikedImages = async () => {
  if (isLoadingLikedImages.value) return;

  isLoadingLikedImages.value = true;
  try {
    const likedIdsArray = getLikedIds();

    if (likedIdsArray.length === 0) {
      likedImages.value = [];
      return;
    }

    const res = await getImagesByIds({
      ids: likedIdsArray,
      character_key: "agst",
    });

    if (res.success) {
      likedImages.value = res.images.map((item) => ({
        src: item.url,
        alt: "",
        likeCount: item.like_count || 0,
        id: item.id,
        liked: true,
      }));
    } else {
      console.error("获取烈阳印记藏品失败:", res.message);
      likedImages.value = images.value.filter((img) => img.liked);
    }
  } catch (error) {
    console.error("获取烈阳印记藏品错误:", error);
    likedImages.value = images.value.filter((img) => img.liked);
  } finally {
    isLoadingLikedImages.value = false;
  }
};

// 切换筛选
const toggleLikedFilter = async () => {
  if (showLikedOnly.value) {
    showLikedOnly.value = false;
    pageImage.value = 1;
    images.value = [];
    finished.value = false;
    loading.value = false;

    await nextTick();
    if (sentinel.value && sentinelObserver) {
      sentinelObserver.unobserve(sentinel.value);
      sentinelObserver.observe(sentinel.value);
    }

    loadNextPage();
  } else {
    showLikedOnly.value = true;
    likedImages.value = [];

    likedImages.value = images.value.filter((img) => img.liked);

    fetchLikedImages();

    window.scrollTo({ top: 0, behavior: "smooth" });
    showFilterAnimation();
  }
};

// 清除筛选
const clearLikedFilter = () => {
  showLikedOnly.value = false;
  pageImage.value = 1;
  images.value = [];
  finished.value = false;
  loading.value = false;

  nextTick(() => {
    if (sentinel.value && sentinelObserver) {
      sentinelObserver.unobserve(sentinel.value);
      sentinelObserver.observe(sentinel.value);
    }
    loadNextPage();
  });
};

// 筛选动画
const showFilterAnimation = () => {
  setTimeout(() => {
    const likedCards = document.querySelectorAll(".card");
    likedCards.forEach((card, index) => {
      const img = card.querySelector("img");
      if (
        img?.getAttribute("src") &&
        likedImages.value.some(
          (likedImg) => likedImg.src === img.getAttribute("src")
        )
      ) {
        card.classList.add("liked-highlight");
        setTimeout(() => {
          card.classList.remove("liked-highlight");
        }, 1000 + index * 100);
      }
    });
  }, 100);
};

// 获取索引
const getDisplayedIndex = (imgId: number, currentIndex: number) => {
  if (showLikedOnly.value) {
    return currentIndex;
  }
  return images.value.findIndex((img) => img.id === imgId);
};

// 点赞处理
const handleLike = async (img: ImageItem) => {
  if (img.liked) return;

  try {
    await likeImage(img.id);
    img.likeCount += 1;
    img.liked = true;

    const likedIds = getLikedIds();
    likedIds.push(img.id);
    setLikedIds(likedIds);

    if (showLikedOnly.value) {
      if (!likedImages.value.some((item) => item.id === img.id)) {
        likedImages.value.push({ ...img });
      }

      const card = Array.from(document.querySelectorAll(".card")).find(
        (card) => {
          const cardImg = card.querySelector("img");
          return cardImg?.getAttribute("src") === img.src;
        }
      );
      if (card) {
        card.classList.add("new-liked");
        setTimeout(() => {
          card.classList.remove("new-liked");
        }, 1500);
      }
    }
  } catch (error) {
    console.error("施加烈阳印记失败", error);
    alert("施加烈阳印记失败，请稍后重试");
  }
};

// 图片相关接口
interface ImageItem {
  src: string;
  alt: string;
  likeCount: number;
  id: number;
  liked: Boolean;
}

interface RankingItem {
  id?: number;
  nickname: string;
  count: number;
}

// 排行榜
const rankingList = ref<RankingItem[]>([]);
const expanded = ref(true);

const fetchRanking = async () => {
  const res = await getRankingList({
    page: 1,
    pageSize: 99,
    character_key: "agst",
  });
  if (res.success) {
    rankingList.value = res.data;
  } else {
    console.error("获取功勋榜失败", res.message);
  }
};

// 图片数据
const images = ref<ImageItem[]>([]);
const imageTotal = ref(0);
const pageImage = ref(1);
const limit = ref(10);
const loading = ref(false);
const finished = ref(false);
const sentinel = ref<HTMLElement | null>(null);

// 图片动画
const observerCard = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerCard.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

async function observeNewCards(startIndex = 0) {
  await nextTick();
  const cards = document.querySelectorAll<HTMLElement>(".card");
  for (let i = startIndex; i < cards.length; i++) {
    observerCard.observe(cards[i]);
  }
}

// 加载图片
async function loadNextPage() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    const res = await getImagesLikesList({
      page: pageImage.value,
      limit: limit.value,
      sortBy: sortBy.value,
      character_key: "agst",
      order: order.value,
    });
    const likedIds = getLikedIds();
    const list = (
      res.images as Array<{ url: string; like_count: number; id: number }>
    ).map((item) => ({
      src: item.url,
      alt: "",
      likeCount: item.like_count,
      id: item.id,
      liked: likedIds.includes(item.id),
    }));
    if (list.length === 0) {
      finished.value = true;
      return;
    }
    const oldLength = images.value.length;
    const existingIds = new Set(images.value.map((i) => i.id));
    const filtered = list.filter((item) => !existingIds.has(item.id));
    images.value.push(...filtered);
    pageImage.value++;
    imageTotal.value = res.total;
    observeNewCards(oldLength);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// 防抖加载
const debouncedLoad = debounce(
  () => {
    loadNextPage();
  },
  200,
  { leading: true, trailing: false }
);

// Lightbox 功能
const lightboxOpen = ref(false);
const currentIndex = ref(0);
const zoomLevel = ref(1);
const isPanning = ref(false);
const panStart = ref({ x: 0, y: 0 });
const panOrigin = ref({ x: 50, y: 50 });

const currentImage = computed(() => {
  return images.value[currentIndex.value];
});

// 缩放功能
const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, 3);
    panOrigin.value = { x: 50, y: 50 };
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5);
    if (zoomLevel.value <= 1) {
      panOrigin.value = { x: 50, y: 50 };
    }
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
  panOrigin.value = { x: 50, y: 50 };
};

// 鼠标滚轮
const handleLightboxWheel = (e: WheelEvent) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

// 拖拽功能
const startPan = (e: MouseEvent | TouchEvent) => {
  if (zoomLevel.value <= 1) return;
  isPanning.value = true;
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  panStart.value = { x: clientX, y: clientY };
};

const doPan = (e: MouseEvent | TouchEvent) => {
  if (!isPanning.value || zoomLevel.value <= 1) return;
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  const deltaX = clientX - panStart.value.x;
  const deltaY = clientY - panStart.value.y;
  const sensitivity = 0.5;
  panOrigin.value = {
    x: Math.max(
      0,
      Math.min(
        100,
        panOrigin.value.x - (deltaX * sensitivity) / zoomLevel.value
      )
    ),
    y: Math.max(
      0,
      Math.min(
        100,
        panOrigin.value.y - (deltaY * sensitivity) / zoomLevel.value
      )
    ),
  };
  panStart.value = { x: clientX, y: clientY };
};

const endPan = () => {
  isPanning.value = false;
};

// 下载图片
const downloadImage = async () => {
  if (!currentImage.value) return;
  try {
    const response = await fetch(currentImage.value.src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName =
      currentImage.value.src.split("/").pop() ||
      `奥古斯塔图集_${Date.now()}.jpg`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showDownloadSuccess();
  } catch (error) {
    console.error("下载失败:", error);
    alert("下载失败，请稍后重试");
  }
};

// 下载成功提示
const showDownloadSuccess = () => {
  const successEl = document.createElement("div");
  successEl.className = "download-success-toast";
  successEl.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>藏品已开始下载</span>
  `;
  document.body.appendChild(successEl);
  setTimeout(() => {
    successEl.classList.add("show");
  }, 10);
  setTimeout(() => {
    successEl.classList.remove("show");
    setTimeout(() => {
      if (successEl.parentNode) {
        document.body.removeChild(successEl);
      }
    }, 300);
  }, 3000);
};

// Lightbox 控制
function openLightbox(index: number) {
  if (showLikedOnly.value) {
    const displayedImg = likedImages.value[index];
    const originalIndex = images.value.findIndex(
      (img) => img.id === displayedImg.id
    );
    currentIndex.value = originalIndex;
  } else {
    currentIndex.value = index;
  }
  lightboxOpen.value = true;
  resetZoom();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightboxOpen.value = false;
  resetZoom();
  document.body.style.overflow = "";
}

function prevImage() {
  currentIndex.value =
    (currentIndex.value + images.value.length - 1) % images.value.length;
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
}

// 图片加载效果
function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  const card = img.closest(".card");
  card?.classList.add("loaded");
}

function onLightboxImageLoad() {
  resetZoom();
}

// 上传功能
const uploadModalOpen = ref(false);
const nickname = ref("");
const fileInput = ref<HTMLInputElement>();
const selectedFiles = ref<File[]>([]);
const isUploading = ref(false);

function getTodayKey() {
  return `uploaded_${new Date().toISOString().slice(0, 10)}`;
}

const uploadedToday = ref<number>(
  Number(localStorage.getItem(getTodayKey()) || 0)
);

const remaining = computed(() => Math.max(24 - uploadedToday.value, 0));

const canSubmit = computed(() => {
  return (
    nickname.value.trim().length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length <= remaining.value
  );
});

function clearOldUploadRecords() {
  const today = new Date();
  const storage = window.localStorage;
  for (const key of Object.keys(storage)) {
    if (!key.startsWith("uploaded_")) continue;
    const dateStr = key.slice("uploaded_".length);
    const recordDate = new Date(dateStr);
    if (isNaN(recordDate.getTime())) continue;
    const diffMs = today.getTime() - recordDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 2) {
      storage.removeItem(key);
    }
  }
}

function openUploadModal() {
  clearOldUploadRecords();
  nickname.value = "";
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = "";
  uploadedToday.value = Number(localStorage.getItem(getTodayKey()) || 0);
  uploadModalOpen.value = true;
}

function closeUploadModal() {
  uploadModalOpen.value = false;
}

function handleFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  if (!files) return;
  const validFiles: File[] = [];
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      alert(`文件过大：${file.name}，请控制在 20MB 内`);
      continue;
    }
    validFiles.push(file);
  }
  if (validFiles.length === 0) return;
  if (validFiles.length > remaining.value) {
    alert(
      `今日最多还能贡献 ${remaining.value} 件，已为你截取前 ${remaining.value} 件`
    );
    selectedFiles.value = validFiles.slice(0, remaining.value);
  } else {
    selectedFiles.value = validFiles;
  }
}

async function submitUpload() {
  if (!canSubmit.value) return;
  isUploading.value = true;
  try {
    const res = await uploadImages(
      selectedFiles.value,
      nickname.value.trim(),
      "agst"
    );
    const uploadedCount = res.data.length;
    uploadedToday.value += uploadedCount;
    localStorage.setItem(getTodayKey(), String(uploadedToday.value));
    alert(`成功贡献 ${uploadedCount} 件藏品`);
    closeUploadModal();
  } catch (err: any) {
    console.error(err);
    alert(err.message || "贡献失败");
  } finally {
    isUploading.value = false;
  }
}

// 触发文件选择
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 无限滚动
let sentinelObserver: IntersectionObserver;

interface Chibi {
  src: string;
  top: number;
  left: number;
}

const chibiList = ref<Chibi[]>([]);

onMounted(async () => {
  await fetchRanking();
  await loadNextPage();
  observeNewCards(0);

  sentinelObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) debouncedLoad();
    },
    { rootMargin: "0px", threshold: 0.1 }
  );

  if (sentinel.value) {
    sentinelObserver.observe(sentinel.value);
  }

  const likedIdsArray = getLikedIds();
  if (likedIdsArray.length > 0) {
    setTimeout(() => {
      fetchLikedImages();
    }, 1000);
  }

  // 1. 基础配置信息
  const total = 10;
  let pickCount = 3; // 每次抽取 3 张
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  // 如果已知单张小人图片的宽高，可避免超出边界；
  // 假设小人图片宽 100px、高 100px，按需替换：
  const imgWidth = 100;
  const imgHeight = 100;

  // 2. Fisher–Yates 洗牌函数
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 3. 随机选出 3 个编号
  const nums = shuffle(Array.from({ length: total }, (_, k) => k + 1));
  if (isMobile) {
    pickCount = 1;
  }
  const picks = nums.slice(0, pickCount);

  // 4. 生成随机位置并填充 chibiList
  chibiList.value = []; // 先清空
  picks.forEach((i) => {
    chibiList.value.push({
      src: `/QImages/1 (${i}).png`,
      left: Math.random() * (vw - imgWidth), // 保证不超出左右边界
      top: Math.random() * (vh - imgHeight), // 保证不超出上下边界
    });
  });

  // 2. 等 img 渲染到 DOM
  await nextTick();

  // 3. 给每个小人绑定 GSAP 动画
  const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  imgs.forEach((img, index) => {
    const padding = 200; // 边缘预留空间
    // ✅ 初始出场动画（闪现）
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(2)",
        delay: 0.2 * index,
      }
    );

    // ✅ 鼠标靠近闪避
    img.addEventListener("mouseenter", () => {
      gsap.killTweensOf(img);

      gsap.to(img, {
        x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        duration: 1.2,
        ease: "back.out(2)",
        onComplete: () => {
          // 闪避完成后，再重新启用动画
          animate(img);
        },
      });
    });

    const animate = (img: HTMLImageElement) => {
      let { x, y } = img.getBoundingClientRect();
      let deltaX = (Math.random() - 0.5) * 200;
      let deltaY = (Math.random() - 0.5) * 200;

      // 预测一下偏移后的位置
      let nextX = x + deltaX;
      let nextY = y + deltaY;

      // 校正：防漂出左、右、上、下边界
      if (nextX < padding) deltaX = padding - x;
      if (nextX + img.width > window.innerWidth - padding)
        deltaX = window.innerWidth - padding - (x + img.width);
      if (nextY < padding) deltaY = padding - y;
      if (nextY + img.height > window.innerHeight - padding)
        deltaY = window.innerHeight - padding - (y + img.height);

      gsap.to(img, {
        x: `+=${deltaX.toFixed(0)}`,
        y: `+=${deltaY.toFixed(0)}`,
        rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
        duration: 2 + Math.random() * 2,
        ease: "power1.inOut",
        onComplete: () => animate(img),
      });
    };
    animate(img);
  });
});

// 监听筛选变化
watch(showLikedOnly, (newVal) => {
  if (!newVal && !loading.value && !finished.value) {
    nextTick(() => {
      if (sentinel.value && sentinelObserver) {
        sentinelObserver.unobserve(sentinel.value);
        sentinelObserver.observe(sentinel.value);
      }
      if (images.value.length === 0) {
        loadNextPage();
      }
    });
  }
});

onBeforeUnmount(() => {
  observerCard.disconnect();
  if (sentinelObserver) {
    sentinelObserver.disconnect();
  }
});
</script>

<style lang="scss" scoped>
/* 奥古斯塔主题色 */
$color-deep-night: #060408;
$color-metal-dark: #1a0e14;
$color-primary-glow: #c64830;
$color-secondary-glow: #ffd460;
$color-blood-shadow: #8b001a;
$color-text-primary: #fff7ef;
$color-text-secondary: #e1d7bd;
$color-border-glow: rgba(198, 72, 48, 0.4);
.floating-chibis {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99;
}

.chibi-img {
  position: absolute;
  width: 80px;
  user-select: none;
  transform-origin: center center;
  pointer-events: auto;
  z-index: 10;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

/* 全局样式 */
.augusta-gallery {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    $color-deep-night 0%,
    $color-metal-dark 100%
  );
  color: $color-text-primary;
  font-family: "Noto Sans SC", "Segoe UI", system-ui, sans-serif;
  padding: 2rem;
  padding-top: 80px;
  overflow-x: hidden;
}

/* 磁力按钮样式 */
.magnetic-btn {
  position: relative;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.8) 0%,
    rgba($color-deep-night, 0.9) 100%
  );
  border: 1px solid $color-border-glow;
  color: $color-text-secondary;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 0.1) 0%,
      rgba($color-secondary-glow, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($color-primary-glow, 0.2),
      0 0 0 1px rgba($color-secondary-glow, 0.1);

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
  }
}

/* 上传按钮 */
.upload-btn {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 100;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    rgba($color-primary-glow, 0.9) 0%,
    rgba($color-blood-shadow, 0.7) 100%
  );
  color: $color-text-primary;
  border: 1px solid rgba($color-secondary-glow, 0.3);
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba($color-primary-glow, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 1) 0%,
      rgba($color-blood-shadow, 0.9) 100%
    );
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 30px rgba($color-primary-glow, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

/* 控制面板 */
.control-panel {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.7) 0%,
    rgba($color-deep-night, 0.8) 100%
  );
  border: 1px solid $color-border-glow;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.panel-header {
  margin-bottom: 1.5rem;

  .panel-title {
    font-size: 1.8rem;
    font-weight: 900;
    background: linear-gradient(
      135deg,
      $color-secondary-glow 0%,
      $color-primary-glow 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
      color: $color-text-secondary;

      svg {
        color: $color-secondary-glow;
      }
    }
  }
}

.sort-controls {
  display: flex;

  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.sort-btn {
  .sort-icon {
    width: 16px;
    height: 16px;
  }
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;

  .filter-btn {
    position: relative;
    padding: 8px 16px;

    &.active {
      background: linear-gradient(
        135deg,
        rgba(255, 71, 87, 0.2) 0%,
        rgba($color-blood-shadow, 0.15) 100%
      );
      border-color: rgba(255, 71, 87, 0.4);
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba($color-text-secondary, 0.3);
      border-top-color: $color-secondary-glow;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  .filter-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: rgba($color-blood-shadow, 0.15);
    border: 1px solid rgba(255, 71, 87, 0.2);
    border-radius: 8px;

    .info-text {
      font-size: 0.85rem;
      color: #ff6b81;
    }

    .loading-text {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .clear-filter {
      padding: 4px;
      border-radius: 6px;

      &:hover {
        background: rgba(255, 71, 87, 0.2);
      }
    }
  }
}

/* 画廊网格 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}

/* 筛选空状态 */
.filter-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: $color-text-secondary;

  .empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
    color: $color-secondary-glow;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: $color-text-primary;
  }

  p {
    opacity: 0.7;
  }
}

/* 卡片样式 */
.card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 3/4;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.loaded {
    .card-image img {
      opacity: 1;
      transform: scale(1);
    }
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);

    .card-border {
      border-color: $color-secondary-glow;
    }

    .border-glow {
      opacity: 1;
    }

    .image-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .card-image img {
      transform: scale(1.05);
    }
  }

  &.liked-card {
    .card-border {
      border-color: rgba(255, 71, 87, 0.3);
    }

    .border-glow {
      background: radial-gradient(
        circle at center,
        rgba(255, 71, 87, 0.2),
        transparent 70%
      );
    }
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.card-border {
  position: absolute;
  inset: 0;
  border: 2px solid $color-border-glow;
  border-radius: 16px;
  transition: border-color 0.3s ease;
  z-index: 1;
}

.border-glow {
  position: absolute;
  inset: -1px;
  border-radius: 16px;
  background: radial-gradient(
    circle at center,
    rgba($color-secondary-glow, 0.1),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-image {
  position: relative;
  width: 100%;
  height: 80%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.6s ease;
    opacity: 0;
    transform: scale(1.1);
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 60%,
    rgba($color-deep-night, 0.9) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;

  .overlay-text {
    color: $color-secondary-glow;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 6px 12px;
    background: rgba($color-deep-night, 0.7);
    border: 1px solid $color-border-glow;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }
}

.card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba($color-metal-dark, 0.9) 30%
  );
  padding: 1rem;
  z-index: 2;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.like-section {
  flex: 1;

  .like-btn {
    padding: 6px 12px;
    border: 1px solid rgba($color-secondary-glow, 0.2);
    background: rgba($color-deep-night, 0.7);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: rgba($color-deep-night, 0.9);
      border-color: $color-secondary-glow;

      .heart-icon {
        transform: scale(1.1);
      }
    }

    .heart-icon {
      transition: transform 0.3s ease;
    }

    .like-count {
      font-weight: 700;
      color: $color-text-primary;
    }

    .like-label {
      font-size: 0.8rem;
      color: $color-text-secondary;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
}

.card-id {
  .id-label {
    font-size: 0.8rem;
    color: $color-text-secondary;
    opacity: 0.8;
  }
}

/* 加载状态 */
.sentinel {
  height: 100px;
}

.loading-state,
.finished-state {
  text-align: center;
  padding: 2rem;
  color: $color-text-secondary;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.magnetic-loader {
  position: relative;
  width: 50px;
  height: 50px;

  .loader-core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: $color-secondary-glow;
    border-radius: 50%;
    box-shadow: 0 0 20px $color-secondary-glow;
    animation: magneticPulse 2s ease-in-out infinite;
  }

  .loader-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-top: 2px solid $color-primary-glow;
    border-radius: 50%;
    animation: magneticSpin 1.5s linear infinite;
  }
}

.finished-state {
  .finished-icon {
    color: $color-secondary-glow;
  }
}

@keyframes magneticSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes magneticPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* 排行榜 */
.ranking-panel {
  position: fixed;
  top: 100px;
  right: 2rem;
  width: 280px;
  z-index: 90;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.9) 0%,
    rgba($color-deep-night, 0.95) 100%
  );
  border: 1px solid $color-border-glow;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.panel-header {
  padding: 1rem 1.2rem;
  background: linear-gradient(
    135deg,
    rgba($color-primary-glow, 0.1) 0%,
    transparent 100%
  );
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 0.15) 0%,
      transparent 100%
    );
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 8px;

    .ranking-icon {
      color: $color-secondary-glow;
    }

    .ranking-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: $color-text-primary;
    }
  }

  .header-stats {
    display: flex;
    align-items: center;
    gap: 8px;

    .total-count {
      font-size: 0.85rem;
      color: $color-text-secondary;
    }

    .toggle-icon {
      color: $color-secondary-glow;
      transition: transform 0.3s ease;
    }
  }
}

.ranking-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($color-text-secondary, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: $color-border-glow;
    border-radius: 3px;
  }
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ranking-item {
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  .item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba($color-deep-night, 0.5);
    border: 1px solid rgba($color-border-glow, 0.2);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($color-deep-night, 0.7);
      border-color: $color-border-glow;
      transform: translateX(4px);
    }
  }

  .rank-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .rank-badge {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba($color-text-secondary, 0.1);
      border: 1px solid $color-border-glow;
      border-radius: 50%;
      font-size: 0.85rem;
      font-weight: 700;
      color: $color-text-secondary;
    }

    .rank-name {
      font-size: 0.9rem;
      color: $color-text-primary;
      font-weight: 500;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .rank-stats {
    display: flex;
    align-items: center;
    gap: 6px;

    .count-badge {
      font-size: 0.8rem;
      color: $color-secondary-glow;
      font-weight: 600;
    }

    .trophy-icon {
      color: $color-secondary-glow;
    }
  }

  /* 前三名样式 */
  &.rank-1 {
    .rank-badge {
      background: linear-gradient(
        135deg,
        $color-secondary-glow,
        $color-primary-glow
      );
      color: $color-deep-night;
      border: none;
    }

    .count-badge {
      color: $color-secondary-glow;
    }
  }

  &.rank-2 {
    .rank-badge {
      background: rgba($color-secondary-glow, 0.2);
      border-color: $color-secondary-glow;
    }
  }

  &.rank-3 {
    .rank-badge {
      background: rgba($color-primary-glow, 0.2);
      border-color: $color-primary-glow;
    }
  }
}

/* Lightbox 样式 */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba($color-deep-night, 0.98);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  overflow: hidden;
  touch-action: none;
  user-select: none;

  .lightbox-halo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    height: 1000px;
    background: radial-gradient(
      circle at center,
      rgba($color-primary-glow, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
  }
}

.lightbox-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

.lightbox-close {
  background: rgba($color-deep-night, 0.8);
  border: 1px solid $color-border-glow;
  width: 48px;
  height: 48px;
  border-radius: 50%;

  &:hover {
    background: rgba($color-deep-night, 0.95);
    border-color: $color-secondary-glow;
  }
}

.lightbox-toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.8) 0%,
    rgba($color-deep-night, 0.9) 100%
  );
  border: 1px solid $color-border-glow;
  border-radius: 25px;
  padding: 0.75rem 1.25rem;
  backdrop-filter: blur(10px);
}

.zoom-controls {
  .zoom-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba($color-text-primary, 0.1);
      border: 1px solid $color-border-glow;

      &:hover:not(:disabled) {
        background: rgba($color-primary-glow, 0.2);
        border-color: $color-primary-glow;
      }
    }

    .zoom-level {
      color: $color-secondary-glow;
      font-size: 0.9rem;
      font-weight: 600;
      min-width: 50px;
      text-align: center;
    }
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .lightbox-like-btn {
    &.liked {
      border-color: rgba(255, 71, 87, 0.5);
      background: rgba(255, 71, 87, 0.1);
    }

    .like-count {
      margin-left: 4px;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }

  .lightbox-download-btn {
    &:hover {
      border-color: $color-secondary-glow;
      background: rgba($color-secondary-glow, 0.1);
    }
  }
}

.nav-info {
  color: $color-text-primary;
  font-size: 0.9rem;
  font-weight: 500;
  padding-left: 0.75rem;
  border-left: 1px solid $color-border-glow;

  .current-index {
    color: $color-secondary-glow;
    font-weight: 700;
  }

  .separator {
    margin: 0 4px;
    opacity: 0.6;
  }

  .total-count {
    opacity: 0.8;
  }
}

.lightbox-image-container {
  position: relative;
  max-width: 85vw;
  max-height: 85vh;
  transition: transform 0.2s ease-out;
  will-change: transform;

  img {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px $color-border-glow;
    object-fit: contain;
    user-drag: none;
  }
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba($color-deep-night, 0.8);
  border: 1px solid $color-border-glow;
  width: 56px;
  height: 56px;
  border-radius: 50%;

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }

  &:hover {
    background: rgba($color-deep-night, 0.95);
    border-color: $color-secondary-glow;
  }
}

.pan-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba($color-deep-night, 0.8);
  border: 1px solid $color-border-glow;
  color: $color-secondary-glow;
  padding: 0.75rem 1.25rem;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  animation: floatHint 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

/* 上传弹窗 */
.upload-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($color-deep-night, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fadeIn 0.3s ease forwards;
}

.upload-modal {
  width: 90%;
  max-width: 500px;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.95) 0%,
    rgba($color-deep-night, 0.98) 100%
  );
  border: 1px solid $color-border-glow;
  border-radius: 16px;
  padding: 2rem;
  color: $color-text-primary;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h3 {
      margin: 0;
      font-size: 1.4rem;
      background: linear-gradient(
        135deg,
        $color-secondary-glow 0%,
        $color-primary-glow 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .modal-close {
      padding: 8px;
      border-radius: 8px;

      &:hover {
        background: rgba($color-primary-glow, 0.1);
      }
    }
  }
}

.modal-tips {
  background: rgba($color-deep-night, 0.5);
  border: 1px solid $color-border-glow;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1.5rem;

  .tips-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 1rem;

    .tips-icon {
      color: $color-secondary-glow;
    }

    h4 {
      margin: 0;
      font-size: 1rem;
      color: $color-text-primary;
    }
  }

  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
      padding-left: 1.2rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: $color-text-secondary;
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: "•";
        color: $color-primary-glow;
        position: absolute;
        left: 0;
      }
    }
  }
}

.modal-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  .stat-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba($color-deep-night, 0.5);
    border: 1px solid $color-border-glow;
    border-radius: 8px;

    .stat-label {
      font-size: 0.9rem;
      color: $color-text-secondary;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: $color-secondary-glow;
    }
  }
}

.modal-form {
  .form-group {
    margin-bottom: 1.2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: $color-text-primary;

    .label-icon {
      color: $color-secondary-glow;
    }
  }

  .form-input {
    width: 100%;
    padding: 0.8rem 1rem;
    background: rgba($color-deep-night, 0.7);
    border: 1px solid $color-border-glow;
    border-radius: 8px;
    color: $color-text-primary;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $color-secondary-glow;
      background: rgba($color-deep-night, 0.9);
    }

    &::placeholder {
      color: rgba($color-text-secondary, 0.5);
    }
  }
}

.file-upload {
  .file-input {
    display: none;
  }

  .upload-area {
    border: 2px dashed $color-border-glow;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba($color-deep-night, 0.5);

    &:hover {
      border-color: $color-secondary-glow;
      background: rgba($color-secondary-glow, 0.05);
    }

    .upload-icon {
      margin-bottom: 1rem;
      color: $color-secondary-glow;
    }

    span {
      display: block;
      color: $color-text-secondary;
      font-size: 0.9rem;
    }
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  .submit-btn {
    flex: 1;
    padding: 0.9rem 1.5rem;
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 0.9) 0%,
      rgba($color-blood-shadow, 0.7) 100%
    );
    color: $color-text-primary;
    border: 1px solid rgba($color-secondary-glow, 0.3);
    font-size: 1rem;
    font-weight: 700;

    .submit-icon {
      margin-right: 8px;
    }

    .uploading-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid transparent;
      border-top: 2px solid $color-text-primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    &:hover:not(:disabled) {
      background: linear-gradient(
        135deg,
        rgba($color-primary-glow, 1) 0%,
        rgba($color-blood-shadow, 0.9) 100%
      );
    }
  }

  .cancel-btn {
    padding: 0.9rem 1.5rem;
    background: transparent;
    border: 1px solid $color-border-glow;
    color: $color-text-secondary;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($color-text-secondary, 0.1);
      border-color: $color-text-secondary;
    }
  }
}

/* 下载成功提示 */
.download-success-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.95),
    rgba($color-deep-night, 0.95)
  );
  backdrop-filter: blur(20px);
  border: 1px solid $color-border-glow;
  color: $color-secondary-glow;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 4000;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba($color-secondary-glow, 0.1);

  &.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes floatHint {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes magneticFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) translateX(20px) rotate(90deg);
  }
  50% {
    transform: translateY(0) translateX(40px) rotate(180deg);
  }
  75% {
    transform: translateY(-20px) translateX(20px) rotate(270deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.panel-expand-enter-active,
.panel-expand-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
  overflow: hidden;
}

.panel-expand-enter-from,
.panel-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .augusta-gallery {
    padding: 1rem;
    padding-top: 70px;
  }

  .upload-btn {
    bottom: 1rem;
    left: 1rem;
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .control-panel {
    padding: 1rem;
  }

  .panel-header {
    .panel-title {
      font-size: 1.4rem;
    }
  }

  .sort-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .ranking-panel {
    display: none;
  }

  .lightbox-controls {
    padding: 1rem;
  }

  .lightbox-toolbar {
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .zoom-controls {
    width: 100%;
    order: 2;
  }

  .action-buttons {
    order: 1;
  }

  .nav-info {
    order: 3;
    width: 100%;
    text-align: center;
    border-left: none;
    border-top: 1px solid $color-border-glow;
    padding-left: 0;
    padding-top: 0.5rem;
  }

  .lightbox-nav {
    width: 48px;
    height: 48px;

    &.prev {
      left: 1rem;
    }

    &.next {
      right: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .panel-title {
    font-size: 1.2rem !important;
  }

  .upload-modal {
    width: 95%;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>