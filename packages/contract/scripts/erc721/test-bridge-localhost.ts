import { Watcher } from "@eth-optimism/watcher";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, Wallet } from "ethers";
import hre from "hardhat";
import { DEFAULT_PRIVATE_KEY } from "../../helpers/constants";
import networks from "../../networks.json";

const main = async () => {
  const { network } = hre;
  const { name } = network;
  const {
    l1RpcUrl,
    l2RpcUrl,
    l1MessengerAddress,
    l2MessengerAddress,
    l1ERC721Address,
    l1ERC721GatewayAddress,
    l2ERC721Address,
  } = networks[name];
  const l1Provider = new JsonRpcProvider(l1RpcUrl);
  const l2Provider = new JsonRpcProvider(l2RpcUrl);
  const l1Signer = new Wallet(DEFAULT_PRIVATE_KEY, l1Provider);
  const l2Signer = new Wallet(DEFAULT_PRIVATE_KEY, l2Provider);
  const l1SignerAddress = await l1Signer.getAddress();
  const watcher = new Watcher({
    l1: {
      provider: l1Provider,
      messengerAddress: l1MessengerAddress,
    },
    l2: {
      provider: l2Provider,
      messengerAddress: l2MessengerAddress,
    },
  });
  const l1ERC721 = await hre.ethers.getContractAt("L1ERC721", l1ERC721Address, l1Signer);
  const l1ERC721Gateway = await hre.ethers.getContractAt("L1ERC721Gateway", l1ERC721GatewayAddress, l1Signer);
  const l2ERC721 = await hre.ethers.getContractAt("L2ERC721", l2ERC721Address, l2Signer);

  const logBalances = async () => {
    console.log("-----");
    const l1Balance = await l1ERC721.balanceOf(l1SignerAddress);
    console.log("L1 balance of", l1SignerAddress, "is", l1Balance.toString());
    const l2Balance = await l2ERC721.balanceOf(l1SignerAddress);
    console.log("L2 balance of", l1SignerAddress, "is", l2Balance.toString());
    console.log("-----");
  };

  console.log("Approving L1 deposit contract...");
  const approveTx = await l1ERC721.setApprovalForAll(l1ERC721Gateway.address, true);
  console.log("Approved:" + approveTx.hash);
  await logBalances();

  console.log("Depositing into L1 deposit contract...");
  const depositTx = await l1ERC721Gateway.deposit(1, { gasLimit: 1000000 });
  console.log("Deposited:" + depositTx.hash);
  await depositTx.wait();
  const [l1ToL2msgHash] = await watcher.getMessageHashesFromL1Tx(depositTx.hash);
  console.log("got L1->L2 message hash", l1ToL2msgHash);
  const l2Receipt = await watcher.getL2TransactionReceipt(l1ToL2msgHash);
  console.log("completed Deposit! L2 tx hash:", l2Receipt.transactionHash);
  await logBalances();

  console.log("Withdrawing from L1 deposit contract...");
  const withdrawalTx = await l2ERC721.withdraw(1, { gasLimit: 5000000 });
  await withdrawalTx.wait();
  console.log("Withdrawal tx hash:" + withdrawalTx.hash);
  await logBalances();

  const [l2ToL1msgHash] = await watcher.getMessageHashesFromL2Tx(withdrawalTx.hash);
  console.log("got L2->L1 message hash", l2ToL1msgHash);
  const l1Receipt = await watcher.getL1TransactionReceipt(l2ToL1msgHash);
  console.log("completed Withdrawal! L1 tx hash:", l1Receipt.transactionHash);
  await logBalances();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
