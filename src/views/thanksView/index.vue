<template>
  <div class="ack-page">
    <!-- 深空背景 -->
    <div class="space-bg"></div>

    <!-- 电光装饰 -->
    <div class="electric-decors">
      <div class="electric-line line-1"></div>
      <div class="electric-line line-2"></div>
      <div class="electric-line line-3"></div>
    </div>

    <!-- 主内容 -->
    <main class="ack-main">
      <!-- 标题区 -->
      <div class="header-section">
        <div class="title-group">
          <h1 class="page-title">奥古斯塔 · 鸣谢之章</h1>
          <div class="title-line"></div>
          <p class="page-subtitle">铁与火铸就的文字，冠冕与基石间的叙事</p>
        </div>

        <!-- 计数器 -->
        <div class="counter-badge">
          <span class="counter-number">{{ acknowledgements.length }}</span>
          <span class="counter-label">条建议</span>
        </div>
      </div>

      <!-- 鸣谢列表 -->
      <div class="ack-list-container">
        <div class="list-header">
          <h2 class="list-title">建议者名单</h2>
          <p class="list-desc">每一份建议，都为冠冕增添光辉</p>
        </div>

        <div class="ack-list">
          <div
            v-for="(item, index) in acknowledgements"
            :key="index"
            class="ack-item"
            :style="{ animationDelay: index * 0.1 + 's' }"
          >
            <div class="item-inner">
              <!-- 建议者 -->
              <div class="contributor-section">
                <div class="contributor-header">
                  <div class="contributor-icon">
                    <span class="icon-text">⚔️</span>
                  </div>
                  <div class="contributor-info">
                    <div class="contributor-label">建议者</div>
                    <div class="contributor-name">{{ item.nickname }}</div>
                  </div>
                </div>
              </div>

              <!-- 建议内容 -->
              <div class="suggestion-section">
                <div class="suggestion-label">建议内容</div>
                <div class="suggestion-content">{{ item.suggestion }}</div>
              </div>

              <!-- 序号 -->
              <div class="item-index">
                <span class="index-number">{{
                  String(index + 1).padStart(2, "0")
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="acknowledgements.length === 0" class="empty-state">
          <div class="empty-icon">📜</div>
          <h3 class="empty-title">暂无知音</h3>
          <p class="empty-desc">冠冕之下，等待第一个建议者</p>
        </div>
      </div>

      <!-- 献辞 -->
      <div class="tribute-section">
        <div class="tribute-content">
          <p class="tribute-text">
            感谢所有为奥古斯塔世界添砖加瓦的建议者，<br />
            你们的每一份建议，都是七丘城荣耀的一部分。
          </p>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="ack-footer">
      <div class="footer-content">
        <div class="footer-symbol">⚔️</div>
        <div class="footer-info">
          <div class="footer-text">奥古斯塔 · 鸣谢之章</div>
          <div class="footer-copyright">
            © 2026 奥古斯塔电子设定集 · 深空夜中，赤金铭刻的记忆
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 鸣谢数据
const acknowledgements = ref([
  { nickname: "雪_霁__", suggestion: "如果骄阳落下，那就让我来成为新的灼阳（首页主标题）" },
  { nickname: "雪_霁__", suggestion: "宿命的囚笼，由我斩断（首页副标题）" },
]);
</script>

<style scoped lang="scss">
// 奥古斯塔主题色板
$color-deep-night: #060408;
$color-metal-dark: #1a0e14;
$color-primary-glow: #c64830;
$color-secondary-glow: #ffd460;
$color-blood-shadow: #8b001a;
$color-text-primary: #fff7ef;
$color-text-secondary: #e1d7bd;

// 动画定义
@keyframes electric-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes star-twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.6;
  }
}

// 主容器
.ack-page {
  min-height: 100vh;
  color: $color-text-primary;
  font-family: "Noto Sans SC", "Inter", system-ui, sans-serif;
  background: linear-gradient(135deg, #040206 0%, #1c1018 100%);
  position: relative;
  overflow-x: hidden;
  padding-top: 80px;
  -webkit-font-smoothing: antialiased;
}

// 深空背景
.space-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(198, 72, 48, 0.05) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(255, 212, 96, 0.03) 0%,
      transparent 40%
    ),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(198, 72, 48, 0.02) 2px,
      rgba(198, 72, 48, 0.02) 4px
    );

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 20% 30%,
        rgba(255, 255, 255, 0.1) 1px,
        transparent 1px
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(255, 212, 96, 0.05) 1px,
        transparent 1px
      );
    background-size: 300px 300px, 400px 400px;
    animation: star-twinkle 4s infinite;
  }
}

// 电光装饰
.electric-decors {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  .electric-line {
    position: absolute;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(198, 72, 48, 0.4),
      rgba(255, 212, 96, 0.3),
      rgba(198, 72, 48, 0.4),
      transparent
    );
    filter: blur(0.5px);

    &.line-1 {
      top: 30%;
      left: 10%;
      width: 25%;
      animation: electric-pulse 5s infinite 0.5s;
    }

    &.line-2 {
      top: 60%;
      right: 15%;
      width: 35%;
      animation: electric-pulse 6s infinite 1s;
    }

    &.line-3 {
      bottom: 40%;
      left: 20%;
      width: 50%;
      animation: electric-pulse 4s infinite 1.5s;
    }
  }
}

// 主内容区
.ack-main {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

// 标题区
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  .title-group {
    margin-bottom: 2rem;

    .page-title {
      font-size: 2.5rem;
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
      margin-bottom: 1rem;
      text-shadow: 0 0 15px rgba(198, 72, 48, 0.3);
    }

    .title-line {
      width: 80px;
      height: 3px;
      background: linear-gradient(
        90deg,
        $color-primary-glow,
        $color-secondary-glow,
        transparent
      );
      margin: 0 auto 1rem;
      border-radius: 2px;
      animation: electric-pulse 3s infinite;
    }

    .page-subtitle {
      color: $color-text-secondary;
      font-size: 1.1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      opacity: 0.9;
    }
  }

  .counter-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.8) 0%,
      rgba(16, 8, 14, 0.8) 100%
    );
    border: 1px solid rgba(198, 72, 48, 0.3);
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    backdrop-filter: blur(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

    .counter-number {
      color: $color-primary-glow;
      font-size: 1.4rem;
      font-weight: 700;
    }

    .counter-label {
      color: $color-text-secondary;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }
}

// 鸣谢列表容器
.ack-list-container {
  .list-header {
    text-align: center;
    margin-bottom: 2rem;

    .list-title {
      color: $color-text-primary;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;

      &::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
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

    .list-desc {
      color: $color-text-secondary;
      font-size: 0.95rem;
      font-weight: 500;
    }
  }
}

// 鸣谢列表
.ack-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

// 鸣谢项
.ack-item {
  opacity: 0;
  animation: float-in 0.6s forwards;

  .item-inner {
    background: linear-gradient(
      135deg,
      rgba(26, 14, 20, 0.8) 0%,
      rgba(16, 8, 14, 0.8) 100%
    );
    border: 1px solid rgba(198, 72, 48, 0.2);
    border-radius: 14px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);

    &:hover {
      border-color: rgba(198, 72, 48, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4),
        0 0 15px rgba(198, 72, 48, 0.2);
    }

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

    &:hover::before {
      left: 100%;
    }

    // 建议者部分
    .contributor-section {
      margin-bottom: 1.2rem;

      .contributor-header {
        display: flex;
        align-items: center;
        gap: 1rem;

        .contributor-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(198, 72, 48, 0.2) 0%,
            rgba(139, 0, 26, 0.1) 100%
          );
          border: 1px solid rgba(198, 72, 48, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;

          .icon-text {
            font-size: 1.5rem;
          }
        }

        .contributor-info {
          flex: 1;

          .contributor-label {
            color: $color-text-secondary;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 0.3rem;
          }

          .contributor-name {
            color: $color-primary-glow;
            font-size: 1.2rem;
            font-weight: 700;
          }
        }
      }
    }

    // 建议部分
    .suggestion-section {
      .suggestion-label {
        display: inline-block;
        background: rgba(6, 4, 8, 0.6);
        color: $color-text-secondary;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.3rem 0.8rem;
        border-radius: 8px;
        margin-bottom: 0.8rem;
        border: 1px solid rgba(225, 215, 189, 0.1);
      }

      .suggestion-content {
        color: $color-text-primary;
        font-size: 1.05rem;
        line-height: 1.5;
        padding-left: 0.5rem;
        border-left: 3px solid rgba(198, 72, 48, 0.5);
      }
    }

    // 序号
    .item-index {
      position: absolute;
      top: 1rem;
      right: 1rem;

      .index-number {
        color: rgba(225, 215, 189, 0.3);
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 1px;
      }
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(26, 14, 20, 0.6) 0%,
    rgba(16, 8, 14, 0.6) 100%
  );
  border: 2px dashed rgba(198, 72, 48, 0.3);
  border-radius: 14px;

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 5px rgba(255, 212, 96, 0.5));
  }

  .empty-title {
    color: $color-text-primary;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .empty-desc {
    color: $color-text-secondary;
    font-size: 1rem;
  }
}

// 献辞
.tribute-section {
  margin-top: 3rem;
  text-align: center;

  .tribute-content {
    .tribute-text {
      color: $color-text-secondary;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      font-style: italic;
      opacity: 0.8;
    }
  }
}

// 页脚
.ack-footer {
  position: relative;
  z-index: 10;
  background: linear-gradient(
    135deg,
    rgba(6, 4, 8, 0.9) 0%,
    rgba(26, 14, 20, 0.9) 100%
  );
  border-top: 1px solid rgba(198, 72, 48, 0.2);
  padding: 1.5rem;
  margin-top: 2rem;

  .footer-content {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .footer-symbol {
      font-size: 2rem;
      filter: drop-shadow(0 0 3px rgba(255, 212, 96, 0.5));
    }

    .footer-info {
      text-align: center;

      .footer-text {
        color: $color-text-primary;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.3rem;
      }

      .footer-copyright {
        color: $color-text-secondary;
        font-size: 0.85rem;
        font-weight: 500;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ack-main {
    padding: 1.5rem 1rem 3rem;
  }

  .header-section {
    .title-group {
      .page-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }
    }
  }

  .ack-item {
    .item-inner {
      padding: 1.2rem;

      .contributor-section {
        .contributor-header {
          .contributor-icon {
            width: 42px;
            height: 42px;

            .icon-text {
              font-size: 1.3rem;
            }
          }

          .contributor-info {
            .contributor-name {
              font-size: 1.1rem;
            }
          }
        }
      }

      .suggestion-section {
        .suggestion-content {
          font-size: 1rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .header-section {
    .title-group {
      .page-title {
        font-size: 1.8rem;
      }
    }
  }

  .ack-item {
    .item-inner {
      .contributor-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.8rem;
      }
    }
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }
}
</style>