# Payroll Credit System

A complete classroom practical Web3 project implementing an administrative payroll configuration contract and an ERC-20 utility credit token (`PAYC`) on Ethereum using Solidity and Hardhat.

---

## 1. Aim

To design, develop, test, and prepare for deployment a decentralized **Payroll Credit System** composed of:
1. An administrator-only configuration smart contract (`PayrollConfig.sol`) to manage global payroll disbursement rates.
2. A standard ERC-20 utility token (`PayrollCredit.sol`) representing payroll credits (`PAYC`) with a fixed initial supply of 1,000,000 tokens minted to the treasury deployer.
3. Automated test suites testing all state modifications, access controls, events, and transfer invariants.
4. A deployment and source-verification pipeline for the Ethereum Sepolia testnet.

---

## 2. Requirements & Software Toolchain

| Tool / Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v24.17.0` | JavaScript runtime environment |
| **npm** | `11.13.0` | Package manager |
| **Hardhat** | `2.29.1` | Ethereum development environment (Hardhat 2 stable release) |
| **Solidity (`solc`)** | `0.8.24` | Smart contract compiler (EVM target: `paris`) |
| **OpenZeppelin Contracts** | `@openzeppelin/contracts@5.2.0` | Audited ERC-20 standard implementation |
| **Hardhat Toolbox** | `@nomicfoundation/hardhat-toolbox@5.0.0` | Ethers v6, Mocha, Chai, and Etherscan verify plugin |
| **Dotenv** | `dotenv@16.4.7` | Secure environment variable configuration |

---

## 3. Contract Descriptions

### 3.1 `PayrollConfig.sol`
- **Purpose**: Provides administrative control over global payroll configuration variables (such as base disbursement rates).
- **Access Control**: Tracks the deployer as `admin`. Restricts rate modifications exclusively to the administrator using the `onlyAdmin` modifier.
- **State Storage**: Encapsulates `uint256 private payrollRate`, initialized to `0`.
- **Event Notification**: Emits `ConfigurationUpdated(uint256 newRate, address indexed updatedBy)` whenever the configuration is altered.

### 3.2 `PayrollCredit.sol`
- **Purpose**: Serves as the fungible ERC-20 payment asset for the payroll ecosystem.
- **Token Specifications**:
  - Name: `Payroll Credit`
  - Symbol: `PAYC`
  - Decimals: `18`
  - Initial Supply: `1,000,000 PAYC` (`1,000,000 * 10^18` wei units)
- **Minting Mechanism**: The entire initial supply is minted to the deployer wallet in the constructor. No external or unrestricted minting functions are exposed, guaranteeing a fixed supply cap.

---

## 4. Algorithms

### Algorithm 1: Administrative Configuration (`PayrollConfig.sol`)
1. **Deployment Phase (`constructor`)**:
   - `admin ← msg.sender`
   - `payrollRate ← 0`
2. **Rate Update Phase (`setPayrollRate(newRate)`)**:
   - If `msg.sender != admin`, revert with error `"PayrollConfig: caller is not the administrator"`.
   - `payrollRate ← newRate`
   - Emit event `ConfigurationUpdated(newRate, msg.sender)`
3. **Rate Inquiry Phase (`getPayrollRate()`)**:
   - Return `payrollRate`

### Algorithm 2: ERC-20 Payroll Token (`PayrollCredit.sol`)
1. **Deployment Phase (`constructor`)**:
   - Initialize parent `ERC20("Payroll Credit", "PAYC")`
   - Set constant `INITIAL_SUPPLY = 1,000,000 * 10^18`
   - Invoke internal `_mint(msg.sender, INITIAL_SUPPLY)`
   - Emit standard ERC-20 `Transfer(address(0), msg.sender, INITIAL_SUPPLY)`
2. **Transfer Phase (`transfer(recipient, amount)`)**:
   - Verify `balanceOf(msg.sender) >= amount` (otherwise revert with `ERC20InsufficientBalance`)
   - `balanceOf(msg.sender) ← balanceOf(msg.sender) - amount`
   - `balanceOf(recipient) ← balanceOf(recipient) + amount`
   - Emit standard ERC-20 `Transfer(msg.sender, recipient, amount)`
   - `totalSupply` remains constant

---

## 5. Important Functions and Their Purposes

### `PayrollConfig.sol`
- `constructor()`: Initializes the deployer address as `admin` and sets initial `payrollRate` to 0.
- `setPayrollRate(uint256 newRate)`: Updates the stored payroll rate. Only accessible by `admin`.
- `getPayrollRate()`: Public view function returning the currently active payroll rate.
- `onlyAdmin()`: Modifier evaluating caller authorization prior to function execution.

### `PayrollCredit.sol`
- `constructor()`: Sets token metadata and mints 1,000,000 PAYC to the deployer.
- `transfer(address to, uint256 value)`: Transfers tokens from caller to recipient.
- `balanceOf(address account)`: Returns token balance of the queried address.
- `totalSupply()`: Returns the total circulating token supply.
- `decimals()`: Returns the token decimal units (`18`).

---

## 6. Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HariVarna/Multi-Sign-Salary-Distribution-System.git
   cd Multi-Sign-Salary-Distribution-System
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Sepolia RPC URL, deployer private key, and Etherscan API key:
   ```ini
   SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
   PRIVATE_KEY="YOUR_SEPOLIA_DEPLOYER_PRIVATE_KEY"
   ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
   ```

---

## 7. Compilation Commands & Output

To compile the smart contracts:
```bash
npm run compile
```

**Actual Output:**
```text
> payroll-credit-system@1.0.0 compile
> hardhat compile

Compiled 7 Solidity files successfully (evm target: paris).
```

---

## 8. Test Commands & Actual Test Results

To execute the complete automated test suite:
```bash
npm test
```

**Actual Terminal Output (17 passing test cases, 0 failures):**
```text
> payroll-credit-system@1.0.0 test
> hardhat test

  Hardhat Environment Setup
    ✔ should initialize Hardhat runtime environment and provide test signers (720ms)
    ✔ should retrieve network chain ID

  PayrollConfig Contract
    Deployment & Initialization
      ✔ should record the deployer as administrator during deployment
      ✔ should initialize the payroll configuration rate to zero
    Payroll Rate Management
      ✔ should allow the administrator to update the rate via setPayrollRate
      ✔ should return the updated value through public getPayrollRate() getter
      ✔ should emit a ConfigurationUpdated event when the value changes
      ✔ should reject non-admin setter calls with proper revert reason (40ms)
      ✔ should leave the stored value unchanged after a failed unauthorized call

  PayrollCredit (PAYC) Token Contract
    Token Metadata & Initial Supply
      ✔ should verify token name, symbol, and decimals
      ✔ should initialize total supply to exactly 1,000,000 PAYC
      ✔ should mint the entire initial supply to the deployer balance
      ✔ should report zero initial balance for other accounts
    Standard ERC-20 Transfers
      ✔ should execute a successful token transfer and emit Transfer event
      ✔ should accurately update sender and recipient balances following a transfer
      ✔ should maintain unchanged total supply across multiple transfers
      ✔ should fail when transfer amount exceeds the sender's available balance

  17 passing (1s)
```

---

## 9. Deployment Commands

### Local Deployment (Hardhat In-Memory / Localhost)
```bash
# Combined deployment:
npx hardhat run scripts/deploy.js

# Local standalone node:
npm run node
npm run deploy:local
```

### Sepolia Testnet Deployment
```bash
# Validate prerequisites before broadcasting:
node scripts/check-env.js

# Deploy both contracts to Sepolia:
npm run deploy:sepolia

# Or deploy individually:
npm run deploy:config:sepolia
npm run deploy:token:sepolia
```

---

## 10. Contract Addresses & Transaction Hashes

### Local Demonstration Deployments (Hardhat Network Chain ID 31337)
- **Deployer**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **PayrollConfig Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **PayrollCredit Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Rate Update Tx Hash**: `0x79fa200064de766291cfd8f862758c693c7ea47d39fefd1634d67066b30f50d9`
- **PAYC Transfer Tx Hash**: `0x3d788845cf74122d3ee99b66bbb40ce8762521eeae75efeb1f2b3c2fbdc2fd82`

*(For live Sepolia testnet, deploy using `npm run deploy:sepolia` once valid testnet credentials and faucet funds are supplied in `.env`).*

---

## 11. Source-Verification Links

Once deployed to Sepolia, verify contract source code with:
```bash
npx hardhat verify --network sepolia <DEPLOYED_CONFIG_ADDRESS>
npx hardhat verify --network sepolia <DEPLOYED_TOKEN_ADDRESS>
```

**Etherscan Block Explorer Links Template:**
- Sepolia Explorer: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)
- PayrollConfig Contract: `https://sepolia.etherscan.io/address/<DEPLOYED_CONFIG_ADDRESS>#code`
- PayrollCredit Contract: `https://sepolia.etherscan.io/address/<DEPLOYED_TOKEN_ADDRESS>#code`

---

## 12. Interaction Commands and Actual Output

### 12.1 PayrollConfig Demonstration
Run:
```bash
npx hardhat run scripts/interact-config.js
```

**Actual Output:**
```text
====================================================
       PayrollConfig Contract Demonstration
====================================================
Network: hardhat
Admin account:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Non-admin account: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deploying fresh PayrollConfig instance for demonstration...
Contract Address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
Administrator:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Initial Rate:      0

[Admin Action] Setting payroll rate to 5000...
Transaction submitted. Hash: 0x79fa200064de766291cfd8f862758c693c7ea47d39fefd1634d67066b30f50d9
Transaction confirmed in block: 2
Updated Rate:      5000

[Security Verification] Testing unauthorized setter call rejection...
✔ Revert confirmed: Non-admin setter call was rejected!
  Revert Reason: VM Exception while processing transaction: reverted with reason string 'PayrollConfig: caller is not the administrator'
Rate after unauthorized attempt: 5000
✔ Stored value remains protected and unchanged at 5000.
====================================================
```

### 12.2 PayrollCredit (PAYC) Demonstration
Run:
```bash
npx hardhat run scripts/interact-token.js
```

**Actual Output:**
```text
====================================================
     PayrollCredit (PAYC) Token Demonstration
====================================================
Network: hardhat
Deployer account:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Recipient account: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deploying fresh PayrollCredit instance for demonstration...

--- Token Metadata ---
Contract Address:   0x5FbDB2315678afecb367f032d93F642f64180aa3
Token Name:         Payroll Credit
Token Symbol:       PAYC
Token Decimals:     18
Total Supply:       1000000.0 PAYC
Deployer Balance:   1000000.0 PAYC
Recipient Balance:  0.0 PAYC

[Transfer Action] Transferring 100 PAYC to recipient...
Transaction submitted. Hash: 0x3d788845cf74122d3ee99b66bbb40ce8762521eeae75efeb1f2b3c2fbdc2fd82
Transaction confirmed in block: 2

--- Balances After Transfer ---
Deployer Balance:   999900.0 PAYC
Recipient Balance:  100.0 PAYC
Total Supply:       1000000.0 PAYC
✔ Total supply verified unchanged.
====================================================
```

---

## 13. Security Considerations

1. **Access Control**: Administrative functions in `PayrollConfig` are restricted via `onlyAdmin`. Unauthorized callers are explicitly rejected.
2. **Supply Cap & Minting Protection**: `PayrollCredit` does not expose any external minting functions. The supply cannot be arbitrarily inflated.
3. **Private Key Safety**: `.env` is explicitly ignored by Git. No sensitive keys or API secrets are hardcoded or tracked in version control.
4. **Gas Protection**: Simulation via static calls is used during demonstration to test revert logic without wasting testnet gas.
5. **Mainnet Safeguard**: Project configurations and scripts are locked to Hardhat local networks and Sepolia testnet only. Mainnet deployment is prohibited.
