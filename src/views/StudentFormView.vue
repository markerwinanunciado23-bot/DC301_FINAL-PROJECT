
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import AppShell from '../components/AppShell.vue'

const route = useRoute()
const router = useRouter()
const editing = computed(() => Boolean(route.params.id))

const courses = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const fieldErrors = ref({})

const form = ref({
  fullName: '',
  email: '',
  courseId: '',
  yearLevel: ''
})

const yearLevels = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year'
]

// Fallback courses are used if the API has no course records.
const defaultCourses = [
  { id: '1', code: 'BSN', name: 'Bachelor of Science in Nursing' },
  { id: '2', code: 'BSIT', name: 'Bachelor of Science in Information Technology' },
  { id: '3', code: 'BSHM', name: 'Bachelor of Science in Hospitality Management' },
  { id: '4', code: 'BSCJ', name: 'Bachelor of Science in Criminology' },
  { id: '5', code: 'BSTM', name: 'Bachelor of Science in Tourism Management' },
  { id: '6', code: 'BSCS', name: 'Bachelor of Science in Computer Science' }
]

async function loadForm() {
  loading.value = true
  error.value = ''

  try {
    const courseResponse = await api.get('/courses')

    // Use API courses when available; otherwise show the six default options.
    courses.value = courseResponse.data.length
      ? courseResponse.data
      : defaultCourses
  } catch (err) {
    // Still allow course selection if the course API is unavailable.
    courses.value = defaultCourses
    error.value = 'Could not load courses from the API. Default courses are shown.'
  }

  if (editing.value) {
    try {
      const response = await api.get(`/students/${route.params.id}`)

      form.value = {
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        courseId: String(response.data.courseId ?? ''),
        yearLevel: response.data.yearLevel || ''
      }
    } catch (err) {
      error.value = err.userMessage || 'Unable to load student information.'
    }
  }

  loading.value = false
}

function validate() {
  const errors = {}
  const email = form.value.email.trim()

  if (form.value.fullName.trim().length < 2) {
    errors.fullName = 'Enter a name with at least 2 characters.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.value.courseId) {
    errors.courseId = 'Please select a course.'
  }

  if (!form.value.yearLevel) {
    errors.yearLevel = 'Please select a year level.'
  }

  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

async function saveStudent() {
  error.value = ''

  if (!validate()) return

  saving.value = true

  const payload = {
    fullName: form.value.fullName.trim(),
    email: form.value.email.trim(),
    courseId: String(form.value.courseId),
    yearLevel: form.value.yearLevel
  }

  try {
    if (editing.value) {
      await api.put(`/students/${route.params.id}`, payload)
    } else {
      await api.post('/students', {
        ...payload,
        createdAt: new Date().toISOString().slice(0, 10)
      })
    }

    router.push({
      name: 'students',
      query: { saved: '1' }
    })
  } catch (err) {
    error.value = err.userMessage || 'Unable to save student.'
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
        <h1>{{ editing ? 'Edit Student' : 'Add Student' }}</h1>
        <p>
          {{ editing
            ? 'Update the student’s academic information.'
            : 'Enter the information to register a new student.' }}
        </p>
      </div>

      <RouterLink to="/students" class="btn btn-quiet">
        ← Back to Students
      </RouterLink>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <section class="form-panel">
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        Loading form…
      </div>

      <form
        v-else
        class="form-grid"
        @submit.prevent="saveStudent"
        novalidate
      >
        <div class="form-section-title">
          <span class="section-icon">♙</span>
          <div>
            <h2>Student Information</h2>
            <p class="muted">Fields marked with * are required.</p>
          </div>
        </div>

        <!-- FULL NAME -->
        <div class="field full-width">
          <label for="fullName">Full Name *</label>
          <input
            id="fullName"
            v-model="form.fullName"
            placeholder="e.g. Juan Dela Cruz"
            autocomplete="name"
            required
          />

          <small v-if="fieldErrors.fullName" class="field-error">
            {{ fieldErrors.fullName }}
          </small>
        </div>

        <!-- EMAIL -->
        <div class="field full-width">
          <label for="email">Email Address *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="student@example.com"
            autocomplete="email"
            required
          />

          <small v-if="fieldErrors.email" class="field-error">
            {{ fieldErrors.email }}
          </small>
        </div>

        <!-- COURSE DROPDOWN -->
        <div class="field">
          <label for="course">Course *</label>

          <select
            id="course"
            v-model="form.courseId"
            required
          >
            <option value="" disabled>Select course</option>

            <option
              v-for="course in courses"
              :key="course.id"
              :value="String(course.id)"
            >
              {{ course.code }} — {{ course.name }}
            </option>
          </select>

          <small v-if="fieldErrors.courseId" class="field-error">
            {{ fieldErrors.courseId }}
          </small>
        </div>

        <!-- YEAR LEVEL DROPDOWN -->
        <div class="field">
          <label for="yearLevel">Year Level *</label>

          <select
            id="yearLevel"
            v-model="form.yearLevel"
            required
          >
            <option value="" disabled>Select year level</option>

            <option
              v-for="year in yearLevels"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>

          <small v-if="fieldErrors.yearLevel" class="field-error">
            {{ fieldErrors.yearLevel }}
          </small>
        </div>

        <!-- FORM BUTTONS -->
        <div class="form-actions full-width">
          <RouterLink to="/students" class="btn btn-quiet">
            Cancel
          </RouterLink>

          <button
            class="btn btn-primary"
            type="submit"
            :disabled="saving"
          >
            {{
              saving
                ? 'Saving…'
                : editing
                  ? 'Update Student'
                  : 'Save Student'
            }}
          </button>
        </div>
      </form>
    </section>
  </AppShell>
</template>
