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

import { useCustomer } from "@/components/contexts/customerContext"
import { useState, useEffect } from "react";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"

import { error, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useUserProfile } from "@/components/contexts/userContext"
import { Checkbox } from "@/components/ui/checkbox"


const Customer = () => {
    const { customer, isLoading, error, getCustomer } = useCustomer();
    const { getUserProfile } = useUserProfile();
    const { address } = useAccount();
    
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerLocation, setCustomerLocation] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);

    useEffect(() => {
        if (customer && typeof customer === 'object') {
            setCustomerName(customer.name ?? "");
            setCustomerEmail(customer.email ?? "");
            setCustomerLocation(customer.location ?? "");
            setIsVisible(customer.visible ?? false);
        }
    }, [customer]);

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
            getCustomer();
            getUserProfile();
        }
    });

    const handleUpdateCustomer = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "updateCustomer",
                args: [customerName, customerEmail, customerLocation, isVisible],
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

    if (!customer) {
        return <div>Profil non trouvé</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Votre profil Client</CardTitle>
                    <CardDescription>
                        Mettre à jour vos informations
                        {console.log(customer)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">              
                    <div className="space-y-1">
                        <Label>Nom & Prénom</Label>
                        <Input 
                            type='string' 
                            placeholder='Vos nom et prénom...' 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="CustomerEmail">Email</Label>
                        <Input 
                            type='email' 
                            placeholder='Votre email...' 
                            value={customerEmail} 
                            onChange={(e) => setCustomerEmail(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="CustomerAdress">Adresse</Label>
                        <Input 
                            type='string' 
                            placeholder='Votre adresse...' 
                            value={customerLocation} 
                            onChange={(e) => setCustomerLocation(e.target.value)}  
                        />
                    </div>
                    <div className="space-y-1">
                        <Checkbox id="CustomerIsVisible" className="mr-2" checked={isVisible} onCheckedChange={() => setIsVisible(!isVisible)} />
                        <label
                            htmlFor="CustomerIsVisible"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Visible par tout le monde
                        </label>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button 
                        disabled={isPending} 
                        onClick={handleUpdateCustomer}
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
        </div>
    )
}

export default Customer;