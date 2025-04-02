'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NFTDisplay from "@/components/shared/NFTDisplay";
import CertificateDisplay from "@/components/shared/CertificateDisplay";
import { useSearchParams } from "next/navigation";

const ConsultCertificate = () => {
    const searchParams = useSearchParams();
    const [certificateId, setCertificateId] = useState("");
    const [searchId, setSearchId] = useState(null);
    
    // Fonction pour lancer la recherche
    const handleSearch = (id = certificateId) => {
        if (id) {
            setSearchId(id);
        }
    };

    // Effet pour vérifier si un ID est présent dans l'URL
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setCertificateId(idFromUrl);
            handleSearch(idFromUrl);
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-4 gap-8">
            <div>
                <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)]">
                    Consulter certificat
                </h1>
            </div>

            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Rechercher un certificat</CardTitle>
                    <CardDescription>
                        Entrez le numéro du certificat à consulter
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            type="number"
                            placeholder="Numéro du certificat"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            className="flex-1"
                        />
                        <Button 
                            onClick={() => handleSearch()}
                            className="bg-[#d4af37] hover:bg-[#b38f2f] text-white"
                        >
                            Rechercher
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {searchId && (
                <CertificateDisplay 
                    certificateNumber={BigInt(searchId)} 
                    title="Détails du certificat"
                    description=""
                />
            )}

            <div className="w-full flex justify-center mt-8">
                <NFTDisplay />
            </div>
        </div>
    );
};

export default ConsultCertificate;