<template>
  <header class="augusta-header" :class="{ 'mobile-nav-open': mobileNavOpen }">
    <!-- 左侧：徽标与标题 -->
    <div class="header-brand">
      <div class="sun-emblem">
        <div class="sun-core"></div>
      </div>
      <h1 class="site-title">七丘总督府</h1>
      <div class="title-underline">
        <div class="spark-line"></div>
      </div>
    </div>
    <div class="bgm-player">
      <button
        class="bgm-toggle"
        @click="toggleBGM"
        :class="{ playing: bgmPlaying }"
        aria-label="切换背景音乐"
      >
        <div class="bgm-icon">
          <!-- 音乐图标 -->
          <svg v-if="!bgmPlaying" class="icon-off" viewBox="0 0 24 24">
            <path
              d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
            />
          </svg>
          <!-- 暂停图标 -->
          <svg v-else class="icon-on" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </div>

        <!-- 烈阳光晕效果 -->
        <div class="bgm-glow" :class="{ active: bgmPlaying }"></div>
      </button>

      <!-- 音频元素 -->
      <audio
        ref="bgmAudio"
        :src="bgmPath"
        loop
        @ended="bgmPlaying = false"
        @pause="bgmPlaying = false"
        @play="bgmPlaying = true"
      ></audio>
    </div>
    <!-- 中间：在线状态 -->
    <div class="header-status">
      <div class="online-status">
        <div class="status-pulse"></div>
        <span class="status-text">共鸣链接</span>
        <span class="online-count" v-if="onlineCount !== null">{{
          onlineCount
        }}</span>
        <span class="status-unit">人</span>
      </div>
      <div class="status-glow"></div>
    </div>

    <!-- 右侧：导航区域 (PC端) -->
    <nav class="header-nav">
      <RouterLink
        v-for="item in primaryNavItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        active-class="nav-link-active"
        @click="closeMobileNav"
      >
        <span class="link-text">{{ item.name }}</span>
        <span class="link-underline"></span>
        <span class="link-sparkle"></span>
      </RouterLink>

      <!-- 下拉菜单：“总督密令” -->
      <div
        class="nav-dropdown"
        @mouseenter="dropdownOpen = true"
        @mouseleave="dropdownOpen = false"
      >
        <button class="dropdown-toggle">
          <span class="toggle-text">总督密令</span>
          <svg
            class="toggle-icon"
            :class="{ rotated: dropdownOpen }"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
          <div class="toggle-glow"></div>
        </button>
        <transition name="dropdown">
          <div class="dropdown-menu" v-show="dropdownOpen">
            <RouterLink
              v-for="item in dropdownNavItems"
              :key="item.path"
              :to="item.path"
              class="dropdown-item"
              @click="closeAllNavs"
            >
              <span class="item-text">{{ item.name }}</span>
            </RouterLink>
            <!-- 外部链接：霜落映界 -->
            <a
              href="http://36.150.237.25/#/redirector"
              target="_blank"
              rel="noopener"
              class="dropdown-item external"
              @click="closeAllNavs"
            >
              <span class="item-text">霜落映界</span>
              <span class="external-badge">总站</span>
            </a>
          </div>
        </transition>
      </div>
    </nav>

    <!-- 移动端汉堡菜单按钮 -->
    <button
      class="mobile-toggle"
      @click="toggleMobileNav"
      aria-label="切换导航"
    >
      <div class="toggle-bar" :class="{ open: mobileNavOpen }"></div>
      <div class="toggle-bar" :class="{ open: mobileNavOpen }"></div>
      <div class="toggle-bar" :class="{ open: mobileNavOpen }"></div>
      <div class="toggle-glow"></div>
    </button>

    <!-- 移动端导航菜单 -->
    <transition name="mobile-nav">
      <nav class="mobile-nav" v-show="mobileNavOpen">
        <div class="mobile-nav-links">
          <RouterLink
            v-for="item in allNavItems"
            :key="item.path"
            :to="item.path"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
            @click="closeMobileNav"
          >
            {{ item.name }}
          </RouterLink>
          <a
            href="http://36.150.237.25/#/redirector"
            target="_blank"
            rel="noopener"
            class="mobile-nav-link external"
            @click="closeMobileNav"
          >
            霜落映界 <span class="external-indicator">↗</span>
          </a>
        </div>
        <div class="mobile-nav-footer">
          <div class="mobile-online">
            在线共鸣者:
            <strong>{{ onlineCount !== null ? onlineCount : "--" }}</strong>
          </div>
        </div>
      </nav>
    </transition>

    <!-- 背景装饰元素 -->
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { io } from "socket.io-client";

// 导航项数据
const navItems = [
  { name: "烈阳之座", path: "/" },
  { name: "铁冕纪年", path: "/timeLine" },
  { name: "战魂回响", path: "/message" },
  { name: "熔炉印痕", path: "/gallery" },
  { name: "王权低语", path: "/talk" },
  { name: "铸刃工坊", path: "/resources" },
  { name: "橡木秘言", path: "/voice" },
  { name: "终末挽歌", path: "/music" },
  { name: "战纪文录", path: "/wiki" },
  { name: "铭文致谢", path: "/thanks" },
];

// 拆分导航项：前5个为主项，后5个+外链为下拉项
const primaryNavItems = computed(() => navItems.slice(0, 5));
const dropdownNavItems = computed(() => navItems.slice(5));
const allNavItems = computed(() => [...navItems]);

// 状态管理
const mobileNavOpen = ref(false);
const dropdownOpen = ref(false);
const onlineCount = ref<number | null>(null);

const siteId = "agst";
const socket: any = io("http://36.150.237.25:3000", { query: { siteId } });

// 方法
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
  if (mobileNavOpen.value) dropdownOpen.value = false;
}
function closeMobileNav() {
  mobileNavOpen.value = false;
}
function closeAllNavs() {
  mobileNavOpen.value = false;
  dropdownOpen.value = false;
}

const bgmPlaying = ref(false);
const volume = ref(70); // 默认音量70%

const bgmPath = "http://36.150.237.25:3000/music/葬我以日光.mp3";
const bgmAudio = ref<HTMLAudioElement | null>(null);

// BGM控制方法
function toggleBGM() {
  if (!bgmAudio.value) return;

  if (bgmPlaying.value) {
    bgmAudio.value.pause();
  } else {
    // 确保音量设置正确
    bgmAudio.value.volume = volume.value / 100;

    // 播放音乐，处理可能的错误
    const playPromise = bgmAudio.value.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("BGM播放失败:", error);
        bgmPlaying.value = false;

        // 如果是用户手势问题，可以添加用户交互后重试的逻辑
        document.addEventListener(
          "click",
          function retryPlay() {
            bgmAudio.value
              ?.play()
              .then(() => {
                bgmPlaying.value = true;
              })
              .catch((e) => {
                console.error("重试播放失败:", e);
              });
            document.removeEventListener("click", retryPlay);
          },
          { once: true }
        );
      });
    }
  }
}

// 生命周期
onMounted(() => {
  socket.on("onlineCount", (count: number) => {
    onlineCount.value = count;
  });
  if (bgmAudio.value) {
    bgmAudio.value.volume = volume.value / 100;
  }
});
onBeforeUnmount(() => {
  socket.disconnect();
  if (bgmAudio.value) {
    bgmAudio.value.pause();
    bgmAudio.value.src = "";
  }
});
</script>

<style scoped lang="scss">
/* 奥古斯塔风格设计系统 */
.augusta-header {
  // 核心颜色变量 - 源自烈阳、雷霆与金属
  --color-deep-iron: #0a0705; // 暗铁黑
  --color-ember-core: #c64830; // 余烬核心红
  --color-solar-gold: #ffb347; // 烈阳金
  --color-thunder-purple: #9d50bb; // 雷霆紫
  --color-metal-gray: #2a2522; // 金属灰
  --color-light-text: #f0e6d8; // 浅色文本

  // 渐变与阴影
  --gradient-sun: linear-gradient(
    135deg,
    var(--color-ember-core),
    var(--color-solar-gold)
  );
  --gradient-metal: linear-gradient(to bottom, #3a332e, #1a1614);
  --shadow-strong: 0 10px 30px rgba(10, 7, 5, 0.7);
  --shadow-glow: 0 0 20px rgba(255, 179, 71, 0.3);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: var(--gradient-metal);
  backdrop-filter: blur(10px) saturate(180%);
  border-bottom: 1px solid rgba(198, 72, 48, 0.2);
  box-shadow: var(--shadow-strong), inset 0 1px 0 rgba(255, 255, 255, 0.05);

  animation: headerAppear 0.6s ease-out;

  // 品牌区域
  .header-brand {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;

    .sun-emblem {
      width: 36px;
      height: 36px;
      position: relative;
      cursor: pointer;
      filter: drop-shadow(0 0 8px rgba(255, 179, 71, 0.5));

      .sun-core {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle,
          var(--color-solar-gold),
          var(--color-ember-core) 70%
        );
        border-radius: 50%;
        animation: sunPulse 4s ease-in-out infinite;
      }
    }

    .site-title {
      font-family: "Cinzel", "Times New Roman", serif;
      font-size: 1.8rem;
      font-weight: 800;
      background: var(--gradient-sun);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: 1px;
      margin: 0;
    }

    .title-underline {
      position: absolute;
      bottom: -8px;
      left: 50px;
      right: 0;
      height: 2px;
      overflow: hidden;

      .spark-line {
        height: 100%;
        width: 30%;
        background: var(--gradient-sun);
        animation: sparkTravel 3s linear infinite;
      }
    }
  }

  // 在线状态
  .header-status {
    position: relative;

    .online-status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      background: rgba(42, 37, 34, 0.6);
      border: 1px solid rgba(255, 179, 71, 0.2);
      border-radius: 20px;
      font-family: "STKaiti", "KaiTi", serif;
      font-size: 0.95rem;
      color: var(--color-light-text);
      position: relative;
      z-index: 2;

      .status-pulse {
        width: 8px;
        height: 8px;
        background: var(--color-ember-core);
        border-radius: 50%;
        animation: statusPulse 2s infinite;
      }

      .online-count {
        font-weight: 800;
        font-size: 1.1rem;
        color: var(--color-solar-gold);
        margin: 0 2px;
      }
    }

    .status-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 110%;
      height: 140%;
      background: radial-gradient(
        circle,
        rgba(255, 179, 71, 0.15),
        transparent 70%
      );
      filter: blur(5px);
      z-index: 1;
    }
  }

  // 主导航 (PC端)
  .header-nav {
    display: flex;
    align-items: center;
    gap: 5px;

    .nav-link {
      position: relative;
      padding: 10px 18px;
      font-family: "STKaiti", "KaiTi", "Noto Serif SC", serif;
      font-weight: 600;
      color: var(--color-light-text);
      text-decoration: none;
      border-radius: 6px;
      overflow: hidden;
      transition: all 0.3s ease;

      .link-text {
        position: relative;
        z-index: 2;
      }

      .link-underline {
        position: absolute;
        bottom: 0;
        left: 10%;
        width: 0;
        height: 2px;
        background: var(--gradient-sun);
        transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .link-sparkle {
        position: absolute;
        top: 50%;
        left: -10px;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        opacity: 0;
        filter: blur(1px);
      }

      &:hover {
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(198, 72, 48, 0.3);

        .link-underline {
          width: 80%;
        }

        .link-sparkle {
          animation: sparkleFly 0.5s forwards;
        }
      }
    }

    .nav-link-active {
      color: var(--color-solar-gold);
      background: rgba(198, 72, 48, 0.1);
      font-weight: 700;

      &::after {
        content: "⚔";
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.8rem;
        opacity: 0.8;
      }

      .link-underline {
        width: 80%;
        background: var(--color-solar-gold);
        box-shadow: 0 0 10px var(--color-solar-gold);
      }
    }

    // 下拉菜单
    .nav-dropdown {
      position: relative;
      margin-left: 5px;

      .dropdown-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(42, 37, 34, 0.8);
        border: 1px solid rgba(255, 179, 71, 0.3);
        border-radius: 8px;
        font-family: "STKaiti", "KaiTi", serif;
        font-weight: 600;
        color: var(--color-light-text);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        .toggle-text {
          position: relative;
          z-index: 2;
        }

        .toggle-icon {
          width: 16px;
          height: 16px;
          fill: var(--color-solar-gold);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;

          &.rotated {
            transform: rotate(180deg);
          }
        }

        .toggle-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(157, 80, 187, 0.2),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: inherit;
        }

        &:hover {
          background: rgba(198, 72, 48, 0.15);
          border-color: rgba(255, 179, 71, 0.5);
          color: white;

          .toggle-glow {
            opacity: 1;
          }
        }
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 5px);
        right: 0;
        min-width: 200px;
        background: rgba(26, 22, 20, 0.98);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 179, 71, 0.2);
        border-radius: 10px;
        padding: 8px 0;
        box-shadow: 0 15px 35px rgba(10, 7, 5, 0.8);
        z-index: 1000;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gradient-sun);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: var(--color-light-text);
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;

          .item-text {
            flex: 1;
            font-family: "STKaiti", "KaiTi", serif;
            font-size: 0.95rem;
          }

          .external-badge {
            font-size: 0.7rem;
            background: rgba(157, 80, 187, 0.3);
            color: #d0a5ff;
            padding: 2px 6px;
            border-radius: 4px;
          }

          &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            background: linear-gradient(
              to right,
              rgba(198, 72, 48, 0.2),
              transparent
            );
            transition: width 0.3s;
          }

          &:hover {
            background: rgba(255, 179, 71, 0.08);
            color: white;
            padding-left: 25px;

            &::after {
              width: 4px;
            }

            &.external {
              background: rgba(157, 80, 187, 0.1);
            }
          }
        }
      }

      // 下拉动画
      .dropdown-enter-active,
      .dropdown-leave-active {
        transition: opacity 0.25s, transform 0.25s;
      }
      .dropdown-enter-from,
      .dropdown-leave-to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
  }

  // 移动端切换按钮
  .mobile-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 22px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    position: relative;
    z-index: 1001;

    .toggle-bar {
      width: 100%;
      height: 3px;
      background: var(--color-light-text);
      border-radius: 3px;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      transform-origin: center;

      &.open:nth-child(1) {
        transform: translateY(9.5px) rotate(45deg);
        background: var(--color-solar-gold);
      }
      &.open:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      &.open:nth-child(3) {
        transform: translateY(-9.5px) rotate(-45deg);
        background: var(--color-solar-gold);
      }
    }

    .toggle-glow {
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(255, 179, 71, 0.2),
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover .toggle-glow {
      opacity: 1;
    }
  }

  // 移动端导航菜单
  .mobile-nav {
    display: none;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, #1a1614, #0a0705);
    backdrop-filter: blur(20px);
    z-index: 999;
    padding: 30px 20px;
    overflow-y: auto;
    border-top: 1px solid rgba(198, 72, 48, 0.3);
    min-height: 100vh;

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .mobile-nav-link {
        padding: 18px 20px;
        font-family: "STKaiti", "KaiTi", serif;
        font-size: 1.1rem;
        color: var(--color-light-text);
        text-decoration: none;
        border-radius: 10px;
        transition: all 0.3s;
        border-left: 4px solid transparent;

        &.mobile-nav-link-active {
          background: rgba(198, 72, 48, 0.15);
          color: var(--color-solar-gold);
          border-left-color: var(--color-ember-core);
          font-weight: 700;
        }

        &:hover {
          background: rgba(255, 179, 71, 0.1);
          transform: translateX(5px);
        }

        &.external {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .external-indicator {
            color: var(--color-thunder-purple);
            font-size: 1.2rem;
          }
        }
      }
    }

    .mobile-nav-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: var(--color-light-text);
      font-family: "STKaiti", "KaiTi", serif;

      strong {
        color: var(--color-solar-gold);
      }
    }
  }

  // 移动端导航动画
  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: opacity 0.4s, transform 0.4s;
  }
  .mobile-nav-enter-from,
  .mobile-nav-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .augusta-header {
    padding: 0 25px;

    .header-nav .nav-link {
      padding: 10px 14px;
      font-size: 0.95rem;
    }
  }
}

@media (max-width: 992px) {
  .augusta-header {
    .header-status .online-status {
      padding: 6px 14px;
      font-size: 0.9rem;
    }

    .header-nav {
      .nav-link {
        padding: 10px 12px;
        font-size: 0.9rem;
      }

      .nav-dropdown .dropdown-toggle {
        padding: 10px 15px;
      }
    }
  }
}

@media (max-width: 768px) {
  .augusta-header {
    height: 65px;
    padding: 0 20px;

    .header-brand .site-title {
      font-size: 1.5rem;
    }

    .header-status,
    .header-nav {
      display: none;
    }

    .mobile-toggle {
      display: flex;
    }

    .mobile-nav {
      display: block;
    }

    &.mobile-nav-open {
      background: rgba(26, 22, 20, 0.95);
    }
  }
}

/* 关键帧动画 */
@keyframes headerAppear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sunPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 179, 71, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 179, 71, 0.8);
  }
}

@keyframes sparkTravel {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
    box-shadow: 0 0 10px var(--color-ember-core);
  }
}

@keyframes sparkleFly {
  0% {
    opacity: 0;
    transform: translate(0, -50%) scale(0);
  }
  50% {
    opacity: 1;
    transform: translate(100px, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(200px, -50%) scale(0);
  }
}

@keyframes lightningStrike {
  0%,
  90%,
  100% {
    opacity: 0;
    height: 0;
  }
  1%,
  89% {
    opacity: 0;
    height: 100%;
  }
  5%,
  85% {
    opacity: 1;
    height: 100%;
  }
}

@keyframes emberFloat {
  from {
    transform: rotate(0deg) translateX(20px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(20px) rotate(-360deg);
  }
}

// BGM播放器样式
.bgm-player {
  position: relative;
  margin-right: 20px;
  z-index: 10;

  .bgm-toggle {
    position: relative;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgba(42, 37, 34, 0.9),
      rgba(26, 22, 20, 0.95)
    );
    border: 1px solid rgba(255, 179, 71, 0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(10, 7, 5, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: visible;

    &:hover {
      transform: translateY(-2px) scale(1.05);
      border-color: rgba(255, 179, 71, 0.5);
      box-shadow: 0 6px 20px rgba(198, 72, 48, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

      .bgm-glow {
        opacity: 0.6;
      }
    }

    &.playing {
      border-color: rgba(157, 80, 187, 0.5);
      box-shadow: 0 4px 16px rgba(157, 80, 187, 0.3),
        inset 0 0 20px rgba(157, 80, 187, 0.1);

      .bgm-glow {
        background: radial-gradient(
          circle,
          rgba(157, 80, 187, 0.4),
          transparent 70%
        );
        opacity: 0.7;
        animation: bgmPulse 2s infinite;
      }
    }

    .bgm-icon {
      position: relative;
      width: 24px;
      height: 24px;
      z-index: 2;

      svg {
        width: 100%;
        height: 100%;
        fill: var(--color-light-text);
        transition: fill 0.3s ease;
        position: relative;
        z-index: 2;
      }

      .icon-off {
        fill: var(--color-solar-gold);
      }

      .icon-on {
        fill: var(--color-thunder-purple);
      }
    }

    .bgm-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      background: radial-gradient(
        circle,
        rgba(255, 179, 71, 0.3),
        transparent 70%
      );
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.5s ease, background 0.5s ease;
      z-index: 1;
    }
  }
}

// 为BGM播放器添加响应式样式
@media (max-width: 1100px) {
  .bgm-player {
    margin-right: 15px;

    .bgm-toggle {
      width: 42px;
      height: 42px;
    }
  }
}

@media (max-width: 768px) {
  .bgm-player {
    position: absolute;
    right: 60px; // 在汉堡菜单左侧
    top: 50%;
    transform: translateY(-50%);
    margin-right: 0;

    .bgm-toggle {
      width: 40px;
      height: 40px;
    }
  }
}

// 新增关键帧动画
@keyframes bgmPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes soundWave {
  0%,
  100% {
    transform: scaleY(0.5);
    opacity: 0.4;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}
</style>