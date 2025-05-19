import { createApp } from "vue"
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query"
import App from "./App.vue"
import "./style.css"
import router from "./router"

// Создаем клиент для запросов
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем повторные запросы при фокусе окна
      retry: 2, // Количество попыток при ошибке
    },
  },
})

const app = createApp(App)
app.use(router)

// Подключаем плагин
app.use(VueQueryPlugin, { queryClient })

app.mount("#app")
