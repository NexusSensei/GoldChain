// import { createPublicClient, http } from 'viem'
// import { hardhat } from 'wagmi/chains' 
// import { sepolia } from 'viem/chains';

// export const publicClient = createPublicClient({
//     chain: hardhat,
//     transport: http(process.env.RPC_URL)
// })

// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";

// export const publicClient = createPublicClient({
//     chain: sepolia,
//     transport: http(SEPOLIA_RPC_URL)
// })


import { createPublicClient, http } from 'viem'
import { hardhat, sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
})