
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <RouterLink to="/" class="brand">
        <span class="brand-logo">S</span>
        <span>Student<span class="brand-accent">MS</span></span>
      </RouterLink>

      <p class="nav-label">WORKSPACE</p>

      <nav class="side-nav">
        <RouterLink to="/" class="nav-link">
          <span>⌂</span> Overview
        </RouterLink>
        <RouterLink to="/students" class="nav-link">
          <span>♙</span> Students
        </RouterLink>
        <RouterLink to="/courses" class="nav-link">
          <span>▤</span> Courses
        </RouterLink>
      </nav>

      <p class="nav-label">ACCOUNT</p>

      <nav class="side-nav">
        <RouterLink to="/profile" class="nav-link">
          <span>◎</span> My Profile
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="user-mini">
          <div class="avatar">{{ (auth.user?.name || 'D').charAt(0).toUpperCase() }}</div>
          <div class="user-mini-info">
            <strong>{{ auth.user?.name || 'Demo User' }}</strong>
            <small>{{ auth.user?.email || 'Guest' }}</small>
          </div>
        </div>

        <button class="logout-button" @click="logout">
          ↪ Sign out
        </button>
      </div>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <div>
          <p class="eyebrow">STUDENT MANAGEMENT SYSTEM</p>
          <h2>{{ $route.meta.title || 'Dashboard' }}</h2>
        </div>

        <div class="topbar-right">
          <span class="status-dot"></span>
          <span class="online-label">System online</span>
          <RouterLink to="/profile" class="avatar avatar-small">
            {{ (auth.user?.name || 'D').charAt(0).toUpperCase() }}
          </RouterLink>
        </div>
      </header>

      <div class="page-content">
        <slot />
      </div>

      <footer class="footer">
        StudentMS · Vue 3 SPA · Academic Records Management
      </footer>
    </main>
  </div>
</template>
