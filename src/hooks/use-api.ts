import { useState } from "react"
import axios, { AxiosError } from "axios"

type RequestState = "idle" | "loading" | "success" | "error"

interface ApiResult<T> {
  payload: T | null
  error: string | null
  state: RequestState
  statusCode?: number
}

interface ApiError {
  message?: string
  error?: string
  statusCode?: number
}

export function useApi<T>() {
  const [result, setResult] = useState<ApiResult<T>>({
    payload: null,
    error: null,
    state: "idle"
  })

  const execute = async (config: {
    url: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    data?: unknown
    headers?: Record<string, string>
  }) => {
    setResult(prev => ({ ...prev, state: "loading", error: null }))

    try {
      const response = await axios.request<T>({
        url: config.url,
        method: config.method,
        data: config.data,
        headers: {
          ...config.headers,
          "Content-Type": "application/json"
        }
      })

      setResult({
        payload: response.data,
        error: null,
        state: "success",
        statusCode: response.status
      })

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>
      const statusCode = axiosError.response?.status
      const errorMessage = axiosError.response?.data?.error || 
                          axiosError.response?.data?.message || 
                          `Request failed with status code ${statusCode}`

      setResult({
        payload: null,
        error: errorMessage,
        state: "error",
        statusCode
      })

      throw new Error(errorMessage)
    }
  }

  return {
    ...result,
    execute,
    isLoading: result.state === "loading",
    isError: result.state === "error",
    isSuccess: result.state === "success"
  }
}
