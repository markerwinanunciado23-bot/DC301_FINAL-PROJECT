
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppShell from '../components/AppShell.vue'

const auth = useAuthStore()
const router = useRouter()

const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const message = ref('')
const error = ref('')

function saveProfile() {
  error.value = ''
  message.value = ''

  if (name.value.trim().length < 2) {
    error.value = 'Enter a name with at least 2 characters.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    error.value = 'Enter a valid email address.'
    return
  }

  try {
    auth.updateProfile({
      name: name.value,
      email: email.value
    })

    message.value = 'Profile updated successfully.'
  } catch (err) {
    error.value = err.message || 'Unable to update profile.'
  }
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <AppShell>
    <div class="page-intro">
      <div>
        <h1>My Profile</h1>
        <p>Manage your account information.</p>
      </div>
    </div>

    <div v-if="message" class="alert alert-success">{{ message }}</div>
    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <section class="profile-layout">
      <div class="panel profile-summary">
        <div class="profile-avatar">
          {{ (auth.user?.name || 'U').charAt(0).toUpperCase() }}
        </div>
        <h2>{{ auth.user?.name }}</h2>
        <p class="muted">{{ auth.user?.email }}</p>
        <span class="course-badge">Demo Account</span>

        <div class="profile-divider"></div>

        <div class="profile-detail">
          <span>Account status</span>
          <strong><span class="status-dot"></span> Active</strong>
        </div>
        <div class="profile-detail">
          <span>Authentication</span>
          <strong>Local demo</strong>
        </div>
      </div>

      <section class="form-panel">
        <div class="form-section-title">
          <span class="section-icon">◎</span>
          <div>
            <h2>Personal Information</h2>
            <p class="muted">Update the name and email for your account.</p>
          </div>
        </div>

        <form class="form-grid" @submit.prevent="saveProfile">
          <div class="field full-width">
            <label for="name">Full Name</label>
            <input id="name" v-model="name" required />
          </div>

          <div class="field full-width">
            <label for="email">Email Address</label>
            <input id="email" v-model="email" type="email" required />
          </div>

          <div class="form-actions full-width">
            <button type="button" class="btn btn-danger" @click="logout">
              Sign Out
            </button>
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </section>
  </AppShell>
</template>

