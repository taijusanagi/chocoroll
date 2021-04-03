import hre from "hardhat";
import { removeLayerIdFromNetworkName } from "../../helpers/utils";
import networks from "../../networks.json";

const main = async () => {
  const { network } = hre;

  const [signer] = await hre.ethers.getSigners();
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { gasPrice, gasLimit, l1ERC721GatewayAddress, l2ERC721Address } = networks[networkName];
  const l2ERC721 = await hre.ethers.getContractAt("L2ERC721", l2ERC721Address, signer);
  await l2ERC721.init(l1ERC721GatewayAddress, {
    gasLimit,
    gasPrice,
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
