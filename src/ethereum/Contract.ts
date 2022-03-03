import { abi as engineABI, bytecode as engineBytecode } from './abis/Engine.json';
import { abi as PUML721ABI, bytecode as PUMLbytecode } from './abis/PumlNFT.json';
import { web3 } from './OnBoard';
import configs from 'configs';
import EthUtil from './EthUtil';

class Contract {

    getPuml721Address(net: any) {
        if (net) {
          switch(net) {
            case configs.ONBOARD_POLYGON_ID:
              return configs.MATIC_PUML721_ADDRESS;
            case configs.ONBOARD_NETWORK_ID:
              return configs.PUML721_ADDRESS;
            default:
              return configs.PUML721_ADDRESS;
          }
        }
    }

    getEngine721Address (net: any) {
        if (net) {
          switch(net) {
            case configs.ONBOARD_POLYGON_ID:
              return configs.MATIC_ENGINE721_ADDRESS;
            case configs.ONBOARD_NETWORK_ID:
              return configs.ENGINE721_ADDRESS;
            default:
              return configs.ENGINE721_ADDRESS;
          }
        }
    }

    getRpcURL (net: any) {
        if (net) {
          switch(net) {
            case configs.ONBOARD_POLYGON_ID:
              return configs.POLYGON_RPC_URL;
            case configs.ONBOARD_NETWORK_ID:
              return configs.RPC_URL;
            default:
              return configs.RPC_URL;
          }
        }
    }

    async createCollection(name: string, symbol: string) {
        if(web3) {
            try{
                let deploy_contract: any = await new web3.eth.Contract(PUML721ABI);
                let deploy_engine: any = await new web3.eth.Contract(engineABI);
                let parameter = {
                    from: EthUtil.getAddress()
                }

                const contract_address: string = await deploy_contract.deploy({
                    data: PUMLbytecode,
                    arguments: [name, symbol]
                }).send(parameter, (err: any, transactionHash: any) => {
                    console.log('Contact Transaction Hash :', transactionHash);
                }).on('confirmation', () => {
                }).then((newContractInstance: any) => {
                    // console.log('Deployed Contract Address : ', newContractInstance.options.address);
                    return newContractInstance.options.address;
                });

                const engine_address: string = await deploy_engine.deploy({
                    data: engineBytecode
                }).send(parameter, (err: any, transactionHash: any) => {
                    console.log('Engine Transaction Hash :', transactionHash);
                }).on('confirmation', () => {
                }).then((newContractInstance: any) => {
                    // console.log('Deployed Engine Address : ', newContractInstance.options.address);
                    return newContractInstance.options.address;
                });
                return {contractAddress: contract_address, engineAddress: engine_address};

            }catch(err) {
                return {contractAddress: '', engineAddress: ''};
            }
        }
        return {contractAddress: '', engineAddress: ''};
    }

    async createNft(
        tokenURI: any , 
        royalties: any , 
        locked_content: string = '', 
        contract_address: string = ''
    ) {
        if(web3) {
            const network = EthUtil.getNetwork();
            const PUML_721_ADDRESS = contract_address !== '' ? contract_address : this.getPuml721Address(network);
            const PUMLContract = new web3.eth.Contract(PUML721ABI, PUML_721_ADDRESS);
            try{
                const result: any = await PUMLContract.methods.createItem(tokenURI, royalties , locked_content).send({
                    from: EthUtil.getAddress()
                });
                if(result.status === true) {
                    const { Transfer } = result.events;
                    if(Transfer && Transfer["returnValues"]) return { success: true , tokenId: Transfer["returnValues"]["tokenId"] };
                }
            }catch(err) {
                return { success: false, error: err }
            }
        }
        return { success: false, error: 'Failed to create NFT!' };
    }

    async approve(tokenId: any, contract_address: string = '', engine_address: string = '') {
        const network = EthUtil.getNetwork();
        const PUML_721_ADDRESS = contract_address !== '' ? contract_address : this.getPuml721Address(network);
        const ENGINE_721_ADDRESS = engine_address !== '' ? engine_address : this.getEngine721Address(network);
        if(web3) {
            // const bytecode = await new web3.eth.getCode(ENGINE_721_ADDRESS);
            const PUMLContract = new web3.eth.Contract(PUML721ABI, PUML_721_ADDRESS);
            try {
                await PUMLContract.methods.approve(ENGINE_721_ADDRESS, tokenId).send({
                    from: EthUtil.getAddress()
                });
                return true;
            }catch(err) {
                console.log(err);
            }
        }
        return false;
    }

    async createOffer(
        tokenId: any, 
        isDirectSale: boolean , 
        isAuction: boolean , 
        price: any, 
        minPrice: any, 
        startTime: any, 
        duration: any, 
        contract_address: string = '',
        engine_address: string = ''
    ) {
        const network = EthUtil.getNetwork();
        const PUML_721_ADDRESS = contract_address !== '' ? contract_address : this.getPuml721Address(network);
        const ENGINE_721_ADDRESS = engine_address !== '' ? engine_address : this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            try {
                await engineContract.methods.createOffer(PUML_721_ADDRESS,tokenId,isDirectSale,isAuction,web3.utils.toWei('' + price),web3.utils.toWei('' + minPrice),startTime,duration).send({
                    from: EthUtil.getAddress()
                });
                return true;
            }catch(err) {
                console.log(err);
            }
        }
        return false;
    }

    async getAuctionId(tokenId: any) {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            try{
                let auctionId = await engineContract.methods.getAuctionId(tokenId).call();
                return auctionId;
            } catch(err) {
                return null;
            }
        }
        return null;
    }

    async bid(tokenId:any, price: any, engine_address: string = '') {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = engine_address !== '' ? engine_address : this.getEngine721Address(network);
        if(web3) {
            let auctionId = await this.getAuctionId(tokenId);
            if(auctionId!==null) {
                const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
                const result: any = await engineContract.methods.bid(auctionId).send({
                    from: EthUtil.getAddress(),
                    value: web3.utils.toWei('' + price)
                });
                if(result.status === true) {
                    return { success: true , transactionHash: result.transactionHash };
                }
            }
        }
        return { success: false, error: 'Failed to bid to this item!' };
    }

    async directBuy(tokenId: any, price: any, engine_address: string = '') {
        const network = EthUtil.getNetwork();
        const ENGINE_721_ADDRESS = engine_address !== '' ? engine_address : this.getEngine721Address(network);
        if(web3) {
            const engineContract = new web3.eth.Contract(engineABI, ENGINE_721_ADDRESS);
            // const bytecode = await new web3.eth.getCode(ENGINE_721_ADDRESS);
            const result: any = await engineContract.methods.buy(tokenId).send({
                from: EthUtil.getAddress(),
                value: web3.utils.toWei('' + price)
            })
            if(result.status === true) {
                return { success: true , transactionHash: result.transactionHash };
            }
        }
        return { success: false, error: 'Failed to buy this item directly!' };
    }
}

const smartContract = new Contract();

export default smartContract;