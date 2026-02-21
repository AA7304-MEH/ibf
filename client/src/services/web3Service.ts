import { ethers } from 'ethers';

class Web3Service {
    private provider: any;
    private signer: any;

    async connectWallet() {
        if (!(window as any).ethereum) {
            throw new Error("No crypto wallet found. Please install MetaMask.");
        }

        try {
            this.provider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await this.provider.send("eth_requestAccounts", []);
            this.signer = await this.provider.getSigner();

            // Check for Polygon Network (Chain ID 137 or 80001 for Mumbai/Amoy)
            const network = await this.provider.getNetwork();
            if (network.chainId !== 137n) {
                // Request network switch or inform user
                console.warn("Please switch to Polygon Mainnet for minting.");
            }

            return accounts[0];
        } catch (error) {
            console.error("Wallet connection failed:", error);
            throw error;
        }
    }

    async claimBadgeOnChain(badgeId: string, studentName: string) {
        // Mock Minting Logic for Demo
        // In a real scenario, this would call a smart contract:
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.signer);
        // const tx = await contract.mintBadge(badgeId);

        console.log(`Minting Badge ${badgeId} for ${studentName} on Polygon...`);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    txHash: "0x" + Math.random().toString(16).slice(2, 66),
                    network: "Polygon POS"
                });
            }, 3000);
        });
    }

    async getWalletAddress() {
        if (!this.signer) return null;
        return await this.signer.getAddress();
    }
}

export const web3Service = new Web3Service();
