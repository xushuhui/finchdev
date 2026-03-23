<template>
  <t-layout class="app-shell">
    <Header />
    <t-content class="main-content">
      <RouterView />
    </t-content>
    <Footer />
  </t-layout>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
</script>
