<template>
  <div id="app">
    <transition name="forge-fade" v-if="showIntro">
      <div
        class="augusta-intro"
        @click="showIntro = false"
        role="presentation"
        aria-label="奥古斯塔欢迎页面"
      >
        <!-- 优化后的背景层级 -->
        <div class="augusta-bg-layers">
          <div class="bg-layer deep-space"></div>
          <div class="bg-layer metal-grid"></div>
          <div class="bg-layer video-container">
            <video
              class="augusta-video-bg"
              :src="videoSrc"
              autoplay
              muted
              loop
              playsinline
              aria-hidden="true"
            ></video>
            <div class="video-overlay"></div>
          </div>
          <div class="bg-layer glow-pulse"></div>
          <div class="bg-layer dust-particles"></div>
        </div>

        <!-- 徽章容器 -->
        <div class="sigil-container">
          <div class="seven-hills-sigil" aria-hidden="true">
            <div class="sigil-inner">
              <svg class="sigil-svg" viewBox="0 0 100 100">
                <path
                  d="M50 10 L90 30 L80 70 L20 70 L10 30 Z"
                  class="sigil-outline"
                />
                <circle cx="50" cy="50" r="15" class="sigil-core" />
                <path d="M50 35 L65 65 L35 65 Z" class="sigil-inner" />
              </svg>
              <div class="sigil-glow"></div>
            </div>
            <div class="sigil-title">VII COLLES</div>
          </div>
        </div>

        <!-- 主内容区域 - 优化布局结构 -->
        <main class="augusta-content" aria-live="polite">
          <div class="content-inner">
            <!-- 左侧装饰 -->
            <aside class="decoration-side left-side" aria-label="铁匠之锤装饰">
              <div class="forge-anvil">
                <div class="anvil-top"></div>
                <div class="anvil-body"></div>
              </div>
              <div class="floating-text">
                <span>铁匠之锤</span>
                <span class="accent">FORGE</span>
              </div>
            </aside>

            <!-- 核心文本区域 -->
            <article class="typewriter-augusta">
              <header class="text-line">
                <span class="prefix-mark" aria-hidden="true">⚔</span>
                <div class="typewriter-container">
                  <h1 class="typewriter-text" :data-text="displayText">
                    {{ displayText }}
                  </h1>
                  <div class="typewriter-cursor" aria-hidden="true"></div>
                </div>
                <span class="suffix-mark" aria-hidden="true">⚔</span>
              </header>

              <div class="subtitle">
                <div class="title-divider">
                  <div class="divider-line"></div>
                  <div class="divider-ornament">✦</div>
                  <div class="divider-line"></div>
                </div>
                <span class="subtitle-text"
                  >奥古斯塔 · 七丘城领主 · 法比亚纳幸存者</span
                >
              </div>

              <footer class="quote-source">
                <div class="source-icon">📜</div>
                <span class="source-text">《铁砧与冠冕》· 奥古斯塔语录</span>
              </footer>
            </article>

            <!-- 右侧装饰 -->
            <aside class="decoration-side right-side" aria-label="战士之冠装饰">
              <div class="crown-symbol">
                <div class="crown-base"></div>
                <div class="crown-peak" v-for="n in 5" :key="n"></div>
              </div>
              <div class="floating-text">
                <span>战士之冠</span>
                <span class="accent">CROWN</span>
              </div>
            </aside>
          </div>

          <!-- 交互区域 -->
          <section class="interaction-area">
            <div class="interaction-hint">
              <div class="hint-pulse"></div>
              <div class="hint-content">
                <div class="hint-icon">⚔</div>
                <span class="hint-text">敲击铁砧，进入七丘城</span>
              </div>
            </div>

            <div class="progress-indicator">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: progressWidth + '%' }"
                ></div>
              </div>
              <div class="progress-text">
                初始化中... {{ Math.round(progressWidth) }}%
              </div>
            </div>
          </section>
        </main>
      </div>
    </transition>

    <div v-else class="main-app">
      <navbar />
      <main class="augusta-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { RouterView } from "vue-router";
import navbar from "@/components/navbar.vue";

const showIntro = ref(true);
const videoSrc = ref("");
const progressWidth = ref(0);

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
] as const;

const displayText = ref("");
let typingTimer: number | null = null;
const typingSpeed = 110;

function pickRandomLine(): string {
  const idx = Math.floor(Math.random() * lines.length);
  return lines[idx];
}

function startOnceType(line: string) {
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    displayText.value = line;
    progressWidth.value = 100;
    return;
  }

  let i = 0;
  displayText.value = "";
  progressWidth.value = 0;

  typingTimer = window.setInterval(() => {
    i++;
    displayText.value = line.slice(0, i);
    progressWidth.value = (i / line.length) * 100;

    if (i >= line.length) {
      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
        document.querySelector(".typewriter-cursor")?.classList.add("blinking");
      }
    }
  }, typingSpeed);
}

onMounted(() => {
  const isMobile = window.innerWidth <= 768;
  const folder = isMobile ? "/mp2" : "/mp1";
  const index = Math.floor(Math.random() * 4) + 1;
  videoSrc.value = `${folder}/1 (${index}).mp4`;

  setTimeout(() => {
    showIntro.value = false;
  }, 4500);

  const line = pickRandomLine();
  setTimeout(() => startOnceType(line), 500);
});

onBeforeUnmount(() => {
  if (typingTimer) clearInterval(typingTimer);
});
</script>

<style scoped lang="scss">
/* 优化后的色板 */
$color-deep-night: #0a0508;
$color-metal-dark: #1a0e14;
$color-primary-glow: #e44c32;
$color-secondary-glow: #ffd460;
$color-blood-shadow: #a0001a;
$color-text-primary: #fffaf0;
$color-text-secondary: #e8dfcb;
$color-border-glow: rgba(228, 76, 50, 0.4);
$color-overlay-dark: rgba(6, 4, 8, 0.85);
$color-metal-light: rgba(42, 26, 34, 0.8);

/* 层级变量 */
$z-index-base: 1;
$z-index-bg-layers: 5;
$z-index-video: 6;
$z-index-content: 20;
$z-index-sigil: 25;
$z-index-interaction: 30;

/* 动画过渡优化 */
.forge-fade-enter-active,
.forge-fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.forge-fade-enter-from,
.forge-fade-leave-to {
  opacity: 0;
}

/* 主容器 */
#app {
  position: relative;
  min-height: 100vh;
  background: $color-deep-night;
}

/* 奥古斯塔风格欢迎页 */
.augusta-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  background: $color-deep-night;
}

/* 重构的背景层级系统 */
.augusta-bg-layers {
  position: absolute;
  inset: 0;
  z-index: $z-index-bg-layers;

  .bg-layer {
    position: absolute;
    inset: 0;

    &.deep-space {
      background: radial-gradient(
        ellipse at 30% 40%,
        $color-metal-dark 0%,
        $color-deep-night 70%
      );
    }

    &.metal-grid {
      background-image: linear-gradient(
          rgba($color-primary-glow, 0.05) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba($color-primary-glow, 0.05) 1px,
          transparent 1px
        );
      background-size: 60px 60px;
      mask: radial-gradient(circle at center, transparent 30%, black 80%);
      opacity: 0.5;
    }

    &.video-container {
      z-index: $z-index-video;

      .augusta-video-bg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.6;
        filter: contrast(1.2) brightness(0.8) sepia(0.3) hue-rotate(-5deg);
      }

      .video-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba($color-deep-night, 0.7) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 20% 30%,
            transparent 30%,
            rgba($color-deep-night, 0.8) 70%
          );
      }
    }

    &.glow-pulse {
      background: radial-gradient(
        circle at 50% 50%,
        rgba($color-primary-glow, 0.15) 0%,
        transparent 70%
      );
      animation: pulse-glow 8s ease-in-out infinite;
    }

    &.dust-particles {
      background-image: radial-gradient(
          circle at 20% 30%,
          rgba($color-secondary-glow, 0.02) 1px,
          transparent 1px
        ),
        radial-gradient(
          circle at 80% 70%,
          rgba($color-primary-glow, 0.015) 1px,
          transparent 1px
        );
      background-size: 180px 180px, 220px 220px;
      animation: dust-drift 60s linear infinite;
    }
  }
}

/* 徽章容器 */
.sigil-container {
  position: absolute;
  top: clamp(30px, 5vh, 60px);
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: $z-index-sigil;
}

.seven-hills-sigil {
  display: flex;
  flex-direction: column;
  align-items: center;

  .sigil-inner {
    position: relative;
    width: clamp(70px, 10vw, 100px);
    height: clamp(70px, 10vw, 100px);
    margin-bottom: 12px;

    .sigil-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 15px rgba($color-primary-glow, 0.8));

      .sigil-outline {
        fill: none;
        stroke: $color-primary-glow;
        stroke-width: 2.5;
        stroke-dasharray: 240;
        stroke-dashoffset: 240;
        animation: draw-sigil 2.5s ease-out forwards;
      }

      .sigil-core {
        fill: $color-blood-shadow;
        opacity: 0;
        animation: fade-in-core 1.2s ease-out 0.8s forwards;
      }

      .sigil-inner {
        fill: rgba($color-secondary-glow, 0.6);
        opacity: 0;
        animation: fade-in 1s ease-out 1.5s forwards;
      }
    }

    .sigil-glow {
      position: absolute;
      inset: -15px;
      background: radial-gradient(
        circle at center,
        rgba($color-primary-glow, 0.25) 0%,
        transparent 70%
      );
      filter: blur(15px);
      opacity: 0;
      animation: glow-pulse-sigil 6s ease-in-out 2s infinite;
    }
  }

  .sigil-title {
    font-family: "Cinzel", serif;
    font-size: clamp(0.75rem, 1.2vw, 0.9rem);
    letter-spacing: 0.3em;
    color: rgba($color-text-secondary, 0.8);
    text-transform: uppercase;
    opacity: 0;
    animation: fade-in-up 1s ease-out 2s forwards;
  }
}

/* 主内容区域 - 优化布局 */
.augusta-content {
  position: relative;
  z-index: $z-index-content;
  width: 100%;
  max-width: 1600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  animation: content-entrance 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: clamp(20px, 4vw, 60px);
  max-width: 1400px;
}

/* 装饰侧边 */
.decoration-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  flex: 0 0 auto;
  opacity: 0;
  animation: fade-in-side 1s ease-out 0.5s forwards;

  &.left-side {
    animation-delay: 0.3s;

    .forge-anvil {
      animation: anvil-float 5s ease-in-out infinite;
    }
  }

  &.right-side {
    animation-delay: 0.7s;

    .crown-symbol {
      animation: crown-float 5s ease-in-out infinite 0.5s;
    }
  }
}

/* 铁砧样式优化 */
.forge-anvil {
  position: relative;
  width: clamp(60px, 8vw, 90px);
  height: clamp(75px, 10vw, 110px);

  .anvil-top {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 35%;
    background: linear-gradient(
      135deg,
      $color-metal-dark 0%,
      rgba(255, 255, 255, 0.1) 50%,
      $color-metal-dark 100%
    );
    border-radius: 6px;
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.6),
      0 0 30px rgba($color-primary-glow, 0.5);
  }

  .anvil-body {
    position: absolute;
    top: 35%;
    left: 20%;
    width: 60%;
    height: 65%;
    background: linear-gradient(
      45deg,
      $color-metal-dark 0%,
      rgba(255, 255, 255, 0.05) 50%,
      $color-metal-dark 100%
    );
    border-radius: 10px 10px 20px 20px;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.8),
      0 5px 15px rgba(0, 0, 0, 0.4);
  }
}

/* 王冠样式优化 */
.crown-symbol {
  position: relative;
  width: clamp(60px, 8vw, 90px);
  height: clamp(45px, 6vw, 70px);

  .crown-base {
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 25%;
    background: linear-gradient(
      90deg,
      rgba($color-secondary-glow, 0.8) 0%,
      rgba(255, 179, 71, 0.9) 50%,
      rgba($color-secondary-glow, 0.8) 100%
    );
    border-radius: 4px;
    box-shadow: 0 0 20px rgba($color-secondary-glow, 0.6);
  }

  .crown-peak {
    position: absolute;
    bottom: 25%;
    width: 15%;
    height: 60%;
    background: linear-gradient(
      to top,
      rgba($color-secondary-glow, 0.9) 0%,
      rgba(255, 179, 71, 0.9) 100%
    );
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);

    @for $i from 1 through 5 {
      &:nth-child(#{$i + 1}) {
        left: calc(10% + #{($i - 1) * 20%});
        transform: translateX(-50%);
        animation: crown-peak-glow 4s ease-in-out infinite #{$i * 0.3}s;
      }
    }
  }
}

.floating-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  span {
    font-family: "Noto Sans SC", sans-serif;
    font-size: clamp(0.8rem, 1.2vw, 0.95rem);
    color: rgba($color-text-secondary, 0.9);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);

    &.accent {
      font-family: "Cinzel", serif;
      font-size: clamp(0.9rem, 1.4vw, 1.1rem);
      font-weight: bold;
      color: $color-secondary-glow;
      letter-spacing: 0.1em;
      text-shadow: 0 0 10px rgba($color-secondary-glow, 0.5);
    }
  }
}

/* 核心打字机区域 */
.typewriter-augusta {
  flex: 1 1 auto;
  text-align: center;
  min-width: 0;
  max-width: 900px;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out 0.8s forwards;
}

.text-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 2.5vw, 32px);
  margin-bottom: 32px;
}

.prefix-mark,
.suffix-mark {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: $color-primary-glow;
  opacity: 0.7;
  filter: drop-shadow(0 0 15px rgba($color-primary-glow, 0.8));
  animation: mark-pulse 4s ease-in-out infinite;

  &.suffix-mark {
    animation-delay: 2s;
  }
}

.typewriter-container {
  position: relative;
  display: inline-block;
  min-height: 1.2em;
}

.typewriter-text {
  margin: 0;
  font-family: "Noto Serif SC", serif;
  font-weight: 800;
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(
    135deg,
    $color-text-primary 0%,
    $color-secondary-glow 25%,
    $color-text-primary 50%,
    rgba($color-text-secondary, 10%) 75%,
    $color-text-primary 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 4px 12px rgba($color-blood-shadow, 0.5),
    0 0 40px rgba($color-primary-glow, 0.4);

  &::before {
    content: attr(data-text);
    position: absolute;
    left: 4px;
    top: 4px;
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 0.5) 0%,
      rgba($color-blood-shadow, 0.7) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    opacity: 0.4;
    filter: blur(6px);
    z-index: -1;
  }
}

.typewriter-cursor {
  position: absolute;
  right: -8px;
  top: 10%;
  width: 3px;
  height: 80%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    $color-primary-glow 20%,
    $color-primary-glow 80%,
    transparent 100%
  );
  opacity: 0;
  box-shadow: 0 0 20px $color-primary-glow;

  &.blinking {
    animation: cursor-blink 1s infinite;
  }
}

.subtitle {
  margin: 40px 0 28px;

  .title-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    opacity: 0;
    animation: fade-in 1s ease-out 1.2s forwards;

    .divider-line {
      flex: 1;
      max-width: 80px;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($color-primary-glow, 0.7),
        transparent
      );
    }

    .divider-ornament {
      color: $color-secondary-glow;
      font-size: 1.4rem;
      animation: ornament-spin 10s linear infinite;
    }
  }

  .subtitle-text {
    font-family: "Noto Sans SC", sans-serif;
    font-size: clamp(1rem, 1.8vw, 1.5rem);
    color: $color-text-secondary;
    letter-spacing: 0.15em;
    opacity: 0;
    animation: fade-in-up 0.8s ease-out 1.4s forwards;
  }
}

.quote-source {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba($color-metal-dark, 0.4);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: fade-in 1s ease-out 1.6s forwards;

  .source-icon {
    font-size: 1.2rem;
    filter: drop-shadow(0 0 6px rgba($color-secondary-glow, 0.6));
  }

  .source-text {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 0.9rem;
    color: rgba($color-text-secondary, 0.8);
    font-style: italic;
  }
}

/* 交互区域 */
.interaction-area {
  position: relative;
  z-index: $z-index-interaction;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
  opacity: 0;
  animation: fade-in 1s ease-out 2s forwards;
}

.interaction-hint {
  position: relative;

  .hint-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 70px;
    border-radius: 35px;
    background: rgba($color-primary-glow, 0.15);
    border: 1px solid rgba($color-primary-glow, 0.3);
    animation: hint-pulse 4s ease-in-out infinite;
  }

  .hint-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 18px 36px;

    .hint-icon {
      font-size: 1.6rem;
      color: $color-secondary-glow;
      animation: icon-hammer 3s ease-in-out infinite;
    }

    .hint-text {
      font-family: "Noto Sans SC", sans-serif;
      font-size: 1.1rem;
      color: $color-text-secondary;
      letter-spacing: 0.1em;
    }
  }
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;

  .progress-bar {
    width: 100%;
    height: 5px;
    background: rgba($color-metal-light, 0.3);
    border-radius: 3px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(
        90deg,
        $color-primary-glow 0%,
        $color-secondary-glow 50%,
        $color-primary-glow 100%
      );
      border-radius: 3px;
      transition: width 0.2s ease;
      box-shadow: 0 0 15px rgba($color-primary-glow, 0.6);
    }
  }

  .progress-text {
    font-family: "Noto Sans SC", sans-serif;
    font-size: 0.9rem;
    color: rgba($color-text-secondary, 0.9);
    letter-spacing: 0.05em;
  }
}

/* 主要应用区域 */
.main-app {
  min-height: 100vh;
}

.augusta-main {
  position: relative;
  background: linear-gradient(
    180deg,
    $color-deep-night 0%,
    $color-metal-dark 100%
  );
  min-height: calc(100vh - 80px);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $color-primary-glow 20%,
      $color-secondary-glow 50%,
      $color-primary-glow 80%,
      transparent 100%
    );
    box-shadow: 0 0 40px rgba($color-primary-glow, 0.5);
  }
}

/* 动画定义 */
@keyframes content-entrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}

@keyframes dust-drift {
  0% {
    background-position: 0 0, 100px 50px;
  }
  100% {
    background-position: 180px 180px, 300px 250px;
  }
}

@keyframes draw-sigil {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes glow-pulse-sigil {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes fade-in-side {
  from {
    opacity: 0;
    transform: translateX(calc(var(--side) * 20px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes anvil-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(-1deg);
  }
  75% {
    transform: translateY(-12px) rotate(1deg);
  }
}

@keyframes crown-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes crown-peak-glow {
  0%,
  100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 5px rgba($color-secondary-glow, 0.3));
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 12px rgba($color-secondary-glow, 0.8));
  }
}

@keyframes mark-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

@keyframes ornament-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes hint-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba($color-primary-glow, 0.2);
    opacity: 0.8;
  }
  50% {
    box-shadow: 0 0 0 25px rgba($color-primary-glow, 0);
    opacity: 1;
  }
}

@keyframes icon-hammer {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
  }
  25% {
    transform: rotate(-20deg) translateY(-2px);
  }
  75% {
    transform: rotate(15deg) translateY(-1px);
  }
}

@keyframes fade-in-core {
  to {
    opacity: 0.9;
  }
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-inner {
    gap: 40px;
  }

  .typewriter-text {
    font-size: clamp(1.8rem, 4vw, 3.5rem);
  }
}

@media (max-width: 768px) {
  .augusta-content {
    padding: 60px 20px 40px;
    gap: 30px;
  }

  .content-inner {
    flex-direction: column;
    gap: 50px;
  }

  .decoration-side {
    flex-direction: row;
    justify-content: center;
    gap: 50px;
    width: 100%;

    &.left-side,
    &.right-side {
      animation-name: fade-in-up;
    }

    &.right-side {
      order: 3;
    }
  }

  .typewriter-augusta {
    order: 2;
  }

  .text-line {
    gap: 12px;
  }

  .prefix-mark,
  .suffix-mark {
    font-size: 1.8rem;
  }

  .typewriter-text {
    font-size: clamp(1.6rem, 6vw, 2.4rem);
    line-height: 1.2;
  }

  .subtitle {
    margin: 30px 0 24px;

    .subtitle-text {
      font-size: clamp(0.9rem, 3vw, 1.2rem);
    }
  }

  .interaction-hint .hint-content {
    padding: 14px 28px;
  }
}

@media (max-width: 480px) {
  .sigil-inner {
    width: 60px;
    height: 60px;
  }

  .forge-anvil,
  .crown-symbol {
    transform: scale(0.9);
  }

  .floating-text {
    gap: 4px;

    span {
      font-size: 0.8rem;

      &.accent {
        font-size: 0.9rem;
      }
    }
  }

  .interaction-hint .hint-content {
    flex-direction: column;
    gap: 8px;

    .hint-text {
      font-size: 1rem;
    }
  }
}

/* 减少运动偏好支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .typewriter-cursor,
  .hint-pulse,
  .sigil-glow,
  .glow-pulse {
    display: none;
  }
}
</style>