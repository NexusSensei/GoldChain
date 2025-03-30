'use client'
import Blank from "@/components/profile/AddProfile"
import { useUserProfile } from "@/components/contexts/userContext"
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"
import AddProfile from "@/components/profile/AddProfile"
import Customer from "@/components/profile/customer"
import Jeweler from "@/components/profile/jeweler"
import Admin from "@/components/profile/Admin"

const MyProfile = () => {
    const { userProfile } = useUserProfile();
    const { isConnected,  status, address : userAddress } = useAccount();
    return (
      <>
      <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)]">
                {userProfile == "unknown" && "S'enregistrer"}
                {userProfile == "customer" && "Mon Profil Client"}
                {userProfile == "jeweler" && "Mon Profil Bijoutier"}
                {userProfile == "admin" && "Mon Profil Administrateur"}
            </h1>
        </div>
      {isConnected ? (
        <div>
        <div>
          {userProfile == "unknown" && <AddProfile />}
          {userProfile == "customer" && <Customer />}
          {userProfile == "jeweler" && <Jeweler />}
          {userProfile == "admin" && <Admin />}
        </div>
      </div>
      ) : (
        <div className="py-8">
            <NotConnected />
        </div>
      )}
    </>

      
      
    )
  }
  
  export default MyProfile