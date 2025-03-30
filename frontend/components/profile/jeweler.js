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
import { useState, useEffect } from "react";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"

import { error, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useUserProfile } from "@/components/contexts/userContext"
import { Checkbox } from "@/components/ui/checkbox"
import { ComboboxMaterials } from "@/components/shared/MaterialsComboBox"
import { ComboboxGemsStones } from "@/components/shared/GemsStonesComboBox"
import { ComboboxCertificateLevel } from "@/components/shared/CertificateLevelCombobox"

const Jeweler = () => {
    const { jeweler, isLoading, error, getJeweler } = useJeweler();
    const { getUserProfile } = useUserProfile();
    const { address } = useAccount();
    
    const [jewelerName, setJewelerName] = useState("");
    const [jewelerEmail, setJewelerEmail] = useState("");
    const [jewelerLocation, setJewelerLocation] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [CreatedCertificateIds, setCreatedCertificateIds] = useState([]);
    const [available, setAvailable] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);
    const [material, setMaterial] = useState("");
    const [gemstone, setGemstone] = useState("");
    const [weightInGrams, setWeightInGrams] = useState("");
    const [jewelerColor, setJewelerColor] = useState("");
    const [certificateLevel, setCertificateLevel] = useState("");

    useEffect(() => {
        if (jeweler && typeof jeweler === 'object') {
            setJewelerName(jeweler.name ?? "");
            setJewelerEmail(jeweler.email ?? "");
            setJewelerLocation(jeweler.location ?? "");
            setIsVisible(jeweler.visible ?? false);
            setCreatedCertificateIds(jeweler.CreatedCertificateIds ?? []);
            setAvailable(jeweler.available ?? false);
        }
    }, [jeweler]);

    // Réinitialiser l'état de la transaction quand l'adresse change
    useEffect(() => {
        if (address) {
            setShowTransactionAlert(false);
        }
    }, [address]);

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
        onSuccess: () => {
            getJeweler();
            getUserProfile();
        }
    });

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
            console.log("Values:", {
                material,
                gemstone,
                weightInGrams,
                jewelerColor,
                certificateLevel,
                available
            });
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "createCertificate",
                args: [[parseInt(material)], [parseInt(gemstone)], weightInGrams, jewelerColor, [parseInt(certificateLevel)], jewelerName, 0],
                account: address
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };
    if (isLoading) {
        return <div>Chargement...</div>;
    }

    if (!jeweler) {
        return <div>Profil non trouvé</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-4 gap-4">
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Votre profil Bijoutier</CardTitle>
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
            {console.log("Values:", {
                material,
                gemstone,
                weightInGrams,
                jewelerColor,
                certificateLevel,
                available
            })}
                <CardHeader>
                    <CardTitle>Vos certificats</CardTitle>
                    <CardDescription>
                        Voir vos certificats
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {CreatedCertificateIds.map((id) => (
                            <div key={id}>{id}</div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Jeweler; 