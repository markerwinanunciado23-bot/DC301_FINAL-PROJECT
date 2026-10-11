
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import AppShell from '../components/AppShell.vue'

const route = useRoute()
const router = useRouter()
const editing = computed(() => Boolean(route.params.id))

const form = ref({
  code: '',
  name: '',
  description: ''
})

const courses = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const fieldErrors = ref({})

async function loadForm() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/courses')
    courses.value = response.data

    if (editing.value) {
      const result = await api.get(`/courses/${route.params.id}`)
      form.value = {
        code: result.data.code || '',
        name: result.data.name || '',
        description: result.data.description || ''
      }
    }
  } catch (err) {
    error.value = err.userMessage || 'Unable to load course.'
  } finally {
    loading.value = false
  }
}

function validate() {
  const errors = {}
  const code = form.value.code.trim().toUpperCase()

  if (!/^[A-Z0-9-]{2,12}$/.test(code)) {
    errors.code = 'Use 2–12 letters, numbers, or hyphens.'
  }

  if (form.value.name.trim().length < 3) {
    errors.name = 'Course name must have at least 3 characters.'
  }

  if (courses.value.some(course =>
    String(course.id) !== String(route.params.id || '') &&
    course.code.toLowerCase() === code.toLowerCase()
  )) {
    errors.code = 'This course code already exists.'
  }

  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

async function saveCourse() {
  error.value = ''

  if (!validate()) return

  saving.value = true

  const payload = {
    code: form.value.code.trim().toUpperCase(),
    name: form.value.name.trim(),
    description: form.value.description.trim()
  }

  try {
    if (editing.value) {
      await api.put(`/courses/${route.params.id}`, payload)
    } else {
      await api.post('/courses', payload)
    }

    router.push('/courses')
  } catch (err) {
    error.value = err.userMessage || 'Unable to save course.'
  } finally {
    saving.value = false
  }
}

onMounted(loadForm)
</script>

<template>
  <AppShell>
    <div class="page-intro">
      <div>
        <h1>{{ editing ? 'Edit Course' : 'Add Course' }}</h1>
        <p>{{ editing ? 'Update the academic program.' : 'Register a new academic program.' }}</p>
      </div>
      <RouterLink to="/courses" class="btn btn-quiet">← Back to Courses</RouterLink>
    </div>

    <div v-if="error" class="alert alert-error">{{ error }}</div>

    <section class="form-panel">
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span> Loading course…
      </div>

      <form v-else class="form-grid" @submit.prevent="saveCourse" novalidate>
        <div class="form-section-title">
          <span class="section-icon">▤</span>
          <div>
            <h2>Course Information</h2>
            <p class="muted">Complete the academic program details.</p>
          </div>
        </div>

        <div class="field">
          <label for="code">Course Code *</label>
          <input
            id="code"
            v-model="form.code"
            placeholder="e.g. BSIT"
            required
          />
          <small v-if="fieldErrors.code" class="field-error">{{ fieldErrors.code }}</small>
        </div>

        <div class="field">
          <label for="name">Course Name *</label>
          <input
            id="name"
            v-model="form.name"
            placeholder="e.g. Bachelor of Science in IT"
            required
          />
          <small v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</small>
        </div>

        <div class="field full-width">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            placeholder="Briefly describe the academic program…"
          ></textarea>
        </div>

        <div class="form-actions full-width">
          <RouterLink to="/courses" class="btn btn-quiet">Cancel</RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving…' : editing ? 'Update Course' : 'Save Course' }}
          </button>
        </div>
      </form>
    </section>
  </AppShell>
</template>
 