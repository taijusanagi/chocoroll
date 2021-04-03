import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
import { ERC20_NAME, ERC20_SYMBOL } from "../helpers/constants";
export const filePath = "../networks.json";
import networks from "../networks.json";

const func = async (hre) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { name } = network;
  const { gasPrice, gasLimit } = networks[name];
  const log = LOG;
  const { address } = await deploy("L2DepositedERC20", {
    from: deployer,
    args: [networks.localhost_l2.messengerAddress, ERC20_NAME, ERC20_SYMBOL],
    gasPrice: hre.ethers.BigNumber.from(gasPrice),
    gasLimit,
    log,
  });
  networks[name].erc20Address = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
};

func.tags = ["L2DepositedERC20"];
export default func;
