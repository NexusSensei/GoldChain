'use client'

// shadcn
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TransactionAlert from "@/components/ui/transaction-alert"

import { useJeweler } from "@/components/contexts/jewelerContext"
import { useState, useEffect, useRef } from "react";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"

import { error, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useUserProfile } from "@/components/contexts/userContext"
import { Checkbox } from "@/components/ui/checkbox"
import { ComboboxMaterials } from "@/components/shared/MaterialsComboBox"
import { ComboboxGemsStones } from "@/components/shared/GemsStonesComboBox"
import { ComboboxCertificateLevel } from "@/components/shared/CertificateLevelCombobox"
import { EnumConverter } from "@/utils/enumConverter";
import { formatEVMDate } from "@/utils/dateUtils";

const Jeweler = () => {
    const { jeweler, isLoading, error, getJeweler } = useJeweler();
    const { getUserProfile } = useUserProfile();
    const { address } = useAccount();
    
    const [jewelerName, setJewelerName] = useState("");
    const [jewelerEmail, setJewelerEmail] = useState("");
    const [jewelerLocation, setJewelerLocation] = useState("");
    const [isVisible, setIsVisible] = useState(true);   
    const [available, setAvailable] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);
    const [material, setMaterial] = useState("");
    const [gemstone, setGemstone] = useState("");
    const [weightInGrams, setWeightInGrams] = useState("");
    const [jewelerColor, setJewelerColor] = useState("");
    const [certificateLevel, setCertificateLevel] = useState("");
    const [firstCertificate, setFirstCertificate] = useState(null);
    const [jewelerCertificateCount, setJewelerCertificateCount] = useState(0);

    // Ajouter un état pour gérer le montage du composant
    const [isMounted, setIsMounted] = useState(false);

    // Lecture du nombre de certificats
    const { data: certificateCount, error: balanceError, refetch: refetchCertificateCount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "balanceOf",
        args: [address],
        enabled: !!address
    });

    // Lecture du dernier certificat si balance > 0
    const { data: lastCertificateData, error: tokenError, refetch: refetchLastCertificate } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [address, certificateCount > 0n ? certificateCount - 1n : 0n],
        enabled: !!address && certificateCount > 0n && typeof certificateCount === 'bigint'
    });

    // Lecture des détails du certificat
    const { data: certificateDetails, error: detailsError, refetch: refetchCertificateDetails } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getOneCertificate",
        args: [lastCertificateData],
        enabled: !!lastCertificateData && typeof lastCertificateData === 'bigint' && certificateCount > 0n
    });

    useEffect(() => {
        if (jeweler && typeof jeweler === 'object') {
            setJewelerName(jeweler.name ?? "");
            setJewelerEmail(jeweler.email ?? "");
            setJewelerLocation(jeweler.location ?? "");
            setIsVisible(jeweler.visible ?? false);
            setAvailable(jeweler.available ?? false);
        }
    }, [jeweler]);
    
    useEffect(() => {
        if (certificateCount) {
            setJewelerCertificateCount(certificateCount);
        }
    }, [certificateCount]);

    useEffect(() => {
        if (certificateDetails) {
            setFirstCertificate(certificateDetails);
        } else {
            setFirstCertificate(null);
        }
    }, [certificateDetails]);

    // Réinitialiser l'état de la transaction quand l'adresse change
    useEffect(() => {
        if (address) {
            setShowTransactionAlert(false);
        }
    }, [address]);

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash
    });

    // Ajouter une référence pour suivre si le rafraîchissement a été effectué
    const refreshDoneRef = useRef(false);

    // Gérer la confirmation de la transaction
    useEffect(() => {
        const refreshData = async () => {
            if (isConfirmed && !refreshDoneRef.current) {
                console.log("Transaction confirmée, rafraîchissement des données...");
                try {
                    refreshDoneRef.current = true;
                    
                    // 1. Mettre à jour le profil
                    await getJeweler();
                    await getUserProfile();
                    
                    // 2. Mettre à jour le nombre de certificats
                    await refetchCertificateCount();
                    
                    // 3. Mettre à jour le dernier certificat
                    await refetchLastCertificate();
                    
                    // 4. Mettre à jour les détails du certificat
                    await refetchCertificateDetails();
                    
                    console.log("Données mises à jour avec succès");
                } catch (error) {
                    console.error("Erreur lors du rafraîchissement des données:", error);
                }
            }
        };
        refreshData();
    }, [isConfirmed, getJeweler, getUserProfile, refetchCertificateCount, refetchLastCertificate, refetchCertificateDetails]);

    // Réinitialiser refreshDoneRef quand une nouvelle transaction commence
    useEffect(() => {
        if (hash) {
            refreshDoneRef.current = false;
        }
    }, [hash]);

    // Surveiller l'état de la transaction
    useEffect(() => {
        if (hash) {
            console.log("Transaction hash:", hash);
        }
        if (isConfirming) {
            console.log("Transaction en cours de confirmation");
        }
        if (isConfirmed) {
            console.log("Transaction confirmée");
        }
    }, [hash, isConfirming, isConfirmed]);

    const handleUpdateJeweler = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "updateJeweler",
                args: [jewelerName, jewelerEmail, jewelerLocation, isVisible],
                account: address
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    const handleCreateCertificate = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            console.log("Début de la création du certificat");
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "createCertificate",
                args: [[parseInt(material)], [parseInt(gemstone)], weightInGrams, jewelerColor, [parseInt(certificateLevel)], jewelerName, 0],
                account: address
            });
        } catch (error) {
            console.error("Erreur lors de la création du certificat:", error);
        } finally {
            setIsPending(false);
            // Réinitialiser les champs du formulaire
        }
    };

    // Ajouter un useEffect pour gérer le montage
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isLoading || !isMounted) {
        return <div>Chargement...</div>;
    }

    if (!jeweler) {
        return <div>Profil non trouvé</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-4 gap-4">
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Vos Informations</CardTitle>
                    <CardDescription>
                        Mettre à jour vos informations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">              
                    <div className="space-y-1">
                        <Label>Nom & Prénom</Label>
                        <Input 
                            type='string' 
                            placeholder='Vos nom et prénom...' 
                            value={jewelerName} 
                            onChange={(e) => setJewelerName(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="JewelerEmail">Email</Label>
                        <Input 
                            type='email' 
                            placeholder='Votre email...' 
                            value={jewelerEmail} 
                            onChange={(e) => setJewelerEmail(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="JewelerAdress">Adresse</Label>
                        <Input 
                            type='string' 
                            placeholder='Votre adresse...' 
                            value={jewelerLocation} 
                            onChange={(e) => setJewelerLocation(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Checkbox id="JewelerIsVisible" className="mr-2" checked={isVisible} onCheckedChange={() => setIsVisible(!isVisible)} />
                        <label
                            htmlFor="JewelerIsVisible"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Visible par tout le monde
                        </label>
                    </div>
                    {(!available && <div className="text-red-500">Votre profil est actuellement en attente d'activation par un administrateur</div>)}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button 
                        disabled={isPending} 
                        onClick={handleUpdateJeweler}
                    >
                        {isPending ? 'En cours de mise à jour...' : 'Mettre à jour le profil'}
                    </Button>
                    {showTransactionAlert && (
                        <TransactionAlert  
                            hash={hash}
                            isConfirming={isConfirming}
                            isConfirmed={isConfirmed}
                            error={writeError}
                        />
                    )}
                </CardFooter>
            </Card>
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Créer un certificat</CardTitle>
                    <CardDescription>
                        Créer un certificat pour un bijou   
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="material">Matériau principal du bijou</Label>
                            <ComboboxMaterials setMaterial={setMaterial} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="gemstone">Pierre précieuse principale du bijou</Label>
                            <ComboboxGemsStones setGemstone={setGemstone} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="weightInGrams">Poids du bijou en grammes</Label>
                            <Input 
                                type="number"
                                id="weightInGrams"
                                placeholder='Entrez le poids en grammes...' 
                                value={weightInGrams} 
                                onChange={(e) => setWeightInGrams(e.target.value)}
                                min="0"
                                step="1"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="jewelerColor">Couleur principale du bijou</Label>
                            <Input 
                                type="string"
                                id="jewelerColor"
                                placeholder='Entrez la couleur principale du bijou...' 
                                value={jewelerColor} 
                                onChange={(e) => setJewelerColor(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="certificateLevel">Niveau du certificat</Label>
                            <ComboboxCertificateLevel setCertificateLevel={setCertificateLevel} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button 
                        disabled={isPending || !available || 
                            material === "" || 
                            gemstone === "" || 
                            weightInGrams === "" || 
                            jewelerColor === "" || 
                            certificateLevel === ""} 
                        onClick={handleCreateCertificate}
                    >
                        {isPending ? 'En cours de création...' : 'Créer le certificat'}
                    </Button>                    
                </CardFooter>
            </Card>
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Vos certificats</CardTitle>
                    <CardDescription>
                        Voir votre dernier certificat
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
                        {isMounted && certificateCount > 0n && firstCertificate && (
                            <div className="border-2 border-[#d4af37] rounded-lg p-8 bg-white shadow-lg">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-[#d4af37] mb-2">Numéro de certificat: #{lastCertificateData?.toString()}</h3>                                    
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Matériau</div>
                                            <div className="font-medium">{EnumConverter.getMaterialLabel(firstCertificate.materials[0])}</div>
                                        </div>
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Pierre précieuse</div>
                                            <div className="font-medium">{EnumConverter.getGemstoneLabel(firstCertificate.gemStones[0])}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Poids</div>
                                            <div className="font-medium">{firstCertificate.weightInGrams} grammes</div>
                                        </div>
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Couleur</div>
                                            <div className="font-medium">{firstCertificate.mainColor}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Niveau de certification</div>
                                            <div className="font-medium">{EnumConverter.getCertificateLevelLabel(firstCertificate.level)}</div>
                                        </div>
                                        <div className="border-b border-gray-200 pb-2">
                                            <div className="text-sm text-gray-600">Date de création</div>
                                            <div className="font-medium">{formatEVMDate(firstCertificate.creationDate)}</div>
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
        </div>
    )
}

export default Jeweler; 