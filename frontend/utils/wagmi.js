import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  hardhat, sepolia
} from 'wagmi/chains';
import { http } from 'viem';

// export const config = getDefaultConfig({
//   appName: 'Simple Storage DApp',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [
//     hardhat
//   ],
//   ssr: true,
// });

export const configSepolia = getDefaultConfig({
  appName: 'GoldChain',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
  },
  ssr: true,
});