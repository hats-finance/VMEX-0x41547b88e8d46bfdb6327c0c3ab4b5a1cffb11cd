import { task } from "hardhat/config";
import { getParamPerNetwork } from "../../helpers/contracts-helpers";
import {
  loadPoolConfig,
  ConfigNames,
  getTreasuryAddress,
  getEmergencyAdmin,
} from "../../helpers/configuration";
import { getWETHGateway } from "../../helpers/contracts-getters";
import { eNetwork, ICommonConfiguration } from "../../helpers/types";
import { notFalsyOrZeroAddress, waitForTx } from "../../helpers/misc-utils";
import {
  claimTrancheId,
  initReservesByHelper,
  getTranche1MockedData,
} from "../../helpers/init-helpers";
import { exit } from "process";
import {
  getAaveProtocolDataProvider,
  getLendingPoolAddressesProvider,
  getLendingPoolConfiguratorProxy,
} from "../../helpers/contracts-getters";
import { deployFlashLoanLiquidation, deployUserLiquidationLogic } from "../../helpers/contracts-deployments";

task(
  "full:liquidations-deployment",
  "Deploy user tracking for chainlink keepers."
)
  .addFlag("verify", "Verify contracts at Etherscan")
  .addParam(
    "pool",
    `Pool name to retrieve configuration, supported: ${Object.values(
      ConfigNames
    )}`
  )
  .setAction(async ({ verify, pool }, DRE) => {
    try {
      await DRE.run("set-DRE");
      
      const network = <eNetwork>DRE.network.name;
      const addressesProvider = await getLendingPoolAddressesProvider();
      
      //TODO: instead of hardcoding the lendingpool, use addresses provider to get the address of the lendingpool
      const flash = await deployFlashLoanLiquidation(["0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9"], verify); 

      console.log("Flash loan deployed at: ", flash.address);

      console.log("attempt userliquidation deployment: ");

      //TODO: instead of hardcoding the lendingpool, use addresses provider to get the address of the lendingpool
      const userliquidation = await deployUserLiquidationLogic(["0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5", "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9", flash.address], verify); 

      console.log("userliquidation deployed at: ", userliquidation.address);

      await addressesProvider.setUserLiquidiationLogic(userliquidation.address);


    } catch (err) {
      console.error(err);
      exit(1);
    }
  });
