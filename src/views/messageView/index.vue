<template>
  <div class="augusta-message-board" aria-live="polite">
    <!-- 背景轮播 -->
    <div class="carousel carousel1" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>
    <div class="carousel carousel2" aria-hidden="true">
      <img
        v-for="(src, idx) in randomFive2"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>

    <!-- 半透明顶部标题 -->
    <header class="board-header" role="banner">
      <div class="title-wrap">
        <span class="title-count">（已收集{{ count }}条誓言）</span>
        <p class="subtitle">烈阳所照，誓言永存；磁律之音，回荡永恒</p>
      </div>
    </header>

    <!-- 留言展示区 -->
    <section class="message-list">
      <transition-group name="msg" tag="div" class="message-list-inner">
        <div
          v-if="loading && messages.length === 0"
          class="skeleton-wrap"
          key="skeleton"
        >
          <div class="skeleton" v-for="i in 3" :key="i">
            <div class="sk-avatar"></div>
            <div class="sk-lines">
              <div class="sk-line short"></div>
              <div class="sk-line"></div>
            </div>
          </div>
        </div>

        <div
          v-for="(msg, idx) in messages"
          :key="msg.id || msg._tempId || idx"
          class="message-card"
          :data-index="idx"
          tabindex="0"
          role="article"
          :aria-label="`留言来自 ${msg.name || '角斗士'}，内容：${msg.content}`"
        >
          <div class="message-meta">
            <div class="left-meta">
              <div class="name-avatar" :title="msg.name || '角斗士'">
                {{ getInitial(msg.name) }}
              </div>
              <div class="meta-texts">
                <div class="message-name">{{ msg.name || "角斗士" }}</div>
                <div class="message-time">{{ formatTime(msg.created_at) }}</div>
              </div>
            </div>
            <div class="augusta-icon" role="button" tabindex="0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="64"
                height="64"
              >
                <!-- 磁律光环 -->
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="#ffd460"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                  opacity="0.3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 32 32"
                    to="360 32 32"
                    dur="20s"
                    repeatCount="indefinite"
                  />
                </circle>

                <!-- 剑刃主体 -->
                <path
                  d="M32,12 L36,28 L32,25 L28,28 Z"
                  fill="#c64830"
                  opacity="0.9"
                />
                <path
                  d="M32,12 L38,32 L32,28 L26,32 Z"
                  fill="#8b001a"
                  opacity="0.8"
                />
                <path
                  d="M32,12 L40,36 L32,32 L24,36 Z"
                  fill="#060408"
                  opacity="0.7"
                />

                <!-- 剑柄 -->
                <rect
                  x="30"
                  y="36"
                  width="4"
                  height="8"
                  rx="1"
                  fill="#1a0e14"
                />
                <circle cx="32" cy="44" r="3" fill="#c64830" />

                <!-- 太阳辐射 -->
                <g>
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(0,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(45,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(90,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(135,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(180,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(225,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(270,32,32)"
                  />
                  <path
                    d="M32,12 L33,8 L35,8 L34,12 Z"
                    fill="#ffd460"
                    transform="rotate(315,32,32)"
                  />
                </g>
              </svg>
            </div>
          </div>

          <p class="message-content">{{ msg.content }}</p>
        </div>
      </transition-group>

      <!-- 无限滚动哨兵 -->
      <div ref="sentinel" class="sentinel"></div>

      <!-- 加载更多提示 -->
      <div v-if="loadingMore" class="loading-more">
        <div class="magnetic-spinner">
          <div class="magnetic-ring"></div>
          <div class="magnetic-core"></div>
        </div>
        <span>磁律共鸣中...</span>
      </div>

      <div v-if="!hasMore && messages.length > 0" class="no-more">
        <span>已加载所有誓言</span>
      </div>
    </section>

    <!-- 底部发送区 -->
    <section class="message-form" aria-label="刻下你的誓言">
      <label class="sr-only" for="mb-name">你的称号</label>
      <input
        id="mb-name"
        v-model="name"
        type="text"
        placeholder="你的称号（角斗士/战士/臣民）"
        @keydown.enter.prevent
      />

      <label class="sr-only" for="mb-content">誓言内容</label>
      <textarea
        id="mb-content"
        v-model="content"
        placeholder="在此刻下你的誓言..."
        @keydown.ctrl.enter.prevent="submitMessage"
        @input="autoGrow"
        ref="textareaRef"
      />

      <div class="form-row">
        <div class="hint">按 <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 释放磁律</div>
        <button
          @click="submitMessage"
          :disabled="isSending || !content.trim()"
          class="magnetic-btn"
        >
          <span v-if="!isSending">
            <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" fill="currentColor" />
            </svg>
            释放磁律
          </span>
          <span v-else>
            <div class="sending-spinner"></div>
            磁律共鸣中...
          </span>
        </button>
      </div>
    </section>

    <!-- 磁力浮动元素 -->
    <div class="magnetic-floats">
      <div
        v-for="(item, i) in magneticFloats"
        :key="i"
        class="magnetic-float"
        :style="{
          left: item.x + 'px',
          top: item.y + 'px',
          animationDelay: item.delay + 's',
        }"
      >
        {{ item.symbol }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, onUnmounted } from "vue";
import { getMessageList, createMessage } from "@/api/modules/message";

// 分页相关状态
const messages = ref<any[]>([]);
const count = ref(0);
const currentPage = ref(1);
const pageSize = 20;
const hasMore = ref(true);
const loading = ref(true);
const loadingMore = ref(false);

const name = ref(localStorage.getItem("message_name") || "");
const content = ref("");
const isSending = ref(false);
const sentinel = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// 磁力浮动元素
const magneticFloats = ref([
  { symbol: "⚔️", x: 10, y: 100, delay: 0 },
  { symbol: "🛡️", x: 85, y: 200, delay: 0.8 },
  { symbol: "👑", x: 90, y: 150, delay: 1.2 },
  { symbol: "⚡", x: 30, y: 250, delay: 0.4 },
  { symbol: "🔱", x: 70, y: 180, delay: 1.6 },
]);

// 分页获取留言
const fetchMessages = async (page: number = 1, isLoadMore: boolean = false) => {
  if (isLoadMore) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const res = await getMessageList({ page, pageSize });
    const newMessages = res.data || [];

    if (isLoadMore) {
      messages.value = [...messages.value, ...newMessages];
    } else {
      messages.value = newMessages;
    }

    count.value = res.pagination.total;

    // 检查是否还有更多数据
    const totalLoaded = messages.value.length;
    hasMore.value = totalLoaded < count.value;

    await nextTick();
  } catch (err) {
    console.error("获取留言失败:", err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 初始化加载第一页
onMounted(() => {
  fetchMessages(1, false);

  // 初始化背景轮播
  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);

  nextTick(() => {
    autoGrow();
    setupInfiniteScroll();
  });
});

// 无限滚动
let observer: IntersectionObserver | null = null;

const setupInfiniteScroll = () => {
  if (!sentinel.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        hasMore.value &&
        !loadingMore.value &&
        !loading.value
      ) {
        loadMoreMessages();
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  observer.observe(sentinel.value);
};

const loadMoreMessages = () => {
  if (!hasMore.value || loadingMore.value) return;

  currentPage.value += 1;
  fetchMessages(currentPage.value, true);
};

// 提交留言
const submitMessage = async () => {
  if (!content.value.trim() || isSending.value) return;

  isSending.value = true;
  const payload = {
    name: name.value || "无名角斗士",
    content: content.value,
  };

  try {
    localStorage.setItem("message_name", name.value);
    content.value = "";

    await nextTick();
    autoGrow();

    // 发送请求
    await createMessage(payload);

    // 重新加载第一页（最新数据）
    currentPage.value = 1;
    await fetchMessages(1, false);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("发送留言失败:", err);
  } finally {
    isSending.value = false;
  }
};

// 工具函数
const formatTime = (time: string) => {
  if (!time) return "未知时间";
  const d = new Date(time);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const getInitial = (n?: string) => {
  if (!n) return "⚔";
  return n.trim().slice(0, 1).toUpperCase();
};

const autoGrow = (e?: Event) => {
  const ta = textareaRef.value;
  if (!ta) return;
  ta.style.height = "auto";
  const h = Math.min(ta.scrollHeight, 220);
  ta.style.height = h + "px";
};

// ========== 背景图片导入与轮播 ==========
const modules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs: string[] = Object.values(modules).map((mod: any) => mod.default);

const modules2 = import.meta.glob("@/assets/images2/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const allSrcs2: string[] = Object.values(modules2).map(
  (mod: any) => mod.default
);

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randomFive = ref<string[]>(shuffle(allSrcs).slice(0, 5));
const randomFive2 = ref<string[]>(shuffle(allSrcs2).slice(0, 5));
const currentIndex = ref(0);
let Imgtimer: number | undefined;

onBeforeUnmount(() => {
  if (Imgtimer) clearInterval(Imgtimer);
  if (observer) observer.disconnect();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped lang="scss">
/* 奥古斯塔主题色板 */
$color-deep-night: #060408;
$color-metal-dark: #1a0e14;
$color-primary-glow: #c64830;
$color-secondary-glow: #ffd460;
$color-blood-shadow: #8b001a;
$color-text-primary: #fff7ef;
$color-text-secondary: #e1d7bd;
$color-border-glow: rgba(198, 72, 48, 0.4);

.augusta-message-board {
  position: relative;
  min-height: 100vh;
  padding-top: 120px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    $color-deep-night 0%,
    $color-metal-dark 100%
  );
  font-family: "Noto Sans SC", "Noto Sans", system-ui, -apple-system, "Segoe UI",
    Roboto, Arial;
  color: $color-text-primary;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* 磁力场背景效果 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 20% 30%,
        rgba($color-primary-glow, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba($color-secondary-glow, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 60%,
        rgba($color-blood-shadow, 0.08) 0%,
        transparent 50%
      );
    z-index: 0;
    pointer-events: none;
  }

  /* 背景轮播 */
  .carousel {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba($color-deep-night, 0.8) 0%,
        rgba($color-metal-dark, 0.9) 100%
      );
      z-index: 1;
      mix-blend-mode: multiply;
    }

    .carousel-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.2s ease, transform 20s linear;
      filter: blur(1px) saturate(0.7) contrast(0.9) brightness(0.4);
      transform: scale(1.1);

      &.active {
        opacity: 0.3;
        transform: scale(1);
      }
    }
  }

  .carousel2 {
    display: none;
  }

  /* ---------- 顶部标题 ---------- */
  .board-header {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 1200px;
    padding: 20px 24px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.9) 0%,
      rgba($color-deep-night, 0.95) 100%
    );
    backdrop-filter: blur(10px);
    border: 1px solid rgba($color-primary-glow, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
      0 0 30px rgba($color-primary-glow, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 10;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        45deg,
        transparent 0%,
        rgba($color-primary-glow, 0.05) 50%,
        transparent 100%
      );
      border-radius: 16px;
      pointer-events: none;
    }

    .title-wrap {
      text-align: center;

      h1 {
        margin: 0;
        font-size: 2.2rem;
        background: linear-gradient(
          135deg,
          $color-secondary-glow 0%,
          $color-primary-glow 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900;
        letter-spacing: 1px;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }

      .title-count {
        display: block;
        margin-top: 8px;
        color: $color-text-secondary;
        font-size: 1rem;
        font-weight: 600;
        opacity: 0.9;
      }

      .subtitle {
        margin: 12px 0 0;
        color: rgba($color-text-secondary, 0.9);
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }
  }

  /* ---------- 留言列表 ---------- */
  .message-list {
    z-index: 2;
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: 30px 20px 180px;
    margin-top: 20px;

    .message-list-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* 骨架屏 */
    .skeleton-wrap {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;

      .skeleton {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 20px;
        background: linear-gradient(
          135deg,
          rgba($color-metal-dark, 0.6) 0%,
          rgba($color-deep-night, 0.7) 100%
        );
        border-radius: 16px;
        border: 1px solid rgba($color-primary-glow, 0.1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      .sk-avatar {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        background: linear-gradient(
          90deg,
          rgba($color-primary-glow, 0.3) 25%,
          rgba($color-secondary-glow, 0.3) 50%,
          rgba($color-primary-glow, 0.3) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-shimmer 1.5s infinite linear;
      }

      .sk-lines {
        flex: 1;

        .sk-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            rgba($color-text-secondary, 0.1) 25%,
            rgba($color-text-secondary, 0.2) 50%,
            rgba($color-text-secondary, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite linear;
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .sk-line.short {
          width: 60%;
        }
      }
    }

    @keyframes skeleton-shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* 单条消息卡片 */
    .message-card {
      background: linear-gradient(
        135deg,
        rgba($color-metal-dark, 0.8) 0%,
        rgba($color-deep-night, 0.9) 100%
      );
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba($color-primary-glow, 0.2);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6),
        0 0 25px rgba($color-primary-glow, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background: linear-gradient(
          180deg,
          $color-primary-glow,
          $color-secondary-glow,
          transparent
        );
        opacity: 0.6;
        transition: opacity 0.4s ease;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7),
          0 0 40px rgba($color-primary-glow, 0.2);
        border-color: rgba($color-primary-glow, 0.4);

        &::before {
          opacity: 1;
        }

        .augusta-icon {
          transform: translateY(-5px) rotate(10deg);
          box-shadow: 0 15px 40px rgba($color-primary-glow, 0.3);
        }
      }

      .message-meta {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 16px;

        .left-meta {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;

          .name-avatar {
            width: 64px;
            height: 64px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            color: $color-text-primary;
            background: linear-gradient(
              135deg,
              $color-primary-glow 0%,
              $color-blood-shadow 50%,
              $color-primary-glow 100%
            );
            box-shadow: 0 8px 24px rgba($color-primary-glow, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            font-size: 20px;
            flex-shrink: 0;
            position: relative;
            z-index: 1;

            &::after {
              content: "";
              position: absolute;
              inset: 2px;
              border-radius: 12px;
              background: linear-gradient(
                135deg,
                transparent 0%,
                rgba($color-secondary-glow, 0.2) 100%
              );
              z-index: -1;
            }
          }

          .meta-texts {
            flex: 1;

            .message-name {
              font-size: 1.2rem;
              color: $color-secondary-glow;
              font-weight: 700;
              line-height: 1.2;
              margin-bottom: 4px;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            .message-time {
              font-size: 0.9rem;
              color: rgba($color-text-secondary, 0.8);
              font-weight: 500;
            }
          }
        }

        .augusta-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;

          svg {
            width: 48px;
            height: 48px;
            filter: drop-shadow(0 4px 12px rgba($color-secondary-glow, 0.3));
          }

          &:hover {
            svg {
              animation: sword-spin 1s ease;
            }
          }
        }

        @keyframes sword-spin {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }

      .message-content {
        font-size: 1.05rem;
        color: $color-text-primary;
        line-height: 1.7;
        margin: 0;
        padding-left: 14px;
        position: relative;

        &::before {
          content: "「";
          position: absolute;
          left: -8px;
          top: -8px;
          color: rgba($color-secondary-glow, 0.5);
          font-size: 1.5rem;
          font-weight: bold;
        }

        &::after {
          content: "」";
          position: absolute;
          right: -8px;
          bottom: -8px;
          color: rgba($color-secondary-glow, 0.5);
          font-size: 1.5rem;
          font-weight: bold;
        }
      }
    }

    /* 无限滚动哨兵 */
    .sentinel {
      height: 1px;
      width: 100%;
      margin: 20px 0;
      opacity: 0;
      pointer-events: none;
    }

    /* 加载更多 */
    .loading-more,
    .no-more {
      text-align: center;
      padding: 30px;
      color: $color-text-secondary;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .loading-more {
      .magnetic-spinner {
        position: relative;
        width: 48px;
        height: 48px;

        .magnetic-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid $color-primary-glow;
          border-radius: 50%;
          animation: magnetic-spin 1.5s linear infinite;
        }

        .magnetic-core {
          position: absolute;
          width: 16px;
          height: 16px;
          background: $color-secondary-glow;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 20px $color-secondary-glow;
          animation: magnetic-pulse 2s ease-in-out infinite;
        }
      }
    }

    @keyframes magnetic-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes magnetic-pulse {
      0%,
      100% {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: 0 0 20px $color-secondary-glow;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.2);
        box-shadow: 0 0 30px $color-secondary-glow;
      }
    }
  }

  /* ---------- 底部输入区 ---------- */
  .message-form {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 24px;
    width: calc(100% - 40px);
    max-width: 1200px;
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.95) 0%,
      rgba($color-deep-night, 0.98) 100%
    );
    padding: 24px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9),
      0 0 40px rgba($color-primary-glow, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 10;
    border: 1px solid rgba($color-primary-glow, 0.3);
    backdrop-filter: blur(10px);

    &::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: 17px;
      background: linear-gradient(
        135deg,
        transparent 0%,
        rgba($color-primary-glow, 0.05) 50%,
        transparent 100%
      );
      pointer-events: none;
    }

    input,
    textarea {
      padding: 16px 20px;
      border-radius: 14px;
      border: 1px solid rgba($color-primary-glow, 0.2);
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
      background: linear-gradient(
        135deg,
        rgba($color-metal-dark, 0.8) 0%,
        rgba($color-deep-night, 0.9) 100%
      );
      color: $color-text-primary;
      resize: none;

      &::placeholder {
        color: rgba($color-text-secondary, 0.5);
      }

      &:focus {
        border-color: $color-primary-glow;
        box-shadow: 0 0 0 3px rgba($color-primary-glow, 0.2),
          0 8px 24px rgba($color-primary-glow, 0.1);
        background: linear-gradient(
          135deg,
          rgba($color-metal-dark, 0.9) 0%,
          rgba($color-deep-night, 0.95) 100%
        );
      }
    }

    textarea {
      min-height: 80px;
      max-height: 220px;
      line-height: 1.6;
    }

    .form-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-top: 8px;

      .hint {
        color: rgba($color-text-secondary, 0.9);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;

        kbd {
          background: rgba($color-primary-glow, 0.2);
          border-radius: 6px;
          padding: 4px 8px;
          border: 1px solid rgba($color-primary-glow, 0.3);
          font-size: 0.85rem;
          color: $color-secondary-glow;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      }

      .magnetic-btn {
        padding: 14px 32px;
        background: linear-gradient(
          135deg,
          $color-primary-glow 0%,
          $color-blood-shadow 50%,
          $color-primary-glow 100%
        );
        background-size: 200% 100%;
        color: $color-text-primary;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: 0.5px;
        box-shadow: 0 8px 24px rgba($color-primary-glow, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        position: relative;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba($color-secondary-glow, 0.2) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover:not(:disabled) {
          background-position: 100% 0;
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba($color-primary-glow, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);

          &::before {
            opacity: 1;
          }
        }

        &:active:not(:disabled) {
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba($color-metal-dark, 0.8);
          color: rgba($color-text-secondary, 0.5);
        }

        .btn-icon {
          width: 18px;
          height: 18px;
        }

        .sending-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid $color-secondary-glow;
          border-radius: 50%;
          animation: sending-spin 1s linear infinite;
        }
      }

      @keyframes sending-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  /* 磁力浮动元素 */
  .magnetic-floats {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;

    .magnetic-float {
      position: absolute;
      font-size: 24px;
      opacity: 0.2;
      animation: magnetic-float 8s ease-in-out infinite;
      filter: drop-shadow(0 0 10px rgba($color-secondary-glow, 0.3));

      &:nth-child(odd) {
        animation-duration: 10s;
      }
    }

    @keyframes magnetic-float {
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
  }

  /* 无障碍隐藏 */
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  /* ---------- 响应式设计 ---------- */
  @media (max-width: 1024px) {
    padding-top: 100px;

    .board-header {
      top: 60px;
      padding: 16px 20px;

      h1 {
        font-size: 1.8rem;
      }
    }

    .message-list {
      padding: 20px 16px 160px;
      gap: 16px;
    }

    .message-card {
      padding: 20px;
    }
  }

  @media (max-width: 768px) {
    padding-top: 90px;

    .carousel1 {
      display: none;
    }
    .carousel2 {
      display: block;
    }

    .board-header {
      left: 16px;
      transform: none;
      width: calc(100% - 32px);
      top: 50px;

      h1 {
        font-size: 1.6rem;
      }

      .subtitle {
        font-size: 0.95rem;
      }
    }

    .message-list {
      padding: 16px 12px 200px;

      .message-list-inner {
        gap: 16px;
      }

      .message-card {
        padding: 16px;

        .message-meta {
         
          gap: 16px;

          .left-meta {
            .name-avatar {
              width: 52px;
              height: 52px;
              font-size: 18px;
            }
          }

          .augusta-icon {
            align-self: flex-end;
            margin-top: -10px;
          }
        }
      }
    }

    .message-form {
      left: 16px;
      transform: none;
      width: calc(100% - 32px);
      bottom: 16px;
      padding: 20px;

      .form-row {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;

        .hint {
          justify-content: center;
        }
      }
    }

    .magnetic-floats {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .board-header {
      padding: 14px;

      h1 {
        font-size: 1.4rem;
      }
    }

    .message-card {
      .message-meta {
        .left-meta {
          gap: 12px;

          .name-avatar {
            width: 48px;
            height: 48px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>