
<script setup>
defineProps({
  label: String,
  value: [String, Number],
  note: String,
  icon: String,
  tone: {
    type: String,
    default: 'blue'
  }
})
</script>

<template>
  <article class="stat-card">
    <div class="stat-top">
      <span>{{ label }}</span>
      <span class="stat-icon" :class="tone">{{ icon }}</span>
    </div>

    <div class="stat-value">{{ value }}</div>
    <div class="stat-note">{{ note }}</div>
  </article>
</template>
