
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

function submitRegistration() {
  error.value = ''

  if (name.value.trim().length < 2) {
    error.value = 'Your name must contain at least 2 characters.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    error.value = 'Enter a valid email address.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must contain at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'The passwords do not match.'
    return
  }

  loading.value = true

  try {
    auth.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    router.push('/')
  } catch (err) {
    error.value = err.message || 'Unable to create account.'
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
        <span class="hero-tag">GET STARTED</span>
        <h1>Create your account</h1>
        <p>Register a demo account to access your profile.</p>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form class="auth-form" @submit.prevent="submitRegistration">
        <div class="field">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="name"
            autocomplete="name"
            placeholder="Your full name"
            required
          />
        </div>

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
            autocomplete="new-password"
            minlength="8"
            placeholder="At least 8 characters"
            required
          />
        </div>

        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Enter password again"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-wide" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Create Account →' }}
        </button>
      </form>

      <p class="auth-switch">
        Already registered?
        <RouterLink to="/login">Sign in</RouterLink>
      </p>

      <RouterLink to="/" class="back-home">← Back to homepage</RouterLink>
    </section>
  </main>
</template>
