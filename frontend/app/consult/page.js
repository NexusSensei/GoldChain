'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NFTDisplay from "@/components/shared/NFTDisplay";
import CertificateDisplay from "@/components/shared/CertificateDisplay";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'

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
            <Suspense>
                <div>
                    <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)]">
                        Consulter certificat
                    </h1>
                </div>

                {searchId ? (
                    <NFTDisplay searchId={searchId} />
                ) : (
                    <NFTDisplay />
                )}
            </Suspense>            
        </div>
    );
};

export default ConsultCertificate;