'use client'
import Blank from "@/components/profile/add"
import { useUserProfile } from "@/components/contexts/userContext"
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"
import AddProfile from "@/components/profile/add"


const MyProfile = () => {
    const { userProfile } = useUserProfile();
    const { isConnected,  status, address : userAddress } = useAccount();
    return (
      <>
      {isConnected ? (
        <div>
        <div>Mon adresse : {userAddress}</div>
        <div>Mon profil {userProfile}
          {userProfile == "unknown" && <AddProfile />}
          {userProfile == "customer" && <div>Customer</div>}
          {userProfile == "jeweler" && <div>Jeweler</div>}
          {userProfile == "admin" && <div>Admin</div>}
        </div>
      </div>
      ) : (
        <NotConnected />
      )}
    </>

      
      
    )
  }
  
  export default MyProfile