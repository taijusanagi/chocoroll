import { JsonRpcProvider } from "@ethersproject/providers";
import hre from "hardhat";
import { removeLayerIdFromNetworkName, getSigner } from "../helpers/utils";
import networks from "../networks.json";
const main = async () => {
  const { network } = hre;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { l2GasPrice, gasLimit, l1ERC721GatewayAddress, l2ERC721Address, l2RpcUrl } = networks[networkName];
  const l2Provider = new JsonRpcProvider(l2RpcUrl);
  const signer = getSigner(l2Provider);
  const l2ERC721 = await hre.ethers.getContractAt("L2ERC721", l2ERC721Address, signer);
  const tx = await l2ERC721.init(l1ERC721GatewayAddress, {
    gasLimit,
    gasPrice: hre.ethers.BigNumber.from(l2GasPrice),
  });
  await tx.wait();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
