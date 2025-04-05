'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { address } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#d4af37]">
            GoldChain - Certificats Numériques pour Bijoux
          </h1>
          <p className="text-xl text-gray-600">
            La première solution blockchain pour certifier et tracer vos bijoux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-[#d4af37]">
            <CardHeader>
              <CardTitle className="text-[#d4af37]">Authenticité Garantie</CardTitle>
              <CardDescription>
                Chaque bijou est associé à un certificat NFT unique et immuable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Grâce à la blockchain, chaque certificat est unique, traçable et impossible à falsifier.
                Protégez la valeur de vos bijoux avec une preuve d&#39;authenticité numérique.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#d4af37]">
            <CardHeader>
              <CardTitle className="text-[#d4af37]">Traçabilité Totale</CardTitle>
              <CardDescription>
                Suivez l&#39;historique complet de vos bijoux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Chaque transaction, modification ou transfert est enregistré de manière permanente
                sur la blockchain. Consultez l&#39;historique complet de vos bijoux en quelques clics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#d4af37]">
            <CardHeader>
              <CardTitle className="text-[#d4af37]">Transfert Simplifié</CardTitle>
              <CardDescription>
                Transférez vos certificats en toute sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Le transfert de propriété devient instantané et sécurisé. Plus besoin de documents
                physiques, tout est géré directement sur la blockchain.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#d4af37]">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-4">
              <div className="text-2xl font-bold text-[#d4af37] mb-2">1</div>
              <h3 className="font-semibold mb-2">Création du Certificat</h3>
              <p>Créez un certificat NFT unique pour votre bijou</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-[#d4af37] mb-2">2</div>
              <h3 className="font-semibold mb-2">Enregistrement</h3>
              <p>Les détails sont enregistrés de manière permanente sur la blockchain</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-[#d4af37] mb-2">3</div>
              <h3 className="font-semibold mb-2">Vérification</h3>
              <p>Vérifiez l&#39;authenticité de vos bijoux en temps réel</p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-[#d4af37] mb-2">4</div>
              <h3 className="font-semibold mb-2">Transfert</h3>
              <p>Transférez la propriété en toute sécurité</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#d4af37]">
            Commencez dès maintenant
          </h2>
          <div className="flex justify-center gap-4">
            {address ? (
              <Button className="bg-[#d4af37] hover:bg-[#b38f2e]">
                Voir mes certificats
              </Button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button 
                    onClick={openConnectModal}
                    className="btn-primary"
                  >
                    Connecter mon wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
