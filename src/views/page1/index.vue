<template>
  <main class="home">
    <!-- 动态粒子背景层：模拟电光与余烬 -->
    <canvas ref="canvasEl" class="particle-canvas" aria-hidden="true"></canvas>

    <!-- 静态风格背景层：深空与渐变光晕 -->
    <div class="background-layer" aria-hidden="true"></div>

    <!-- 主内容区域 -->
    <section class="center" role="main">
      <!-- 角色徽记与装饰线 -->
      <div class="heraldry">
        <div class="heraldry-line left"></div>
        <div class="heraldry-icon" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <!-- 简约的剑与冠冕组合图形 -->
            <path
              d="M50,15 L60,40 L75,45 L60,50 L65,70 L50,60 L35,70 L40,50 L25,45 L40,40 Z"
            />
            <circle cx="50" cy="85" r="8" />
          </svg>
        </div>
        <div class="heraldry-line right"></div>
      </div>

      <!-- 主标题与角色头衔 -->
      <div class="title-container">
        <h1 class="title-main">奥古斯塔</h1>
        <p class="title-sub">AUGUSTA · 七丘的无畏总督</p>
      </div>

      <!-- 动态角色语录 -->
      <div class="quote-container">
        <p class="quote-main" >“如果骄阳落下，那就让我来成为新的灼阳”</p>
        <div class="quote-typed">
          <span class="typed-text">{{ typedText }}</span>
          <span class="cursor" aria-hidden="true"></span>
        </div>
      </div>

      <!-- 能力标签 -->
      <div class="ability-tags">
        <span class="tag" v-for="tag in abilityTags" :key="tag">{{ tag }}</span>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="augusta-footer" role="contentinfo">
      <div class="footer-content">
        <p class="footer-quote">愿我流血时，仍不忘为何而举剑</p>
        <p class="footer-meta">© {{ currentYear }} 奥古斯塔电子设定集 · 霜落天亦</p>
      </div>
      <!-- 装饰性页脚边框 -->
      <div class="footer-border"></div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// ==================== 基础数据 ====================
const currentYear = new Date().getFullYear();

// 奥古斯塔能力与语录 (整合自搜索结果)
const abilityTags = ref([
  "未曜的磁律",
  "灼金电光",
  "双形态武器",
  "万剑状态",
  "七丘总督",
]);

const quotes = [
  "宿命的囚笼，由我斩断",
  "从铁砧到冠冕，见证凡人的史诗",
  "七丘之上，以剑立誓的守望",
  "承载众生之愿，方知冠冕之重",
  "法比亚纳的余烬中，信念永不熄灭",
  "锻造命运的铁砧就在心中", // 结合其“铁与血”的背景
  "黑潮终将退去，黎明必将到来",
  "我的剑，为无法挥剑之人而战",
];

// ==================== 动态打字机效果 ====================
const typedText = ref("");
let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimer: number | null = null;

const TYPE_SPEED = 120; // 打字速度（毫秒）
const DELETE_SPEED = 60; // 删除速度（毫秒）
const PAUSE_DURATION = 1800; // 暂停时间（毫秒）

function typeWriter() {
  const currentQuote = quotes[quoteIndex];

  if (!isDeleting) {
    // 打字模式
    typedText.value = currentQuote.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex >= currentQuote.length) {
      // 打字完成，暂停后开始删除
      isDeleting = true;
      typingTimer = window.setTimeout(typeWriter, PAUSE_DURATION);
      return;
    }
    typingTimer = window.setTimeout(typeWriter, TYPE_SPEED);
  } else {
    // 删除模式
    typedText.value = currentQuote.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex <= 0) {
      // 删除完成，切换到下一句
      isDeleting = false;
      quoteIndex = (quoteIndex + 1) % quotes.length;
      typingTimer = window.setTimeout(typeWriter, 300);
      return;
    }
    typingTimer = window.setTimeout(typeWriter, DELETE_SPEED);
  }
}

// ==================== 动态粒子背景 ====================
const canvasEl = ref<HTMLCanvasElement | null>(null);
let animationId = 0;
let lastTime = 0;
let canvasCtx: CanvasRenderingContext2D;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life: number; // 生命周期 0.0 - 1.0
  decay: number; // 衰减速度
}

const particles: Particle[] = [];
const PARTICLE_COUNT_DESKTOP = 65; // 桌面端粒子数
const PARTICLE_COUNT_MOBILE = 25; // 移动端粒子数
const PARTICLE_COLORS = [
  "rgba(198, 72, 48, 0.7)", // 主色暗紫/赤金
  "rgba(255, 212, 96, 0.8)", // 灼金电光高光
  "rgba(139, 0, 26, 0.5)", // 深红血光
  "rgba(255, 255, 220, 0.9)", // 炽白烈阳核心
];

function initParticles(count: number) {
  particles.length = 0;
  if (!canvasEl.value) return;

  const width = canvasEl.value.clientWidth;
  const height = canvasEl.value.clientHeight;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1.5,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.7) * 1.2, // 略微向上漂浮
      color:
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      life: Math.random() * 0.5 + 0.5, // 初始生命值
      decay: Math.random() * 0.008 + 0.004,
    });
  }
}

function tickParticles(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (!canvasEl.value || !canvasCtx) return;
  const width = canvasEl.value.clientWidth;
  const height = canvasEl.value.clientHeight;

  // 半透明黑色覆盖层，制造粒子拖尾效果
  canvasCtx.fillStyle = "rgba(6, 4, 8, 0.05)";
  canvasCtx.fillRect(0, 0, width, height);

  particles.forEach((p) => {
    // 更新位置与生命周期
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= p.decay;

    // 粒子重置条件：移出视窗或生命结束
    if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > width + 10) {
      p.x = Math.random() * width;
      p.y = height + 5; // 从底部重生
      p.life = 1.0;
      p.speedX = (Math.random() - 0.5) * 0.8;
      p.speedY = (Math.random() - 0.7) * 1.2;
    }

    // 绘制粒子
    const radius = p.size * p.life;
    canvasCtx.beginPath();
    const gradient = canvasCtx.createRadialGradient(
      p.x,
      p.y,
      0,
      p.x,
      p.y,
      radius * 1.5
    );
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, "rgba(255, 255, 220, 0)");
    canvasCtx.fillStyle = gradient;
    canvasCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    canvasCtx.fill();
  });

  animationId = requestAnimationFrame(tickParticles);
}

let resizeTimeout: number;
function handleResize() {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    cancelAnimationFrame(animationId);
    if (!canvasEl.value) return;

    const dpr = window.devicePixelRatio || 1;
    const width =
      canvasEl.value.parentElement?.clientWidth || window.innerWidth;
    const height =
      canvasEl.value.parentElement?.clientHeight || window.innerHeight;

    canvasEl.value.style.width = `${width}px`;
    canvasEl.value.style.height = `${height}px`;
    canvasEl.value.width = width * dpr;
    canvasEl.value.height = height * dpr;

    canvasCtx?.scale(dpr, dpr);

    // 根据屏幕宽度调整粒子数量
    const isMobile = width < 768;
    initParticles(isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP);

    lastTime = 0;
    animationId = requestAnimationFrame(tickParticles);
  }, 150);
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 启动打字机效果
  typingTimer = window.setTimeout(typeWriter, 800);

  // 初始化粒子画布
  if (canvasEl.value) {
    canvasCtx = canvasEl.value.getContext("2d")!;
    handleResize();
    window.addEventListener("resize", handleResize);
  }
});

onBeforeUnmount(() => {
  if (typingTimer) clearTimeout(typingTimer);
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
/* 奥古斯塔主题色板：深空夜 + 灼金/赤金电光 + 铁血深红 */
$color-deep-night: #060408; // 主背景：深空夜色
$color-metal-dark: #1a0e14; // 金属暗部
$color-primary-glow: #c64830; // 主辉光 - 暗紫/赤金
$color-secondary-glow: #ffd460; // 次辉光 - 灼金高光
$color-blood-shadow: #8b001a; // 血影深红
$color-text-primary: #fff7ef; // 主文字
$color-text-secondary: #e1d7bd; // 副文字
$color-border-glow: rgba(198, 72, 48, 0.4); // 边框辉光

.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  background-color: $color-deep-night;
  color: $color-text-primary;
  font-family: "Segoe UI", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif;
  isolation: isolate;

  /* 粒子画布 */
  .particle-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: screen; /* 增强光效融合 */
  }

  /* 静态背景层：深空渐变与光晕 */
  .background-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(
        circle at 20% 30%,
        rgba($color-primary-glow, 0.08) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba($color-blood-shadow, 0.05) 0%,
        transparent 35%
      ),
      linear-gradient(
        180deg,
        $color-deep-night 0%,
        rgba($color-metal-dark, 5%) 100%
      );
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 1px,
        rgba($color-secondary-glow, 0.02) 1px,
        rgba($color-secondary-glow, 0.02) 2px
      );
      opacity: 0.4;
    }
  }

  /* 主内容区 */
  .center {
    position: relative;
    z-index: 10;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1.5rem;
    gap: 2.5rem;

    /* 徽记装饰 */
    .heraldry {
      display: flex;
      align-items: center;
      justify-content: center;
      width: min(100%, 600px);
      margin-bottom: 1rem;
      .heraldry-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          $color-border-glow 30%,
          $color-border-glow 70%,
          transparent
        );
        &.left {
          margin-right: 1.5rem;
        }
        &.right {
          margin-left: 1.5rem;
        }
      }
      .heraldry-icon {
        width: 3.5rem;
        height: 3.5rem;
        svg {
          width: 100%;
          height: 100%;
          fill: none;
          stroke: $color-primary-glow;
          stroke-width: 1.2;
          filter: drop-shadow(0 0 6px rgba($color-primary-glow, 0.6));
        }
      }
    }

    /* 标题区域 */
    .title-container {
      .title-main {
        font-size: clamp(3.5rem, 10vw, 6rem);
        font-weight: 800;
        line-height: 1;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(
          135deg,
          $color-text-primary 0%,
          $color-secondary-glow 50%,
          $color-primary-glow 100%
        );
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba($color-primary-glow, 0.15);
        letter-spacing: 0.02em;
      }
      .title-sub {
        font-size: clamp(1rem, 3vw, 1.3rem);
        color: $color-text-secondary;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin: 0;
        opacity: 0.9;
      }
    }

    /* 语录区域 */
    .quote-container {
      max-width: 800px;
      .quote-main {
        font-size: clamp(1.5rem, 4vw, 2.2rem);
        font-weight: 600;
        color: $color-text-primary;
        margin: 0 0 1.5rem 0;
        line-height: 1.4;
     
      }
      .quote-typed {
        font-size: clamp(1.1rem, 2.5vw, 1.4rem);
        min-height: 1.8em;
        color: rgba($color-text-secondary, 0.95);
        .typed-text {
          font-weight: 500;
          letter-spacing: 0.03em;
        }
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          margin-left: 4px;
          background: linear-gradient(
            to bottom,
            $color-secondary-glow,
            $color-primary-glow
          );
          border-radius: 1px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }
      }
    }

    /* 能力标签 */
    .ability-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.8rem;
      max-width: 800px;
      .tag {
        padding: 0.5em 1.2em;
        background: rgba($color-metal-dark, 0.7);
        border: 1px solid rgba($color-primary-glow, 0.3);
        border-radius: 2em;
        font-size: 0.9rem;
        color: $color-text-secondary;
        letter-spacing: 0.05em;
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;
        &:hover {
          border-color: $color-primary-glow;
          color: $color-secondary-glow;
          box-shadow: 0 0 12px rgba($color-primary-glow, 0.3);
          transform: translateY(-2px);
        }
      }
    }
  }

  /* 页脚 */
  .augusta-footer {
    position: relative;
    z-index: 10;
    padding: 2rem 1.5rem;
    margin-top: auto;
    .footer-content {
      text-align: center;
      .footer-quote {
        font-size: 1.1rem;
        color: $color-text-secondary;
        margin: 0 0 0.5rem 0;
        font-style: italic;
      }
      .footer-meta {
        font-size: 0.9rem;
        color: rgba($color-text-secondary, 0.6);
        margin: 0;
        em {
          color: rgba($color-primary-glow, 0.9);
          font-style: normal;
        }
      }
    }
    .footer-border {
      height: 1px;
      width: min(400px, 80%);
      margin: 1.5rem auto 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($color-primary-glow, 0.4) 20%,
        rgba($color-primary-glow, 0.4) 80%,
        transparent
      );
    }
  }
}

/* 关键帧动画 */
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .home {
    .center {
      gap: 2rem;
      padding: 1.5rem 1rem;
      .heraldry .heraldry-icon {
        width: 2.8rem;
        height: 2.8rem;
      }
      .ability-tags {
        gap: 0.6rem;
        .tag {
          font-size: 0.85rem;
          padding: 0.4em 1em;
        }
      }
    }
    .augusta-footer {
      padding: 1.5rem 1rem;
    }
  }
}

/* 小屏优化 */
@media (max-width: 480px) {
  .home .center {
    .title-container .title-main {
      font-size: 2.8rem;
    }
    .quote-container {
      .quote-main {
        font-size: 1.4rem;
      }
      .quote-typed {
        font-size: 1rem;
      }
    }
  }
}
</style>