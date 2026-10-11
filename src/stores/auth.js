
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const USERS_KEY = 'studentms-users'
const SESSION_KEY = 'studentms-session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(
    JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  )

  const isAuthenticated = computed(() => Boolean(user.value))

  function register({ name, email, password }) {
    const users = getUsers()

    if (
      users.some(
        item => item.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      throw new Error('An account with this email already exists.')
    }

    users.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password
    })

    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    login({ email, password })
  }

  function login({ email, password }) {
    const account = getUsers().find(
      item =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    )

    if (!account) {
      throw new Error('Incorrect email or password.')
    }

    user.value = {
      id: account.id,
      name: account.name,
      email: account.email
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  function updateProfile({ name, email }) {
    if (!user.value) {
      throw new Error('Please sign in first.')
    }

    const users = getUsers()

    if (
      users.some(
        item =>
          item.id !== user.value.id &&
          item.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      throw new Error('That email is already in use.')
    }

    const index = users.findIndex(
      item => item.id === user.value.id
    )

    if (index !== -1) {
      users[index].name = name.trim()
      users[index].email = email.trim()

      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    user.value = {
      ...user.value,
      name: name.trim(),
      email: email.trim()
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
  }

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile
  }
})
