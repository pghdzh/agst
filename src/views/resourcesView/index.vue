<template>
  <div class="yuzuki-resources">
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
    <header class="hero">
      <div class="hero-inner">
        <h1>资源分享</h1>
        <p class="subtitle">可自由上传关于奥古斯塔的相关链接</p>
      </div>
    </header>

    <main class="container">
      <section class="uploader" :class="{ collapsed: uploaderCollapsed }">
        <div class="uploader-head">
          <button
            class="toggle"
            @click="toggleUploader"
            :aria-expanded="!uploaderCollapsed"
          >
            <span v-if="uploaderCollapsed">展开上传区</span>
            <span v-else>收起上传区</span>
          </button>
        </div>

        <form
          @submit.prevent="addResource"
          class="upload-form"
          :aria-hidden="uploaderCollapsed"
        >
          <div class="row">
            <input
              v-model="form.title"
              type="text"
              placeholder="标题（必填，如果有解压码之类的也写这里吧）"
              aria-label="标题"
            />
            <input
              v-model="form.type"
              type="text"
              placeholder="链接类型(网页链接、b站视频、网盘链接等等)"
              aria-label="来源"
            />
          </div>

          <div class="row">
            <input
              v-model="form.uploader"
              type="text"
              placeholder="上传人（可选）"
              aria-label="上传人"
            />
            <input
              v-model="form.link"
              type="url"
              placeholder="链接(只输入网址不能有中文)"
              aria-label="链接"
            />
          </div>

          <div class="actions">
            <button type="submit" class="btn primary">上传</button>
          </div>
        </form>
      </section>

      <section class="list">
        <div class="list-header">
          <h2>资源列表（{{ resources.length }}）</h2>
          <div class="sort">
            <label>
              排序：
              <select v-model="sortBy">
                <option value="time">按时间（新→旧）</option>
                <option value="likes">按点赞（高→低）</option>
              </select>
            </label>
          </div>
        </div>

        <ul class="items">
          <li v-for="item in sortedResources" :key="item.id" class="item">
            <a
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              class="title"
              >{{ item.title }}</a
            >

            <div class="meta">
              <div class="left">
                <span class="uploader">{{ item.uploader || "匿名" }}</span>
                <span class="dot">•</span>
                <time :datetime="item.time">{{ formatTime(item.time) }}</time>
              </div>

              <div class="right">
                <button
                  @click.prevent="handleLike(item)"
                  :aria-pressed="likedIds.has(String(item.id))"
                  class="like-btn"
                  :class="{ active: likedIds.has(String(item.id)) }"
                >
                  <img
                    :src="
                      likedIds.has(String(item.id))
                        ? '/icons/heart-red-filled.svg'
                        : '/icons/heart-red-outline.svg'
                    "
                    class="heart-icon"
                    alt="heart"
                  />
                  <span class="count">{{ item.likes }}</span>
                </button>

                <span class="badge">{{ item.type }}</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-if="resources.length === 0" class="empty">
          目前没有资源，快来上传第一条吧！
        </p>
      </section>
    </main>

    <footer class="foot">提示：点击标题将直接跳转</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
// 如果你的工程使用 ts 路径别名 @ 指向 src，可以用 '@/api/resource'，否则根据实际路径调整
import {
  getResourceList,
  createResource,
  likeResource,
} from "@/api/modules/resource";
import { ElMessage } from "element-plus";

interface Resource {
  id: number | string;
  title: string;
  uploader?: string;
  time: string; // ISO 或 created_at
  likes: number;
  link: string;
  type: string;
  role_key?: string;
}

const STORAGE_KEY = "fll_resources_v1";
const DEFAULT_ROLE = "agst";

const form = ref<{
  title: string;
  uploader: string;
  link: string;
  type: string;
}>({
  title: "",
  uploader: "",
  link: "",
  type: "",
});

const resources = ref<Resource[]>([]);
const likedIds = ref(new Set<string>());
const sortBy = ref<"time" | "likes">("time");
const uploaderCollapsed = ref(false);

function mapServerToLocal(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    uploader: row.uploader || "匿名",
    time: row.created_at || row.time || new Date().toISOString(),
    likes: row.likes ?? 0,
    link: row.link,
    type: row.storage_type || row.type || "other",
    role_key: row.role_key,
  };
}

async function loadResources() {
  try {
    // 尝试从后端拉取（分页可扩展，这里一次拉足够 demo）
    const res: any = await getResourceList({
      role_key: DEFAULT_ROLE,
      page: 1,
      pageSize: 100,
    });
    if (res && res.success && Array.isArray(res.data)) {
      resources.value = res.data.map(mapServerToLocal);
      // 可恢复本地点赞状态（仅 UI 记忆）
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.liked && Array.isArray(parsed.liked)) {
            parsed.liked.forEach((id: string) => likedIds.value.add(id));
          }
        } catch (e) {
          /* ignore */
        }
      }
      return;
    }
  } catch (err) {
    console.warn("拉取资源失败，使用本地缓存", err);
  }
  // 回退：本地缓存（仅恢复点赞状态）
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.liked && Array.isArray(parsed.liked)) {
        parsed.liked.forEach((id: string) => likedIds.value.add(id));
      }
    }
  } catch (e) {
    console.warn("本地加载失败", e);
  }
}

function saveLocalCache() {
  try {
    const liked = Array.from(likedIds.value);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked }));
  } catch (e) {
    console.warn("保存本地缓存失败", e);
  }
}

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

onMounted(() => {
  loadResources();
  Imgtimer = window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % Math.max(1, randomFive.value.length);
  }, 5200);
  uploaderCollapsed.value = window.innerWidth <= 640;
});
function toggleUploader() {
  uploaderCollapsed.value = !uploaderCollapsed.value;
}
onBeforeUnmount(() => {
  if (Imgtimer) clearInterval(Imgtimer);
});

async function addResource() {
  const t = form.value.title.trim();
  const l = form.value.link.trim();
  if (!form.value.title.trim() || !form.value.link.trim()) {
    return ElMessage.warning("请填写完整信息");
  }
  if (!/^https?:\/\//i.test(l)) {
    return ElMessage.error("请输入正确的链接(https开头)");
  }
  // 尝试调用后端接口
  try {
    const payload = {
      title: t,
      uploader: form.value.uploader.trim() || "匿名",
      link: l,
      storage_type: form.value.type,
      role_key: DEFAULT_ROLE,
    };
    const res: any = await createResource(payload);
    if (res && res.success && res.data) {
      const added = mapServerToLocal(res.data);
      resources.value.unshift(added);
      // 自动展开到顶部展示（可选）
      saveLocalCache();
      resetForm();
      ElMessage.success("上传成功");
      return;
    }
    ElMessage.error("上传失败");
  } catch (err) {
    console.warn("创建资源失败", err);
  }
}

function resetForm() {
  form.value.title = "";
  form.value.uploader = "";
  form.value.link = "";
  form.value.type = "";
}

async function handleLike(item: Resource) {
  // UI 乐观更新
  const id = item.id;
  const wasLiked = likedIds.value.has(String(id));
  if (wasLiked) {
    likedIds.value.delete(String(id));
    item.likes = Math.max(0, item.likes - 1);
  } else {
    likedIds.value.add(String(id));
    item.likes++;
  }
  saveLocalCache();

  // 同步后端（不依赖返回值进行 UI 回滚，简单处理：若失败则回退）
  try {
    const action = wasLiked ? "unlike" : "like";
    const res: any = await likeResource(id, action);
    if (
      res &&
      res.success &&
      res.data &&
      typeof res.data.likes !== "undefined"
    ) {
      item.likes = res.data.likes;
    }
  } catch (err) {
    console.warn("点赞接口调用失败，回滚本地状态", err);
    // 回滚
    if (wasLiked) {
      // 本来是已赞，取消失败 -> 重新添加
      likedIds.value.add(String(id));
      item.likes++;
    } else {
      likedIds.value.delete(String(id));
      item.likes = Math.max(0, item.likes - 1);
    }
    saveLocalCache();
  }
}

const sortedResources = computed(() => {
  const arr = [...resources.value];
  if (sortBy.value === "time") {
    arr.sort((a, b) => +new Date(b.time) - +new Date(a.time));
  } else {
    arr.sort((a, b) => b.likes - a.likes);
  }
  return arr;
});

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch (e) {
    return iso;
  }
}
</script>
<style scoped lang="scss">
// 奥古斯塔主题色板 - 深空夜 + 灼金/赤金电光 + 铁血深红
$color-deep-night: #060408; // 主背景：深空夜色
$color-metal-dark: #1a0e14; // 金属暗部
$color-primary-glow: #c64830; // 主辉光 - 赤金电光
$color-secondary-glow: #ffd460; // 次辉光 - 灼金高光
$color-blood-shadow: #8b001a; // 血影深红
$color-text-primary: #fff7ef; // 主文字
$color-text-secondary: #e1d7bd; // 副文字
$color-border-glow: rgba(198, 72, 48, 0.4); // 边框辉光

// 衍生颜色（不使用lighten/darken）
$bg-gradient-start: #040206; // 深空夜色的更深变体
$bg-gradient-end: #1e1018; // 金属暗部的深色变体
$card-bg: rgba(26, 14, 20, 0.25);
$glass-bg: rgba(6, 4, 8, 0.8);
$hover-glow: rgba(198, 72, 48, 0.18);
$active-glow: rgba(255, 212, 96, 0.25);
$accent-fade: rgba(139, 0, 26, 0.3);

// 电光脉冲动画
@keyframes electric-pulse {
  0%,
  100% {
    opacity: 0.3;
    box-shadow: 0 0 5px rgba(198, 72, 48, 0.2);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(198, 72, 48, 0.6);
  }
}

@keyframes metallic-shine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes blood-pulse {
  0%,
  100% {
    background-color: rgba(139, 0, 26, 0.1);
  }
  50% {
    background-color: rgba(139, 0, 26, 0.25);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.yuzuki-resources {
  color: $color-text-primary;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Noto Sans SC", "PingFang SC", "Helvetica Neue", Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  background: 
    // 深空背景渐变
    linear-gradient(135deg, $bg-gradient-start 0%, $bg-gradient-end 100%),
    // 赤金电光纹理
    repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(198, 72, 48, 0.03) 2px,
        rgba(198, 72, 48, 0.03) 4px
      ),
    // 血影深红纹理
    repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 1px,
        rgba(139, 0, 26, 0.02) 1px,
        rgba(139, 0, 26, 0.02) 3px
      );
  position: relative;
  overflow-x: hidden;
  padding-top: 60px;
  // 电光粒子效果层
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 20% 30%,
        rgba(198, 72, 48, 0.08) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(255, 212, 96, 0.05) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 40% 80%,
        rgba(139, 0, 26, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }

  // 金属边框装饰
  &::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(198, 72, 48, 0.1) 20%,
        rgba(255, 212, 96, 0.05) 40%,
        rgba(255, 212, 96, 0.05) 60%,
        rgba(198, 72, 48, 0.1) 80%,
        transparent 100%
      )
      border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }
}

// 轮播图容器 - 修复显示问题
.carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; // 改为视口高度，确保完全覆盖
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(6, 4, 8, 0.95) 0%,
      rgba(6, 4, 8, 0.7) 20%,
      rgba(6, 4, 8, 0.4) 50%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $color-primary-glow 20%,
      $color-secondary-glow 50%,
      $color-primary-glow 80%,
      transparent 100%
    );
    animation: electric-pulse 3s infinite;
    z-index: 3;
    filter: blur(1px);
  }

  .carousel-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover; // 保持比例并覆盖整个区域
    object-position: center; // 确保图片居中显示
    opacity: 0;
    transition: opacity 1.5s ease-in-out;
    filter: brightness(0.7) contrast(1.1) saturate(1.2);

    &.active {
      opacity: 1;
    }
  }
}

// 移动端轮播图隐藏
.carousel2 {
  display: none;
}

// 英雄区域
.hero {
  position: relative;
  z-index: 10;
  padding: 2.5rem 1rem 1.8rem;
 
  background: linear-gradient(
    180deg,
    rgba(26, 14, 20, 0.4) 0%,
    rgba(6, 4, 8, 0.25) 100%
  );
  backdrop-filter: blur(4px);
  border-top: 2px solid rgba(198, 72, 48, 0.3);
  border-bottom: 1px solid rgba(255, 212, 96, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  .hero-inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;

    h1 {
      margin: 0 0 0.8rem;
      font-size: 2.8rem;
      font-weight: 900;
      letter-spacing: 2px;
      background: linear-gradient(
        135deg,
        $color-text-primary 0%,
        $color-secondary-glow 50%,
        $color-primary-glow 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(198, 72, 48, 0.4);
      position: relative;
      animation: float 6s ease-in-out infinite;

      &::after {
        content: "";
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 3px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          $color-primary-glow 30%,
          $color-secondary-glow 50%,
          $color-primary-glow 70%,
          transparent 100%
        );
        border-radius: 2px;
        filter: blur(1px);
        animation: electric-pulse 2s infinite;
      }
    }

    .subtitle {
      color: $color-text-secondary;
      font-size: 1.1rem;
      margin-top: 0.5rem;
      letter-spacing: 1px;
      opacity: 0.9;
      font-weight: 500;
    }
  }
}

// 主容器
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}

// 上传区域
.uploader {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2.5rem;
  background: $card-bg;
  border: 1px solid rgba(198, 72, 48, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(198, 72, 48, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(198, 72, 48, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(198, 72, 48, 0.4);
  }

  .uploader-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.8rem;
    background: linear-gradient(
      90deg,
      rgba(26, 14, 20, 0.25) 0%,
      rgba(10, 6, 12, 0.35) 100%
    );
    border-bottom: 1px solid rgba(198, 72, 48, 0.25);

    .toggle {
      background: linear-gradient(
        135deg,
        rgba(198, 72, 48, 0.25) 0%,
        rgba(139, 0, 26, 0.25) 100%
      );
      border: 1px solid rgba(198, 72, 48, 0.4);
      color: $color-text-primary;
      padding: 0.6rem 1.5rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(5px);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 212, 96, 0.3),
          transparent
        );
        transition: left 0.7s ease;
      }

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(198, 72, 48, 0.35) 0%,
          rgba(139, 0, 26, 0.35) 100%
        );
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 5px 20px rgba(198, 72, 48, 0.4);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0) scale(1);
        box-shadow: 0 2px 10px rgba(198, 72, 48, 0.3);
      }
    }
  }

  .upload-form {
    padding: 1.8rem;
    max-height: 600px;
    overflow: hidden;
    transition: max-height 0.5s ease, padding 0.5s ease, opacity 0.5s ease;
    opacity: 1;

    .row {
      display: flex;
      gap: 1.2rem;
      margin-bottom: 1.2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }

      input {
        flex: 1;
        padding: 0.9rem 1.2rem;
        border-radius: 12px;
        border: 1px solid rgba(198, 72, 48, 0.25);
        background: rgba(6, 4, 8, 0.75);
        color: $color-text-primary;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        outline: none;
        backdrop-filter: blur(5px);

        &::placeholder {
          color: rgba(225, 215, 189, 0.6);
          font-weight: 400;
        }

        &:focus {
          border-color: $color-primary-glow;
          box-shadow: 0 0 0 3px rgba(198, 72, 48, 0.25),
            inset 0 0 15px rgba(198, 72, 48, 0.15);
          background: rgba(6, 4, 8, 0.9);
          transform: translateY(-2px);
        }

        &:hover:not(:focus) {
          border-color: rgba(198, 72, 48, 0.4);
          background: rgba(6, 4, 8, 0.85);
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.8rem;

      .btn {
        padding: 0.9rem 2.5rem;
        border-radius: 12px;
        border: none;
        font-weight: 700;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;

        &.primary {
          background: linear-gradient(
            135deg,
            $color-primary-glow 0%,
            #b03c28 30%,
            $color-blood-shadow 70%,
            #8b001a 100%
          );
          color: $color-text-primary;
          box-shadow: 0 8px 25px rgba(198, 72, 48, 0.5),
            0 0 15px rgba(139, 0, 26, 0.4);

          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            transition: left 0.7s ease;
          }

          &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              135deg,
              rgba(255, 212, 96, 0.1) 0%,
              transparent 30%,
              transparent 70%,
              rgba(255, 212, 96, 0.1) 100%
            );
            border-radius: 12px;
          }

          &:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 15px 35px rgba(198, 72, 48, 0.6),
              0 0 25px rgba(139, 0, 26, 0.5);

            &::before {
              left: 100%;
            }
          }

          &:active {
            transform: translateY(-1px) scale(1);
            box-shadow: 0 5px 20px rgba(198, 72, 48, 0.4),
              0 0 10px rgba(139, 0, 26, 0.3);
          }
        }
      }
    }
  }

  &.collapsed {
    .upload-form {
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
      opacity: 0;
    }
  }
}

// 资源列表区域
.list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.8rem;
    padding-bottom: 1.2rem;
    border-bottom: 2px solid rgba(198, 72, 48, 0.3);

    h2 {
      font-size: 1.6rem;
      margin: 0;
      color: $color-text-primary;
      font-weight: 800;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(
          90deg,
          $color-primary-glow,
          $color-secondary-glow
        );
        border-radius: 2px;
        filter: blur(1px);
      }
    }

    .sort {
      label {
        color: $color-text-secondary;
        font-size: 0.95rem;
        font-weight: 600;
        margin-right: 0.5rem;
      }

      select {
        background: rgba(6, 4, 8, 0.85);
        border: 1px solid rgba(198, 72, 48, 0.3);
        color: $color-text-primary;
        padding: 0.6rem 1rem;
        border-radius: 10px;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
        backdrop-filter: blur(5px);

        &:focus {
          border-color: $color-primary-glow;
          box-shadow: 0 0 0 3px rgba(198, 72, 48, 0.25);
        }

        &:hover {
          border-color: rgba(198, 72, 48, 0.5);
          background: rgba(6, 4, 8, 0.95);
        }
      }
    }
  }

  .items {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 65vh;
    overflow-y: auto;
    padding-right: 8px;

    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(6, 4, 8, 0.6);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, $color-primary-glow, #b03c28);
      border-radius: 4px;
      border: 1px solid rgba(255, 212, 96, 0.2);
    }

    &::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #d85c40, $color-primary-glow);
    }

    .item {
      background: linear-gradient(
        135deg,
        rgba(26, 14, 20, 0.2) 0%,
        rgba(16, 8, 14, 0.3) 100%
      );
      border: 1px solid rgba(198, 72, 48, 0.2);
      border-radius: 14px;
      padding: 1.4rem 1.8rem;
      margin-bottom: 1.2rem;
      transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(3px);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 212, 96, 0.08),
          transparent
        );
        transition: left 0.8s ease;
      }

      &:hover {
        transform: translateY(-6px);
        border-color: rgba(198, 72, 48, 0.5);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5),
          0 0 20px rgba(198, 72, 48, 0.3);
        background: linear-gradient(
          135deg,
          rgba(26, 14, 20, 0.55) 0%,
          rgba(16, 8, 14, 0.65) 100%
        );

        &::before {
          left: 100%;
        }

        .title {
          color: $color-secondary-glow;
        }
      }

      .title {
        display: block;
        color: $color-text-primary;
        font-weight: 700;
        font-size: 1.15rem;
        text-decoration: none;
        margin-bottom: 1rem;
        transition: color 0.3s ease;
        line-height: 1.5;
        position: relative;
        z-index: 2;

        &:hover {
          text-decoration: underline;
          text-decoration-color: $color-primary-glow;
          text-decoration-thickness: 2px;
        }
      }

      .meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
        position: relative;
        z-index: 2;

        .left {
          display: flex;
          align-items: center;
          gap: 1rem;

          .uploader {
            color: $color-secondary-glow;
            font-weight: 600;
            background: rgba(255, 212, 96, 0.12);
            padding: 0.3rem 0.8rem;
            border-radius: 6px;
            border: 1px solid rgba(255, 212, 96, 0.1);
          }

          .dot {
            color: rgba(198, 72, 48, 0.8);
            font-weight: bold;
          }

          time {
            color: rgba(255, 247, 239, 0.85);
            font-weight: 500;
          }
        }

        .right {
          display: flex;
          align-items: center;
          gap: 1.2rem;

          .like-btn {
            background: transparent;
            border: 1px solid rgba(198, 72, 48, 0.3);
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            transition: all 0.3s ease;
            color: rgba(255, 247, 239, 0.9);
            position: relative;
            overflow: hidden;
            background: rgba(198, 72, 48, 0.1);

            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 212, 96, 0.2),
                transparent
              );
              transition: left 0.6s ease;
            }

            &:hover {
              background: rgba(198, 72, 48, 0.2);
              transform: translateY(-2px) scale(1.05);
              border-color: rgba(198, 72, 48, 0.5);

              &::before {
                left: 100%;
              }

              .count {
                color: $color-text-primary;
              }
            }

            .heart-icon {
              width: 20px;
              height: 20px;
              display: block;
              filter: brightness(0.9);
              transition: transform 0.3s ease;
            }

            &.active {
              animation: blood-pulse 3s infinite;
              background: rgba(198, 72, 48, 0.25);
              border-color: $color-primary-glow;

              .heart-icon {
                filter: brightness(1.3)
                  drop-shadow(0 0 5px rgba(198, 72, 48, 0.9));
                transform: scale(1.15);
              }

              .count {
                color: $color-primary-glow;
                font-weight: 800;
                text-shadow: 0 0 5px rgba(198, 72, 48, 0.5);
              }
            }

            .count {
              transition: all 0.3s ease;
              font-size: 1rem;
            }
          }

          .badge {
            padding: 0.4rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
            background: linear-gradient(
              135deg,
              rgba(198, 72, 48, 0.25) 0%,
              rgba(139, 0, 26, 0.25) 100%
            );
            color: $color-secondary-glow;
            border: 1px solid rgba(255, 212, 96, 0.2);
            letter-spacing: 0.5px;
            backdrop-filter: blur(5px);
          }
        }
      }
    }
  }

  .empty {
    text-align: center;
    color: $color-text-secondary;
    padding: 3rem 1rem;
    font-size: 1.2rem;
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.6) 0%,
      rgba(16, 8, 14, 0.6) 100%
    );
    border-radius: 14px;
    border: 2px dashed rgba(198, 72, 48, 0.3);
    animation: electric-pulse 5s infinite;
    font-weight: 600;
  }
}

// 页脚
.foot {
  text-align: center;
  color: rgba(225, 215, 189, 0.75);
  font-size: 0.9rem;
  margin: 2.5rem 0 3.5rem;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(198, 72, 48, 0.15);
  position: relative;
  z-index: 10;

  &::before {
    content: "⚡";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    color: $color-secondary-glow;
    font-size: 1.5rem;
    filter: drop-shadow(0 0 5px rgba(255, 212, 96, 0.5));
  }
}

// 响应式设计
@media (max-width: 992px) {
  .hero {
    padding: 2rem 1rem 1.5rem;
    margin-top: 35vh;

    .hero-inner {
      h1 {
        font-size: 2.4rem;
      }
    }
  }

  .container {
    padding: 0 1.2rem 2.5rem;
  }
}

@media (max-width: 768px) {
  .carousel {
    height: 50vh; // 移动端降低高度
  }

  .hero {
    margin-top: 25vh;
    padding: 1.8rem 1rem 1.2rem;

    .hero-inner {
      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }
  }

  .container {
    padding: 0 1rem 2rem;
  }

  .uploader {
    border-radius: 14px;

    .uploader-head {
      padding: 1rem 1.2rem;
    }

    .upload-form {
      padding: 1.5rem;
    }
  }

  .list {
    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.2rem;

      h2 {
        font-size: 1.4rem;
      }
    }

    .items {
      max-height: 55vh;

      .item {
        padding: 1.2rem;

        .meta {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;

          .right {
            width: 100%;
            justify-content: space-between;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .carousel1 {
    display: none;
  }

  .carousel2 {
    display: block;
    height: 45vh;
  }

  .hero {
    margin-top: 20vh;
    padding: 1.5rem 0.8rem 1rem;

    .hero-inner {
      h1 {
        font-size: 1.8rem;
        letter-spacing: 1px;
      }

      .subtitle {
        font-size: 0.95rem;
        letter-spacing: 0.5px;
      }
    }
  }

  .upload-form {
    .row {
      flex-direction: column;
      gap: 0.8rem;
    }

    .actions {
      .btn.primary {
        padding: 0.8rem 2rem;
        width: 100%;
      }
    }
  }

  .list {
    .items {
      .item {
        .meta {
          .left {
            flex-wrap: wrap;
            gap: 0.6rem;
          }
        }
      }
    }
  }
}


</style>