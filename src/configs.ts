import { EthereumNetworkID } from "./model/EthereumNetwork";

const configs = {
  DEPLOY_URL: "https://napi.pumlx.com",
  /* Wallet Info */
  ONBOARD_API_KEY: process.env.REACT_APP_ONBOARD_API_KEY,
  ONBOARD_NETWORK_ID: EthereumNetworkID.GoerliNetwork,
  ONBOARD_POLYGON_ID: EthereumNetworkID.MumbaiNetwork,
  FORTMATIC_KEY:
    "pk_test_737DD7FC0782E5A0" /* live(Mainnet) pk_live_ECF4039B2C85FB79*/,
  PORTIS_KEY: "",
  INFURA_KEY: "a6699e4ad89f4c4187e807f0709a360c",
  WALLET_APP_URL: "",
  CONTACT_EMAIL: "general@puml.com",
  // RPC_URL: "https://rinkeby.infura.io/v3/a6699e4ad89f4c4187e807f0709a360c",
  RPC_URL: "https://goerli.infura.io/v3/a6699e4ad89f4c4187e807f0709a360c",
  POLYGON_RPC_URL:
    "https://rpc-mumbai.maticvigil.com/" /* https://polygon-rpc.com/ */,
  POLYGON_BLOCK_EXPLORER:
    "https://mumbai.polygonscan.com/" /* https://polygonscan.com/ */,
  WALLET_APP_NAME: "PUML NFT",
  CURRENCY_API_URL: "https://api.binance.com/api/v1/ticker/price",
  HASH_LINK_URL: "https://goerli.etherscan.io/tx/",
  BLOCK_EXPLORER: "https://goerli.etherscan.io",

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
    MOBILE_API: "https://connect2.puml.io/api/",
    PUMLUSER_URL: "Pumlusers"
  },

  /* STORAGE Values */
  STORAGE: {
    TOKEN: "auth_token",
    SELECTED_WALLET: "sellectedWallet",
    SELECTED_NETWORK: "networkID",
    THEME: "theme"
  },

  /* ACCEPT Values */
  NFT_FILE_ACCEPT:
    "image/gif,image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/x-m4v,.webm,.mp3",
  IMG_FILE_ACCEPT: "image/gif,image/png,image/jpeg,image/jpg,image/webp",

  /* Smart Contract */
  PUML721_ADDRESS: "0x31F5334bb4F0fC91CBbcef05836F4564B536f602",
  ENGINE721_ADDRESS: "0x07627C365ceC6d14982D003Bb924FEd88cff3d8B",
  MATIC_PUML721_ADDRESS: "0xC4E8B16e46e49759492854C65589ab38d8188eDf",
  MATIC_ENGINE721_ADDRESS: "0xa25eEBA53Ab5B19be3195724f25eeB3498773bb9",
  PUMLSTAKE_ADDRESS: "0x678C3c074E6E1Fd73B30cDbB9a636D5514DC28e6",

  // ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
  ADMIN_ADDRESS: "0xe15f2992EA8b06cAA2dA8f2291B72DC739DddFC1",

  // PUMLx contract address
  PUML20_ADDRESS: "0xB2e408bc3E7674De7c589F4f8E5471C81F09F5c6",

  /* Pinata */
  PINATA_API_KEY: "1788923011a6cef5602b",
  PINATA_SECRET_API_KEY:
    "eb83272b418819cc3c7c8891b9581b8fe44bf238ae3e1975e07c19583752a3bd",
  PINATA_GATEWAY: "https://puml.mypinata.cloud",

  MAIN_ACCOUNT: "0xF9b99c56364f1D69AA4196B0957E6372ee6f9713",
  SERVICE_FEE_COMPANY: "0xDCBDB0dDB5A3a8DF116d7a02415DD0c4c39FbDaD",
  SERVICE_FEE_REVENUE: "0xC8616CD6e90c2a770cDB66eA777E5dA6bb57832f",
  PUML_POOL_ADDRESS: "0x0A50e179C57110edF83343D01D533214615e5cCF",
  NFT_POOL_ADDRESS: "0x7714fE1D6BD1be63AF1D006Ddf6C6e1FA1da90C8",
  FEE_POOL_ADDRESS: "0x06BA79D856C477E71d492786029986fEEa4744a6",
  PUML_ETH_POOL: 1000000,
  PUML_ETH_FIRST_POOL: 500000,
  NFT_ETH_POOL: 300000,
  NFT_ETH_FIRST_POOL: 150000,
  FEE_ETH_POOL: 101000,
  FEE_ETH_FIRST_POOL: 50000,
  FEE_ETH_REWARD_RATE: 0.02107
};

export default configs;
