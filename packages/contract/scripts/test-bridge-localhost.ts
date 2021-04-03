import { JsonRpcProvider } from "@ethersproject/providers";
import networks from "../networks.json";

const main = async () => {
  const { network } = hre;
  const { name } = network;
  const { gasPrice, gasLimit } = networks[name];
  const l1Provider = new JsonRpcProvider(selectedNetwork.l1RpcUrl);
  const l2Provider = new JsonRpcProvider(selectedNetwork.l2RpcUrl);
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
  const logBalances = async (description = "") => {
    console.log("\n ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ " + description + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    if (L1_ERC20) {
      const l1Balance = await L1_ERC20.balanceOf(deployWallet.address);
      console.log(" L1 balance of", deployWallet.address, "is", l1Balance.toString());
    } else {
      console.log(" no L1_ERC20 configured");
    }
    if (OVM_L2DepositedERC20) {
      const l2Balance = await OVM_L2DepositedERC20.balanceOf(deployWallet.address);
      console.log(" L2 balance of", deployWallet.address, "is", l2Balance.toString());
    } else {
      console.log(" no OVM_L2DepositedERC20 configured");
    }
    console.log(
      " ~".repeat(description.length) + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"
    );
  };
  // Approve
  console.log(" Approving L1 deposit contract...");
  const approveTx = await L1_ERC20.approve(OVM_L1ERC20Gateway.address, 10);
  console.log(" Approved: " + approveTx.hash);
  await approveTx.wait();
  await logBalances();
  // Deposit
  console.log(" Depositing into L1 deposit contract...");
  const depositTx = await OVM_L1ERC20Gateway.deposit(10, { gasLimit: 1000000 });
  console.log(" Deposited: " + depositTx.hash);
  await depositTx.wait();
  const [l1ToL2msgHash] = await watcher.getMessageHashesFromL1Tx(depositTx.hash);
  console.log(" got L1->L2 message hash", l1ToL2msgHash);
  const l2Receipt = await watcher.getL2TransactionReceipt(l1ToL2msgHash);
  console.log(" completed Deposit! L2 tx hash:", l2Receipt.transactionHash);
  await logBalances();
  // Withdraw
  console.log(" Withdrawing from L1 deposit contract...");
  const withdrawalTx = await OVM_L2DepositedERC20.withdraw(10, { gasLimit: 5000000 });
  await withdrawalTx.wait();
  console.log(" Withdrawal tx hash:" + withdrawalTx.hash);
  await logBalances();
  const [l2ToL1msgHash] = await watcher.getMessageHashesFromL2Tx(withdrawalTx.hash);
  console.log(" got L2->L1 message hash", l2ToL1msgHash);
  const l1Receipt = await watcher.getL1TransactionReceipt(l2ToL1msgHash);
  console.log(" completed Withdrawal! L1 tx hash:", l1Receipt.transactionHash);
  await logBalances();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
