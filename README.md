# Free-Net dHost: Decentralized Web Hosting and Domain Resolution

Free-Net dHost is a decentralized peer-to-peer (P2P) hosting infrastructure that pairs Ethereum Sepolia smart contracts with IPFS content-addressed storage to provide censorship-resistant `.free` domain registry and hosting.

---

## Architecture Overview

1. **Smart Contracts (`freenet-contracts/`)**:
   - `src/DomainRegistry.sol`: Maps `.free` domain names to IPFS CIDs and owner addresses, and tracks owned domains per user address.
   - `test/DomainRegistry.t.sol`: Foundry test suite testing registration, uniqueness constraints, unauthorized access guards, and domain updates.
   - `script/DeployDomainRegistry.s.sol`: Script for one-command deployment to Ethereum Sepolia.

2. **Frontend & IPFS Upload Proxy (`freenet-frontend/`)**:
   - `pages/api/upload.ts`: Server-side proxy handling multi-file folder uploads and pinning directly to Pinata IPFS.
   - `pages/_app.tsx`: RainbowKit + Wagmi + TanStack Query provider setup configured for Ethereum Sepolia with dark Art Deco accents.
   - `pages/index.tsx`: Clean, unified Web3 dashboard:
     - Directory/Folder upload to IPFS (produces CID)
     - Domain registration on Sepolia (`.free`)
     - Owned domains management vault with live CID updates
     - Zero-gas decentralized resolver reading on-chain state and rendering within an isolated sandboxed iframe.

3. **Sample Site (`sample-site/`)**:
   - Ready-to-upload static website folder for testing IPFS pinning immediately.

---

## 1. Smart Contract: Foundry Testing & Deployment

### Run Test Suite
```bash
cd freenet-contracts
forge test -vv
```
All 5 unit tests pass:
- `test_RegisterDomain()`
- `test_RevertIfDuplicate()`
- `test_UpdateCID()`
- `test_RevertUnauthorizedUpdate()`
- `test_GetUserDomains()`

### Deploy to Sepolia
Set your Sepolia RPC and private key:
```bash
export RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
export PRIVATE_KEY="<your_private_key>"

forge script script/DeployDomainRegistry.s.sol:DeployDomainRegistry \
  --rpc-url $RPC_URL \
  --broadcast
```
Copy the deployed contract address and add it to `freenet-frontend/.env.local`.

---

## 2. Frontend Configuration & Running

### Configure Environment Variables
Open `freenet-frontend/.env.local` and set:
```env
PINATA_JWT=your_pinata_jwt_token_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=c04b8d78b88d3e9dc01991d31d4e2df4
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

### Start Development Server
```bash
cd freenet-frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. End-to-End Workflow

1. **Connect Wallet**: Click "Connect Wallet" at the top right and select MetaMask on Ethereum Sepolia.
2. **Upload Folder**: Choose the `sample-site` folder or your own static site build folder and click **"Pin Folder to IPFS via Pinata"**.
3. **Register Domain**: Enter your domain name (e.g. `myproject`) and click **"Register .free Domain"**. Confirm the transaction in MetaMask.
4. **Inspect The Vault**: Your registered domains will appear in the dashboard where you can update their IPFS CIDs at any time.
5. **Resolve & Browse**: In the **dBrowser Directory Board**, enter your domain name (e.g. `myproject`) and click **"Go"** to resolve the on-chain mapping and safely render the website in the sandboxed frame!