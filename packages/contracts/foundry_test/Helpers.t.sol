// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol"; 
import {Vm} from "forge-std/Vm.sol"; 

import "../contracts/protocol/libraries/helpers/Helpers.sol"; 

contract HelpersTest is Test {
    function setUp() public {				
	}

    function testVelodromePrice() public {
		uint256[] memory prices = new uint256[](2); 
			prices[0] = usdc_oracle.latest_pool_price(); 
			prices[1] = velo_oracle.latest_pool_price();  
		
		uint256 supply = IERC20(velodrome_lp).totalSupply(); 
		uint256 lp_price = vOracle.get_lp_price(velodrome_lp, prices); 	

		console.log("price0:", prices[0]); 
		console.log("price1:", prices[1]); 

		emit log_named_uint("lp price:", lp_price); 
	}

	function testVelodromeInputs() public {
		(uint256 d0, uint256 d1, uint256 r0, uint256 r1, , , ) = vPair.metadata(); 
		
		uint256 scaledR0 = r0 * 1e18 / d0; 
		uint256 scaledR1 = r1 * 1e18 / d1; 
		
		uint256[] memory prices = new uint256[](2); 
			prices[0] = usdc_oracle.latest_pool_price(); 
			prices[1] = velo_oracle.latest_pool_price();  
		
		uint p0 = (scaledR0 * prices[0]) / 1e18; 
		uint p1 = (scaledR1 * prices[1]) / 1e18; 
			
		uint256 finalPrice = (p0 * p1) / IERC20(velodrome_lp).totalSupply(); 
		console.log(finalPrice); 
	}
	
}
