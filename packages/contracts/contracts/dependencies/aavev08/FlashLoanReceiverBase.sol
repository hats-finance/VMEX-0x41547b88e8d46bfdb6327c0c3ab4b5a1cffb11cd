// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./IFlashLoanReceiver.sol";
import "./ILendingPoolAddressProvider.sol";
import "./ILendingPool.sol";

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver {

  ILendingPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
  ILendingPool public immutable LENDING_POOL;

  constructor(ILendingPoolAddressesProvider provider) {
    ADDRESSES_PROVIDER = provider;
    LENDING_POOL = ILendingPool(provider.getLendingPool());
  }

}

