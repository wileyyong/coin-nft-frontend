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
  PUML721_ADDRESS: "0x690253669604bCeA6801aa7dF12D1Babe518cF69",
  ENGINE721_ADDRESS: "0x576c20Aa01c85BCFb6B3562e120A129C72c374Ed",
  MATIC_PUML721_ADDRESS: "0xC4E8B16e46e49759492854C65589ab38d8188eDf",
  MATIC_ENGINE721_ADDRESS: "0xa25eEBA53Ab5B19be3195724f25eeB3498773bb9",
  // ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
  ADMIN_ADDRESS: "0xe15f2992EA8b06cAA2dA8f2291B72DC739DddFC1",
  // PUMLx contract address
  PUML20_ADDRESS: "0xB2e408bc3E7674De7c589F4f8E5471C81F09F5c6",

  /* HDWalletProvider */
  MAIN_ACCOUNT: "0xF9b99c56364f1D69AA4196B0957E6372ee6f9713",
  SERVICE_FEE_COMPANY: "0xDCBDB0dDB5A3a8DF116d7a02415DD0c4c39FbDaD",
  SERVICE_FEE_REVENUE: "0xC8616CD6e90c2a770cDB66eA777E5dA6bb57832f",

  /* PumlStaking Address */
  PUMLSTAKE_ADDRESS: "0x498b29ed7dEB6B41d128DA5E02ca68cFe24fEb2e",
  REWARD_RATE: 10,

  /* Pinata */
  PINATA_API_KEY: "7ee8721f543f5901db86",
  PINATA_SECRET_API_KEY:
    "c2fb20820e03eee1578cfe2c32b9439c74315a898c6929f49c6b08be1d5fdaf5",
  PINATA_GATEWAY: "https://puml.mypinata.cloud",

  /* Stake initialize */
  START_PUMLX_PUML: 100000000,
  START_REWARD_PUML: 4109589.04,
  START_PUMLX_NFT: 35000000,
  START_REWARD_NFT: 1232876.71,
  CHANGE_PER_PERIOD: 0.041
};

export default configs;
