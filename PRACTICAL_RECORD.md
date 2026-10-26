# Practical Record: Payroll Credit System

**Course / Subject**: Blockchain & Web3 Technologies Laboratory  
**Project**: Payroll Credit System using Solidity & Hardhat  
**Date**: October 2026  

---

## 1. Aim
To design, implement, test, and prepare for deployment a decentralized **Payroll Credit System** consisting of:
1. An administrator-only configuration smart contract (`PayrollConfig.sol`) to manage payroll rate parameters.
2. An ERC-20 utility token contract (`PayrollCredit.sol`) representing payroll credits (`PAYC`) with an initial fixed supply of 1,000,000 tokens minted to the deployer.
3. Comprehensive automated test suites verifying access controls, state mutability, ERC-20 compliance, and transaction balance integrity.
4. A deployment and source-verification pipeline targeting the Ethereum Sepolia testnet.

---

## 2. Algorithms

### Algorithm 1: Administrative Configuration (`PayrollConfig.sol`)
1. **Initialization (`constructor`)**:
   - Step 1.1: Capture `msg.sender` and assign it to `admin`.
   - Step 1.2: Set the initial `payrollRate` state variable to `0`.
2. **Access-Controlled Modification (`setPayrollRate(uint256 newRate)`)**:
   - Step 2.1: Evaluate caller identity via `onlyAdmin` modifier (`require(msg.sender == admin)`).
   - Step 2.2: If caller is not `admin`, revert execution with `"PayrollConfig: caller is not the administrator"`.
   - Step 2.3: If caller is `admin`, assign `payrollRate = newRate`.
   - Step 2.4: Emit the `ConfigurationUpdated(newRate, msg.sender)` event.
3. **Data Retrieval (`getPayrollRate()`)**:
   - Step 3.1: Return stored `payrollRate` as an unprivileged view call.

### Algorithm 2: ERC-20 Payroll Token (`PayrollCredit.sol`)
1. **Initialization (`constructor`)**:
   - Step 1.1: Invoke OpenZeppelin ERC20 constructor with Token Name `"Payroll Credit"` and Symbol `"PAYC"`.
   - Step 1.2: Define constant `INITIAL_SUPPLY = 1,000,000 * 10^18`.
   - Step 1.3: Call internal `_mint(msg.sender, INITIAL_SUPPLY)` to credit 1,000,000 PAYC to the deployer account.
   - Step 1.4: Emit the standard ERC-20 `Transfer(address(0), msg.sender, INITIAL_SUPPLY)` event.
2. **Token Transfer (`transfer(address to, uint256 amount)`)**:
   - Step 2.1: Check if caller balance `>= amount` (otherwise revert with `ERC20InsufficientBalance`).
   - Step 2.2: Deduct `amount` from caller balance.
   - Step 2.3: Credit `amount` to recipient (`to`) balance.
   - Step 2.4: Total supply remains invariant throughout transfer lifecycle.

---

## 3. Smart Contract Specifications

| Contract | Standard / Base | State Variables | Key Functions | Events |
| :--- | :--- | :--- | :--- | :--- |
| **`PayrollConfig.sol`** | Standalone Solidity | `admin` (address), `payrollRate` (uint256) | `setPayrollRate(uint256)`, `getPayrollRate()` | `ConfigurationUpdated` |
| **`PayrollCredit.sol`** | OpenZeppelin ERC-20 | `INITIAL_SUPPLY` (1,000,000 * 10^18) | Standard ERC-20 (`transfer`, `balanceOf`, `totalSupply`, `decimals`) | `Transfer`, `Approval` |

---

## 4. Test Cases & Execution Summary

- **Framework**: Hardhat 2.29.1, `@nomicfoundation/hardhat-toolbox` (Ethers v6, Mocha, Chai).
- **Total Test Cases**: 17 Passed, 0 Failed.

| Suite | Category | Tested Behavior | Status |
| :--- | :--- | :--- | :--- |
| **`hardhat-setup.test.js`** | Environment | Hardhat Runtime initialization & signers | PASS |
| | Network | Local Chain ID verification (`31337`) | PASS |
| **`PayrollConfig.test.js`** | Deployment | Deployer recorded as administrator | PASS |
| | Initialization | Initial rate set to `0` | PASS |
| | Authorization | Admin updates rate to `5000` via `setPayrollRate` | PASS |
| | Getter | Public `getPayrollRate()` returns updated value | PASS |
| | Event | `ConfigurationUpdated` event emitted | PASS |
| | Access Control | Non-admin call reverts with exact error string | PASS |
| | State Guard | Unauthorized attempt leaves stored value intact | PASS |
| **`PayrollCredit.test.js`** | Metadata | Name (`Payroll Credit`), Symbol (`PAYC`), Decimals (`18`) | PASS |
| | Total Supply | Exactly `1,000,000 PAYC` (`10^24` wei) | PASS |
| | Minting | Full initial supply credited to deployer | PASS |
| | Zero Balance | Other accounts have initial balance `0` | PASS |
| | Transfer | Successful transfer emits ERC-20 `Transfer` | PASS |
| | Balances | Sender decreased & recipient increased accurately | PASS |
| | Invariance | Total supply unchanged after multiple transfers | PASS |
| | Revert Guard | Transfer exceeding sender balance reverts with `ERC20InsufficientBalance` | PASS |

---

## 5. Deployment Details & Instructions

- **Target Network**: Ethereum Sepolia Testnet (Chain ID: `11155111`).
- **Configuration Security**:
  - Environment loader reads `SEPOLIA_RPC_URL`, `PRIVATE_KEY`, and `ETHERSCAN_API_KEY` from `.env`.
  - `.gitignore` strictly protects `.env`, ensuring private keys are never committed.
- **Local Demonstration Results (Hardhat Runtime)**:
  - `PayrollConfig` deployed to: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
  - `PayrollCredit` deployed to: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (in isolated runs)
  - Rate updated to `5000` by admin; non-admin call reverted with `"PayrollConfig: caller is not the administrator"`.
  - 100 PAYC transferred from deployer to recipient; deployer balance updated to `999,900 PAYC`, recipient to `100 PAYC`, total supply invariant.
- **Sepolia Deployment Command**:
  ```bash
  npm run deploy:sepolia
  ```
- **Sepolia Source Verification Command**:
  ```bash
  npx hardhat verify --network sepolia <DEPLOYED_CONFIG_ADDRESS>
  npx hardhat verify --network sepolia <DEPLOYED_TOKEN_ADDRESS>
  ```

---

## 6. Result
The Payroll Credit System smart contracts were successfully designed, compiled, and verified through automated test suites (17/17 passing). The local interaction demonstrations proved both the access control integrity of the configuration contract and the transactional correctness of the ERC-20 credit token. The deployment pipeline for Sepolia testnet is fully configured, secured, and ready for broadcasting.
