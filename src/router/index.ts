import { createRouter, createWebHistory } from "vue-router"
import { isAuthenticated } from "../API/LoginRegister"

const routes = [
  {
    path: "/",
    name: "Weather",
    component: () => import("../components/WeatherToday.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/LoginForm.vue"),
    meta: { requiresGuest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = isAuthenticated()

  // Если требуется авторизация, но пользователь не авторизован
  if (to.meta.requiresAuth && !auth) {
    return { name: "Login" }
  }

  // Если роут только для гостей, но пользователь авторизован
  if (to.meta.requiresGuest && auth) {
    return { name: "Weather" }
  }

  // Во всех остальных случаях продолжаем навигацию
  return true
})

export default router
