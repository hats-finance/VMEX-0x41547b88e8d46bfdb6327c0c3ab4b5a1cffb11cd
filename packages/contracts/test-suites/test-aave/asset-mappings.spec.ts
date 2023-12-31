import { TestEnv, makeSuite } from "./helpers/make-suite";
import {
  APPROVAL_AMOUNT_LENDING_POOL,
  MAX_UINT_AMOUNT,
  oneEther,
} from "../../helpers/constants";
import { ProtocolErrors } from "../../helpers/types";
import { BigNumberish } from "ethers";
import { createRandomAddress } from "../../helpers/misc-utils";
import {
  deployMintableERC20,
  deployMockAToken,
} from "../../helpers/contracts-deployments";
import { convertToCurrencyDecimals } from "../../helpers/contracts-helpers";
import rawBRE, { ethers } from "hardhat";
import { getAToken, getTrancheAdminT1, getVariableDebtToken } from "../../helpers/contracts-getters";
const { expect } = require("chai");
makeSuite("Asset mappings", (testEnv: TestEnv) => {
  const {
    AM_INVALID_CONFIGURATION,
    AM_ASSET_ALREADY_IN_MAPPINGS,
    AM_ASSET_NOT_CONTRACT,
    AM_INTEREST_STRATEGY_NOT_CONTRACT,
    AM_UNABLE_TO_DISALLOW_ASSET,
  } = ProtocolErrors;

  const defaultAssetMappingAssets = new Set<string>([
    "0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf",
    "0xf4e77E5Da47AC3125140c470c71cBca77B5c638c",
    "0x52d3b94181f8654db2530b0fEe1B19173f519C52",
    "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F",
    "0x3521eF8AaB0323004A6dD8b03CE890F4Ea3A13f5",
    "0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0",
    "0x8B5B7a6055E54a36fF574bbE40cf2eA68d5554b3",
    "0x20Ce94F404343aD2752A2D01b43fa407db9E0D00",
    "0xc4905364b78a742ccce7B890A89514061E47068D",
    "0x1d80315fac6aBd3EfeEbE97dEc44461ba7556160",
    "0x2D8553F9ddA85A9B3259F6Bf26911364B85556F5",
    "0x1A1FEe7EeD918BD762173e4dc5EfDB8a78C924A8",
    "0x0078371BDeDE8aAc7DeBfFf451B74c5EDB385Af7",
    "0x5bcb88A0d20426e451332eE6C4324b0e663c50E0",
    "0x3619DbE27d7c1e7E91aA738697Ae7Bc5FC3eACA5",
    "0x038B86d9d8FAFdd0a02ebd1A476432877b0107C8",
    "0xD6C850aeBFDC46D7F4c207e445cC0d6B0919BDBe",
    "0xf784709d2317D872237C4bC22f867d1BAe2913AB",
    "0x7e35Eaf7e8FBd7887ad538D4A38Df5BbD073814a",
    "0x500D1d6A4c7D8Ae28240b47c8FCde034D827fD5e",
    "0xe1B3b8F6b298b52bCd15357ED29e65e66a4045fF",
    "0x8731324a6C09a1745bD15009Dc8FcceF11c05F4a",
    "0x00aD4926D7613c8e00cB6CFa61831D5668265724",
    "0x099d9fF8F818290C8b5B7Db5bFca84CEebd2714c",
    "0x85bdE212E66e2BAE510E44Ed59116c1eC712795b",
    "0x79dC3dA279A2ADc72210BD00e10951AB9dC70ABc",
    "0xF0B4ACda6D679ea22AC5C4fD1973D0d58eA10ec1",
    "0xE78d9772cED3eD5C595d9E438a87602eD86bfE9b",
    "0xA17827A991EB72793fa437e580B084ceB25Ab0f9",
    "0x8565Fb7dfB5D36b2aA00086ffc920cfF20db4F2f",
    "0x93C1e99C8dD990D77232821f9476c308FBad47f5",
    "0x57965788BD1a93639CE738a58176e1A3d6F4d04f",
    "0xBbC60A8fAf66552554e460d55Ac0563Fb9e76c01",
    "0xdDD96662ea11dA6F289A5D00da41Ec5F3b67d2b4",
    "0xecE50C63d1Ae02Ba306c2b2E1579d0327220196e",
    "0x0D8448C0fBB84c30395838C8b3fD64722ea94532",
    "0x053568617FFccEe2F75073975CC0e1549Ff9db71",
    "0xA40A2298B02a8597321580fdAD8518A6d6601b6C",
    "0x26d1E94963C8b382Ad66320826399E4B30347404",
    "0xEC8Ec2A30c3E9Fb0cE7031ac4A52DbdFAD57a0D2",
    "0xD036a8F254ef782cb93af4F829A1568E992c3864",
  ]);

  it("Determine number of approved assets", async () => {
    const { assetMappings } = testEnv;
    const numTokens = await assetMappings.getNumApprovedTokens();
    expect(numTokens).to.be.equal(39, "Incorrect number of approved tokens");
  });

  it("Determine addresses of approved tokens", async () => {
    const { assetMappings } = testEnv;

    const tokens = await assetMappings.getAllApprovedTokens();

    for (let i = 0; i < tokens.length; i++) {
      expect(defaultAssetMappingAssets.has(tokens[i])).to.be.equal(
        true,
        "Unexpected token in asset mappings: " + tokens[i]
      );
    }
  });

  it("Deletes weth from approved tokens", async () => {
    const { assetMappings, weth } = testEnv;
    await expect(assetMappings.setAssetAllowed(weth.address, false)).to.be.revertedWith(AM_UNABLE_TO_DISALLOW_ASSET);
    await assetMappings.setBorrowingEnabled(weth.address, false);
    await expect(assetMappings.setAssetAllowed(weth.address, false)).to.be.revertedWith(AM_UNABLE_TO_DISALLOW_ASSET);
    await assetMappings.configureAssetMapping(weth.address, 0,0,0,0,0,10000);
    await assetMappings.setAssetAllowed(weth.address, false);
    
    await expect(
      assetMappings.getAssetMapping(weth.address)
    ).to.be.revertedWith(ProtocolErrors.AM_ASSET_NOT_ALLOWED);
  });

  it("Checks all WETH reserves are deactivated", async () => {
    const { weth, helpersContract } = testEnv;
    await expect(
      helpersContract.getReserveFlags(weth.address, 0)
    ).to.be.revertedWith(ProtocolErrors.AM_ASSET_NOT_ALLOWED);
    await expect(
      helpersContract.getReserveFlags(weth.address, 1)
    ).to.be.revertedWith(ProtocolErrors.AM_ASSET_NOT_ALLOWED);
  });

  it("Determine number of approved assets", async () => {
    const { assetMappings } = testEnv;
    const numTokens = await assetMappings.getNumApprovedTokens();
    expect(numTokens).to.be.equal(38, "Incorrect number of approved tokens");
  });

  it("Determine addresses of approved tokens after delete", async () => {
    const { assetMappings, weth } = testEnv;

    const tokens = await assetMappings.getAllApprovedTokens();

    const expected = [...defaultAssetMappingAssets];
    expected.splice(expected.indexOf(weth.address), 1);

    for (let i = 0; i < tokens.length; i++) {
      expect(defaultAssetMappingAssets.has(tokens[i])).to.be.equal(
        true,
        "Unexpected token in asset mappings: " + tokens[i]
      );
    }
  });

  it("Adds WETH back to be allowed", async () => {
    const { assetMappings, weth } = testEnv;
    await assetMappings.setAssetAllowed(weth.address, true);

    const numTokens = await assetMappings.getNumApprovedTokens();
    expect(numTokens).to.be.equal(39, "Incorrect number of approved tokens");

    const tokens = await assetMappings.getAllApprovedTokens();

    for (let i = 0; i < tokens.length; i++) {
      expect(defaultAssetMappingAssets.has(tokens[i])).to.be.equal(
        true,
        "Unexpected token in asset mappings: " + tokens[i]
      );
    }
  });

  it("Change VMEX Reserve Factor for an asset", async () => {
    const { assetMappings, usdc } = testEnv;
    await assetMappings.setVMEXReserveFactor(usdc.address, 1000); // sets reserve factor to 10%
    expect(
      await assetMappings.getVMEXReserveFactor(usdc.address)
    ).to.be.bignumber.equal(
      oneEther.div(10).toString(),
      "Incorrect VMEX Reserve factor set"
    );

    await expect(
      assetMappings.setVMEXReserveFactor(usdc.address, 10000)
    ).to.be.revertedWith(ProtocolErrors.RC_INVALID_RESERVE_FACTOR);

    await expect(
      assetMappings.setVMEXReserveFactor(usdc.address, 10001)
    ).to.be.revertedWith(ProtocolErrors.RC_INVALID_RESERVE_FACTOR);
  });

  it("Change borrow enabled for an asset", async () => {
    const { assetMappings, usdc } = testEnv;
    await assetMappings.setBorrowingEnabled(usdc.address, true); // sets reserve factor to 10%
    expect(await assetMappings.getAssetBorrowable(usdc.address)).to.be.equal(
      true
    );

    await assetMappings.setBorrowingEnabled(usdc.address, false); // sets reserve factor to 10%
    expect(await assetMappings.getAssetBorrowable(usdc.address)).to.be.equal(
      false
    );
  });

  it("Add asset mappings for an asset already in the mapping", async () => {
    const { assetMappings } = testEnv;
    const newERC20 = await deployMintableERC20(["MOCK", "MOCK", "18"]);

    const asset = defaultAssetMappingAssets.values().next().value;

    let initInputParams: {
      asset: string;
      defaultInterestRateStrategyAddress: string;
      supplyCap: BigNumberish; //1,000,000
      borrowCap: BigNumberish; //1,000,000
      baseLTV: BigNumberish;
      liquidationThreshold: BigNumberish;
      liquidationBonus: BigNumberish;
      borrowFactor: BigNumberish;
      borrowingEnabled: boolean;
      assetType: BigNumberish;
      VMEXReserveFactor: BigNumberish;
    }[] = [];

    const newInterestRateStrategy = createRandomAddress();

    initInputParams.push({
      asset: asset,
      defaultInterestRateStrategyAddress: newERC20.address, //so passes isContract test
      assetType: 0,
      supplyCap: 0, //1,000,000
      borrowCap: 0, //1,000,000
      baseLTV: 0,
      liquidationThreshold: 0,
      liquidationBonus: 0,
      borrowFactor: 0,
      borrowingEnabled: false,
      VMEXReserveFactor: 0,
    });

    // adding a new asset mapping should still work
    initInputParams.push({
      asset: newERC20.address,
      defaultInterestRateStrategyAddress: newERC20.address,
      assetType: 0,
      supplyCap: 1000, //1,000,000
      borrowCap: 1000, //1,000,000
      baseLTV: 1000,
      liquidationThreshold: 2000,
      liquidationBonus: 10001,
      borrowFactor: 10000,
      borrowingEnabled: true,
      VMEXReserveFactor: 1000,
    });

    await expect(
      assetMappings.addAssetMapping(initInputParams)
    ).to.be.revertedWith(AM_ASSET_ALREADY_IN_MAPPINGS);

    const usdcMapping = await assetMappings.getAssetMapping(asset);
    expect(usdcMapping.supplyCap.toString() != "0").to.be.equal(true);
    expect(usdcMapping.borrowCap.toString() != "0").to.be.equal(true);
    expect(usdcMapping.borrowingEnabled).to.be.equal(false);
  });

  it("Add asset mappings with bad params should revert", async () => {
    const { assetMappings } = testEnv;
    const newERC20 = await deployMintableERC20(["MOCK", "MOCK", "18"]);
    const newAsset = createRandomAddress();
    let initInputParams: {
      asset: string;
      defaultInterestRateStrategyAddress: string;
      supplyCap: BigNumberish; //1,000,000
      borrowCap: BigNumberish; //1,000,000
      baseLTV: BigNumberish;
      liquidationThreshold: BigNumberish;
      liquidationBonus: BigNumberish;
      borrowFactor: BigNumberish;
      borrowingEnabled: boolean;
      assetType: BigNumberish;
      VMEXReserveFactor: BigNumberish;
    }[] = [];

    const newInterestRateStrategy = createRandomAddress();

    initInputParams.push({
      asset: newERC20.address,
      defaultInterestRateStrategyAddress: newERC20.address,
      assetType: 0,
      supplyCap: 1000, //1,000,000
      borrowCap: 1000, //1,000,000
      baseLTV: 2000,
      liquidationThreshold: 1000,
      liquidationBonus: 10001,
      borrowFactor: 1000,
      borrowingEnabled: true,
      VMEXReserveFactor: 1000,
    });

    await expect(
      assetMappings.addAssetMapping(initInputParams)
    ).to.be.revertedWith(AM_INVALID_CONFIGURATION);
  });

  it("Add asset mappings not contract revert", async () => {
    const { assetMappings } = testEnv;
    const notContract = createRandomAddress();
    const newERC20 = await deployMintableERC20(["MOCK", "MOCK", "18"]);
    let initInputParams: {
      asset: string;
      defaultInterestRateStrategyAddress: string;
      supplyCap: BigNumberish; //1,000,000
      borrowCap: BigNumberish; //1,000,000
      baseLTV: BigNumberish;
      liquidationThreshold: BigNumberish;
      liquidationBonus: BigNumberish;
      borrowFactor: BigNumberish;
      borrowingEnabled: boolean;
      assetType: BigNumberish;
      VMEXReserveFactor: BigNumberish;
    }[] = [];

    const newInterestRateStrategy = createRandomAddress();

    initInputParams.push({
      asset: notContract,
      defaultInterestRateStrategyAddress: newERC20.address,
      assetType: 0,
      supplyCap: 1000, //1,000,000
      borrowCap: 1000, //1,000,000
      baseLTV: 2000,
      liquidationThreshold: 1000,
      liquidationBonus: 10001,
      borrowFactor: 1000,
      borrowingEnabled: true,
      VMEXReserveFactor: 1000,
    });

    await expect(
      assetMappings.addAssetMapping(initInputParams)
    ).to.be.revertedWith(AM_ASSET_NOT_CONTRACT);
  });

  it("Add asset mappings interest rate strategy not contract revert", async () => {
    const { assetMappings } = testEnv;
    const notContract = createRandomAddress();
    const newERC20 = await deployMintableERC20(["MOCK", "MOCK", "18"]);
    let initInputParams: {
      asset: string;
      defaultInterestRateStrategyAddress: string;
      supplyCap: BigNumberish; //1,000,000
      borrowCap: BigNumberish; //1,000,000
      baseLTV: BigNumberish;
      liquidationThreshold: BigNumberish;
      liquidationBonus: BigNumberish;
      borrowFactor: BigNumberish;
      borrowingEnabled: boolean;
      assetType: BigNumberish;
      VMEXReserveFactor: BigNumberish;
    }[] = [];

    const newInterestRateStrategy = createRandomAddress();

    initInputParams.push({
      asset: newERC20.address,
      defaultInterestRateStrategyAddress: notContract,
      assetType: 0,
      supplyCap: 1000, //1,000,000
      borrowCap: 1000, //1,000,000
      baseLTV: 2000,
      liquidationThreshold: 1000,
      liquidationBonus: 10001,
      borrowFactor: 1000,
      borrowingEnabled: true,
      VMEXReserveFactor: 1000,
    });

    await expect(
      assetMappings.addAssetMapping(initInputParams)
    ).to.be.revertedWith(AM_INTEREST_STRATEGY_NOT_CONTRACT);
  });

  it("Disallow asset can only happen when there is no outstanding debt in any tranche", async () => {
    const { assetMappings, pool, dai, usdc, users, addressesProvider } = testEnv;
    const tranche = 0;

    expect(defaultAssetMappingAssets.has(dai.address)).to.be.equal(
      true,
      "Incorrect configuration of default asset mappings"
    );

    // user 0 will deposit 1000 dai
    await dai
      .connect(users[0].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"));
    
    await dai
      .connect(users[1].signer)
      .mint(await convertToCurrencyDecimals(dai.address, "1000"));

    await dai
      .connect(users[0].signer)
      .approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);
    await dai
      .connect(users[1].signer)
      .approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);

    const amountDAItoDeposit = await convertToCurrencyDecimals(
      dai.address,
      "1000"
    );
    
    await pool
      .connect(users[0].signer)
      .deposit(dai.address, tranche, amountDAItoDeposit, users[0].address, "0");
    // user 1 will deposit 1000 weth into the lending pool
    await usdc
      .connect(users[1].signer)
      .mint(await convertToCurrencyDecimals(usdc.address, "1000"));
      console.log("HERE5")
    await usdc
      .connect(users[1].signer)
      .approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);

    await pool
      .connect(users[1].signer)
      .deposit(
        usdc.address,
        tranche,
        await convertToCurrencyDecimals(usdc.address,"1000.0"),
        users[1].address,
        "0"
      );

    // user 1 borrows dai using weth as collateral
    await pool
      .connect(users[1].signer)
      .borrow(
        dai.address,
        tranche,
        ethers.utils.parseEther("0.1"),
        "0",
        users[1].address
      );

    //governance decides to disallow dai
    await assetMappings.setBorrowingEnabled(dai.address, false);
    await assetMappings.configureAssetMapping(dai.address, 0,0,0,0,0,10000);

    await expect(
      assetMappings.setAssetAllowed(dai.address, false)
    ).to.be.revertedWith(AM_UNABLE_TO_DISALLOW_ASSET);

    // user 1 repays all dai debts
    await pool
      .connect(users[1].signer)
      .repay(dai.address, tranche, MAX_UINT_AMOUNT, users[1].address);

    //not all has been withdrawn
    await expect(
      assetMappings.setAssetAllowed(dai.address, false)
    ).to.be.revertedWith(AM_UNABLE_TO_DISALLOW_ASSET);

    await pool
      .connect(users[0].signer)
      .withdraw(dai.address, tranche, MAX_UINT_AMOUNT, users[0].address);
    //tranche admin and global admin also need to withdraw their amount

    await rawBRE.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xF2539a767D6a618A86E0E45D6d7DB3dE6282dE49"],
    });
    const globalAdmin = await ethers.getSigner("0xF2539a767D6a618A86E0E45D6d7DB3dE6282dE49")
    const trancheAdminAdd = await addressesProvider.getTrancheAdmin(tranche)
    const trancheAdmin = await ethers.getSigner(trancheAdminAdd);

    const reserveDat = await pool.connect(users[0].signer).getReserveData(dai.address, tranche);
    const varDebt = await getVariableDebtToken(reserveDat.variableDebtTokenAddress);
    const aToken = await getAToken(reserveDat.aTokenAddress);
    console.log("amount global admin has: ", await aToken.connect(users[0].signer).balanceOf("0xF2539a767D6a618A86E0E45D6d7DB3dE6282dE49"))

    console.log("amount tranche admin has: ", await aToken.connect(users[0].signer).balanceOf(trancheAdminAdd))

    console.log("total atokens: ", await aToken.connect(users[0].signer).totalSupply())
    console.log("total debt tokens: ", await varDebt.connect(users[0].signer).totalSupply())
    await users[0].signer.sendTransaction({
      to: globalAdmin.address,
      value: ethers.utils.parseEther("100.0"), // Sends exactly 100.0 ether
    });
    await pool
      .connect(globalAdmin)
      .withdraw(dai.address, tranche, MAX_UINT_AMOUNT, globalAdmin.address);

    await pool
      .connect(trancheAdmin)
      .withdraw(dai.address, tranche, MAX_UINT_AMOUNT, trancheAdminAdd);

    await assetMappings.setAssetAllowed(dai.address, false); //should be allowed now
  });
});
