import { API_BASE } from "@/utils/constants";
import axios from "axios";


const token = localStorage.getItem("token")

export interface AI_RESPONSE {
    text: String,
    data: Object | null,
    trigger: String | null,
}

export interface USER_MESSAGE {
    file?: File,
    text?: String,
    key?: String,
}


export const handleIntitialization = async () => {
    try {
        const res = await axios.get(`${API_BASE}/c/initialize`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = res.data;
        const formatedData: AI_RESPONSE = {
            text: data.data.data.message,
            data: data.data,
            trigger: data.phase
        }
        console.log(formatedData, "data: ", data.data.data);
        return formatedData;
    } catch (error) {
        throw Error(error)
    }
}

export const handleUserMessage = async (message: USER_MESSAGE) => {
    if (!message.file && !message.text && !message.key) {
        return;
    }
    try {
        if (message.text) {
            const res = await axios.post(`${API_BASE}/c/message`, { message: message.text, key: message.key },
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            const data = res.data;
            const formatedData: AI_RESPONSE= {
                text: data.message,
                data: data.data,
                trigger: data.phase
            }
            return formatedData;
        } else if (message.file) {
            const formData = new FormData();
            formData.append("image", message.file)
            const res = await axios.post(`${API_BASE}/AI/process-document`, formData,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const data = res.data;
            const formatedData: AI_RESPONSE = {
                text: data.message,
                trigger: data.phase,
                data: data.data,
            }
            return formatedData;
        }
    } catch (error) {
        throw Error(error)
    }
}