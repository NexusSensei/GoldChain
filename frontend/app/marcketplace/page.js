'use client'
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"


const MarcketPlace = () => {
    
      const { isConnected,  status, address : userAddress } = useAccount();
    return (
      <>
      {isConnected ? (
        <div>
        <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)]">
                Marcket Place
            </h1>
        </div>
      </div>
      ) : (
        <NotConnected />
      )}
    </>
    )
  }
  
  export default MarcketPlace