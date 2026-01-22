<template>
  <div class="wiki-page">
    <!-- 背景轮播放在最底层 -->
    <div class="carousel">
      <img
        v-for="(src, idx) in randomFive"
        :key="idx"
        :src="src"
        class="carousel-image"
        :class="{ active: idx === currentIndex }"
      />
    </div>
    <header class="wiki-header">
      <div class="title">
        <h1>奥古斯塔文本分享</h1>
        <p class="subtitle">铁与火铸就的文字，冠冕与基石间的叙事</p>
      </div>
      <div class="actions">
        <input
          v-model="search"
          class="search"
          placeholder="搜索标题或者标签..."
        />
        <button class="btn btn-new" @click="openCreate">新建词条</button>
      </div>
    </header>

    <main class="wiki-body">
      <div v-if="filteredEntries.length === 0" class="empty">
        没有找到匹配的词条 ✨
      </div>

      <ul class="entry-list">
        <li v-for="entry in filteredEntries" :key="entry.id" class="entry-card">
          <div class="entry-head">
            <div class="entry-meta" @click="openDetail(entry)">
              <div class="entry-title-wrap">
                <h2 class="entry-title">{{ entry.title }}</h2>
                <span class="entry-badge">#{{ entry.slug || "未设置" }}</span>
              </div>
              <div class="entry-info">
                <span class="meta-item">作者：{{ entry.author }}</span>
                <span class="meta-item"
                  >时间：{{ formatTime(entry.updatedAt) }}</span
                >
              </div>
            </div>

            <div class="entry-actions">
              <button
                class="like"
                :class="{ active: isLiked(entry.id) }"
                :aria-pressed="isLiked(entry.id)"
                @click.stop="toggleLike(entry.id)"
              >
                <img
                  :src="
                    isLiked(entry.id)
                      ? '/icons/heart-red-filled.svg'
                      : '/icons/heart-red-outline.svg'
                  "
                  alt="like"
                />
                <span class="like-count">{{ entry.likes }}</span>
              </button>
              <div class="edit-delete" v-if="canEdit(entry.id)">
                <button class="small" @click="openEdit(entry)">编辑</button>
                <button class="small danger" @click="remove(entry.id)">
                  删除
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </main>

    <!-- Edit/Create Modal -->
    <transition name="fade-zoom">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal">
          <header class="modal-header">
            <h3>{{ editing ? "编辑词条" : "新建词条" }}</h3>
            <button class="close" @click="closeModal">✕</button>
          </header>
          <section class="modal-body">
            <label>
              标题
              <input v-model="form.title" placeholder="输入标题" />
            </label>

            <label>
              词条（短标签）
              <input
                v-model="form.slug"
                placeholder="比如：彩蛋、考据、点位等等"
              />
            </label>

            <label>
              作者
              <input v-model="form.author" placeholder="作者昵称" />
            </label>

            <label>
              内容
              <textarea
                v-model="form.content"
                rows="8"
                placeholder="在这里输入词条内容"
              ></textarea>
            </label>
          </section>
          <footer class="modal-footer">
            <button class="btn ghost" @click="closeModal">取消</button>
            <button class="btn" @click="submit">
              {{ editing ? "保存" : "创建" }}
            </button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- Detail Modal -->
    <transition name="fade-zoom">
      <div class="modal-overlay" v-if="detailEntry">
        <div class="modal detail-modal">
          <header class="modal-header">
            <h3>{{ detailEntry.title }}</h3>
            <button class="close" @click="detailEntry = null">✕</button>
          </header>
          <section class="modal-body">
            <div class="detail-content">{{ detailEntry.content }}</div>
          </section>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import {
  getWikiList,
  createWiki,
  updateWiki,
  deleteWiki,
  likeWiki,
} from "@/api/modules/wiki";

// 本地存储自己创建的词条 ID
const LS_MY_WIKI_IDS = "yuzuriha:wiki:my_ids";
const myWikiIds: string[] = JSON.parse(
  localStorage.getItem(LS_MY_WIKI_IDS) || "[]"
);
const markAsMine = (id: string | number) => {
  if (!myWikiIds.includes(String(id))) {
    myWikiIds.push(String(id));
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
  }
};
const canEdit = (id: string | number) => myWikiIds.includes(String(id));

// 数据状态
const entries = ref<any[]>([]);

// 本地存储键
const LS_LIKED_IDS = "yuzuriha:wiki:liked_ids";
// 从 localStorage 读取已点赞 id 列表（字符串形式）
const likedIds = ref<string[]>(
  JSON.parse(localStorage.getItem(LS_LIKED_IDS) || "[]")
);

const showModal = ref(false);
const editing = ref(false);
const editingId = ref<string | number | null>(null);
const detailEntry = ref<any>(null);
const form = reactive({ title: "", slug: "", author: "", content: "" });
const search = ref("");

// 时间格式化
function formatTime(ts: string | number | null | undefined) {
  if (!ts) return "未知时间";
  const date = new Date(ts);
  if (isNaN(date.getTime())) return "未知时间";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// 加载词条列表
async function loadEntries() {
  try {
    const res: any = await getWikiList();
    entries.value = res.data.map((e: any) => ({
      ...e,
      createdAt: e.createdAt || e.created_at,
      updatedAt: e.updatedAt || e.updated_at,
    }));
  } catch (err) {
    console.error(err);
    ElMessage.error("加载词条失败");
  }
}

// 打开/关闭弹窗
function openCreate() {
  editing.value = false;
  editingId.value = null;
  form.title = "";
  form.slug = "";

  form.content = "";
  showModal.value = true;
}
function openEdit(entry: any) {
  if (!canEdit(entry.id)) {
    ElMessage.warning("只有创建者可以编辑");
    return;
  }
  editing.value = true;
  editingId.value = entry.id;
  form.title = entry.title;
  form.slug = entry.slug;
  form.author = entry.author;
  form.content = entry.content;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

const canSubmit = computed(() => form.title.trim() && form.content.trim());

// 提交
async function submit() {
  if (!canSubmit.value) {
    ElMessage.warning("请填写标题和内容");
    return;
  }
  const payload = {
    title: form.title.trim(),
    author: form.author.trim() || "匿名",
    content: form.content.trim(),
    slug: null,
  };
  if (form.slug.trim()) payload.slug = form.slug.trim();
  try {
    if (editing.value && editingId.value) {
      await updateWiki(editingId.value, payload);
      ElMessage.success("编辑成功");
    } else {
      const res: any = await createWiki(payload);
      markAsMine(res.data.id);
      editingId.value = res.data.id;
      ElMessage.success("创建成功");
    }
    showModal.value = false;
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("提交失败");
  }
}

// 删除
async function remove(id: string | number) {
  if (!canEdit(id)) {
    ElMessage.warning("只有创建者可以删除");
    return;
  }
  if (!confirm("确认删除该词条？此操作不可撤销")) return;
  try {
    await deleteWiki(id);
    const index = myWikiIds.indexOf(String(id));
    if (index !== -1) myWikiIds.splice(index, 1);
    localStorage.setItem(LS_MY_WIKI_IDS, JSON.stringify(myWikiIds));
    ElMessage.success("删除成功");
    loadEntries();
  } catch (err) {
    console.error(err);
    ElMessage.error("删除失败");
  }
}

// 点赞
function persistLikedIds() {
  try {
    localStorage.setItem(LS_LIKED_IDS, JSON.stringify(likedIds.value));
  } catch (e) {
    console.warn("保存 likedIds 失败", e);
  }
}

// 判断是否已点赞（供模板绑定 class/aria-pressed）
function isLiked(id: string | number) {
  return likedIds.value.includes(String(id));
}

// 点赞 / 取消点赞（乐观更新，本地仅存 id，点赞数使用 entry.likes）
async function toggleLike(id: string | number) {
  const entry = entries.value.find((e) => e.id === id);
  if (!entry) return;

  const idStr = String(id);
  const wasLiked = likedIds.value.includes(idStr);

  // 乐观更新 UI（立即反映）
  if (wasLiked) {
    // 取消点赞：保证不低于 0
    entry.likes = Math.max(0, (entry.likes || 0) - 1);
    likedIds.value = likedIds.value.filter((x) => x !== idStr);
  } else {
    // 点赞
    entry.likes = (entry.likes || 0) + 1;
    likedIds.value.push(idStr);
  }
  persistLikedIds();

  try {
    // 调用后端（action: 'like' | 'unlike' | 'toggle'）
    // 我们明确传 'like' 或 'unlike'
    const action = wasLiked ? "unlike" : "like";
    await likeWiki(id, action);

    // 可选：如果后端在响应中返回了最新的 likes 数（res.data.likes），
    // 你可以在这里用后端值覆盖本地（示例注释）
    // const res = await likeWiki(id, action)
    // if (res?.data?.likes !== undefined) entry.likes = res.data.likes
  } catch (err) {
    // 出错则回滚乐观更新
    console.error("toggleLike error", err);
    if (wasLiked) {
      // 取消点赞失败 -> 重新标记为已点赞
      entry.likes = (entry.likes || 0) + 1;
      if (!likedIds.value.includes(idStr)) likedIds.value.push(idStr);
    } else {
      // 点赞失败 -> 取消之前增加的 count
      entry.likes = Math.max(0, (entry.likes || 0) - 1);
      likedIds.value = likedIds.value.filter((x) => x !== idStr);
    }
    persistLikedIds();
    ElMessage.error("点赞失败，请稍后重试");
  }
}

// 详情弹窗
async function openDetail(entry: any) {
  detailEntry.value = entry;
}

// 搜索过滤
const filteredEntries = computed(() => {
  const q = String(search.value || "")
    .trim()
    .toLowerCase();
  let list = entries.value;

  // 搜索过滤
  if (q) {
    list = list.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.slug || "").toLowerCase().includes(q)
    );
  }

  // 按点赞数排序（默认降序：点赞多的在前）
  return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
});

// 1. 分别导入两套图
const pcModules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg,webp}", {
  eager: true,
});
const mobileModules = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);

const pcSrcs: string[] = Object.values(pcModules).map((m: any) => m.default);
const mobileSrcs: string[] = Object.values(mobileModules).map(
  (m: any) => m.default
);

// 洗牌函数
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const randomFive = ref<string[]>([]);
const currentIndex = ref(0);
let timer: number;

function pickImages() {
  const isMobile = window.innerWidth < 768;
  const all = isMobile ? mobileSrcs : pcSrcs;
  randomFive.value = shuffle(all).slice(0, 5);
}

onMounted(() => {
  loadEntries();
  pickImages(); // 首次判断
  // 监听窗口大小变化
  window.addEventListener("resize", pickImages);

  // 轮播
  timer = window.setInterval(() => {
    if (randomFive.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % randomFive.value.length;
    }
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", pickImages);
});
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

// 衍生颜色
$bg-gradient-start: #040206;
$bg-gradient-end: #1c1018;
$card-bg: rgba(26, 14, 20, 0.85);
$glass-bg: rgba(6, 4, 8, 0.8);
$hover-glow: rgba(198, 72, 48, 0.2);
$active-glow: rgba(255, 212, 96, 0.25);
$accent-fade: rgba(139, 0, 26, 0.3);

// 动画定义
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

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes fade-zoom {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.wiki-page {
  min-height: 100vh;
  color: $color-text-primary;
  padding: 1.5rem;
  padding-top: 5rem;
  background: 
    // 深空背景
    linear-gradient(135deg, $bg-gradient-start 0%, $bg-gradient-end 100%),
    // 电光纹理
    repeating-linear-gradient(
        45deg,
        transparent,
        transparent 1px,
        rgba(198, 72, 48, 0.03) 1px,
        rgba(198, 72, 48, 0.03) 3px
      ),
    // 血影纹理
    repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 2px,
        rgba(139, 0, 26, 0.02) 2px,
        rgba(139, 0, 26, 0.02) 4px
      );
  position: relative;
  overflow-x: hidden;

  // 电光背景效果
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 15% 20%,
        rgba(198, 72, 48, 0.08) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 85% 70%,
        rgba(255, 212, 96, 0.05) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 50% 30%,
        rgba(139, 0, 26, 0.06) 0%,
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
        rgba(198, 72, 48, 0.15) 25%,
        rgba(255, 212, 96, 0.08) 50%,
        rgba(198, 72, 48, 0.15) 75%,
        transparent 100%
      )
      border-box;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }
}

// 轮播背景
.carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;

  .carousel-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0;
    transition: opacity 1.2s ease-in-out;
    filter: brightness(0.4) contrast(1.1) saturate(1.2) hue-rotate(-5deg);

    &.active {
      opacity: 1;
    }
  }
}

// 页面头部
.wiki-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgba(26, 14, 20, 0.3) 0%,
    rgba(16, 8, 14, 0.4) 100%
  );
  backdrop-filter: blur(4px);
  border: 1px solid rgba(198, 72, 48, 0.25);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(198, 72, 48, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  .title {
    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: 1px;
      background: linear-gradient(
        135deg,
        $color-text-primary 0%,
        $color-secondary-glow 50%,
        $color-primary-glow 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(198, 72, 48, 0.3);
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 80px;
        height: 3px;
        background: linear-gradient(
          90deg,
          $color-primary-glow,
          $color-secondary-glow,
          transparent
        );
        filter: blur(1px);
        animation: electric-pulse 3s infinite;
      }
    }

    .subtitle {
      margin: 0;
      color: $color-text-secondary;
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    .search {
      padding: 0.6rem 1rem;
      background: rgba(6, 4, 8, 0.8);
      border: 1px solid rgba(198, 72, 48, 0.2);
      border-radius: 12px;
      color: $color-text-primary;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.3s ease;
      width: 250px;
      backdrop-filter: blur(5px);

      &::placeholder {
        color: rgba(225, 215, 189, 0.5);
      }

      &:focus {
        border-color: $color-primary-glow;
        box-shadow: 0 0 0 3px rgba(198, 72, 48, 0.2);
      }

      &:hover:not(:focus) {
        border-color: rgba(198, 72, 48, 0.3);
      }
    }

    .btn-new {
      padding: 0.7rem 1.5rem;
      background: linear-gradient(
        135deg,
        $color-primary-glow 0%,
        #b03c28 30%,
        $color-blood-shadow 70%,
        #8b001a 100%
      );
      border: none;
      border-radius: 12px;
      color: $color-text-primary;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

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

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(198, 72, 48, 0.4),
          0 0 15px rgba(139, 0, 26, 0.3);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 主体内容
.wiki-body {
  position: relative;
  z-index: 10;

  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: $color-text-secondary;
    font-size: 1.1rem;
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.6) 0%,
      rgba(16, 8, 14, 0.6) 100%
    );
    border-radius: 14px;
    border: 2px dashed rgba(198, 72, 48, 0.3);
    animation: electric-pulse 5s infinite;
  }
}

// 词条列表
.entry-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.2rem;

  .entry-card {
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.3) 0%,
      rgba(16, 8, 14, 0.4) 100%
    );
    border: 1px solid rgba(198, 72, 48, 0.2);
    border-radius: 14px;
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
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
      transform: translateY(-5px);
      border-color: rgba(198, 72, 48, 0.4);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(198, 72, 48, 0.3);

      &::before {
        left: 100%;
      }
    }

    .entry-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      position: relative;
      z-index: 1;

      .entry-meta {
        flex: 1;
        cursor: pointer;
        min-width: 0;

        .entry-title-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.8rem;
          flex-wrap: wrap;

          .entry-title {
            margin: 0;
            color: $color-text-primary;
            font-size: 1.2rem;
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .entry-badge {
            background: linear-gradient(
              135deg,
              rgba(198, 72, 48, 0.25) 0%,
              rgba(139, 0, 26, 0.25) 100%
            );
            border: 1px solid rgba(255, 212, 96, 0.2);
            color: $color-secondary-glow;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            white-space: nowrap;
            backdrop-filter: blur(5px);
          }
        }

        .entry-info {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;

          .meta-item {
            color: $color-text-secondary;
            font-size: 0.9rem;
            font-weight: 500;
            background: rgba(6, 4, 8, 0.4);
            padding: 0.3rem 0.8rem;
            border-radius: 8px;
            border: 1px solid rgba(225, 215, 189, 0.1);
          }
        }
      }

      .entry-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;

        .like {
          background: transparent;
          border: 1px solid rgba(198, 72, 48, 0.3);
          border-radius: 10px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(225, 215, 189, 0.9);
          background: rgba(198, 72, 48, 0.1);
          position: relative;
          overflow: hidden;

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
            transform: translateY(-2px);
            border-color: rgba(198, 72, 48, 0.5);

            &::before {
              left: 100%;
            }
          }

          &.active {
            animation: pulse 2s infinite;
            background: rgba(198, 72, 48, 0.25);
            border-color: $color-primary-glow;

            img {
              filter: brightness(1.3)
                drop-shadow(0 0 5px rgba(198, 72, 48, 0.9));
            }

            .like-count {
              color: $color-primary-glow;
              font-weight: 800;
              text-shadow: 0 0 5px rgba(198, 72, 48, 0.5);
            }
          }

          img {
            width: 18px;
            height: 18px;
            display: block;
            filter: brightness(0.9);
            transition: transform 0.3s ease;
          }

          .like-count {
            transition: all 0.3s ease;
            font-size: 0.95rem;
          }
        }

        .edit-delete {
          display: flex;
          gap: 0.5rem;

          .small {
            padding: 0.5rem 0.8rem;
            background: linear-gradient(
              135deg,
              rgba(26, 14, 20, 0.9) 0%,
              rgba(16, 8, 14, 0.9) 100%
            );
            border: 1px solid rgba(198, 72, 48, 0.3);
            border-radius: 8px;
            color: $color-text-secondary;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: linear-gradient(
                135deg,
                rgba(198, 72, 48, 0.2) 0%,
                rgba(139, 0, 26, 0.2) 100%
              );
              transform: translateY(-2px);
            }

            &.danger {
              color: #ff6b85;
              border-color: rgba(139, 0, 26, 0.3);
              background: rgba(139, 0, 26, 0.1);

              &:hover {
                background: rgba(139, 0, 26, 0.2);
              }
            }
          }
        }
      }
    }
  }
}

// 模态框
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 4, 8, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;

  .modal {
    width: 100%;
    max-width: 800px;
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.95) 0%,
      rgba(16, 8, 14, 0.95) 100%
    );
    backdrop-filter: blur(10px);
    border: 1px solid rgba(198, 72, 48, 0.3);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(198, 72, 48, 0.2);
    animation: fade-zoom 0.3s ease;

    &.detail-modal {
      max-width: 700px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(198, 72, 48, 0.2);
      background: linear-gradient(
        135deg,
        rgba(26, 14, 20, 0.95) 0%,
        rgba(16, 8, 14, 0.95) 100%
      );

      h3 {
        margin: 0;
        color: $color-text-primary;
        font-size: 1.3rem;
        font-weight: 700;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(
            90deg,
            $color-primary-glow,
            $color-secondary-glow
          );
          border-radius: 1px;
        }
      }

      .close {
        background: transparent;
        border: 1px solid rgba(198, 72, 48, 0.3);
        color: $color-text-primary;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(198, 72, 48, 0.2);
          transform: rotate(90deg);
        }
      }
    }

    .modal-body {
      padding: 2rem;
      max-height: 70vh;
      overflow-y: auto;

      // 自定义滚动条
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(6, 4, 8, 0.6);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(
          to bottom,
          $color-primary-glow,
          $color-blood-shadow
        );
        border-radius: 4px;
        border: 1px solid rgba(255, 212, 96, 0.2);
      }

      .detail-content {
        color: $color-text-secondary;
        font-size: 1rem;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      label {
        display: block;
        margin-bottom: 1.2rem;
        color: $color-text-primary;
        font-weight: 600;
        font-size: 0.95rem;

        input,
        textarea {
          width: 100%;
          padding: 0.8rem 1rem;
          margin-top: 0.5rem;
          background: rgba(6, 4, 8, 0.8);
          border: 1px solid rgba(198, 72, 48, 0.2);
          border-radius: 10px;
          color: $color-text-primary;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);

          &::placeholder {
            color: rgba(225, 215, 189, 0.5);
          }

          &:focus {
            border-color: $color-primary-glow;
            box-shadow: 0 0 0 3px rgba(198, 72, 48, 0.2);
          }
        }

        textarea {
          resize: vertical;
          min-height: 150px;
          line-height: 1.5;
        }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(198, 72, 48, 0.2);
      background: linear-gradient(
        135deg,
        rgba(26, 14, 20, 0.95) 0%,
        rgba(16, 8, 14, 0.95) 100%
      );

      .btn {
        padding: 0.7rem 1.8rem;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &.ghost {
          background: linear-gradient(
            135deg,
            rgba(26, 14, 20, 0.9) 0%,
            rgba(16, 8, 14, 0.9) 100%
          );
          border: 1px solid rgba(198, 72, 48, 0.3);
          color: $color-text-primary;

          &:hover {
            background: linear-gradient(
              135deg,
              rgba(198, 72, 48, 0.2) 0%,
              rgba(139, 0, 26, 0.2) 100%
            );
            transform: translateY(-2px);
          }
        }

        &:not(.ghost) {
          background: linear-gradient(
            135deg,
            $color-primary-glow 0%,
            #b03c28 30%,
            $color-blood-shadow 70%,
            #8b001a 100%
          );
          border: none;
          color: $color-text-primary;
          position: relative;
          overflow: hidden;

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

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(198, 72, 48, 0.4);

            &::before {
              left: 100%;
            }
          }
        }
      }
    }
  }
}

// 过渡动画
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

// 响应式设计
@media (max-width: 768px) {
  .wiki-page {
    padding: 1rem;
    padding-top: 4rem;
  }

  .wiki-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;

    .actions {
      flex-direction: column;

      .search {
        width: 100%;
      }
    }
  }

  .entry-head {
    flex-direction: column;
    gap: 1.2rem;

    .entry-meta {
      width: 100%;
    }

    .entry-actions {
      width: 100%;
      justify-content: space-between;
    }
  }

  .modal {
    .modal-body {
      padding: 1.5rem;
      max-height: 60vh;
    }

    .modal-header,
    .modal-footer {
      padding: 1.2rem 1.5rem;
    }
  }
}

@media (max-width: 480px) {
  .entry-info {
    flex-direction: column;
    gap: 0.6rem;
  }

  .entry-actions {
    flex-direction: column;
    gap: 1rem;

    .edit-delete {
      width: 100%;
      justify-content: space-between;

      .small {
        flex: 1;
      }
    }
  }
}
</style>