import api from "./axios"

export const loginUser=async(data)=>{
    const response=await api.post("/auth/login",data);
    return response.data;
};
export const signupUser=async(data)=>{
    console.log("hello")
    console.log(data)
    const response=await api.post("/auth/signup",data);
    console.log(response)
    return response.data;
};
export const page_data_title=async(data)=>{
    const response=await api.post("/auth/page_data_title",data);
    return response.data;
}
