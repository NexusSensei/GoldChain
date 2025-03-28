'use client'

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
import { useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

const Admin = () => {
    const [jewelerAddress, setJewelerAddress] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);
    const { address } = useAccount();

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
        onSuccess: () => {
            setShowTransactionAlert(false);
        }
    });

    const handleActivateJeweler = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "activateJeweler",
                args: [jewelerAddress],
                account: address
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    const handleDeactivateJeweler = async () => {
        try {
            setIsPending(true);
            setShowTransactionAlert(true);
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "desactivateJeweler",
                args: [jewelerAddress],
                account: address
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Administration</CardTitle>
                    <CardDescription>
                        Gérer les bijoutiers
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">              
                    <div className="space-y-1">
                        <Label>Adresse du bijoutier</Label>
                        <Input 
                            type='string' 
                            placeholder='0x...' 
                            value={jewelerAddress} 
                            onChange={(e) => setJewelerAddress(e.target.value)}  
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            disabled={isPending || !jewelerAddress} 
                            onClick={handleActivateJeweler}
                            className="flex-1"
                        >
                            Activer le bijoutier
                        </Button>
                        <Button 
                            disabled={isPending || !jewelerAddress} 
                            onClick={handleDeactivateJeweler}
                            variant="destructive"
                            className="flex-1"
                        >
                            Désactiver le bijoutier
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
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

export default Admin; 