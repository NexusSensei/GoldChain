'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";	
import Image from 'next/image';
import { useUserProfile } from "@/components/contexts/userContext"
import { useAccount } from "wagmi";

const Header = () => {
  const { userProfile } = useUserProfile();
  const { isConnected,  status, address : userAddress } = useAccount();
  return (
    <div className="flex justify-between items-center p-5">
        <div className="flex items-center">
            <Image
                src={`/GoldChainLogo.jpeg?v=${Date.now()}`}
                alt="GoldChain Logo"
                width={200}
                height={1}
                priority
            />
        </div>
        <div className="flex gap-5">
            <Link href="/">Accueil</Link>
            <Link href="/consult">Consulter certificat</Link>
            <Link href="/marcketplace">MarcketPlace</Link>
            {isConnected && (userProfile === "jeweler" || userProfile === "customer") && (
                <Link href="/mycertificates">Mes certificats</Link>
            )}
            <Link href="/profil">Mon profil</Link>
        </div>
        <div><ConnectButton showBalance={false} /></div>
    </div>
  )
}

export default Header