'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";
import { useCertificate } from "@/hooks/useCertificate";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { Button } from "@/components/ui/button";

const MyCertificateDisplay = ({      
    title = "Vos certificats", 
    description = "votre dernier certificat :" 
}) => {
    const { address } = useAccount();
    const [currentCertificate, setCurrentCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    
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

    // Récupérer l'ID du certificat à l'index courant
    const { 
        data: currentTokenId,
        error: tokenIdError,
        refetch: refetchCurrentTokenId
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [address, BigInt(currentIndex)],
        enabled: !!certificateCount && certificateCount > 0n && currentIndex >= 0
    });

    // Récupérer le certificat courant
    const { 
        data: certificateData, 
        error: certificateError, 
        refetch: refetchCertificate 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getOneCertificate",
        args: [currentTokenId],
        enabled: !!currentTokenId
    });

    // Mettre à jour le certificat courant lorsque les données sont disponibles
    useEffect(() => {
        if (certificateData) {
            setCurrentCertificate({
                id: currentTokenId,
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
    }, [certificateData, certificateCount, currentTokenId]);

    // Réinitialiser l'index quand le nombre de certificats change
    useEffect(() => {
        if (certificateCount) {
            setCurrentIndex(Number(certificateCount) - 1);
        }
    }, [certificateCount]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (certificateCount && currentIndex < Number(certificateCount) - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Log pour déboguer
    useEffect(() => {
        console.log("address:", address);
        console.log("certificateCount:", certificateCount);
        console.log("currentIndex:", currentIndex);
        console.log("currentTokenId:", currentTokenId);
        console.log("certificateData:", certificateData);
        console.log("currentCertificate:", currentCertificate);
    }, [address, certificateCount, currentIndex, currentTokenId, certificateData, currentCertificate]);

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
                    
                    {tokenIdError && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du dernier ID de certificat: {tokenIdError.message}
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
                        <>
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
                            <div className="flex justify-between mt-4">
                                <Button 
                                    onClick={handlePrevious}
                                    disabled={currentIndex === 0}
                                    variant="outline"
                                >
                                    Précédent
                                </Button>
                                <Button 
                                    onClick={handleNext}
                                    disabled={certificateCount ? currentIndex >= Number(certificateCount) - 1 : true}
                                    variant="outline"
                                >
                                    Suivant
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MyCertificateDisplay; 