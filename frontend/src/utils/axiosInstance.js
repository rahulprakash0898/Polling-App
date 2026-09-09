import axios from "axios";
import { API_BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response){    //Handle common errors globally 
            if(error.response.status === 401){
                console.log("Unauthorized! redirecting to login")
                window.location.href = "/login"
            } else if(error.response.status === 500){
                console.log("Server error. Please try again later")
            } else if(error.code === "ECONNABORTED"){
                console.log("Request timeout. Please try again later")
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;