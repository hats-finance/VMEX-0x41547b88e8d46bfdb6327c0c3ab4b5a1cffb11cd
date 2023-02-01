//import {UserLiquidationLogic} from "./UserLiquidationData.sol"; 


interface IUserLiquidationLogic {
	function _executeOperation(
    	address asset,
    	uint256 amount,
    	uint256 premium,
    	address initiator,
    	bytes calldata params
	) external returns (bool);
	function liquidateUser(address user) external; 
}
