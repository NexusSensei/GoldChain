'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCertificate } from "@/hooks/useCertificate";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";
import NFTDisplay from "@/components/shared/NFTDisplay";

const ConsultCertificate = () => {
    const [certificateId, setCertificateId] = useState("");
    const [searchId, setSearchId] = useState(null);
    
    const {
        certificateDetails,
        detailsError,
        refetchDetails
    } = useCertificate(searchId ? BigInt(searchId) : null);

    const handleSearch = () => {
        if (certificateId) {
            setSearchId(certificateId);
        }
    };

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
                            onClick={handleSearch}
                            className="bg-[#d4af37] hover:bg-[#b38f2f] text-white"
                        >
                            Rechercher
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {searchId && (
                <Card className="w-[600px]">
                    <CardHeader>
                        <CardTitle>Détails du certificat</CardTitle>
                        <CardDescription>
                            Certificat #{searchId}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            {detailsError && (
                                <div className="text-red-500">
                                    Erreur lors de la lecture des détails du certificat: {detailsError.message}
                                </div>
                            )}
                            {certificateDetails && (
                                <div className="border-2 border-[#d4af37] rounded-lg p-8 bg-white shadow-lg">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Matériau</div>
                                                <div className="font-medium">{EnumConverter.getMaterialLabel(certificateDetails.materials)}</div>
                                            </div>
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Pierre précieuse</div>
                                                <div className="font-medium">{EnumConverter.getGemstoneLabel(certificateDetails.gemStones)}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Poids</div>
                                                <div className="font-medium">{certificateDetails.weightInGrams} grammes</div>
                                            </div>
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Couleur</div>
                                                <div className="font-medium">{certificateDetails.mainColor}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Niveau de certification</div>
                                                <div className="font-medium">{EnumConverter.getCertificateLevelLabel(certificateDetails.level)}</div>
                                            </div>
                                            <div className="border-b border-gray-200 pb-2">
                                                <div className="text-sm text-gray-600">Date de création</div>
                                                <div className="font-medium">{formatEVMDate(certificateDetails.creationDate)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!certificateDetails && !detailsError && (
                                <div className="text-center text-gray-500">Certificat non trouvé</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="w-full flex justify-center mt-8">
                <NFTDisplay />
            </div>
        </div>
    );
};

export default ConsultCertificate;