<template>
  <div id="app">
    <transition name="fade" v-if="showIntro">
      <div class="intro-container" @click="showIntro = false">
        <video
          class="video-background"
          :src="videoSrc"
          autoplay
          muted
          loop
          playsinline
        ></video>
        <div class="intro-content" aria-live="polite">
          <div class="intro-inner">
            <!-- 打字机展示的随机语句 -->
            <div class="typewriter-wrap">
              <p class="typewriter">
                {{ displayText }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-else>
      <navbar />

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterView } from "vue-router";
import navbar from "@/components/navbar.vue";

const showIntro = ref(true);
const videoSrc = ref(""); // 新增
const lines = [
  "愿我流血时，仍不忘为何而举剑。欢迎来到七丘城，战士。",
  "铁砧与冠冕，皆是我走过的路。愿你能在此找到自己的方向。",
  "从法比亚纳的余烬中，我们重建家园。欢迎你，同行者。",
  "每一块凡铁都渴望成为利器，正如每个灵魂都寻求归宿。",
  "七丘城的炉火永不熄灭，正如守护的誓言永不凋零。",
  "黑潮终将退散，而信念长存。愿我的故事能给你力量。",
  "我以铁匠的锤与战士的剑起誓：此地，即为庇护之所。",
  "冠冕之重，我一人承担足矣。而你，只需挺直脊梁前行。",
  "听见了吗？那是法比亚纳的风，仍在诉说着不屈的故事。",
  "我的剑为你开辟道路，但真正的力量，在你心中。",
  "橡果虽小，却孕育参天大树。欢迎你，未来的希望。",
  "在淬火中重生，在锤炼中坚强。这就是我的道路。",
  "七丘城不只是一处要塞，更是所有流浪者的归所。",
  "我并非生而为王，只是选择承担必须承担的重任。",
  "若你感到迷茫，不妨听听铁砧的节奏——那是生命的韵律。",
  "我守护的不是王座，而是每一个平凡的梦想。",
  "火焰会熄灭，钢铁会锈蚀，但意志永恒。",
  "不必仰望我的冠冕，我们同样从平凡中崛起。",
  "今天的淬炼，是为了明日更坚韧的站立。欢迎。",
  "在此，你可以放下戒备。七丘城即是你的盾牌。",
] as const;

const displayText = ref("");

let typingTimer: number | null = null;

/* 打字机参数 */
const typingSpeed = 150; // 每字符间隔 ms

function pickRandomLine(): string {
  const idx = Math.floor(Math.random() * lines.length);
  return lines[idx];
}

/* 逐字打字，完成后启动 5s 隐藏计时（若用户偏好减少动效则直接显示且不自动隐藏） */
function startOnceType(line: string) {
  // 如果用户偏好减少动效，直接显示整句并不启动定时隐藏
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    displayText.value = line;
    return;
  }

  let i = 0;
  typingTimer = window.setInterval(() => {
    i++;
    displayText.value = line.slice(0, i);
    if (i >= line.length) {
      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }
  }, typingSpeed);
}

onMounted(() => {
  // 检测是否为移动端
  const isMobile = window.innerWidth <= 768;
  const folder = isMobile ? "/mp2" : "/mp1";
  // const index = Math.floor(Math.random() * 4) + 1; // 随机 1 或 2
  videoSrc.value = `${folder}/1 (1).mp4`;

  setTimeout(() => {
    showIntro.value = false;
  }, 6000); // 播放动画 4 秒后进入主页

  const line = pickRandomLine();
  // 延迟一点开始打字，视觉更舒适
  setTimeout(() => startOnceType(line), 200);
});

onBeforeUnmount(() => {
  if (typingTimer) clearInterval(typingTimer);
});
</script>

<style scoped lang="scss">
#app {
  position: relative;
  min-height: 100vh;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 欢迎页样式 */
.intro-container {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #111 0%, #000 100%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
}

.intro-content {
  width: 100%;
  box-sizing: border-box;
  padding: 18px 12px;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10;

  .intro-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    transition: opacity 420ms ease, transform 420ms ease;
    opacity: 1;
    transform: translateY(0);

    .typewriter-wrap {
      display: flex;
      align-items: center;
      min-width: 0;

      .typewriter {
        margin: 0;
        font-weight: 700;
        font-size: clamp(36px, 7.6vw, 58px);
        line-height: 1.1;

        background: linear-gradient(90deg, #c64830 0%, #e1d7bd 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 0.2px rgba(0, 0, 0, 0.06);
        text-shadow: 0 6px 18px rgba(60, 15, 29, 0.22);
      }
    }
  }
}

/* PC 横向（桌面）保持并列；移动端竖向 */
@media (max-width: 780px) {
  .intro-inner {
    flex-direction: column;
    gap: 8px;
    align-items: center;
    text-align: center;
  }

  .typewriter {
    font-size: clamp(10px, 5.8vw, 14px);

    max-width: 92vw;
  }
}

.video-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  z-index: 1;
  pointer-events: none;
  /* 避免遮挡点击 */
}

/* 动画定义 */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
