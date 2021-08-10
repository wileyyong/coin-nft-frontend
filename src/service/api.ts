import axios from 'axios'
import Storage from "./storage";
import configs from '../configs'
var instance = axios.create({
    baseURL: configs.API.BASE_URL
});

instance.interceptors.request.use(function (config) {
    // Set Token before request is sent
    var token:any = Storage.getAuthToken();
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export default instance;