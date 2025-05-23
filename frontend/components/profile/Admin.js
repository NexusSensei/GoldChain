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
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Events from "./Event";
import { parseAbiItem } from 'viem'
import { publicClient } from '@/utils/client'
import { formatEVMDate } from "@/utils/dateUtils";

const Admin = () => {
    const [jewelerAddress, setJewelerAddress] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showTransactionAlert, setShowTransactionAlert] = useState(false);
    const { address } = useAccount();
    const [events, setEvents] = useState([]);

    const getEvents = async() => {
        try {
            const fromBlock = BigInt(Number(await publicClient.getBlockNumber()) - 2000);

            const jewelerCreatedEvents = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event jewelerCreated(address jewelerAddress, uint timestamp)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
                toBlock: 'latest'
            });
        
            const jewelerActivatedEvents = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event jewelerActivated(address jewelerAddress, uint timestamp)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
                toBlock: 'latest'
            });

            const jewelerDesactivatedEvents = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: parseAbiItem('event jewelerDesactivated(address jewelerAddress, uint timestamp)'),
                fromBlock: Number(fromBlock) >= 0 ? fromBlock : BigInt(0),
                toBlock: 'latest'
            });
        
            const combinedEvents = jewelerCreatedEvents.map((event) => ({
                type: 'jewelerCreated',
                address: event.args.jewelerAddress,
                timestamp: Number(event.args.timestamp)
            })).concat(jewelerActivatedEvents.map((event) => ({
                type: 'jewelerActivated',
                address: event.args.jewelerAddress,
                timestamp: Number(event.args.timestamp)
            }))).concat(jewelerDesactivatedEvents.map((event) => ({
                type: 'jewelerDesactivated',
                address: event.args.jewelerAddress,
                timestamp: Number(event.args.timestamp)
            })));
        
            const sortedEvents = combinedEvents.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
            setEvents(sortedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    useEffect(() => {
        if (address) {
            getEvents();
        }
    }, [address]);

    const { data: hash, error: writeError, writeContract } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
        onSuccess: async () => {
            setShowTransactionAlert(false);
            await getEvents(); // Attendre que les événements soient récupérés
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
            // Supprimer getEvents() ici car il sera appelé dans onSuccess
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
            // Supprimer getEvents() ici car il sera appelé dans onSuccess
        }
    };

    // Ajouter un useEffect pour surveiller isConfirmed
    useEffect(() => {
        if (isConfirmed) {
            getEvents();
        }
    }, [isConfirmed]);

    return (
        <div className="flex flex-col items-center min-h-[80vh] p-4 gap-8">
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

            <Card className="w-[600px]">
                <CardHeader>
                    <CardTitle>Historique des événements</CardTitle>
                    <CardDescription>
                        Suivi des actions sur les bijoutiers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Events events={events} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Admin; 