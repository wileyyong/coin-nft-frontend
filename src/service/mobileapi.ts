import axios from 'axios'
import configs from '../configs'
var instance = axios.create({
    baseURL: configs.API.MOBILE_API
});


export default instance;