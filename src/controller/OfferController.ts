import API from 'service/api';
import configs from 'configs';
import Utility from 'service/utility';

class OfferController {
    //Create a new offer.

    public static create(payload: any) {
        return API.post(configs.API.OFFER_URL, payload).then(res => res.data)
    }

    //Get all offers.
    public static getList(type?: string, params?: any) {
        let url = configs.API.OFFER_URL;
        if(type) {
            url = `${url}/${type}`;
        }
        if(params) url = `${url}${Utility.getParamStrFromObj(params)}`;
        return API.get(url).then(res => {
            return res.data;
        })
    }    
}

export default OfferController;