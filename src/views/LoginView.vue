
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function submitLogin() {
  error.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = 'Enter both your email and password.'
    return
  }

  loading.value = true

  try {
    auth.login({
      email: email.value,
      password: password.value
    })

    const destination = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/'

    router.push(destination)
  } catch (err) {
    error.value = err.message || 'Unable to sign in.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink to="/" class="brand auth-brand">
        <span class="brand-logo">S</span>
        <span>Student<span class="brand-accent">MS</span></span>
      </RouterLink>

      <div class="auth-heading">
        <span class="hero-tag">WELCOME BACK</span>
        <h1>Sign in to StudentMS</h1>
        <p>Access your academic management workspace.</p>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form class="auth-form" @submit.prevent="submitLogin">
        <div class="field">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-wide" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign In →' }}
        </button>
      </form>

      <p class="auth-switch">
        Don't have an account?
        <RouterLink to="/register">Create one</RouterLink>
      </p>

      <RouterLink to="/" class="back-home">← Back to homepage</RouterLink>
    </section>
  </main>
</template>
