<script setup lang="ts">
import { ref } from "vue"
import { UseWeatherNow } from "../Hooks/UseWeatherNow"
import { logout } from "../API/LoginRegister"
import { useRouter } from "vue-router"

const city = ref("Москва")
const inputCity = ref("")
const { data: weather, isLoading, isError, error } = UseWeatherNow(city)
const formHandler = () => {
  city.value = inputCity.value
}

const router = useRouter()

const handleLogout = () => {
  logout()
  router.push("/login")
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-300 to-sky-300 py-12 px-4"
  >
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-blue-800 mb-8">
        Прогноз погоды
      </h1>

      <div class="py-12 px-4 sm:px-6 lg:px-8">
        <div
          class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
        >
          <!-- Заголовок -->
          <div
            class="bg-blue-500 p-6 text-white flex items-center justify-between"
          >
            <h1 class="text-2xl font-bold text-center">Погода сейчас</h1>
            <button
              class="p-2 bg-white text-black font-medium rounded-xl hover:scale-105 cursor-pointer"
              @click="handleLogout"
            >
              Выйти
            </button>
          </div>

          <!-- Основное содержимое -->
          <div class="p-8">
            <!-- Поле ввода города -->
            <div class="mb-6">
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Город</label
              >
              <div class="relative">
                <input
                  id="city"
                  v-model="inputCity"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Введите город"
                />
                <button
                  type="submit"
                  @click.prevent="formHandler"
                  class="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg
                    class="h-5 w-5 hover:scale-105 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Состояние загрузки -->
            <div
              v-if="isLoading"
              class="flex justify-center items-center py-12"
            >
              <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
              ></div>
            </div>

            <!-- Состояние ошибки -->
            <div
              v-if="isError"
              class="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    Ошибка при загрузке данных, проверьте правильно ли введен
                    город
                  </p>
                </div>
              </div>
            </div>

            <!-- Отображение погоды -->
            <div v-if="weather && !isLoading" class="space-y-6">
              <div class="text-center">
                <h2 class="text-3xl font-bold text-gray-800">
                  {{ weather.name }}, {{ weather.sys?.country }}
                </h2>
                <p class="text-gray-500">
                  {{ new Date(weather.dt * 1000).toLocaleDateString() }}
                </p>
              </div>

              <div
                class="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between"
              >
                <div class="flex items-center mb-4 sm:mb-0">
                  <img
                    :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                    :alt="weather.weather[0].description"
                    class="w-20 h-20"
                  />
                  <div class="ml-4 text-center sm:text-left">
                    <p class="text-xl font-semibold capitalize">
                      {{ weather.weather[0].description }}
                    </p>
                    <p class="text-gray-500">
                      Влажность: {{ weather.main.humidity }}%
                    </p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-5xl font-bold text-blue-600">
                    {{ Math.round(weather.main.temp) }}°C
                  </p>
                  <p class="text-gray-500">
                    Ощущается как: {{ Math.round(weather.main.feels_like) }}°C
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-500">Ветер</p>
                  <p class="text-lg font-semibold">
                    {{ weather.wind.speed }} м/с
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-500">Давление</p>
                  <p class="text-lg font-semibold">
                    {{ Math.ceil(weather.main.pressure * 0.750062) }} мм рт ст
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-500">Восход</p>
                  <p class="text-lg font-semibold">
                    {{
                      new Date(weather.sys.sunrise * 1000).toLocaleTimeString()
                    }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-500">Закат</p>
                  <p class="text-lg font-semibold">
                    {{
                      new Date(weather.sys.sunset * 1000).toLocaleTimeString()
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
