import rawBRE from "hardhat";
import { MockContract } from "ethereum-waffle";
import {
  insertContractAddressInDb,
  getEthersSigners,
  registerContractInJsonDb,
  getEthersSignersAddresses,
  getContractAddressWithJsonFallback
} from "../../helpers/contracts-helpers";
import {
  deployAssetMapping,
  deployLendingPoolAddressesProvider,
  deployMintableERC20,
  deployLendingPoolAddressesProviderRegistry,
  deployLendingPoolConfigurator,
  deployLendingPool,
  deployPriceOracle,
  deployLendingPoolCollateralManager,
  deployMockFlashLoanReceiver,
  deployWalletBalancerProvider,
  deployAaveProtocolDataProvider,
  deployLendingRateOracle,
  deployStableAndVariableTokensHelper,
  // deployATokensAndRatesHelper,
  deployWETHGateway,
  deployWETHMocked,
  deployMockUniswapRouter,
  deployUniswapLiquiditySwapAdapter,
  deployUniswapRepayAdapter,
  deployFlashLiquidationAdapter,
  deployMockParaSwapAugustus,
  deployMockParaSwapAugustusRegistry,
  deployParaSwapLiquiditySwapAdapter,
  authorizeWETHGateway,
  deployATokenImplementations,
  deployAaveOracle,
  deployCurveOracle,
  deployCurveOracleWrapper,
  deployTricrypto2Strategy,
  deployConvexBaseRewardPool,
  deployConvexBooster,
} from "../../helpers/contracts-deployments";
import { Signer } from "ethers";
import {
  TokenContractId,
  eContractid,
  tEthereumAddress,
  AavePools,
} from "../../helpers/types";
import { MintableERC20 } from "../../types/MintableERC20";
import {
  ConfigNames,
  getReservesConfigByPool,
  getTreasuryAddress,
  loadPoolConfig,
  // loadCustomAavePoolConfig,
  getGlobalVMEXReserveFactor,
  isHardhatTestingStrategies,
} from "../../helpers/configuration";
import { initializeMakeSuite } from "./helpers/make-suite";
import { buildTestEnv } from "./__setup-helper";

before(async () => {
  await rawBRE.run("set-DRE");
  const [deployer, secondaryWallet] = await getEthersSigners();
  const FORK = process.env.FORK;

  if (FORK) {
    await rawBRE.run("aave:mainnet", { skipRegistry: true });
  } else {
    console.log("-> Deploying test environment...");
    await buildTestEnv(deployer);
  }

  await initializeMakeSuite();
  console.log("\n***************");
  console.log("Setup and snapshot finished");
  console.log("***************\n");
});
