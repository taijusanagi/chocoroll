import * as fs from "fs";
import * as path from "path";

import { LOG } from "../../helpers/configs";
const filePath = "../../networks.json";
import { removeLayerIdFromNetworkName } from "../../helpers/utils";
import networks from "../../networks.json";
const func = async (hre) => {
  const { deployments, network } = hre;
  const [signer] = await hre.ethers.getSigners();
  const { deploy } = deployments;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { gasPrice, gasLimit } = networks[networkName];
  const log = LOG;
  const { address } = await deploy("L1ERC20Gateway", {
    from: signer.address,
    args: [networks.localhost.l1ERC20Address, networks.localhost.l2ERC20Address, networks.localhost.l1MessengerAddress],
    gasPrice: hre.ethers.BigNumber.from(gasPrice),
    gasLimit,
    log,
  });
  networks[networkName].l1ERC20GatewayAddress = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  return address;
};

func.tags = ["L1ERC20Gateway"];
export default func;
