import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';
import { MockContract } from "ethereum-waffle";
import {
  getEthersSigners,
} from "../../helpers/contracts-helpers";
import { initializeMakeSuite } from "../../test-suites/test-aave/helpers/make-suite";

import {buildTestEnv} from "../../test-suites/test-aave/__setup-helper"

task('aave:dev:test', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    const [deployer, secondaryWallet] = await getEthersSigners();
    const FORK = process.env.FORK;
  
    if (FORK) {
      await localBRE.run("aave:mainnet", { skipRegistry: true });
    } else {
      console.log("-> Deploying test environment...");
      await buildTestEnv(deployer);
    }
  
    await initializeMakeSuite();
    console.log("\n***************");
    console.log("Setup and snapshot finished");
    console.log("***************\n");
  });
