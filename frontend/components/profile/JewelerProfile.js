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
import { Checkbox } from "@/components/ui/checkbox"
import { ComboboxMaterials } from "@/components/shared/MaterialsComboBox"
import { ComboboxGemsStones } from "@/components/shared/GemsStonesComboBox"
import { ComboboxCertificateLevel } from "@/components/shared/CertificateLevelCombobox"


const Jeweler = () => {
    const { jeweler, isLoading, error, getJeweler } = useJeweler();
    const { address } = useAccount();
    
    const [jewelerName, setJewelerName] = useState("");
    const [jewelerEmail, setJewelerEmail] = useState("");
    const [jewelerLocation, setJewelerLocation] = useState("");
    const [isVisible, setIsVisible] = useState(true);   
    const [available, setAvailable] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);

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
    

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash
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
                    {(!available && <div className="text-red-500">Votre profil est actuellement en attente de son activation par un administrateur</div>)}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button 
                        disabled={isPending} 
                        onClick={handleUpdateJeweler}
                        className="btn-primary"
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
            <Card className="w-[600px]" >
                <CardContent className="pt-6">
                    <div className="flex gap-12 items-center justify-center">
                        <Link href="/create-certificate">
                            <Button className="btn-primary">Créer un certificat</Button>
                        </Link>
                        <Link href="/mycertificates">
                            <Button className="btn-primary">Mes certificats</Button>
                        </Link>
                        <Link href="/manage">
                            <Button className="btn-primary">Transférer un certificat</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Jeweler; 