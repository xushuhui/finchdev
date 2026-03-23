<template>
  <t-footer style="padding: 48px 24px; border-top: 1px solid var(--td-border-level-1); text-align: center;">
    <p style="color: var(--td-text-color-secondary); margin-bottom: 8px;">
      &copy; {{ year }} FinchDev. Free online tools for developers.
    </p>
    <p style="color: var(--td-text-color-placeholder); font-size: 12px;">
      Built for quick daily tasks: JSON, regex, Base64, timestamp, and URL tools.
    </p>
  </t-footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
