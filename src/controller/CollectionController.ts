import API from 'service/api';
import configs from "configs";

class CollectionController {
    public static create(payload: any) {
        return API.post(configs.API.COLLECTION_URL, payload).then(res => res.data)
    }

    public static getList(type?: string, page?: number) {
        let url = configs.API.COLLECTION_URL;
        if(type) {
            url = `${url}?type=${type}`;
        }
        return API.get(`${url}${page === 1 ? '' : '?page='+page}`).then(res => {
            return res.data
        })
    }

    public static getCollections(id: string, type: string, page: number) {
        let url = `${configs.API.COLLECTION_URL}/${id}/items/${type}${page === 1 ? '' : '?page='+page}`;
        return API.get(url).then(res => {
            return res.data
        })
    }

    public static getMyCollections() {
        let url = configs.API.MY_COLLECTION_URL;
        return API.get(url).then(res => {
            if(res.data && res.data.collections) return res.data.collections
            return []
        })
    }

    public static getById(id: any) {
        return API.get(`${configs.API.COLLECTION_URL}/${id}`).then(res => res.data)
    }

    public static getByUserId(user_id: any) {
        return API.get(`${configs.API.COLLECTION_URL}/user/${user_id}`).then(res => res.data);
    }

    public static delete(id: any) {
        return API.delete(`${configs.API.COLLECTION_URL}/${id}`).then(res => res.data)
    }
}

export default CollectionController;