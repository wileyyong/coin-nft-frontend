import API from 'service/api';
import configs from "configs";

class CategoriesController {
    public static getList() {
        return API.get(configs.API.CATEGORIES_URL).then(res => res.data.categories)
    }
}

export default CategoriesController;