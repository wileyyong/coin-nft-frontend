import configs from "configs";
import axios from 'axios'

class CurrencyController {

  public static getETHUSDTCurrency() {
      return axios.get(`${configs.CURRENCY_API_URL}?symbol=ETHUSDT`).then(res => res.data)
  }

  public static getMATICUSDTCurrency() {
    return axios.get(`${configs.CURRENCY_API_URL}?symbol=MATICUSDT`).then(res => res.data)
  }

}

export default CurrencyController;