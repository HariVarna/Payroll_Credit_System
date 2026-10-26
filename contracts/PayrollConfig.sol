// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title PayrollConfig
 * @dev Administrator-only configuration contract for the Payroll Credit System.
 * Stores payroll rate settings accessible and mutable only by the authorized administrator.
 */
contract PayrollConfig {
    address public admin;
    uint256 private payrollRate;

    event ConfigurationUpdated(uint256 newRate, address indexed updatedBy);

    modifier onlyAdmin() {
        require(msg.sender == admin, "PayrollConfig: caller is not the administrator");
        _;
    }

    /**
     * @dev Initializes the contract setting the deployer as administrator
     * and payrollRate to zero.
     */
    constructor() {
        admin = msg.sender;
        payrollRate = 0;
    }

    /**
     * @notice Updates the stored payroll rate. Accessible only by the administrator.
     * @param newRate New configuration value.
     */
    function setPayrollRate(uint256 newRate) external onlyAdmin {
        payrollRate = newRate;
        emit ConfigurationUpdated(newRate, msg.sender);
    }

    /**
     * @notice Returns the current payroll rate configuration value.
     * @return Stored payroll rate.
     */
    function getPayrollRate() external view returns (uint256) {
        return payrollRate;
    }
}
