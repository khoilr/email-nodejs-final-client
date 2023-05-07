import axios, { AxiosResponse } from 'axios'
import { getCookie } from 'cookies-next'

export async function auth(token: String) {
    const response: AxiosResponse = await axios
        .get('http://localhost:3300/account', {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            return response
        })
        .catch((error) => {
            return error.response
        })

    return response
}
