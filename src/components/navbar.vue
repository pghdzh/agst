<template>
  <header class="app-header">
    <h1 class="title">奥古斯塔电子设定集</h1>
    <!-- 在线人数展示 -->
    <div class="online-count" v-if="onlineCount !== null">
      当前在线：<span class="count">{{ onlineCount }}人</span>
    </div>
    <!-- 移动端汉堡按钮 -->
    <button
      class="hamburger"
      @click="toggleMobileNav"
      aria-label="Toggle navigation"
    >
      <span :class="{ open: mobileNavOpen }"></span>
      <span :class="{ open: mobileNavOpen }"></span>
      <span :class="{ open: mobileNavOpen }"></span>
    </button>

    <!-- 普通导航 & 移动端下拉导航 -->
    <nav :class="['nav-links', { 'mobile-open': mobileNavOpen }]">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        active-class="active-link"
        @click="mobileNavOpen = false"
      >
        {{ item.name }}
      </RouterLink>

      <a
        href="http://36.150.237.25/#/redirector"
        target="_blank"
        rel="noopener"
        class="nav-item"
        active-class="active-link"
        @click="mobileNavOpen = false"
      >
        霜落映界
      </a>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { io } from "socket.io-client";

const navItems = [
  { name: "七丘城的守望", path: "/" },
  { name: "铁砧与冠冕", path: "/timeLine" },
  { name: "战士的回响", path: "/message" },
  { name: "淬火印记", path: "/gallery" },
  { name: "铸炼工坊", path: "/resources" },
  { name: "王者低语", path: "/talk" },
  { name: "橡果密语", path: "/voice" },
  { name: "法比亚纳挽歌", path: "/music" },
  { name: "致谢铭文", path: "/thanks" },
];

const mobileNavOpen = ref(false);
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}

const siteId = "agst";

const onlineCount = ref<number | null>(null);

// 连接时带上 query.siteId
const socket: any = io("http://36.150.237.25:3000", {
  query: { siteId },
});

onMounted(() => {
  socket.on("onlineCount", (count: number) => {
    onlineCount.value = count;
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<style scoped lang="scss">
/* 奥古斯塔 — 烈阳战铠：灼金/白银/赤焰 + 剑锋光泽 */
.app-header {
  --deep-bg: linear-gradient(
    180deg,
    rgba(12, 8, 6, 0.98),
    rgba(22, 10, 6, 0.995)
  ); /* 暗金/战场底色 */
  --solar-core: rgba(255, 200, 120, 0.08); /* 太阳核心薄光 */
  --accent: #c64830; /* 主色：烈焰赤（对应角色红橙发色） */
  --accent-2: #e1d7bd; /* 次色：暖金 / 烈阳高光 */
  --gold-accent: #ffd78a; /* 金色点缀 */
  --muted-text: #fff7ef; /* 温暖近白文字 */
  --ember-sheen: rgba(160, 80, 30, 0.05); /* 灰橙薄雾/余烬 */
  --wing-silhouette: rgba(180, 120, 60, 0.06); /* 背后披风/翼状剪影 */

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: radial-gradient(
      360px 80px at 12% 12%,
      rgba(240, 180, 80, 0.03),
      transparent 12%
    ),
    var(--deep-bg);
  backdrop-filter: blur(6px) saturate(1);
  box-shadow: 0 10px 36px rgba(10, 6, 4, 0.72), 0 0 18px var(--solar-core) inset;
  border-bottom: 1px solid rgba(220, 160, 100, 0.04);
  animation: fadeInDown 0.5s ease-out both;
  overflow: visible;

  &::after {
    /* 余烬薄雾 + 铠甲反光 */
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(180deg, var(--ember-sheen), transparent 28%);
    mix-blend-mode: overlay;
  }

  /* 右侧烈阳与披风/翼状剪影 */
  &::before {
    content: "";
    position: absolute;
    right: 6%;
    top: 6%;
    width: 300px;
    height: 92px;
    pointer-events: none;
    background: radial-gradient(
        44px 14px at 14% 22%,
        rgba(255, 190, 110, 0.18),
        transparent 30%
      ),
      radial-gradient(
        88px 28px at 50% 40%,
        rgba(220, 140, 70, 0.06),
        transparent 46%
      ),
      radial-gradient(
        24px 10px at 78% 62%,
        rgba(255, 240, 180, 0.04),
        transparent 42%
      );
    filter: blur(6px);
    transform: translateY(0) rotate(-4deg);
    animation: ember-drift 9s ease-in-out infinite;
    mix-blend-mode: screen;
  }

  .title {
    position: relative;
    font-family: "Cinzel", serif;
    font-style: normal;
    font-size: 26px;
    font-weight: 800;
    color: var(--muted-text);
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.6px;
    text-shadow: 0 6px 22px rgba(12, 6, 4, 0.6);
    transition: transform 0.28s ease, text-shadow 0.28s ease;
    animation: pulse-solemn 8.6s ease-in-out infinite;

    &:hover {
      transform: translateY(-2px) scale(1.04);
      text-shadow: 0 12px 36px rgba(220, 130, 70, 0.12);
    }
  }

  .online-count {
    position: relative;
    margin-left: 16px;
    padding: 6px 14px;
    font-family: "Cinzel", serif;
    font-size: 1rem;
    color: var(--muted-text);
    background: linear-gradient(
      135deg,
      rgba(18, 12, 8, 0.26),
      rgba(14, 10, 8, 0.18)
    );
    border: 1px solid rgba(220, 160, 100, 0.05);
    border-radius: 24px;
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 18px rgba(8, 6, 4, 0.5), 0 0 10px var(--solar-core) inset;
    overflow: hidden;
    cursor: default;
    transition: transform 0.22s ease, box-shadow 0.22s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(12, 8, 6, 0.6),
        0 0 34px rgba(255, 170, 80, 0.08);
    }

    .count {
      display: inline-block;
      margin-left: 18px;
      font-weight: 800;
      color: var(--accent-2);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 8px rgba(255, 160, 80, 0.06);
    }
  }

  .nav-links {
    display: flex;
    gap: 22px;
    align-items: center;

    .nav-item {
      position: relative;
      color: var(--muted-text);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.22s ease, transform 0.16s ease;
      padding: 6px 4px;
      border-radius: 6px;
      overflow: visible;
      font-family: "STKaiti", "KaiTi", "Noto Serif SC", serif;
      font-style: italic;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -8px;
        width: 0;
        height: 6px;
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0),
          rgba(230, 120, 50, 0.92),
          rgba(255, 200, 120, 0.9),
          rgba(0, 0, 0, 0)
        );
        transform: translateX(-50%);
        opacity: 0.95;
        filter: blur(0.8px) contrast(1.03);
        transition: width 0.36s cubic-bezier(0.2, 0.9, 0.2, 1), left 0.36s,
          opacity 0.24s;
        background-size: 200% 100%;
        animation: wave-ember 5.8s linear infinite;
      }

      &::before {
        content: "";
        position: absolute;
        right: 14%;
        top: -6px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          var(--gold-accent),
          transparent 60%
        );
        opacity: 0;
        transform: translateY(-6px) scale(0.86);
        transition: opacity 0.26s, transform 0.36s;
        box-shadow: 0 6px 14px rgba(200, 120, 60, 0.08);
      }

      &:hover {
        color: var(--accent-2);
        transform: translateY(-1.8px);
        text-shadow: 0 0 8px rgba(220, 140, 80, 0.04);
      }

      &:hover::after {
        width: 72%;
        left: 50%;
        opacity: 1;
      }

      &:hover::before {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .active-link {
      color: var(--accent);
      font-weight: 700;

      &::before {
        content: "☀️";
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%) rotate(-6deg);
        font-size: 12px;
        color: var(--gold-accent);
        text-shadow: 0 2px 10px rgba(255, 200, 120, 0.12);
        animation: sun-emblem 3.6s ease-in-out infinite;
        opacity: 0.98;
      }

      &::after {
        width: 92%;
        opacity: 1;
        box-shadow: 0 6px 22px rgba(220, 140, 80, 0.06);
      }
    }
  }

  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 24px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    span {
      display: block;
      width: 100%;
      height: 3px;
      background: rgba(255, 245, 232, 0.92);
      border-radius: 2px;
      transition: transform 0.28s ease, opacity 0.28s ease, background 0.28s;
      box-shadow: 0 2px 6px rgba(12, 8, 6, 0.18), 0 0 8px var(--solar-core);
    }

    span.open:nth-child(1) {
      transform: translateY(10px) rotate(45deg);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
    }

    span.open:nth-child(2) {
      opacity: 0;
    }

    span.open:nth-child(3) {
      transform: translateY(-10px) rotate(-45deg);
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
    }
  }

  @media (max-width: 768px) {
    padding: 0 20px;

    .title {
      display: none;
    }
    .hamburger {
      display: flex;
    }

    .nav-links {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      flex-direction: column;
      background: linear-gradient(
        180deg,
        rgba(16, 10, 8, 0.98),
        rgba(12, 8, 8, 0.995)
      );
      backdrop-filter: blur(12px);
      gap: 0;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.34s ease;
      border-top: 1px solid rgba(220, 160, 100, 0.03);

      &.mobile-open {
        max-height: 520px;
      }

      .nav-item {
        padding: 14px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      }
    }
  }
}

/* 动效关键帧（余烬 / 烈阳 / 剑锋） */
@keyframes wave-ember {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse-solemn {
  0% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(-3px) scale(1.02);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ember-drift {
  0% {
    transform: translateY(0) rotate(-4deg) translateX(0);
    opacity: 0.9;
    filter: blur(6px);
  }
  50% {
    transform: translateY(-6px) rotate(2deg) translateX(-6px);
    opacity: 1;
    filter: blur(4px) saturate(1.03);
  }
  100% {
    transform: translateY(0) rotate(-4deg) translateX(0);
    opacity: 0.9;
  }
}

@keyframes solar-flare {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-6px) rotate(0.4deg);
    opacity: 1;
    filter: drop-shadow(0 6px 18px rgba(255, 160, 80, 0.08));
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
}

@keyframes sun-emblem {
  0% {
    transform: translateY(-6%) rotate(-6deg);
    opacity: 0.8;
    filter: drop-shadow(0 2px 8px rgba(200, 140, 80, 0.06));
  }
  50% {
    transform: translateY(6%) rotate(2deg);
    opacity: 1;
    filter: drop-shadow(0 6px 18px rgba(255, 190, 120, 0.12));
  }
  100% {
    transform: translateY(-6%) rotate(-6deg);
    opacity: 0.8;
  }
}
</style>
