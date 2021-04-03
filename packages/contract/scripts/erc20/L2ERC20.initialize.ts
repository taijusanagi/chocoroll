import hre from "hardhat";
import { removeLayerIdFromNetworkName } from "../../helpers/utils";
import networks from "../../networks.json";

const main = async () => {
  const { network } = hre;

  const [signer] = await hre.ethers.getSigners();
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { gasPrice, gasLimit, l1ERC20GatewayAddress, l2ERC20Address } = networks[networkName];
  const l2ERC20 = await hre.ethers.getContractAt("L2ERC20", l2ERC20Address, signer);
  await l2ERC20.init(l1ERC20GatewayAddress, {
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
