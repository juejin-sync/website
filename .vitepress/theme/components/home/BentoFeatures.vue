<script setup>
// Bento Grid 特性模块
const bentoCards = [
  {
    colSpan: 'span-5',
    tag: '原图保真 · 0 外链损耗',
    title: '原图无损转存与图床清洗管道',
    desc: '自动剥离掘金 CDN 图片水印参数，提取原始高清画质；针对微信公众平台自动同步至微信官方素材库，并实时裁剪 16:9、1:1 与 3:4 三套标准封面；对知乎与 CSDN 采用双轨二进制上传，彻底根除跨域防盗链裂图。',
    visualType: 'pipeline'
  },
  {
    colSpan: 'span-3',
    tag: '主流矩阵',
    title: '4 大技术社区草稿箱秒级直达',
    desc: '打通国内主流技术作者阵地，一次撰写，多端就绪。保留掘金写作心流，各平台仅停留在草稿箱，由作者亲自把关最终发布。',
    visualType: 'platforms'
  },
  {
    colSpan: 'span-3',
    tag: '零信任安全',
    title: '100% 纯本地运行 · 零后端隐私底座',
    desc: '全流程在当前浏览器端侧独立完成，零外部中转服务器，绝不申请敏感的 Chrome 全局 Cookies 权限，零数据外泄，代码在 GitHub 完全开源可审计。',
    visualType: 'security'
  },
  {
    colSpan: 'span-5',
    tag: '幂等自愈',
    title: '草稿幂等覆盖与排版自愈引擎',
    desc: '修改了错别字或调整了代码？在掘金再次点击同步，智能状态机会自动精准覆盖各平台旧草稿，绝不产生多余废稿。微信排版专属内联编译，知乎 Draft.js 结构无缝适配。',
    visualType: 'idempotence'
  }
]
</script>

<template>
  <section id="features" class="bento-section">
    <div class="bento-container">
      <!-- Section Header -->
      <div class="bento-head">
        <div class="bento-kicker">
          <span class="kicker-glow"></span>
          <span>Core Capabilities</span>
        </div>
        <h2 class="bento-title">为苛求品质的技术作者而设计</h2>
        <p class="bento-desc">
          告别繁琐的手动复制粘贴，把原图裂图、代码乱序与格式错位等脏活累活全部交给端侧智能流水线。
        </p>
      </div>

      <!-- Bento Grid 8-Column Layout -->
      <div class="bento-grid">
        <!-- Card 1: Image Pipeline (Span 5) -->
        <div class="bento-card bento-span-5">
          <div class="card-glow-edge"></div>
          <div class="card-inner">
            <div class="card-top">
              <span class="card-tag">原图保真 · 0 外链损耗</span>
              <h3 class="card-title">原图无损转存与图床清洗直通管道</h3>
              <p class="card-desc">
                自动剥离掘金 CDN 图片水印参数，提取原始高清画质；针对微信公众平台自动同步至微信素材库，并智能裁剪生成 16:9、1:1 与 3:4 三套标准封面；对知乎与 CSDN 采用双轨二进制上传，根除防盗链裂图。
              </p>
            </div>

            <div class="pipeline-widget">
              <div class="widget-row">
                <div class="pill-chip">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>CDN 水印动态剥离</span>
                </div>
                <div class="pill-chip">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>微信三比例封面自动切图</span>
                </div>
                <div class="pill-chip">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>WebP → PNG 离线无缝转码</span>
                </div>
              </div>

              <div class="code-terminal-snippet">
                <div class="terminal-bar">
                  <span class="terminal-file">image-pipeline.worker.ts</span>
                  <span class="terminal-badge">Lossless Buffer</span>
                </div>
                <pre class="terminal-code"><code><span class="token-kw">const</span> pipeline = <span class="token-fn">createImagePipeline</span>({
  stripWatermark: <span class="token-bool">true</span>,      <span class="token-cmt">// 剥离 x-oss-process 等水印</span>
  generateCovers: [<span class="token-str">'16:9'</span>, <span class="token-str">'1:1'</span>, <span class="token-str">'3:4'</span>],
  fallbackPolicy: <span class="token-str">'binary-abort'</span> <span class="token-cmt">// 缺图严格中断保护</span>
});</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: 4 Platforms Matrix (Span 3) -->
        <div class="bento-card bento-span-3">
          <div class="card-glow-edge"></div>
          <div class="card-inner">
            <div class="card-top">
              <span class="card-tag">矩阵生态</span>
              <h3 class="card-title">4 大平台草稿箱秒级直达</h3>
              <p class="card-desc">
                一次发文，多平台草稿箱全量就绪。各平台均停留在草稿状态，由你亲自把关发布。
              </p>
            </div>

            <div class="platform-matrix-list">
              <div class="matrix-item wechat">
                <div class="matrix-info">
                  <span class="matrix-name">微信公众号</span>
                  <span class="matrix-sub">代码高亮 · 封面直存</span>
                </div>
                <span class="matrix-pill">图文草稿</span>
              </div>

              <div class="matrix-item zhihu">
                <div class="matrix-info">
                  <span class="matrix-name">知乎专栏</span>
                  <span class="matrix-sub">Draft.js 保真 · 公式支持</span>
                </div>
                <span class="matrix-pill">专栏草稿</span>
              </div>

              <div class="matrix-item csdn">
                <div class="matrix-info">
                  <span class="matrix-name">CSDN 博客</span>
                  <span class="matrix-sub">个人专栏动态对齐</span>
                </div>
                <span class="matrix-pill">博文草稿</span>
              </div>

              <div class="matrix-item cnblogs">
                <div class="matrix-info">
                  <span class="matrix-name">博客园随笔</span>
                  <span class="matrix-sub">原生 Markdown 排版</span>
                </div>
                <span class="matrix-pill">随笔草稿</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Local Privacy & Security (Span 3) -->
        <div class="bento-card bento-span-3">
          <div class="card-glow-edge"></div>
          <div class="card-inner">
            <div class="card-top">
              <span class="card-tag">零信任安全</span>
              <h3 class="card-title">100% 纯本地运行 · 零后端隐私底座</h3>
              <p class="card-desc">
                全流程在端侧沙箱独立执行，绝不向第三方服务器上传任何数据，零隐私泄漏风险。
              </p>
            </div>

            <div class="security-spec-grid">
              <div class="sec-item">
                <div class="sec-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="sec-text">
                  <strong>0 外部中转服务器</strong>
                  <small>无需注册第三方账号</small>
                </div>
              </div>

              <div class="sec-item">
                <div class="sec-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div class="sec-text">
                  <strong>零敏感 Cookies 权限</strong>
                  <small>同源 Bridge 规范交互</small>
                </div>
              </div>

              <div class="sec-item">
                <div class="sec-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <div class="sec-text">
                  <strong>MIT 源码开源审计</strong>
                  <small>代码公开透明无暗门</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Idempotence & Formatting Engine (Span 5) -->
        <div class="bento-card bento-span-5">
          <div class="card-glow-edge"></div>
          <div class="card-inner">
            <div class="card-top">
              <span class="card-tag">幂等自愈</span>
              <h3 class="card-title">草稿幂等防重与智能自愈引擎</h3>
              <p class="card-desc">
                改了错别字或调整代码重新点击同步，智能映射引擎将自动覆写目标平台的已有草稿，绝不在草稿箱堆砌重名废稿；遇到目标草稿被手动删除时，具备智能降级自愈能力。
              </p>
            </div>

            <div class="idempotent-flow">
              <div class="flow-step">
                <span class="flow-num">Step 1</span>
                <span class="flow-name">哈希映射对齐</span>
                <small class="flow-desc">双身份草稿指纹校验</small>
              </div>
              <div class="flow-divider">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div class="flow-step">
                <span class="flow-num">Step 2</span>
                <span class="flow-name">增量/覆盖判定</span>
                <small class="flow-desc">避免产生同名垃圾稿件</small>
              </div>
              <div class="flow-divider">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div class="flow-step success">
                <span class="flow-num">Step 3</span>
                <span class="flow-name">草稿原子写入</span>
                <small class="flow-desc">各平台任务独立隔离</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento-section {
  padding: 64px 0 80px;
}

.bento-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
}

.bento-head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 52px;
}

.bento-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.kicker-glow {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px var(--vp-c-brand-1);
}

.bento-title {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 16px 0;
  color: var(--bento-text-title);
}

@media (max-width: 640px) {
  .bento-title {
    font-size: 1.85rem;
  }
}

.bento-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--bento-text-body);
  margin: 0;
}

/* 8-Column Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

.bento-card {
  position: relative;
  border-radius: var(--bento-radius);
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  box-shadow: var(--bento-shadow);
  overflow: hidden;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover {
  border-color: var(--bento-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--bento-shadow-hover);
}

.bento-span-5 {
  grid-column: span 5;
}

.bento-span-3 {
  grid-column: span 3;
}

@media (max-width: 1024px) {
  .bento-span-5, .bento-span-3 {
    grid-column: span 1;
  }
}

.card-inner {
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-top {
  margin-bottom: 24px;
}

.card-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.28rem;
  font-weight: 650;
  line-height: 1.35;
  color: var(--bento-text-title);
  margin: 0 0 10px 0;
}

.card-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--bento-text-body);
  margin: 0;
}

/* Card 1: Pipeline Widget */
.pipeline-widget {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.widget-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--bento-card-subtle);
  border: 1px solid var(--bento-inner-border);
  font-size: 0.76rem;
  color: var(--bento-text-title);
  font-weight: 500;
}

.pill-chip svg {
  color: #10B981;
}

.code-terminal-snippet {
  background: #0D1117;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: var(--font-mono);
}

.terminal-bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
  font-size: 0.72rem;
}

.terminal-file {
  color: #8B949E;
}

.terminal-badge {
  color: #58A6FF;
}

.terminal-code {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: #C9D1D9;
}

.token-kw { color: #FF7B72; }
.token-fn { color: #D2A8FF; }
.token-str { color: #A5D6FF; }
.token-bool { color: #79C0FF; }
.token-cmt { color: #8B949E; font-style: italic; }

/* Card 2: Matrix List */
.platform-matrix-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.matrix-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--bento-card-subtle);
  border: 1px solid var(--bento-inner-border);
  transition: all 0.2s ease;
}

.matrix-item:hover {
  background: var(--bento-card-bg-hover);
}

.matrix-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.matrix-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bento-text-title);
}

.matrix-sub {
  font-size: 0.72rem;
  color: var(--bento-text-muted);
}

.matrix-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  color: var(--bento-text-title);
}

.matrix-item.wechat .matrix-pill { color: var(--color-wechat); border-color: rgba(7, 193, 96, 0.2); }
.matrix-item.zhihu .matrix-pill { color: var(--color-zhihu); border-color: rgba(0, 102, 255, 0.2); }
.matrix-item.csdn .matrix-pill { color: var(--color-csdn); border-color: rgba(252, 85, 49, 0.2); }
.matrix-item.cnblogs .matrix-pill { color: var(--color-cnblogs); border-color: rgba(16, 185, 129, 0.2); }

/* Card 3: Security Grid */
.security-spec-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sec-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--bento-card-subtle);
  border: 1px solid var(--bento-inner-border);
}

.sec-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sec-text {
  display: flex;
  flex-direction: column;
}

.sec-text strong {
  font-size: 0.82rem;
  color: var(--bento-text-title);
}

.sec-text small {
  font-size: 0.72rem;
  color: var(--bento-text-muted);
}

/* Card 4: Idempotent Flow */
.idempotent-flow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 8px;
  background: var(--bento-card-subtle);
  border: 1px solid var(--bento-inner-border);
  overflow-x: auto;
}

.flow-step {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.flow-num {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.flow-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--bento-text-title);
}

.flow-desc {
  font-size: 0.7rem;
  color: var(--bento-text-muted);
}

.flow-step.success .flow-name {
  color: #10B981;
}

.flow-divider {
  color: var(--bento-text-muted);
  opacity: 0.6;
}
</style>
