// import { getDefaultConfig } from '@rainbow-me/rainbowkit';
// import {
//   hardhat, sepolia
// } from 'wagmi/chains';
// import { http } from 'viem';

// export const config = getDefaultConfig({
//   appName: 'Simple Storage DApp',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [
//     hardhat
//   ],
//   ssr: true,
// });

// export const configSepolia = getDefaultConfig({
//   appName: 'GoldChain',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [
//     sepolia
//   ],
//   transports: {
//     [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
//   },
//   ssr: true,
// });
import { http } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Log pour déboguer l'URL RPC
console.log('RPC URL:', process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);

export const config = getDefaultConfig({
    appName: 'GoldChain Dapp',
    projectId: 'bb9097f687004ae16192163d5cf0547c',
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    },
    ssr: true,
});