<template>
  <section class="voice-gallery">
    <div class="bg-carousel" aria-hidden="true">
      <transition-group name="bg-fade" tag="div" class="bg-layer">
        <img
          v-for="(src, idx) in activeImages"
          :key="`bg-${idx}-${isMobile ? 'm' : 'd'}`"
          :src="src"
          :class="['bg-img', { active: idx === currentIndex }]"
          alt=""
        />
      </transition-group>
    </div>

    <div class="vg__wrap">
      <header class="vg__header">
        <div class="logo">
          <div class="title-group">
            <h1 class="title">奥古斯塔 · 语音馆</h1>
            <p class="subtitle">和奥古斯塔对话有概率解锁语音彩蛋哦</p>
          </div>
        </div>
      </header>

      <!-- 列表（已解锁放前，未解锁放后） -->
      <ul class="vg__list" role="list">
        <li
          v-for="id in allVoiceIds"
          :key="id"
          class="vg__item"
          :class="{
            unlocked: isUnlocked(id),
            locked: !isUnlocked(id),
            playing: id === currentId,
          }"
        >
          <div class="item__left">
            <div class="index">{{ String(id).padStart(3, "0") }}</div>
            <div class="info">
              <div class="name">语音 {{ String(id).padStart(3, "0") }}</div>
              <div class="note" v-if="isUnlocked(id)">已解锁</div>
              <div class="note note--locked" v-else>未解锁</div>
            </div>
          </div>

          <div class="item__right">
            <button
              class="btn btn--icon"
              :disabled="!isUnlocked(id)"
              @click="playEntry(id)"
              :title="
                isUnlocked(id)
                  ? currentId === id && isPlaying
                    ? '暂停'
                    : '播放'
                  : '尚未解锁'
              "
            >
              <span v-if="!isUnlocked(id)">🔒</span>
              <span v-else-if="currentId === id && isPlaying">❚❚</span>
              <span v-else>▶</span>
            </button>

            <a
              v-if="isUnlocked(id)"
              :href="voicePath(id)"
              :download="`audio_${id}.mp3`"
              title="下载"
            >
              <el-button type="primary" :icon="Download" circle />
            </a>
            <span v-else class="btn btn--hint" aria-hidden="true">—</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Download } from "@element-plus/icons-vue";
/* ================== 配置 ================== */
const TOTAL_VOICES = 15; // 语音总数，按实际替换
const BG_INTERVAL_MS = 4500; // 背景切换间隔（毫秒）
const MOBILE_BREAKPOINT = 720; // 小于这个宽度视为移动端
/* ========================================= */

/* ========== 导入图片资源（Vite：eager） ========== */
/* 横图（用于 PC） */
const modules: Record<string, any> = import.meta.glob(
  "@/assets/images1/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs: string[] = Object.values(modules).map(
  (m: any) => m.default || m
);

/* 竖图（用于移动端） */
const modules2: Record<string, any> = import.meta.glob(
  "@/assets/images2/*.{jpg,png,jpeg,webp}",
  { eager: true }
);
const allSrcs2: string[] = Object.values(modules2).map(
  (m: any) => m.default || m
);

/* 简单洗牌函数 */
function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* 随机取 5 张（若不足 5 张则全部） */
const randomFive = ref<string[]>(
  shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length))
);
const randomFive2 = ref<string[]>(
  shuffle(allSrcs2).slice(0, Math.min(5, allSrcs2.length))
);

/* 轮播索引（共享，但 index 会根据 activeImages 长度做取模） */
const currentIndex = ref(0);
let imgTimer: number | null = null;

/* ========== 设备判断（响应式） ========== */
const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT);
function handleResize() {
  const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
  if (nowMobile !== isMobile.value) {
    isMobile.value = nowMobile;
    // 切换图片组时重置索引以避免越界
    currentIndex.value = 0;
  }
}

/* activeImages 根据 isMobile 返回对应数组 */
const activeImages = computed(() =>
  isMobile.value ? randomFive2.value : randomFive.value
);
/* ========== 语音列表与播放逻辑 ========== */

/* 已解锁集合（由 localStorage.triggeredVoices 提供，数组） */
const unlockedSet = ref<Set<number>>(new Set<number>());

function loadUnlocked() {
  try {
    const raw = localStorage.getItem("triggeredVoices") || "[]";
    const arr = JSON.parse(raw);
    const s = new Set<number>();
    if (Array.isArray(arr)) {
      arr.forEach((v: any) => {
        const n = Number(v);
        if (!Number.isNaN(n)) s.add(n);
      });
    }
    unlockedSet.value = s;
  } catch (e) {
    console.warn("读取 triggeredVoices 失败", e);
    unlockedSet.value = new Set<number>();
  }
}

/* 生成所有 id，并保持已解锁在前、未解锁在后 */
const allIds = Array.from({ length: TOTAL_VOICES }, (_, i) => i);
const allVoiceIds = computed(() => {
  const unlocked = Array.from(unlockedSet.value)
    .filter((n) => allIds.includes(n))
    .sort((a, b) => a - b);
  const locked = allIds.filter((id) => !unlockedSet.value.has(id));
  return [...unlocked, ...locked];
});

/* audio 单例 */
let currentAudio: HTMLAudioElement | null = null;
const currentId = ref<number | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const currentDuration = ref(0);

function createAudio(src?: string) {
  destroyAudio();
  currentAudio = new Audio();
  currentAudio.preload = "auto";
  if (src) currentAudio.src = src;
  currentAudio.addEventListener("timeupdate", onTimeUpdate);
  currentAudio.addEventListener("loadedmetadata", onLoadedMeta);
  currentAudio.addEventListener("ended", onEnded);
  currentAudio.addEventListener("error", onAudioError);
}
function destroyAudio() {
  if (!currentAudio) return;
  try {
    currentAudio.pause();
    currentAudio.removeEventListener("timeupdate", onTimeUpdate);
    currentAudio.removeEventListener("loadedmetadata", onLoadedMeta);
    currentAudio.removeEventListener("ended", onEnded);
    currentAudio.removeEventListener("error", onAudioError);
    currentAudio.src = "";
  } catch (e) {}
  currentAudio = null;
}
function onTimeUpdate() {
  if (currentAudio) currentTime.value = currentAudio.currentTime || 0;
}
function onLoadedMeta() {
  if (currentAudio) currentDuration.value = currentAudio.duration || 0;
}
function onEnded() {
  isPlaying.value = false; /* 不自动下一条 */
}
function onAudioError(e?: any) {
  console.error("audio error", e);
  isPlaying.value = false;
}

function voicePath(id: number) {
  return `/voice/audio (${id}).mp3`;
}
function isUnlocked(id: number) {
  return unlockedSet.value.has(id);
}

async function playEntry(id: number) {
  if (!isUnlocked(id)) return;
  // 同一条 -> 切换暂停/恢复
  if (currentId.value === id && isPlaying.value) {
    currentAudio?.pause();
    isPlaying.value = false;
    return;
  }
  if (currentId.value === id && !isPlaying.value && currentAudio) {
    try {
      await currentAudio.play();
      isPlaying.value = true;
    } catch (e) {
      console.warn(e);
    }
    return;
  }

  // 新条目
  currentId.value = id;
  createAudio(voicePath(id));
  try {
    await currentAudio!.play();
    isPlaying.value = true;
  } catch (e) {
    console.warn("播放被阻止或失败", e);
    isPlaying.value = false;
  }
}

/* ========== 背景轮播控制 ========== */
function startBgTimer() {
  stopBgTimer();
  imgTimer = window.setInterval(() => {
    const len = Math.max(1, activeImages.value.length);
    // 保证在当前 activeImages 长度范围内循环
    currentIndex.value = (currentIndex.value + 1) % len;
  }, BG_INTERVAL_MS);
}
function stopBgTimer() {
  if (imgTimer !== null) {
    clearInterval(imgTimer);
    imgTimer = null;
  }
}

/* 监听 storage 事件（跨 tab 更新） */
function onStorage(e: StorageEvent) {
  if (e.key === "triggeredVoices") loadUnlocked();
}

/* 生命周期 */
onMounted(() => {
  loadUnlocked();
  window.addEventListener("storage", onStorage);
  window.addEventListener("resize", handleResize);

  // 如果数组为空（没有图片），也避免报错：确保至少有一个占位空数组
  if (!randomFive.value.length && allSrcs.length)
    randomFive.value = shuffle(allSrcs).slice(0, Math.min(5, allSrcs.length));
  if (!randomFive2.value.length && allSrcs2.length)
    randomFive2.value = shuffle(allSrcs2).slice(
      0,
      Math.min(5, allSrcs2.length)
    );

  // 启动轮播
  startBgTimer();
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("resize", handleResize);
  stopBgTimer();
  destroyAudio();
});

/* 监听 activeImages 长度变化（切换设备时重置 index 并保持循环） */
watch(activeImages, (nv) => {
  currentIndex.value = 0;
});
</script>

<style lang="scss" scoped>
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

@keyframes ripple {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.voice-gallery {
  position: relative;
  min-height: 100vh;
  font-family: "PingFang SC", "Noto Sans SC", system-ui, -apple-system,
    "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: $color-text-primary;
  overflow: hidden;
  padding: 2rem 1.5rem;
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
  -webkit-font-smoothing: antialiased;

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

// 背景轮播层
.bg-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;

  .bg-layer {
    position: absolute;
    inset: 0;

    .bg-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0;
      transform: scale(1.02);
      transition: opacity 1.2s ease, transform 1.2s ease;
      pointer-events: none;
      filter: brightness(0.5) contrast(1.1) saturate(1.2) hue-rotate(-5deg);

      &.active {
        opacity: 0.15;
        transform: scale(1);
      }
    }
  }
}

// 前景容器
.vg__wrap {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(26, 14, 20, 0.85) 0%,
    rgba(16, 8, 14, 0.85) 100%
  );
  backdrop-filter: blur(8px);
  border: 1px solid rgba(198, 72, 48, 0.25);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(198, 72, 48, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

// 头部
.vg__header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 2px solid rgba(198, 72, 48, 0.3);

  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;

    .title-group {
      .title {
        margin: 0;
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: 1px;
        background: linear-gradient(
          135deg,
          $color-secondary-glow 0%,
          $color-primary-glow 50%,
          $color-text-primary 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(198, 72, 48, 0.3);
        position: relative;
        animation: float 6s ease-in-out infinite;

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
        margin: 0.5rem 0 0;
        color: $color-text-secondary;
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
    }
  }
}

// 列表区域
.vg__list {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: calc(100vh - 250px);
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
    background: linear-gradient(
      to bottom,
      $color-primary-glow,
      $color-blood-shadow
    );
    border-radius: 4px;
    border: 1px solid rgba(255, 212, 96, 0.2);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #d85c40, $color-primary-glow);
  }
}

// 卡片项
.vg__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    rgba(26, 14, 20, 0.8) 0%,
    rgba(16, 8, 14, 0.8) 100%
  );
  border: 1px solid rgba(198, 72, 48, 0.2);
  backdrop-filter: blur(5px);
  transition: all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
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
      rgba(255, 212, 96, 0.08),
      transparent
    );
    transition: left 0.8s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(198, 72, 48, 0.4);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(198, 72, 48, 0.2);

    &::before {
      left: 100%;
    }
  }

  &.unlocked {
    .item__left .index {
      background: linear-gradient(
        135deg,
        $color-primary-glow 0%,
        #b03c28 50%,
        $color-secondary-glow 100%
      );
      color: $color-text-primary;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }

    .item__left .note {
      color: $color-secondary-glow;
    }
  }

  &.locked {
    opacity: 0.6;
    filter: grayscale(0.3);

    .item__left .index {
      background: linear-gradient(
        135deg,
        rgba(26, 14, 20, 0.9) 0%,
        rgba(16, 8, 14, 0.9) 100%
      );
      color: rgba(225, 215, 189, 0.5);
      border-color: rgba(225, 215, 189, 0.1);
    }

    .item__left .note {
      color: rgba(225, 215, 189, 0.4);
    }
  }

  &.playing {
    animation: pulse 2s infinite;
    border-color: rgba(255, 212, 96, 0.4);
    background: linear-gradient(
      135deg,
      rgba(198, 72, 48, 0.15) 0%,
      rgba(139, 0, 26, 0.1) 100%
    );

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-primary-glow;
      box-shadow: 0 0 10px $color-primary-glow, 0 0 20px $color-primary-glow;
      animation: ripple 1.5s infinite;
    }
  }

  .item__left {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .index {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
      border: 2px solid rgba(198, 72, 48, 0.3);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }

    .info {
      .name {
        color: $color-text-primary;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.3rem;
      }

      .note {
        color: $color-text-secondary;
        font-size: 0.9rem;
        font-weight: 500;

        &--locked {
          color: rgba(225, 215, 189, 0.5);
        }
      }
    }
  }

  .item__right {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .btn {
      &--icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        border: 1px solid rgba(198, 72, 48, 0.3);
        background: linear-gradient(
          135deg,
          rgba(26, 14, 20, 0.9) 0%,
          rgba(16, 8, 14, 0.9) 100%
        );
        color: $color-text-primary;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
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

        &:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            rgba(198, 72, 48, 0.2) 0%,
            rgba(139, 0, 26, 0.2) 100%
          );
          transform: translateY(-2px) scale(1.05);

          &::before {
            left: 100%;
          }
        }

        &:active:not(:disabled) {
          transform: translateY(0) scale(1);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: linear-gradient(
            135deg,
            rgba(26, 14, 20, 0.6) 0%,
            rgba(16, 8, 14, 0.6) 100%
          );
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      }

      &--hint {
        color: rgba(225, 215, 189, 0.3);
        font-size: 1.2rem;
      }
    }

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: linear-gradient(
        135deg,
        $color-primary-glow 0%,
        #b03c28 30%,
        $color-blood-shadow 70%,
        #8b001a 100%
      );
      border: none;
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
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 5px 20px rgba(198, 72, 48, 0.4);

        &::before {
          left: 100%;
        }

        .el-button {
          transform: scale(1.1);
        }
      }

      &:active {
        transform: translateY(0) scale(1);
      }

      .el-button {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        color: $color-text-primary;
        transition: transform 0.3s ease;

        :deep(svg) {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

// 背景过渡动画
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 1.2s ease, transform 1.2s ease;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.bg-fade-enter-to,
.bg-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

// 响应式设计
@media (max-width: 768px) {
  .voice-gallery {
    padding: 1rem;
    padding-top: 4rem;
  }

  .vg__wrap {
    padding: 1rem;
    border-radius: 12px;
  }

  .vg__header {
    margin-bottom: 1.5rem;

    .logo {
      .title-group {
        .title {
          font-size: 1.6rem;
        }

        .subtitle {
          font-size: 0.9rem;
        }
      }
    }
  }

  .vg__item {
    padding: 1rem;

    .item__left {
      .index {
        width: 50px;
        height: 50px;
        font-size: 1rem;
      }

      .info {
        .name {
          font-size: 1rem;
        }

        .note {
          font-size: 0.8rem;
        }
      }
    }

    .item__right {
      .btn--icon {
        width: 45px;
        height: 45px;
      }

      a {
        width: 45px;
        height: 45px;
      }
    }
  }
}

@media (max-width: 480px) {
  .vg__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    .item__left {
      width: 100%;
    }

    .item__right {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>