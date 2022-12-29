import { task } from "hardhat/config";
import { checkVerification } from "../../helpers/etherscan-verification";
import { ConfigNames } from "../../helpers/configuration";
import { printContracts } from "../../helpers/misc-utils";
import { usingTenderly } from "../../helpers/tenderly-utils";
import { ethers } from "ethers";
import testWallets from "../../test-wallets";

task("aave:mainnet", "Deploy development enviroment")
  .addFlag("verify", "Verify contracts at Etherscan")
  .addFlag(
    "skipRegistry",
    "Skip addresses provider registration at Addresses Provider Registry"
  )
  .setAction(async ({ verify, skipRegistry }, DRE) => {
    console.log("Network name initial: ", DRE.network.name);
    const POOL_NAME = ConfigNames.Aave;
    await DRE.run("set-DRE");

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    // Fund wallets on tenderly fork
    // if (usingTenderly()) {
    //   // const provider = new ethers.providers.JsonRpcProvider(`https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`)
    //   const provider = (DRE as any).ethers.provider;
    //   const WALLETS = testWallets.accounts.map((el) => new ethers.Wallet(el.secretKey).address);

    //   const result = await provider.send("tenderly_setBalance", [
    //     WALLETS,
    //     //amount in wei will be set for all wallets
    //     ethers.utils.hexValue(ethers.utils.parseUnits("10", "ether").toHexString()),
    //   ]);


    //   console.log('\nSuccessfully funded test wallets:', result, "\n");
    // }

    console.log("Migration started\n");

    console.log("1. Deploy address provider");
    await DRE.run("full:deploy-address-provider", {
      pool: POOL_NAME,
      skipRegistry,
    });

    console.log("1.5. Deploy asset mappings");
    await DRE.run("full:deploy-asset-mappings", { pool: POOL_NAME });

    console.log("2. Deploy lending pool");
    await DRE.run("full:deploy-lending-pool", { pool: POOL_NAME });

    console.log("3. Deploy oracles");
    await DRE.run("full:deploy-oracles", { pool: POOL_NAME });

    console.log("4. Deploy Data Provider");
    await DRE.run("full:data-provider", { pool: POOL_NAME });

    console.log("5. Deploy WETH Gateway");
    await DRE.run("full-deploy-weth-gateway", { pool: POOL_NAME });

    console.log("6. Initialize lending pool");
    await DRE.run("full:initialize-lending-pool", { pool: POOL_NAME });

    console.log("6.1. Initialize lending pool tranche 0");
    await DRE.run("full:initialize-lending-pool-tranches-0", {
      pool: POOL_NAME,
    });

    console.log("6.2. Initialize lending pool tranche 1");
    await DRE.run("full:initialize-lending-pool-tranches-1", {
      pool: POOL_NAME,
    });

    if (verify) {
      printContracts();
      console.log("7. Veryfing contracts");
      await DRE.run("verify:general", { all: true, pool: POOL_NAME });

      console.log("8. Veryfing aTokens and debtTokens");
      await DRE.run("verify:tokens", { pool: POOL_NAME });
    }

    if (usingTenderly()) {
      const postDeployHead = DRE.tenderlyNetwork.getHead();
      const postDeployFork = DRE.tenderlyNetwork.getFork();
      console.log("Tenderly Info");
      console.log("- Head", postDeployHead);
      console.log("- Fork", postDeployFork);
    }
    console.log("\nFinished migrations");
    printContracts();
  });
