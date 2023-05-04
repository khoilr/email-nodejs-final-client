import axios, { AxiosResponse } from 'axios'

export async function auth(token: String) {
    const response: AxiosResponse = await axios
        .get('http://localhost:3300/auth', {
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
