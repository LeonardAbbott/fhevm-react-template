const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting deployment process...");
  console.log("=".repeat(50));

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance < hre.ethers.parseEther("0.01")) {
    console.warn("⚠️  Warning: Account balance is low. You may need more ETH for deployment.");
  }

  console.log("=".repeat(50));

  console.log("\nDeploying PrivateVoting contract...");
  const PrivateVoting = await hre.ethers.getContractFactory("PrivateVoting");

  console.log("Estimating gas...");
  const deploymentTx = await PrivateVoting.getDeployTransaction();
  const estimatedGas = await hre.ethers.provider.estimateGas(deploymentTx);
  console.log("Estimated gas:", estimatedGas.toString());

  const contract = await PrivateVoting.deploy();
  console.log("Transaction hash:", contract.deploymentTransaction().hash);
  console.log("Waiting for confirmations...");

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("=".repeat(50));
  console.log("✅ PrivateVoting deployed successfully!");
  console.log("Contract address:", contractAddress);
  console.log("=".repeat(50));

  const network = await hre.ethers.provider.getNetwork();
  console.log("\nNetwork Information:");
  console.log("  Name:", network.name);
  console.log("  Chain ID:", network.chainId.toString());

  if (network.chainId === 11155111n) {
    console.log("  Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log(`Contract: PrivateVoting`);
  console.log(`Address: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Network: ${network.name} (${network.chainId})`);
  console.log(`Transaction: ${contract.deploymentTransaction().hash}`);
  console.log("=".repeat(50));

  const deploymentInfo = {
    contract: "PrivateVoting",
    address: contractAddress,
    deployer: deployer.address,
    network: network.name,
    chainId: network.chainId.toString(),
    transactionHash: contract.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    blockNumber: contract.deploymentTransaction().blockNumber
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${deploymentsDir}/${network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${filename}`);

  console.log("\n" + "=".repeat(50));
  console.log("NEXT STEPS");
  console.log("=".repeat(50));
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network ${network.name} ${contractAddress}`);
  console.log("\n2. Update frontend with contract address:");
  console.log(`   CONTRACT_ADDRESS = "${contractAddress}";`);
  console.log("\n3. Test contract interaction:");
  console.log(`   npx hardhat run scripts/interact.js --network ${network.name}`);
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
