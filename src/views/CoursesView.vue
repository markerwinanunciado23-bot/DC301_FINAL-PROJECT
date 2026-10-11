
<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import AppShell from '../components/AppShell.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const courses = ref([])
const students = ref([])
const search = ref('')
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const notice = ref('')
const selectedCourse = ref(null)

const filteredCourses = computed(() => {
  const query = search.value.trim().toLowerCase()

  return courses.value.filter(course =>
    [course.code, course.name, course.description]
      .some(value => String(value || '').toLowerCase().includes(query))
  )
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [courseResponse, studentResponse] = await Promise.all([
      api.get('/courses'),
      api.get('/students')
    ])

    courses.value = courseResponse.data
    students.value = studentResponse.data
  } catch (err) {
    error.value = err.userMessage || 'Unable to load courses.'
  } finally {
    loading.value = false
  }
}

function studentCount(courseId) {
  return students.value.filter(
    student => String(student.courseId) === String(courseId)
  ).length
}

async function deleteCourse() {
  if (!selectedCourse.value) return

  const course = selectedCourse.value

  if (studentCount(course.id) > 0) {
    error.value = 'This course has enrolled students. Reassign or remove those student records first.'
    selectedCourse.value = null
    return
  }

  saving.value = true
  error.value = ''

  try {
    await api.delete(`/courses/${course.id}`)
    notice.value = `${course.code} was deleted.`
    selectedCourse.value = null
    await loadData()
  } catch (err) {
    error.value = err.userMessage || 'Unable to delete course.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <AppShell>
    <div class="page-intro">
      <div>
        <h1>Courses</h1>
        <p>Manage academic programs and course information.</p>
      </div>
      <RouterLink to="/courses/new" class="btn btn-primary">＋ Add Course</RouterLink>
    </div>

    <div v-if="notice" class="alert alert-success">
      {{ notice }}
      <button class="text-button" @click="notice = ''">Dismiss</button>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
      <button class="text-button" @click="error = ''">Dismiss</button>
    </div>

    <section class="panel">
      <div class="panel-toolbar">
        <div>
          <h2>Academic Programs</h2>
          <p class="muted">{{ filteredCourses.length }} course(s) found</p>
        </div>

        <input
          v-model="search"
          class="search-input"
          type="search"
          placeholder="Search courses…"
          aria-label="Search courses"
        />
      </div>

      <div v-if="loading" class="loading-state">
        <span class="spinner"></span> Loading courses…
      </div>

      <div v-else-if="filteredCourses.length === 0" class="empty-state">
        <h3>No courses found</h3>
        <p>Create a course or change your search.</p>
        <RouterLink to="/courses/new" class="btn btn-primary">Add Course</RouterLink>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>CODE</th>
              <th>COURSE NAME</th>
              <th>DESCRIPTION</th>
              <th>STUDENTS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="course in filteredCourses" :key="course.id">
              <td><span class="course-badge">{{ course.code }}</span></td>
              <td><strong>{{ course.name }}</strong></td>
              <td class="description-cell">{{ course.description || 'No description' }}</td>
              <td>{{ studentCount(course.id) }}</td>
              <td>
                <div class="action-buttons">
                  <RouterLink
                    :to="{ name: 'course-edit', params: { id: course.id } }"
                    class="btn btn-small btn-quiet"
                  >
                    Edit
                  </RouterLink>
                  <button
                    class="btn btn-small btn-danger"
                    @click="selectedCourse = course"
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
      :show="Boolean(selectedCourse)"
      title="Delete course?"
      :message="`Delete ${selectedCourse?.code || 'this course'}? Courses assigned to students cannot be deleted.`"
      :busy="saving"
      @cancel="selectedCourse = null"
      @confirm="deleteCourse"
    />
  </AppShell>
</template>
