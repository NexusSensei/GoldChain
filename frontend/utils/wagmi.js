import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  hardhat
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Simple Storage DApp',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    hardhat
  ],
  ssr: true,
});