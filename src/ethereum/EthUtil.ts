
import { web3, onboard } from './OnBoard';

class EthUtil {

    getAddress() {
        const currentState = onboard.getState();
        if(currentState.address) return currentState.address;
        return '';
    }

    async getBalance() {
        if(web3) {
            let balance = await web3.eth.getBalance(this.getAddress());
            let ethBalance = web3.utils.fromWei(balance, "ether");
            return ethBalance;
        }
        return 0;
    }
   
}

const ethUtil = new EthUtil();

export default ethUtil;