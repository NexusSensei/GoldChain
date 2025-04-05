'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TransactionAlert from "@/components/ui/transaction-alert"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { ComboboxMaterials } from "@/components/shared/MaterialsComboBox"
import { ComboboxGemsStones } from "@/components/shared/GemsStonesComboBox"
import { ComboboxCertificateLevel } from "@/components/shared/CertificateLevelCombobox"
import { useJeweler } from "@/components/contexts/jewelerContext";

const CreateCertificate = () => {
    const { address } = useAccount();
    const { jeweler } = useJeweler();
    
    const [material, setMaterial] = useState("");
    const [gemstone, setGemstone] = useState("");
    const [weightInGrams, setWeightInGrams] = useState("");
    const [jewelerColor, setJewelerColor] = useState("");
    const [certificateLevel, setCertificateLevel] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash
    });

    const handleCreateCertificate = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            console.log("Début de la création du certificat");
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "createCertificate",
                args: [[parseInt(material)], [parseInt(gemstone)], weightInGrams, jewelerColor, [parseInt(certificateLevel)], jeweler.name, 0],
                account: address
            });
        } catch (error) {
            console.error("Erreur lors de la création du certificat:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-4 gap-4">
            <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)] mb-8">
                Créer un certificat
            </h1>
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
                            <Label htmlFor="jewelerColor">Description du bijou</Label>
                            <Input 
                                type="string"
                                id="jewelerColor"
                                placeholder='Entrez la description du bijou...' 
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
                        disabled={isPending || 
                            material === "" || 
                            gemstone === "" || 
                            weightInGrams === "" || 
                            jewelerColor === "" || 
                            certificateLevel === ""} 
                        onClick={handleCreateCertificate}
                        className="btn-primary"
                    >
                        {isPending ? 'En cours de création...' : 'Créer le certificat'}
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

            <Card className="w-[600px] mx-auto mt-8" >
                <CardContent className="pt-6">
                    <div className="flex gap-12 items-center justify-center">
                        <Link href="/profil">
                            <Button className="btn-primary">Mon profil</Button>
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

export default CreateCertificate; 