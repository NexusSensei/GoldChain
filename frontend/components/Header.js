import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";	
import Image from 'next/image';

const Header = () => {
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
            <Link href="/profil">Mon profil</Link>
        </div>
        <div><ConnectButton showBalance={false} /></div>
    </div>
  )
}

export default Header