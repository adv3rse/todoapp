import axios from 'axios'
const instance = axios.create({
    baseURL : 'https://test-react-82198-default-rtdb.firebaseio.com/',
    timeout : 5000
})


instance.interceptors.request.use(config => {
    console.log('z :'+config)
    return config
},err => {
    console.log(err)
    return Promise.reject(err)
})

export default instance