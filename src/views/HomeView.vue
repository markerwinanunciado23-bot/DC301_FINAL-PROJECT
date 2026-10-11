
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import AppShell from '../components/AppShell.vue'
import StatCard from '../components/StatCard.vue'

const students = ref([])
const courses = ref([])
const loading = ref(true)
const error = ref('')

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    const [studentResponse, courseResponse] = await Promise.all([
      api.get('/students'),
      api.get('/courses')
    ])

    students.value = studentResponse.data
    courses.value = courseResponse.data
  } catch (err) {
    error.value = err.userMessage || 'Unable to load dashboard.'
  } finally {
    loading.value = false
  }
}

function courseName(id) {
  return courses.value.find(course => String(course.id) === String(id))?.code || 'Unassigned'
}

onMounted(loadDashboard)
</script>

<template>
  <AppShell>
    <section class="hero">
      <div class="hero-content">
        <span class="hero-tag">✦ ACADEMIC MANAGEMENT</span>
        <h1>Manage your campus,<br />one record at a time.</h1>
        <p>
          Welcome to StudentMS. Manage student information and academic
          courses in one organized workspace.
        </p>

        <div class="hero-actions">
          <RouterLink to="/students" class="btn btn-primary">
            View Students →
          </RouterLink>
          <RouterLink to="/courses" class="btn btn-outline">
            Explore Courses
          </RouterLink>
        </div>
      </div>

      <div class="hero-art" aria-hidden="true">
        <div class="art-circle"></div>
        <div class="art-card">
          <div class="art-cap">🎓</div>
          <div class="art-line long"></div>
          <div class="art-line"></div>
          <div class="art-line short"></div>
          <div class="art-badge">STUDENTMS</div>
        </div>
        <div class="art-orbit">✦</div>
      </div>
    </section>

    <div v-if="error" class="alert alert-error">
      {{ error }}
      <button class="text-button" @click="loadDashboard">Retry</button>
    </div>

    <div class="section-heading">
      <div>
        <h2>Overview</h2>
        <p class="muted">A quick look at your academic records.</p>
      </div>
      <span class="live-badge">● Live data</span>
    </div>

    <div class="stats-grid">
      <StatCard
        label="Total Students"
        :value="loading ? '—' : students.length"
        note="Registered student records"
        icon="♙"
        tone="blue"
      />
      <StatCard
        label="Available Courses"
        :value="loading ? '—' : courses.length"
        note="Academic programs"
        icon="▤"
        tone="purple"
      />
      <StatCard
        label="Academic Records"
        :value="loading ? '—' : students.length + courses.length"
        note="Students plus courses"
        icon="▦"
        tone="green"
      />
    </div>

    <div class="section-heading">
      <div>
        <h2>Quick Actions</h2>
        <p class="muted">Go directly to the task you need.</p>
      </div>
    </div>

    <div class="quick-grid">
      <RouterLink to="/students/new" class="quick-card">
        <span class="quick-icon blue">＋</span>
        <div>
          <h3>Add a Student</h3>
          <p>Register a student and assign an academic course.</p>
        </div>
        <span class="quick-arrow">→</span>
      </RouterLink>

      <RouterLink to="/courses/new" class="quick-card">
        <span class="quick-icon purple">▤</span>
        <div>
          <h3>Add a Course</h3>
          <p>Create a new academic program in the database.</p>
        </div>
        <span class="quick-arrow">→</span>
      </RouterLink>

      <RouterLink to="/students" class="quick-card">
        <span class="quick-icon green">☷</span>
        <div>
          <h3>Manage Records</h3>
          <p>Search, update, or remove student records.</p>
        </div>
        <span class="quick-arrow">→</span>
      </RouterLink>
    </div>

    <div class="section-heading">
      <div>
        <h2>Recent Students</h2>
        <p class="muted">Latest records in your system.</p>
      </div>
      <RouterLink to="/students" class="text-link">View all →</RouterLink>
    </div>

    <div class="panel">
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span> Loading student records…
      </div>

      <div v-else-if="students.length === 0" class="empty-state">
        <h3>No students yet</h3>
        <p>Add your first student to get started.</p>
        <RouterLink to="/students/new" class="btn btn-primary">
          Add Student
        </RouterLink>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>EMAIL</th>
              <th>COURSE</th>
              <th>YEAR LEVEL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students.slice(0, 5)" :key="student.id">
              <td>
                <div class="person-cell">
                  <span class="table-avatar">
                    {{ student.fullName.charAt(0).toUpperCase() }}
                  </span>
                  <strong>{{ student.fullName }}</strong>
                </div>
              </td>
              <td>{{ student.email }}</td>
              <td><span class="course-badge">{{ courseName(student.courseId) }}</span></td>
              <td>{{ student.yearLevel }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
</template>
