import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
import { ERC20_NAME, ERC20_SYMBOL, ERC20_INITIAL_SUPPLY } from "../helpers/constants";
export const filePath = "../networks.json";
import networks from "../networks.json";

const func = async (hre) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { name } = network;
  const { gasPrice, gasLimit } = networks[name];
  const log = LOG;
  const { deployer } = await getNamedAccounts();
  const { address } = await deploy("ERC20", {
    from: deployer,
    args: [ERC20_INITIAL_SUPPLY, ERC20_NAME, ERC20_SYMBOL],
    gasPrice: hre.ethers.BigNumber.from(gasPrice),
    gasLimit,
    log,
  });
  networks[name].erc20Address = address;
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
};
func.tags = ["ERC20"];
export default func;
