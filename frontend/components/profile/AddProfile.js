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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState } from "react";

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"

import { error, useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useUserProfile } from "@/components/contexts/userContext"
import { useCustomer } from "@/components/contexts/customerContext"
import { useJeweler } from "@/components/contexts/jewelerContext"

const AddProfile = () => {
  const { address, isConnected } = useAccount();
  const { getUserProfile } = useUserProfile();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [jewelerName, setJewelerName] = useState("");
  const [jewelerEmail, setJewelerEmail] = useState("");
  const [jewelerLocation, setJewelerLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const {getCustomer} = useCustomer();
  const {getJeweler} = useJeweler();
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  
  const handleAddClient = async() => {
    try {
      console.log(customerName, customerEmail, customerLocation);
      console.log(CONTRACT_ABI);
      console.log("début de la création du profil client");
      writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "createCustomer",
          args: [customerName, customerEmail, customerLocation],
          account: address
      })
      console.log("création du profil client terminée");
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddJeweler = async() => {
    try {
      console.log(jewelerName, jewelerEmail, jewelerLocation);
      console.log(CONTRACT_ABI);
      console.log("début de la création du profil bijoutier");
      writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "createJeweler",
            args: [jewelerName, jewelerEmail, jewelerLocation],
          account: address
      })
      console.log("création du profil bijoutier terminée");
    } catch (error) {
      console.error(error)
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,  
    
  })



  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Tabs defaultValue="Client" className="w-[600px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Client">Client</TabsTrigger>
          <TabsTrigger value="Bijoutier">Bijoutier</TabsTrigger>
        </TabsList>
        <TabsContent value="Client">
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
              <CardDescription>
                Consultez la marcket-place et gérez vos certificats.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">              
              <div className="space-y-1">
                <Label>Nom & Prénom</Label>
                <Input type='string' placeholder='Vos nom et prénom...' value={customerName} onChange={(e) => setCustomerName(e.target.value)}  />
              </div>
              <div className="space-y-1">
                <Label htmlFor="CustomerEmail">Email</Label>
                <Input type='email' placeholder='Votre email...' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}  />
              </div>
              <div className="space-y-1">
                <Label htmlFor="CustomerAdress">Adresse</Label>
                <Input type='string' placeholder='Votre adresse...' value={customerLocation} onChange={(e) => setCustomerLocation(e.target.value)}  />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isPending} onClick={handleAddClient} className="btn-primary"> {isPending ? 'En cours de création...' : 'Créer profil client'}</Button>
              {hash && <div>Transaction Hash: {hash}</div>}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed. { getCustomer() && getUserProfile()  }</div>  }
              {error && (
                  <div>Error: {error.shortMessage || error.message}</div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Bijoutier">
          <Card>
            <CardHeader>
              <CardTitle>Bijoutier</CardTitle>
              <CardDescription>
                Créez des certificats, ajoutez vos bijoux à la marcket-place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
              <Label>Nom & Prénom</Label>
              <Input type='string' placeholder='Vos nom et prénom...' value={jewelerName} onChange={(e) => setJewelerName(e.target.value)}  />
              </div>
              <div className="space-y-1">
                <Label htmlFor="JewelerEmail">Email</Label>
                <Input type='email' placeholder='Votre email...' value={jewelerEmail} onChange={(e) => setJewelerEmail(e.target.value)}  />
              </div>
              <div className="space-y-1">
                <Label htmlFor="JewelerAdresse">Adresse</Label>
                <Input type='string' placeholder='Votre adresse...' value={jewelerLocation} onChange={(e) => setJewelerLocation(e.target.value)}  />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={isPending} onClick={handleAddJeweler} className="btn-primary"> {isPending ? 'En cours de création...' : 'Créer profil bijoutier'}</Button>
              {hash && <div>Transaction Hash: {hash}</div>}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed. { getJeweler() && getUserProfile()  }</div>  }
              {error && (
                  <div>Error: {error.shortMessage || error.message}</div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
  }
  
  export default AddProfile