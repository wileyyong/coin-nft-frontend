import configs from "../configs";

class Storage {
    get(key: string, defaultValue: any = '') {
        let value = localStorage.getItem(key) || defaultValue;
        return value;
    }

    set(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    setAuthToken(value: any) {
        this.set(configs.STORAGE.TOKEN, value);
    }

    getAuthToken() {
        return this.get(configs.STORAGE.TOKEN);
    }

    clearAuthToken() {
        this.remove(configs.STORAGE.TOKEN);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    removeAll() {
        localStorage.clear()
    }

}

const storage = new Storage();

export default storage;