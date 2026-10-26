// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title PayrollCredit
 * @dev ERC-20 token implementation for Payroll Credit (PAYC).
 * Mints an initial fixed supply of 1,000,000 PAYC (18 decimals) to the deployer.
 */
contract PayrollCredit is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    /**
     * @dev Sets token name "Payroll Credit" and symbol "PAYC",
     * and mints the entire initial supply to the deployer.
     */
    constructor() ERC20("Payroll Credit", "PAYC") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
