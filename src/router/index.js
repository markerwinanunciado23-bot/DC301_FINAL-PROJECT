
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import HomeView from '../views/HomeView.vue'
import StudentsView from '../views/StudentsView.vue'
import StudentFormView from '../views/StudentFormView.vue'
import CoursesView from '../views/CoursesView.vue'
import CourseFormView from '../views/CourseFormView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Overview' }
    },
    {
      path: '/students',
      name: 'students',
      component: StudentsView,
      meta: { title: 'Students' }
    },
    {
      path: '/students/new',
      name: 'student-new',
      component: StudentFormView,
      meta: { title: 'Add Student' }
    },
    {
      path: '/students/:id/edit',
      name: 'student-edit',
      component: StudentFormView,
      meta: { title: 'Edit Student' }
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
      meta: { title: 'Courses' }
    },
    {
      path: '/courses/new',
      name: 'course-new',
      component: CourseFormView,
      meta: { title: 'Add Course' }
    },
    {
      path: '/courses/:id/edit',
      name: 'course-edit',
      component: CourseFormView,
      meta: { title: 'Edit Course' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { title: 'My Profile', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login', guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Register', guestOnly: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(to => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

router.afterEach(to => {
  document.title = `${to.meta.title || 'StudentMS'} | StudentMS`
})

export default router
