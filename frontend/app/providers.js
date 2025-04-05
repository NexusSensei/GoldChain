// 'use client';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from 'wagmi';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// import { configSepolia } from '@/utils/wagmi';

// const queryClient = new QueryClient();

// export function Providers({ children }) {
//   return (
//     <WagmiProvider config={configSepolia}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { config } from '@/utils/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// 'use client'
// import '@rainbow-me/rainbowkit/styles.css';
// import {
//   getDefaultConfig,
//   RainbowKitProvider,}
// from '@rainbow-me/rainbowkit';
// import { WagmiProvider } from 'wagmi';
// import { sepolia } from '@/utils/sepolia';
// import {
//   QueryClientProvider,
//   QueryClient,
// } from "@tanstack/react-query";

// const config = getDefaultConfig({
//     appName: 'GoldChain',
//     projectId: 'bb9097f687004ae16192163d5cf0547c',
//     chains: [sepolia],
//     ssr: true, // If your dApp uses server side rendering (SSR)
// });

// const queryClient = new QueryClient();

// const RainbowKitAndWagmiProvider = ({ children }) => {
//   return (
//     <WagmiProvider config={config}>
//         <QueryClientProvider client={queryClient}>
//             <RainbowKitProvider>
//                 {children}
//             </RainbowKitProvider>
//         </QueryClientProvider>
//     </WagmiProvider>
//   )
// }
// export default RainbowKitAndWagmiProvider