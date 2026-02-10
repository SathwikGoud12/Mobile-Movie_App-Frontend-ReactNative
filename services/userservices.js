import api from "../app/services/api"


export const getProfile=async()=>{
const res=api.get("/users/profile")
return res.data.user;
}
export const logOut=async()=>{
    await api.post("/logout")
}