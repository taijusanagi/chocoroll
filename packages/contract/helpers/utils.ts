import { Wallet } from "ethers";
import { DEFAULT_MNEMONIC } from "../helpers/constants";
const mnemonic = process.env.MNEMONIC ? process.env.MNEMONIC : DEFAULT_MNEMONIC;

export const removeLayerIdFromNetworkName = (networkName) => {
  return networkName.split("_")[0];
};

export const getSigner = (provider) => {
  const wallet = Wallet.fromMnemonic(mnemonic);
  const privateKey = wallet.privateKey;
  return new Wallet(privateKey, provider);
};
