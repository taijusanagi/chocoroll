import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
const filePath = "../networks.json";
import { removeLayerIdFromNetworkName, getSigner } from "../helpers/utils";
import networks from "../networks.json";
const func = async (hre) => {
  const { deployments, network } = hre;
  const { deploy } = deployments;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { l1GasPrice, gasLimit, l1Provider, l1ERC721Address, l2ERC721Address, l1MessengerAddress } = networks[
    networkName
  ];
  const log = LOG;
  const signer = getSigner(l1Provider);
  const signerAddress = await signer.getAddress();
  const { address } = await deploy("L1ERC721Gateway", {
    from: signerAddress,
    args: [l1ERC721Address, l2ERC721Address, l1MessengerAddress],
    gasPrice: hre.ethers.BigNumber.from(l1GasPrice),
    gasLimit,
    log,
  });
  networks[networkName].l1ERC721GatewayAddress = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  return address;
};

func.tags = ["L1ERC721Gateway"];
export default func;
