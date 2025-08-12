import { AUTH_REGISTER,AUTH_LOGIN, AUTH_LOGOUT, AUTH_REFRESH_TOKEN } from "@/utils/constants"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const navigate = useNavigate();

export const registerUser = async ({name, email, password}) => {
    try {
        if(!name.trim() || !email.trim() || ! password.trim()){
            throw new Error('All fields are required')
        }
        const response = await axios.post(AUTH_REGISTER, {
            name, email, password
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const loginUser = async ({email, password}) => {
    try {
        if(!email.trim() || ! password.trim()){
            throw new Error('All fields are required')
        }
        const response = await axios.post(AUTH_LOGIN, {
            email, password
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const logoutUser = async () => {
    try {
        await axios.post(AUTH_LOGOUT, {}, {withCredentials: true})
        localStorage.setItem('token', undefined)
        navigate('/login')
    } catch (error) {
        throw error
    }
}

export const authTokenRefresh = async ({name, email, password}) => {
    try {
        const response = await axios.post(AUTH_REFRESH_TOKEN, {}, {withCredentials: true})
        const data = response.data
        localStorage.setItem('token', data.token)
        return response
    } catch (error) {
        throw error
    }
}