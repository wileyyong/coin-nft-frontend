import API from 'service/api';
import configs from "configs";

class TokenController {

    public static getTokens(type?: string) {
        let url = configs.API.TOKEN_URL;
        if(type) {
            url = `${url}/${type}`;
        }
        return API.get(url).then(res => {
            if(res.data && res.data.tokens) return res.data.tokens
            return []
        });
    }
    public static getById(id: any) {
        return API.get(`${configs.API.TOKEN_URL}/${id}`).then(res => res.data );
    }
    public static getMyTokens() {
        let url = configs.API.MY_TOKEN_URL;
        return API.get(url).then(res => {
            if(res.data && res.data.tokens) return res.data.tokens
            return []
        });
    }
    public static getItems(walletAdress: String, type: String, page: number) {
        let url = configs.API.USERS_URL;
        return API.get(`${url}/${walletAdress}/items/${type}${page > 1 ? '?page='+page : ''}`).then(res => {
            return res.data
        });
    }  
    public static setLike(id: String) {
        let url = configs.API.TOKEN_URL;
        return API.get(`${url}/${id}/like`).then(res => res);
    }
    public static setUnLike(id: String) {
        let url = configs.API.TOKEN_URL;
        return API.get(`${url}/${id}/unlike`).then(res => res);
    }
    public static buyToken(payload: any) {
        let url = configs.API.TOKEN_URL;
        return API.post(`${url}/buyToken`, payload).then(res => res.data);
    }
    public static bidToken(payload: any) {
        let url = configs.API.TOKEN_URL;
        return API.post(`${url}/bidToken`, payload).then(res => res.data);
    }
}

export default TokenController;