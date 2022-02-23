import { EthereumNetworkID } from "./model/EthereumNetwork";

const configs = {
    DEPLOY_URL: "https://nftapi.puml.io",
    /* Wallet Info */
    ONBOARD_API_KEY: process.env.REACT_APP_ONBOARD_API_KEY,
    ONBOARD_NETWORK_ID: EthereumNetworkID.RinkebyNetwork,
    ONBOARD_POLYGON_ID: EthereumNetworkID.MumbaiNetwork,
    FORTMATIC_KEY:  "pk_test_737DD7FC0782E5A0", /* live(Mainnet) pk_live_ECF4039B2C85FB79*/
    PORTIS_KEY: "",
    INFURA_KEY: "a6699e4ad89f4c4187e807f0709a360c",
    WALLET_APP_URL: "",
    CONTACT_EMAIL: "general@puml.com",
    RPC_URL: "https://rinkeby.infura.io/v3/a6699e4ad89f4c4187e807f0709a360c",
    POLYGON_RPC_URL: "https://rpc-mumbai.maticvigil.com/", /* https://polygon-rpc.com/ */
    POLYGON_BLOCK_EXPLORER: "https://mumbai.polygonscan.com/", /* https://polygonscan.com/ */
    WALLET_APP_NAME: "PUML NFT",
    CURRENCY_API_URL: "https://api.binance.com/api/v1/ticker/price",
    HASH_LINK_URL: "https://rinkeby.etherscan.io/tx/",
    BLOCK_EXPLORER: "https://rinkeby.etherscan.io",

    /* API Info*/
    API: {
        BASE_URL: process.env.REACT_APP_API_POINT,
        AUTH_WITH_WALLET_URL: "auth/wallet",
        OFFER_URL: "offers",
        CATEGORIES_URL: "categories",
        COLLECTION_URL: "collections",
        MY_COLLECTION_URL: "collections/user/my",
        USERS_URL: "users",
        TOKEN_URL: "tokens",
        MY_TOKEN_URL: "tokens/my",
    },
    
    /* STORAGE Values */
    STORAGE: {
        TOKEN: 'auth_token',
        SELECTED_WALLET: 'sellectedWallet',
        SELECTED_NETWORK: 'networkID'
    },

    /* ACCEPT Values */
    NFT_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/x-m4v,.webm,.mp3",
    IMG_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp",

    /* Smart Contract */
    PUML721_ADDRESS: process.env.REACT_APP_PUML721_ADDRESS,
    ENGINE721_ADDRESS: process.env.REACT_APP_ENGINE_ADDRESS,
    MATIC_PUML721_ADDRESS: process.env.REACT_MATIC_PUML721_ADDRESS,
    MATIC_ENGINE721_ADDRESS: process.env.REACT_MATIC_ENGINE_ADDRESS,
    // ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
    ADMIN_ADDRESS: '0xe15f2992ea8b06caa2da8f2291b72dc739dddfc1'
};

export default configs;