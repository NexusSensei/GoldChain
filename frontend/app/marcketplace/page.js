'use client'
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"


const MarcketPlace = () => {
    
      const { isConnected,  status, address : userAddress } = useAccount();
    return (
      <>
      {isConnected ? (
        <div>
        <div>Mon adresse : {userAddress}</div>
        <div>Marcket Place
          
        </div>
      </div>
      ) : (
        <NotConnected />
      )}
    </>
    )
  }
  
  export default MarcketPlace