'use client'
import Blank from "@/components/profile/AddProfile"
import { useUserProfile } from "@/components/contexts/userContext"
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"
import AddProfile from "@/components/profile/AddProfile"
import Customer from "@/components/profile/customer"

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
          {userProfile == "customer" && <Customer />}
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