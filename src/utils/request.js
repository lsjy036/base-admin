import axios from 'axios'

const service = axios.create({
    baseURL: '/api', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000000 // request timeout
})

//请求拦截器
service.interceptors.request.use((config) => {
    return config;
}, error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        const res = response.data
        return res
    },error=>{
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)
export default service

