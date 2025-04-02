'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";
import { useCertificate } from "@/hooks/useCertificate";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";


const MyCertificateDisplay = ({      
    title = "Vos certificats", 
    description = "votre dernier certificat :" 
}) => {
    const { address } = useAccount();
    const [currentCertificate, setCurrentCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Lecture du nombre de certificats
    const { 
        data: certificateCount, 
        error: balanceError, 
        refetch: refetchCertificateCount 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "balanceOf",
        args: [address],
        enabled: !!address
    });

    // Récupérer le dernier certificat
    const { 
        data: certificateData, 
        error: certificateError, 
        refetch: refetchCertificate 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getOneCertificate",
        args: [certificateCount ? certificateCount - 1n : 0n],
        enabled: !!certificateCount && certificateCount > 0n
    });

    // Mettre à jour le certificat courant lorsque les données sont disponibles
    useEffect(() => {
        if (certificateData) {
            setCurrentCertificate({
                id: certificateCount ? certificateCount - 1n : 0n,
                details: {
                    materials: certificateData.materials,
                    gemStones: certificateData.gemStones,
                    weightInGrams: certificateData.weightInGrams,
                    mainColor: certificateData.mainColor,
                    level: certificateData.level,
                    creationDate: certificateData.creationDate,
                    updated_at: certificateData.updated_at,
                    status: certificateData.status
                }
            });
            setIsLoading(false);
        } else if (certificateCount === 0n || !certificateCount) {
            setCurrentCertificate(null);
            setIsLoading(false);
        }
    }, [certificateData, certificateCount]);

    // Log pour déboguer
    useEffect(() => {
        console.log("address:", address);
        console.log("certificateCount:", certificateCount);
        console.log("certificateData:", certificateData);
        console.log("currentCertificate:", currentCertificate);
    }, [address, certificateCount, certificateData, currentCertificate]);

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
                    
                    {certificateError && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du certificat: {certificateError.message}
                        </div>
                    )}
                    
                    {!certificateCount || certificateCount === 0n ? (
                        <div className="text-center text-gray-500 py-4">Aucun certificat trouvé</div>
                    ) : isLoading ? (
                        <div className="text-center py-4">Chargement du certificat...</div>
                    ) : !currentCertificate ? (
                        <div className="text-center text-gray-500 py-4">Aucun certificat trouvé</div>
                    ) : (
                        <div className="border-2 border-[#d4af37] rounded-lg p-8 bg-white shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Numéro de certificat: #{currentCertificate.id.toString()}</h3>                                    
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Matériau</div>
                                        <div className="font-medium">{EnumConverter.getMaterialLabel(currentCertificate.details.materials)}</div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Pierre précieuse</div>
                                        <div className="font-medium">{EnumConverter.getGemstoneLabel(currentCertificate.details.gemStones)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Poids</div>
                                        <div className="font-medium">{currentCertificate.details.weightInGrams} grammes</div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Description</div>
                                        <div className="font-medium">{currentCertificate.details.mainColor}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Niveau de certification</div>
                                        <div className="font-medium">{EnumConverter.getCertificateLevelLabel(currentCertificate.details.level)}</div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Date de création</div>
                                        <div className="font-medium">{formatEVMDate(currentCertificate.details.creationDate)}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Statut du certificat</div>
                                        <div className="font-medium">{EnumConverter.getCertificateStatusLabel(currentCertificate.details.status)}</div>
                                    </div>
                                    <div className="border-b border-gray-200 pb-2">
                                        <div className="text-sm text-gray-600">Date de dernière modification</div>
                                        <div className="font-medium">{formatEVMDate(currentCertificate.details.updated_at)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MyCertificateDisplay; 