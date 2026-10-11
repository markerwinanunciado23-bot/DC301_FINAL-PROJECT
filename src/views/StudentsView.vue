
<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import AppShell from '../components/AppShell.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const students = ref([])
const courses = ref([])
const search = ref('')
const loading = ref(true)
const error = ref('')
const deleting = ref(false)
const selectedStudent = ref(null)
const notice = ref('')

const filteredStudents = computed(() => {
  const query = search.value.trim().toLowerCase()

  return students.value.filter(student => {
    const course = courses.value.find(
      item => String(item.id) === String(student.courseId)
    )

    return [
      student.fullName,
      student.email,
      course?.code || ''
    ].some(value => String(value).toLowerCase().includes(query))
  })
})

function courseName(id) {
  return courses.value.find(
    item => String(item.id) === String(id)
  )?.code || 'Unassigned'
}

async function loadData() {
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
    error.value = err.userMessage || 'Failed to load students.'
  } finally {
    loading.value = false
  }
}

async function deleteStudent() {
  if (!selectedStudent.value) return

  deleting.value = true
  error.value = ''

  try {
    await api.delete(`/students/${selectedStudent.value.id}`)
    notice.value = `${selectedStudent.value.fullName} was deleted.`
    selectedStudent.value = null
    await loadData()
  } catch (err) {
    error.value = err.userMessage || 'Could not delete student.'
  } finally {
    deleting.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <AppShell>
    <div class="page-intro">
      <div>
        <h1>Students</h1>
        <p>Manage student information and academic records.</p>
      </div>
      <RouterLink to="/students/new" class="btn btn-primary">
        ＋ Add Student
      </RouterLink>
    </div>

    <div v-if="notice" class="alert alert-success">
      {{ notice }}
      <button class="text-button" @click="notice = ''">Dismiss</button>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
      <button class="text-button" @click="loadData">Retry</button>
    </div>

    <section class="panel">
      <div class="panel-toolbar">
        <div>
          <h2>Student Directory</h2>
          <p class="muted">{{ filteredStudents.length }} student(s) found</p>
        </div>

        <input
          v-model="search"
          class="search-input"
          type="search"
          placeholder="Search name, email, or course…"
          aria-label="Search students"
        />
      </div>

      <div v-if="loading" class="loading-state">
        <span class="spinner"></span> Loading students…
      </div>

      <div v-else-if="filteredStudents.length === 0" class="empty-state">
        <h3>No matching students</h3>
        <p>Try another search or add a student.</p>
        <RouterLink to="/students/new" class="btn btn-primary">
          Add Student
        </RouterLink>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>STUDENT</th>
              <th>EMAIL</th>
              <th>COURSE</th>
              <th>YEAR LEVEL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td class="muted">#{{ student.id }}</td>
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
              <td>
                <div class="action-buttons">
                  <RouterLink
                    :to="{ name: 'student-edit', params: { id: student.id } }"
                    class="btn btn-small btn-quiet"
                  >
                    Edit
                  </RouterLink>
                  <button
                    class="btn btn-small btn-danger"
                    @click="selectedStudent = student"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ConfirmModal
      :show="Boolean(selectedStudent)"
      title="Delete student?"
      :message="`Delete ${selectedStudent?.fullName || 'this student'}? This action cannot be undone.`"
      :busy="deleting"
      @cancel="selectedStudent = null"
      @confirm="deleteStudent"
    />
  </AppShell>
</template>
