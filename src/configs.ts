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
        SELECTED_NETWORK: 'networkID',
        THEME: 'theme'
    },

    /* ACCEPT Values */
    NFT_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/x-m4v,.webm,.mp3",
    IMG_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp",

    /* Smart Contract */
    PUML721_ADDRESS: '0xe361cF6A6731Db7860460db2c6148cCB16133A18',
    ENGINE721_ADDRESS: '0xcFDDaB31F4199b136579a94B4A7678968a0165b8',
    MATIC_PUML721_ADDRESS: '0x53956Ea5d1454494836eB3e9647834E1A20F78D6',
    MATIC_ENGINE721_ADDRESS: '0xFf0850c3B1DE8417D627e6cF34102239CD43F20d',
    // ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
    ADMIN_ADDRESS: '0xe15f2992ea8b06caa2da8f2291b72dc739dddfc1',
    // PUMLx contract address
    PUML20_ADDRESS: '0xbc75ECc12c77506DCFd70113B15683A9a0768AB4',

    /* HDWalletProvider */
    MAIN_ACCOUNT: '0x64c7Cbb0B194d15e64741Dd002015F846a663E93',

    /* PumlStaking Address */
    PUMLSTAKE_ADDRESS: '0x352e3a419C092676189D2e4A574CC219719cAb83'
};

export default configs;