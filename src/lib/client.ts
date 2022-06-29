import {
  ColonyClientV4,
  getColonyNetworkClient,
  Network,
} from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';

const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
export const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

export const provider = new InfuraProvider();

const wallet = Wallet.createRandom();
const connectedWallet = wallet.connect(provider);

let colonyClientInstance: ColonyClientV4 | null = null;

export const getColonyClientInstance = async () => {
  if (colonyClientInstance) {
    return colonyClientInstance;
  }

  const networkClient = getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS,
    }
  );

  colonyClientInstance = (await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  )) as ColonyClientV4;

  return colonyClientInstance;
};
