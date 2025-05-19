export const LS_USERS_KEY = "fakeUsersDB"
export const LS_AUTH_KEY = "authToken"

export const register = (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || "{}")
  if (users[email]) {
    return "Пользователь уже зарегистрирован"
  }

  users[email] = password
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users))
  localStorage.setItem(LS_AUTH_KEY, `${email}+${Date.now}`)
  return "Регистрация прошла успешна"
}

export const login = async (email: string, password: string) => {
  try {
    const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || "{}")
    if (users[email] == password) {
      localStorage.setItem(LS_AUTH_KEY, `${email}+${Date.now}`)
      return "Добро пожаловать"
    }
    const response = await fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "reqres-free-v1",
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса ${response.status}`)
    }

    const reqresToken = await response.json()
    localStorage.setItem(LS_AUTH_KEY, reqresToken)
    return "Вход через ReqRes"
  } catch (err) {
    if (err) {
      console.error(`Ошибка ${err}`)
      return null
    }
  }
}

export const logout = () => {
  localStorage.removeItem(LS_AUTH_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(LS_AUTH_KEY)
}
