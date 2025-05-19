<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { register, login, isAuthenticated } from "../API/LoginRegister"

const router = useRouter()

// Форма
const email = ref("") // Тестовый пользователь reqres
const password = ref("")
const isLoginMode = ref(true) // true = вход, false = регистрация
const error = ref("")
const isLoading = ref(false)

// Проверяем авторизацию при загрузке
if (isAuthenticated()) {
  router.push("/")
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ""

    if (isLoginMode.value) {
      // Логика входа
      const result = await login(email.value, password.value)
      if (!result) throw new Error("Ошибка авторизации")
      router.push("/")
    } else {
      // Логика регистрации
      const result = register(email.value, password.value)
      if (result !== "Регистрация прошла успешна") throw new Error(result)
      alert(result + " Теперь войдите")
      isLoginMode.value = true // Переключаем на форму входа
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Неизвестная ошибка"
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">
        {{ isLoginMode ? "Вход в систему" : "Регистрация" }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Поле email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            autocomplete="true"
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Поле пароля -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Пароль</label
          >
          <input
            autocomplete="true"
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Кнопка отправки -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="isLoading">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span v-else>
            {{ isLoginMode ? "Войти" : "Зарегистрироваться" }}
          </span>
        </button>

        <!-- Сообщение об ошибке -->
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </form>

      <!-- Переключение между формами -->
      <div class="mt-4 text-center">
        <button
          @click="isLoginMode = !isLoginMode"
          class="text-sm text-blue-600 hover:text-blue-500 focus:outline-none cursor-pointer"
        >
          {{
            isLoginMode
              ? "Нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"
          }}
        </button>
      </div>

      <!-- Тестовые данные -->
      <div
        v-if="isLoginMode"
        class="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-500"
      >
        <p class="font-medium">Тестовые данные для входа (reqres.in):</p>
        <p>Email: eve.holt@reqres.in</p>
        <p>Пароль: cityslicka</p>
      </div>
    </div>
  </div>
</template>
