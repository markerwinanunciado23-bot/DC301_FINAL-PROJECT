
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 8000
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. Please try again.'
    } else if (!error.response) {
      error.userMessage =
        'Cannot reach the API. Make sure JSON Server is running.'
    } else {
      error.userMessage =
        error.response.data?.message || 'Something went wrong.'
    }

    return Promise.reject(error)
  }
)

export default api
