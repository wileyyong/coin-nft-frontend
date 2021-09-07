import { EthereumNetworkID } from "./model/EthereumNetwork";

const configs = {
    DEPLOY_URL: "https://nftapi.puml.io",
    /* Wallet Info */
    ONBOARD_API_KEY: process.env.REACT_APP_ONBOARD_API_KEY,
    ONBOARD_NETWORK_ID: EthereumNetworkID.RinkebyNetwork,
    FORTMATIC_KEY:  "pk_test_737DD7FC0782E5A0", /* live(Mainnet) pk_live_ECF4039B2C85FB79*/
    PORTIS_KEY: "",
    INFURA_KEY: "5fbd69535adf4bd685f2cdd9901d199b",
    WALLET_APP_URL: "",
    CONTACT_EMAIL: "general@puml.com",
    RPC_URL: "https://rinkeby.infura.io/v3/5fbd69535adf4bd685f2cdd9901d199b",
    WALLET_APP_NAME: "PUML NFT",
    CURRENCY_API_URL: "https://api.binance.com/api/v1/ticker/price",

    /* API Info*/
    API: {
        BASE_URL: process.env.REACT_APP_API_POINT,
        AUTH_WITH_WALLET_URL: "auth/wallet",
        OFFER_URL: "offers",
        COLLECTION_URL: "collections",
        MY_COLLECTION_URL: "collections/user/my",
        USERS_URL: "users",
    },
    
    /* STORAGE Values */
    STORAGE: {
        TOKEN: 'auth_token',
        SELECTED_WALLET: 'sellectedWallet'
    },

    /* ACCEPT Values */
    NFT_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/x-m4v,.webm,.mp3",
    IMG_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp",

    /* Smart Contract */
    PUML721_ADDRESS: process.env.REACT_APP_PUML721_ADDRESS,
    ENGINE_ADDRESS: process.env.REACT_APP_ENGINE_ADDRESS
};

export default configs;