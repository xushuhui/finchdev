<template>
  <t-footer class="site-footer">
    <t-row :gutter="[16, 16]">
      <t-col :xs="12" :md="8">
        <t-card class="footer-card" :bordered="false">
          <t-space direction="vertical" size="8px">
            <p class="footer-title">FinchDev</p>
            <p class="footer-text">&copy; {{ year }} FinchDev. Free online tools for developers, built for quick daily debugging and conversion tasks.</p>
          </t-space>
        </t-card>
      </t-col>
      <t-col :xs="12" :md="4">
        <t-card class="footer-card" :bordered="false">
          <t-space wrap>
            <t-tag theme="success" variant="light-outline">Browser Only</t-tag>
            <t-tag theme="primary" variant="light-outline">SSG</t-tag>
            <t-tag theme="warning" variant="light-outline">No Login</t-tag>
          </t-space>
        </t-card>
      </t-col>
    </t-row>
  </t-footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  padding: 20px 24px 32px;
  border-top: 1px solid var(--td-component-border);
}

.footer-card {
  border-radius: var(--td-radius-extraLarge);
  background: var(--td-bg-color-container);
}

.footer-title {
  margin: 0;
  color: var(--td-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.footer-text {
  margin: 0;
  color: var(--td-text-color-secondary);
  line-height: 1.7;
}
</style>
