import { default as axios } from "axios";


export const BASE_URL = "https://proconnect-sh7q.onrender.com"
const clientServer = axios.create({
    baseURL : BASE_URL,
})

export default clientServer;