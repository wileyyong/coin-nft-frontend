
import API from 'service/api';
import configs from "configs";

class UserController {
    public static signInWithWallet(payload: any) {
        return API.post(configs.API.AUTH_WITH_WALLET_URL, payload).then(res => res.data)
    }
    public static userStats(wallet: String) {
        let url = configs.API.USERS_URL;
        if(wallet) {
            url = `${url}/${wallet}`;
        }
        return API.get(url).then(res => {
            return res.data;
        })
    }
    public static getVerify() {
        return API.get(`${configs.API.USERS_URL}/verify`).then(res => res.data);
    }
    public static getSettings() {
        return API.get(`${configs.API.USERS_URL}/settings`).then(res => res.data.user);
    }
    public static getFeatured() {
        return API.get(`${configs.API.USERS_URL}/featured`).then(res => res.data);
    }
    public static userSettings(payload: any) {
        return API.post(`${configs.API.USERS_URL}/settings`, payload);
    }
    public static updateFeatured(payload: any) {
        return API.post(`${configs.API.USERS_URL}/featured`, payload);
    }
    public static getTopUsers(type: string, days: number) {
        return API.get(`${configs.API.USERS_URL}/tops/${type}?days=${days}`).then(res => res.data.users);
    }
    public static userFollow(id: string) {
        return API.get(`${configs.API.USERS_URL}/${id}/follow`);
    }
    public static userUnFollow(id: string) {
        return API.get(`${configs.API.USERS_URL}/${id}/unfollow`);
    }
    public static uploadCover(payload: any) {
        return API.post(`${configs.API.USERS_URL}/cover`, payload);
    }
    public static uploadFeaturedImage(payload: any) {
        return API.post(`${configs.API.USERS_URL}/featuredImage`, payload);
    }
    public static userSearch(params: any, page: number) {
        return API.post(`/users/search${page === 1 ? '' : '?page='+page}`, params).then(res => res.data);
    }
}

export default UserController;