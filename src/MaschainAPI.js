const API_URL = 'https://service-testnet.maschain.com';
const CLIENT_ID = '71f5262fecb4000f18f909a94b0b837705be582c61c5281d87cd0cca5eb5d07b';
const CLIENT_SECRET = 'sk_799a2e7f261e0046cfe7266df5d89ee15f5d6fa05302c216d63cc599982022f7';
const DEFAULT_FILE = new Blob(['Placeholder NFT'], { type: 'text/plain' }); // Hardcoded file data
const DEFAULT_NAME = 'KLCC';
const DEFAULT_DESCRIPTION = 'NFT rewarded for visiting KLCC';
const CALLBACK_URL = 'https://your.callback.url';

const headers = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'content-type': 'application/json'
};

const MaschainAPI = {

    createWallet: async (name, email, ic) => {
        const response = await fetch(`${API_URL}/api/wallet/create-user`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name, email, ic })
        });
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Failed to create wallet: ${errorDetails}`);
        }
        return await response.json();
    },

    getWallet: async (address) => {
        const response = await fetch(`${API_URL}/api/wallet/wallet/${address}`, {
            method: 'GET',
            headers
        });
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to create wallet: ${errorDetails}`);
        }
        const walletData = await response.json();
        console.log('Wallet Response:', walletData);
        return walletData;
    },

    transferTokens: async (walletAddress, to, amount, contractAddress, callbackUrl) => {
        const response = await fetch(`${API_URL}/api/token/token-transfer`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ wallet_address: walletAddress, to, amount, contract_address: contractAddress, callback_url: callbackUrl })
        });
        if (!response.ok) {
            throw new Error('Failed to transfer tokens');
        }
        return await response.json();
    },

    mintTokens: async (from, to, amount, contractAddress) => {
      const response = await fetch(`${API_URL}/api/token/mint`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
              wallet_address: from,
              to,
              amount,
              contract_address: contractAddress,
              callback_url: 'YOUR_CALLBACK_URL' // Replace with your callback URL
          })
      });
      if (!response.ok) {
          const errorDetails = await response.text(); // Log detailed error message
          throw new Error(`Failed to mint tokens: ${errorDetails}`);
      }
      return await response.json();
    },

    checkTokenBalance: async (walletAddress, contractAddress) => {
      const response = await fetch(`${API_URL}/api/token/balance`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ wallet_address: walletAddress, contract_address: contractAddress })
      });
      if (!response.ok) {
          throw new Error('Failed to check token balance');
      }
      return await response.json();
    },

    transferTokens: async (walletAddress, to, amount, contractAddress, callbackUrl) => {
        const response = await fetch(`${API_URL}/api/token/token-transfer`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ wallet_address: walletAddress, to, amount, contract_address: contractAddress, callback_url: callbackUrl }),
        });
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Failed to transfer tokens: ${errorDetails.result || 'Unknown error'}`);
        }
        return await response.json();
    },

    getNFTCollection: async (walletAddress) => {
        const response = await fetch(`${API_URL}/api/certificate/get-certificate?to=${walletAddress}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch NFT collection');
        }

        return await response.json();
    },

    mintNFT: async (defaultAddress, walletAddress, contractAddress, name, description, callbackUrl) => {
        const data = {
            wallet_address: defaultAddress ,
            to: walletAddress,
            contract_address: contractAddress,
            name: name,
            description: description,
            callback_url: callbackUrl
        };
    
        try {
            console.log('Sending JSON request to:', `${API_URL}/api/certificate/mint-certificate`);
            const response = await fetch(`${API_URL}/api/certificate/mint-certificate`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Failed to mint NFT: ${errorDetails}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Minting Error:', error);
            throw error;
        }
    }    
};

export default MaschainAPI;