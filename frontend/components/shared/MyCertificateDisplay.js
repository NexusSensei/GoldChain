'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { Button } from "@/components/ui/button";
import { parseAbiItem } from 'viem'
import { publicClient } from '@/utils/client'


const MyCertificateDisplay = ({      
    title = "Vos certificats", 
    description = "votre dernier certificat :" 
}) => {
    const { address } = useAccount();
    const [currentCertificate, setCurrentCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
    const [transferEvents, setTransferEvents] = useState([]);
    
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

    // Contrôle quand on doit faire les appels
    useEffect(() => {
        if (certificateCount && certificateCount > 0n) {
            setShouldFetch(true);
        } else {
            setShouldFetch(false);
            setCurrentCertificate(null);
            setIsLoading(false);
        }
    }, [certificateCount]);

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
        enabled: shouldFetch
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
        enabled: shouldFetch && !!currentTokenId
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
            getTransferEvents(currentTokenId);
            setIsLoading(false);
        } else if (!shouldFetch) {
            setCurrentCertificate(null);
            setIsLoading(false);
        }
    }, [certificateData, currentTokenId, shouldFetch]);

    // Réinitialiser l'index quand le nombre de certificats change
    useEffect(() => {
        if (certificateCount && certificateCount > 0n) {
            setCurrentIndex(Number(certificateCount) - 1);
        } else {
            setCurrentIndex(0);
        }
    }, [certificateCount]);

    // Fonction pour récupérer les événements de transfert
    const getTransferEvents = async (tokenId) => {
        try {
            const fromBlock = BigInt(Number(await publicClient.getBlockNumber()) - 2000);

            const transferEvents = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
                toBlock: 'latest',
                args: {
                    tokenId: tokenId
                }
            });

            // Récupérer les timestamps des blocs
            const formattedEvents = await Promise.all(transferEvents.map(async (event) => {
                const block = await publicClient.getBlock({
                    blockNumber: event.blockNumber
                });
                return {
                    type: 'Transfer',
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(block.timestamp)
                };
            }));

            // Trier les événements par date (du plus récent au plus ancien)
            formattedEvents.sort((a, b) => b.timestamp - a.timestamp);
            setTransferEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching transfer events:', error);
            setTransferEvents([]);
        }
    };

    // Mettre à jour les événements quand le certificat change
    useEffect(() => {
        if (currentTokenId) {
            getTransferEvents(currentTokenId);
        }
    }, [currentTokenId]);

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
        console.log("Debug - shouldFetch:", shouldFetch);
        console.log("Debug - certificateCount:", certificateCount);
        console.log("Debug - currentTokenId:", currentTokenId);
    }, [shouldFetch, certificateCount, currentTokenId]);

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
                    
                    {tokenIdError && !tokenIdError.message.includes("ERC721OutOfBoundsIndex") && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du dernier ID de certificat: {tokenIdError.message}
                        </div>
                    )}
                    
                    {certificateError && !certificateError.message.includes("Cannot convert undefined to a BigInt") && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du certificat: {certificateError.message}
                        </div>
                    )}

                    {statusMessage.message && (
                        <div className={`p-4 rounded-md ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {statusMessage.message}
                        </div>
                    )}
                    
                    {(!certificateCount || certificateCount === 0n || 
                      (tokenIdError && tokenIdError.message.includes("ERC721OutOfBoundsIndex")) ||
                      (certificateError && certificateError.message.includes("Cannot convert undefined to a BigInt"))) ? (
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
                                            {console.log("currentCertificate.details.updated_at", currentCertificate.details.updated_at)}
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
                                    className="btn-primary"
                                >
                                    Précédent
                                </Button>
                                <Button 
                                    onClick={handleNext}
                                    disabled={certificateCount ? currentIndex >= Number(certificateCount) - 1 : true}
                                    variant="outline"
                                    className="btn-primary"
                                >
                                    Suivant
                                </Button>
                            </div>
                            
                            {/* Section des événements de transfert */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold mb-4 text-[#d4af37]">Historique des transferts</h4>
                                {transferEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {transferEvents.map((event, index) => (
                                            console.log("event.timestamp", event.timestamp),
                                            console.log("formatEVMDate(event.timestamp)", formatEVMDate(event.timestamp)),
                                            <div key={index} className="border-2 border-[#d4af37] rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-600">Expéditeur</div>
                                                        <div className="font-mono text-sm break-all">{event.from}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600">Destinataire</div>
                                                        <div className="font-mono text-sm break-all">{event.to}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    {formatEVMDate(event.timestamp)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4 italic">
                                        Aucun historique de transfert disponible
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MyCertificateDisplay; 