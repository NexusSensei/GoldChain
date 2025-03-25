import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";	

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5">
        <div>Logo</div>
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