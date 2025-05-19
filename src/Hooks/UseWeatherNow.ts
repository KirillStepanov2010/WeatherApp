import { useQuery } from "@tanstack/vue-query"
import type { Ref } from "vue"

export const getWeatherNow = async (city: Ref<string>) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        city.value
      }&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&lang=ru`
    )
    if (!response.ok) {
      throw new Error(`HTTP ошибка, ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Ошибка при получении данных ${error}`)
  }
}

export const UseWeatherNow = (city: Ref<string>) => {
  return useQuery({
    queryKey: ["weatherNow", city],
    queryFn: () => getWeatherNow(city),
    enabled: !!city.value.trim(),
    staleTime: 1000 * 60 * 10,
  })
}
