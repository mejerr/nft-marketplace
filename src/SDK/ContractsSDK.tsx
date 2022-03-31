// tslint:disable: no-empty
import { ethers } from 'ethers';

import marketplaceABI from 'NFTMarketPlace.json';
import marketItemABI from 'NFTMarketItem.json';
import axios from 'axios';

export interface ICollection {
  collectionId: number;
  name: string;
  description: string;
  creator: string;
}

export interface IFetchedNFTItem {
  itemId: number;
  name: string;
  description: string;
  price: string;
  collectionId: number;
  createdOn: string;
  status: string;
}

export interface INFTItem {
  itemId: number;
  name: string;
  description: string;
  price: string;
  collectionId: number;
  createdOn: string;
  status: string;
  image: any;
  creator: any;
}

class ContractsSDK {
  public marketplace: ethers.Contract;
  public marketItem: ethers.Contract;

  constructor(signer: ethers.Signer) {
    this.marketplace =  new ethers.Contract(
      '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
      marketplaceABI.abi,
      signer
    );

    this.marketItem =  new ethers.Contract(
      '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      marketItemABI.abi,
      signer
    );
  }

  public async getCollections() {
    const collectionLength = Number((await this.marketplace.getCollectionLength()).toString());
    const collectionIds: ICollection[] = [];

    for (let i = 1; i <= collectionLength; i++) {
      const collection = this.marketplace.collections(i);
      collectionIds.push(collection);
    };

    const result = await Promise.all(collectionIds).then(collections => (
      collections.map(({ collectionId, name, description, creator }): ICollection => ({
        collectionId: Number(collectionId.toString()),
        name,
        description,
        creator
      }))
    ));

    return result;
  }


  public async createCollection(name: string, description: string) {
    const collectionCreation = await this.marketplace.createCollection(name, description);
    await collectionCreation.wait();
  }

  public async getNFTs() {
    const nftItemsLength = Number((await this.marketplace.getMarketItemsLength()).toString());
    const nftItemsIds: IFetchedNFTItem[] = [];

    for (let i = 1; i <= nftItemsLength; i++) {
      const nftItem = this.marketplace.marketItems(i);
      nftItemsIds.push(nftItem);
    };

    const result = Promise.all(nftItemsIds).then((nftItems) => {
      return Promise.all(nftItems.map(async ({ itemId, name, description, price, collectionId, createdOn, status }): Promise<INFTItem> => {
        const tokenUri = await this.marketItem.tokenURI(itemId)
        const meta = await axios.get(tokenUri);
        const parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether');

        return {
          itemId: Number(itemId.toString()),
          name,
          description,
          price: parsedPrice,
          collectionId: Number(collectionId.toString()),
          createdOn,
          status,
          creator: this.marketItem.address,
          image: meta.data.image
        }
      }))
    });

    return result;
  }

  public async createNFTItem(tokenURI: string, name: string, description: string, collectionId: number) {
    const NFTCreation = await this.marketplace.mintToken(tokenURI, name, description, collectionId);
    await NFTCreation.wait()
  }
}

export default ContractsSDK;