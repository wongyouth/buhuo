import axios, { AxiosRequestConfig } from 'axios'

export type Result = {
  data: any
  status: number
}

export const get =
  (baseURL: string) => async (url: string, config?: AxiosRequestConfig) => {
    const result = await axios.get(url, {
      ...config,
      baseURL,
    })

    return {
      data: result.data,
      status: result.status,
    }
  }

export const post =
  (baseURL: string) =>
  async (url: string, data?: any, config?: AxiosRequestConfig) => {
    const result = await axios.post(url, data, {
      ...config,
      baseURL,
    })

    return {
      data: result.data,
      status: result.status,
    }
  }
