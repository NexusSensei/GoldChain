'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";
import { useCertificate } from "@/hooks/useCertificate";
import { useUserCertificate } from "@/hooks/useUserCertificate";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

const CertificateDisplay = ({ 
    certificateNumber, 
    title = "Vos certificats", 
    description = "votre dernier certificat :" 
}) => {
    const { address } = useAccount();
    const [isMounted, setIsMounted] = useState(false);
    
    const {
        certificateCount,
        certificateData,
        balanceError,
        tokenError,
        refetchAll
    } = useUserCertificate(address, certificateNumber);

    const {
        certificateDetails,
        detailsError,
        refetchDetails
    } = useCertificate(certificateData);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {balanceError && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du nombre de certificats: {balanceError.message}
                        </div>
                    )}
                    {tokenError && certificateCount > 0n && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du dernier certificat: {tokenError.message}
                        </div>
                    )}
                    {detailsError && certificateCount > 0n && (
                        <div className="text-red-500">
                            Erreur lors de la lecture des détails du certificat: {detailsError.message}
                        </div>
                    )}
                    {isMounted && certificateCount > 0n && certificateDetails && (
                        <div className="border-2 border-[#d4af37] rounded-lg p-8 bg-white shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Numéro de certificat: #{certificateData?.toString()}</h3>                                    
                            </div>
                            
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
                                        <div className="text-sm text-gray-600">Description</div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Statut du certificat</div>
                                        <div className="font-medium">{EnumConverter.getCertificateStatusLabel(certificateDetails.status)}</div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Date de dernière modification</div>
                                        <div className="font-medium">{formatEVMDate(certificateDetails.updated_at)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isMounted && (!certificateCount || certificateCount === 0n) && !balanceError && (
                        <div className="text-center text-gray-500">Aucun certificat trouvé</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CertificateDisplay; 