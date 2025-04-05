'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";

const CertificateManagerV2 = ({ certificateId }) => {
    const { address } = useAccount();
    const [transferAddress, setTransferAddress] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
    const [transferHash, setTransferHash] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    
    // Vérifier si l'utilisateur est le propriétaire du certificat
    const { 
        data: ownerAddress, 
        error: ownerError,
        refetch: refetchOwner 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ownerOf",
        args: [certificateId ? BigInt(certificateId) : BigInt(0)],
        enabled: !!certificateId
    });

    // Récupérer les détails du certificat
    const { 
        data: certificateDetails, 
        error: detailsError,
        refetch: refetchDetails 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getOneCertificate",
        args: [certificateId ? BigInt(certificateId) : BigInt(0)],
        enabled: !!certificateId
    });

    // Configuration pour le transfert
    const { 
        writeContract: transfer, 
        isPending: isTransferring,
        error: transferError
    } = useWriteContract({
        mutation: {
            onSuccess: (hash) => {
                setTransferHash(hash);
            },
            onError: (error) => {
                setStatusMessage({
                    type: "error",
                    message: `Erreur lors de l'envoi de la transaction: ${error.message}`
                });
            }
        }
    });

    // Attendre la transaction de transfert
    const { 
        isLoading: isConfirmingTransfer, 
        isSuccess: isTransferSuccess,
        isError: isTransferError,
    } = useWaitForTransactionReceipt({
        hash: transferHash,
    });

    // Mettre à jour isOwner quand ownerAddress change
    useEffect(() => {
        if (ownerAddress && address) {
            const isOwnerCheck = ownerAddress.toLowerCase() === address.toLowerCase();
            setIsOwner(isOwnerCheck);
        }
    }, [ownerAddress, address]);

    // Vérifier si l'adresse de transfert est valide
    useEffect(() => {
        setIsValidAddress(transferAddress !== "" && isAddress(transferAddress));
    }, [transferAddress]);

    // Gérer le succès du transfert
    useEffect(() => {
        if (isTransferSuccess) {
            setStatusMessage({
                type: "success",
                message: "Transfert réussi ! Le certificat a été transféré avec succès."
            });
            setTransferAddress("");
            
            // Rafraîchir les détails du certificat et la vérification de propriété
            Promise.all([
                refetchDetails(),
                refetchOwner()
            ]).then(() => {
                // Données rafraîchies avec succès
            }).catch(error => {
                setStatusMessage({
                    type: "error",
                    message: `Erreur lors du rafraîchissement des données: ${error.message}`
                });
            });
            
            // Réinitialiser le message après 3 secondes
            setTimeout(() => {
                setStatusMessage({ type: "", message: "" });
            }, 3000);
        }
    }, [isTransferSuccess]);

    // Gérer les erreurs de transfert
    useEffect(() => {
        if (isTransferError && transferError) {
            setStatusMessage({
                type: "error",
                message: `Erreur lors du transfert: ${transferError.message}`
            });
        }
    }, [isTransferError, transferError]);

    // Gérer le transfert
    const handleTransfer = async () => {
        if (!isValidAddress) {
            setStatusMessage({
                type: "error",
                message: "Veuillez entrer une adresse valide."
            });
            return;
        }

        try {
            await transfer({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'safeTransferFrom',
                args: [address, transferAddress, certificateId ? BigInt(certificateId) : BigInt(0)],
            });
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: `Erreur lors du transfert: ${error.message}`
            });
        }
    };

    if (!isOwner) {
        return (
            <div className="flex justify-center items-center">
                <Card className="w-[600px]">
                    <CardHeader>
                        <CardTitle>Accès refusé</CardTitle>
                        <CardDescription>
                            Ce certificat ne vous appartient pas
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Message de statut */}
            {statusMessage.message && (
                <div className={`p-4 rounded-md ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {statusMessage.message}
                </div>
            )}

            {/* Affichage des détails du certificat */}
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Détails du certificat</CardTitle>
                    <CardDescription>
                        Informations du certificat à gérer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {certificateDetails ? (
                        <div className="border-2 border-[#d4af37] rounded-lg p-8 bg-white shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Numéro de certificat: #{certificateId}</h3>                                    
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
                    ) : (
                        <p>Chargement des détails du certificat...</p>
                    )}
                </CardContent>
            </Card>

            {/* Gestion du transfert */}
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Transférer le certificat</CardTitle>
                    <CardDescription>
                        Transférer le certificat à une autre adresse
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Adresse du destinataire"
                                    value={transferAddress}
                                    onChange={(e) => setTransferAddress(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            <Button 
                                onClick={handleTransfer}
                                disabled={isTransferring || isConfirmingTransfer || !isValidAddress}
                                className="btn-primary"
                            >
                                {isTransferring || isConfirmingTransfer ? "Transfert..." : "Transférer"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CertificateManagerV2; 