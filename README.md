# Payroll Credit System

A classroom practical blockchain project implementing an administrative payroll configuration contract and an ERC-20 utility credit token (`PAYC`) on Ethereum using Solidity and Hardhat.

---

## 1. Project Objective

The objective of this project is to provide a solid, secure, and straightforward demonstration of Web3 backend engineering principles for payroll automation:
- **Administrative Configuration (`PayrollConfig.sol`)**: Manages dynamic payroll rate settings protected by strict access control mechanisms.
- **Utility Token (`PayrollCredit.sol`)**: An ERC-20 token standard implementation representing payroll disbursement units (`PAYC`) with an initial fixed supply minted to the treasury deployer.
- **Classroom Practical Alignment**: Built with clarity, comprehensive automated tests, and industry-standard security patterns suitable for practical examinations and laboratory evaluations.

---

## 2. Software & Tooling Versions

- **Node.js**: `v24.17.0`
- **npm**: `11.13.0`
- **Hardhat**: `2.29.1` (Hardhat 2 stable release)
- **Solidity (`solc`)**: `0.8.24` (EVM target: Paris)
- **OpenZeppelin Contracts**: `@openzeppelin/contracts@5.2.0`
- **Hardhat Toolbox**: `@nomicfoundation/hardhat-toolbox@5.0.0`
- **Dotenv**: `dotenv@16.4.7`

---

## 3. Smart Contracts Description

### `PayrollConfig.sol`
- **Administrator Assignment**: The deployer address is permanently assigned as the contract administrator at construction time (`admin = msg.sender`).
- **State Storage**: Stores a `uint256 private payrollRate` initialized to `0`.
- **Access Control**: Protected by the `onlyAdmin` modifier. Non-administrator attempts revert with `"PayrollConfig: caller is not the administrator"`.
- **Public Getter**: `getPayrollRate()` provides read-only access to the configured payroll rate.
- **Event Emission**: Emits `ConfigurationUpdated(uint256 newRate, address indexed updatedBy)` upon successful state change.

### `PayrollCredit.sol`
- **Standard**: ERC-20 token based on OpenZeppelin's audited implementation.
- **Name**: `Payroll Credit`
- **Symbol**: `PAYC`
- **Decimals**: `18`
- **Initial Supply**: `1,000,000 PAYC` (`1,000,000 * 10^18` wei units).
- **Minting**: The entire initial supply is minted to the deployer address upon deployment; no arbitrary or unprotected minting functions exist.

---

## 4. Installation Instructions

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/HariVarna/Multi-Sign-Salary-Distribution-System.git
   cd Multi-Sign-Salary-Distribution-System
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

---

## 5. Compilation & Testing Commands

### Compile Smart Contracts
```bash
npm run compile
```
*Direct Hardhat command:* `npx hardhat compile`

### Run Automated Tests
```bash
npm test
```
*Direct Hardhat command:* `npx hardhat test`

### Clean Build Cache
```bash
npm run clean
```

---

## 6. Test Suite & Coverage

The automated test suite covers 17 test cases across 3 test files:

### `test/PayrollConfig.test.js`
- **Deployment & Initialization**:
  - Verifies deployer is assigned as the administrator.
  - Verifies initial payroll rate defaults to `0`.
- **Payroll Rate Management**:
  - Verifies the administrator can successfully call `setPayrollRate(newRate)`.
  - Verifies public getter `getPayrollRate()` returns the updated value.
  - Verifies the `ConfigurationUpdated` event is emitted with the correct arguments.
  - Verifies that non-admin calls revert with `"PayrollConfig: caller is not the administrator"`.
  - Verifies that failed unauthorized calls leave the stored rate unchanged.

### `test/PayrollCredit.test.js`
- **Token Metadata & Initial Supply**:
  - Verifies name is `"Payroll Credit"`, symbol is `"PAYC"`, and decimals equal `18`.
  - Verifies total supply equals `1,000,000 PAYC` (`1_000_000 * 10^18`).
  - Verifies the full initial supply is minted to the deployer.
  - Verifies non-deployer accounts start with zero balance.
- **Standard ERC-20 Transfers**:
  - Verifies successful token transfers emit the `Transfer` event.
  - Verifies sender and recipient balances update accurately post-transfer.
  - Verifies total supply remains constant after multiple transfers.
  - Verifies transfers exceeding the sender's balance revert with `ERC20InsufficientBalance`.

### `test/hardhat-setup.test.js`
- Validates that the Hardhat Runtime Environment initializes signers and connects to local chain ID `31337`.

---

## 7. Environment Configuration (.env)

A `.env.example` file is included with template variables. To configure your environment for testnet deployment:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Populate the variables in `.env`:
   ```ini
   # Sepolia RPC URL (from Alchemy, Infura, or any provider)
   SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key"

   # Deployer Private Key (Testnet only; NEVER expose or commit real keys)
   PRIVATE_KEY="your_64_character_hex_private_key"

   # Etherscan API Key for contract verification
   ETHERSCAN_API_KEY="your_etherscan_api_key"
   ```

> **Security Note:** `.env` is ignored by Git in `.gitignore`. Never commit private keys or API credentials.

---

## 8. Deployment Instructions

### Local In-Memory Deployment (Testing)
To deploy locally for validation:
```bash
npx hardhat run scripts/deploy.js
```

### Local Hardhat Node Deployment
1. Start the local node in terminal 1:
   ```bash
   npm run node
   ```
2. Deploy contracts in terminal 2:
   ```bash
   npm run deploy:local
   ```

### Sepolia Testnet Deployment
Ensure you have Sepolia testnet ETH in your deployer wallet and `.env` configured.

#### Deploy Both Contracts:
```bash
npm run deploy:sepolia
```
*Or via Hardhat:* `npx hardhat run scripts/deploy.js --network sepolia`

#### Deploy Contracts Individually:
- **Deploy PayrollConfig only:**
  ```bash
  npm run deploy:config:sepolia
  ```
- **Deploy PayrollCredit only:**
  ```bash
  npm run deploy:token:sepolia
  ```

### Contract Verification on Etherscan (Sepolia)
Once deployed to Sepolia, verify contract source code with:
```bash
npx hardhat verify --network sepolia <DEPLOYED_CONFIG_ADDRESS>
npx hardhat verify --network sepolia <DEPLOYED_TOKEN_ADDRESS>
```
*(No constructor arguments are required for either contract).*
