import { expect } from 'chai';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { ProtocolErrors, eContractid } from '../../helpers/types';
import { deployContract, getContract } from '../../helpers/contracts-helpers';
import { MockAToken } from '../../types/MockAToken';
import { MockStableDebtToken } from '../../types/MockStableDebtToken';
import { MockVariableDebtToken } from '../../types/MockVariableDebtToken';
import { ZERO_ADDRESS } from '../../helpers/constants';
import {
  getAToken,
  getEmergencyAdminT0,
  getMockStableDebtToken,
  getMockVariableDebtToken,
  getStableDebtToken,
  getVariableDebtToken,
} from '../../helpers/contracts-getters';
import {
  deployMockAToken,
  deployMockStableDebtToken,
  deployMockVariableDebtToken,
} from '../../helpers/contracts-deployments';
import { BigNumberish } from 'ethers';

makeSuite('Upgradeability', (testEnv: TestEnv) => {
  const { CALLER_NOT_TRANCHE_ADMIN } = ProtocolErrors;
  let newATokenAddress: string;
  let newStableTokenAddress: string;
  let newVariableTokenAddress: string;

  const tranche = 0;

  before('deploying instances', async () => {
    const { dai, pool, configurator } = testEnv;
    const aTokenInstance = await deployMockAToken([
      pool.address,
      configurator.address,
      dai.address,
      tranche.toString(),
      ZERO_ADDRESS,
      ZERO_ADDRESS,
      "0",
      ZERO_ADDRESS,
      'Aave Interest bearing DAI updated',
      'aDAI'
    ]);

    const stableDebtTokenInstance = await deployMockStableDebtToken([
      pool.address,
      dai.address,
      ZERO_ADDRESS,
      'Aave stable debt bearing DAI updated',
      'stableDebtDAI'
    ]);

    const variableDebtTokenInstance = await deployMockVariableDebtToken([
      pool.address,
      dai.address,
      ZERO_ADDRESS,
      'Aave variable debt bearing DAI updated',
      'variableDebtDAI'
    ]);

    newATokenAddress = aTokenInstance.address;
    newVariableTokenAddress = variableDebtTokenInstance.address;
    newStableTokenAddress = stableDebtTokenInstance.address;
  });

  it('Tries to update the DAI Atoken implementation with a different address than the lendingPoolManager', async () => {
    const { dai, configurator, users } = testEnv;
    const emergencyAdminT0 = await getEmergencyAdminT0();

    const name = await (await getAToken(newATokenAddress)).name();
    const symbol = await (await getAToken(newATokenAddress)).symbol();

    const updateATokenInputParams: {
      asset: string;
      trancheId: BigNumberish;
      treasury: string;
      incentivesController: string;
      name: string;
      symbol: string;
      implementation: string;
    } = {
      asset: dai.address,
      trancheId: tranche,
      treasury: ZERO_ADDRESS,
      incentivesController: ZERO_ADDRESS,
      name: name,
      symbol: symbol,
      implementation: newATokenAddress,
    };
    await expect(
      configurator.connect(users[1].signer).updateAToken(updateATokenInputParams)
    ).to.be.revertedWith('Caller not global VMEX admin');
  });

  it('Upgrades the DAI Atoken implementation ', async () => {
    const { dai, configurator, aDai } = testEnv;

    const name = await (await getAToken(newATokenAddress)).name();
    const symbol = await (await getAToken(newATokenAddress)).symbol();

    const updateATokenInputParams: {
      asset: string;
      trancheId: BigNumberish;
      treasury: string;
      incentivesController: string;
      name: string;
      symbol: string;
      implementation: string;
    } = {
      asset: dai.address,
      trancheId: tranche,
      treasury: ZERO_ADDRESS,
      incentivesController: ZERO_ADDRESS,
      name: name,
      symbol: symbol,
      implementation: newATokenAddress,
    };
    await configurator.updateAToken(updateATokenInputParams);

    const tokenName = await aDai.name();

    expect(tokenName).to.be.eq('Aave Interest bearing DAI updated', 'Invalid token name');
  });

  // it('Tries to update the DAI Stable debt token implementation with a different address than the lendingPoolManager', async () => {
  //   const { dai, configurator, users } = testEnv;

  //   const name = await (await getStableDebtToken(newStableTokenAddress)).name();
  //   const symbol = await (await getStableDebtToken(newStableTokenAddress)).symbol();


  //   const updateDebtTokenInput: {
  //     asset: string;
  //     trancheId: BigNumberish;
  //     incentivesController: string;
  //     name: string;
  //     symbol: string;
  //     implementation: string;
  //     params: string;
  //   } = {
  //     asset: dai.address,
  //     trancheId: tranche,
  //     incentivesController: ZERO_ADDRESS,
  //     name: name,
  //     symbol: symbol,
  //     implementation: newStableTokenAddress,
  //     params: '0x10'
  //   }

  //   await expect(
  //     configurator
  //       .connect(users[1].signer)
  //       .updateStableDebtToken(updateDebtTokenInput)
  //   ).to.be.revertedWith('Caller not global VMEX admin');
  // });

  // it('Upgrades the DAI stable debt token implementation ', async () => {
  //   const { dai, configurator, pool, helpersContract } = testEnv;

  //   const name = await (await getStableDebtToken(newStableTokenAddress)).name();
  //   const symbol = await (await getStableDebtToken(newStableTokenAddress)).symbol();


  //   const updateDebtTokenInput: {
  //     asset: string;
  //     trancheId: BigNumberish;
  //     incentivesController: string;
  //     name: string;
  //     symbol: string;
  //     implementation: string;
  //     params: string;
  //   } = {
  //     asset: dai.address,
  //     trancheId: tranche,
  //     incentivesController: ZERO_ADDRESS,
  //     name: name,
  //     symbol: symbol,
  //     implementation: newStableTokenAddress,
  //     params: '0x10'
  //   }

  //   await configurator.updateStableDebtToken(updateDebtTokenInput);

  //   const { stableDebtTokenAddress } = await helpersContract.getReserveTokensAddresses(dai.address, tranche);

  //   const debtToken = await getMockStableDebtToken(stableDebtTokenAddress);

  //   const tokenName = await debtToken.name();

  //   expect(tokenName).to.be.eq('Aave stable debt bearing DAI updated', 'Invalid token name');
  // });

  it('Tries to update the DAI variable debt token implementation with a different address than the lendingPoolManager', async () => {
    const {dai, configurator, users} = testEnv;

    const name = await (await getVariableDebtToken(newVariableTokenAddress)).name();
    const symbol = await (await getVariableDebtToken(newVariableTokenAddress)).symbol();

    const updateDebtTokenInput: {
      asset: string;
      trancheId: BigNumberish;
      incentivesController: string;
      name: string;
      symbol: string;
      implementation: string;
      params: string;
    } = {
      asset: dai.address,
      trancheId: tranche,
      incentivesController: ZERO_ADDRESS,
      name: name,
      symbol: symbol,
      implementation: newVariableTokenAddress,
      params: '0x10'
    }

    await expect(
      configurator
        .connect(users[1].signer)
        .updateVariableDebtToken(updateDebtTokenInput)
    ).to.be.revertedWith('Caller not global VMEX admin');
  });

  it('Upgrades the DAI variable debt token implementation ', async () => {
    const {dai, configurator, pool, helpersContract} = testEnv;

    const name = await (await getVariableDebtToken(newVariableTokenAddress)).name();
    const symbol = await (await getVariableDebtToken(newVariableTokenAddress)).symbol();

    const updateDebtTokenInput: {
      asset: string;
      trancheId: BigNumberish;
      incentivesController: string;
      name: string;
      symbol: string;
      implementation: string;
      params: string;
    } = {
      asset: dai.address,
      trancheId: tranche,
      incentivesController: ZERO_ADDRESS,
      name: name,
      symbol: symbol,
      implementation: newVariableTokenAddress,
      params: '0x10'
    }
    //const name = await (await getAToken(newATokenAddress)).name();

    await configurator.updateVariableDebtToken(updateDebtTokenInput);

    const { variableDebtTokenAddress } = await helpersContract.getReserveTokensAddresses(
      dai.address, tranche
    );

    const debtToken = await getMockVariableDebtToken(variableDebtTokenAddress);

    const tokenName = await debtToken.name();

    expect(tokenName).to.be.eq('Aave variable debt bearing DAI updated', 'Invalid token name');
  });
});
