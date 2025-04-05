'use client'
import { useAccount } from "wagmi"
import NotConnected from "@/components/shared/NotConnected"
import MyCertificateDisplay from "@/components/shared/MyCertificateDisplay"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/components/contexts/userContext"
import { Card, CardContent } from "@/components/ui/card"

const MyCertificates = () => {
    const { isConnected, status, address: userAddress } = useAccount();
    const { userProfile } = useUserProfile();
    return (
        <>
            {isConnected ? (
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)] mb-8">
                        Mes certificats
                    </h1>
                    <div className="flex justify-center items-center mb-8">
                        <MyCertificateDisplay />
                    </div>
                    <Card className="w-[600px] mx-auto mt-8" >
                        <CardContent className="pt-6">
                            <div className="flex gap-12 items-center justify-center">
                                {userProfile == "jeweler" && (
                                    <Link href="/create-certificate">
                                        <Button className="btn-primary">Créer un certificat</Button>
                                    </Link>
                                )}
                                <Link href="/profil">
                                    <Button className="btn-primary">Mon profil</Button>
                                </Link>
                                <Link href="/manage">
                                    <Button className="btn-primary">Transférer un certificat</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <NotConnected />
            )}
        </>
    )
}

export default MyCertificates