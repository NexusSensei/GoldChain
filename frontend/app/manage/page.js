'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CertificateManagerV2 from "@/components/shared/CertificateManagerV2";
import Link from "next/link";
import { useUserProfile } from "@/components/contexts/userContext";

export default function ManagePage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [searchId, setSearchId] = useState("");
  const { userProfile } = useUserProfile();

  const handleSearch = () => {
    if (certificateNumber) {
      setSearchId(certificateNumber);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center bg-gold-gradient text-transparent bg-clip-text drop-shadow-gold [text-shadow:var(--tw-shadow)] mb-12">
        Transférer un certificat</h1>      
      <div className="flex flex-col items-center gap-8 ">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle>Rechercher un certificat</CardTitle>
            <CardDescription>
              Entrez le numéro du certificat à gérer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Numéro de certificat"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                className="btn-primary"
              >
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchId && (
          <CertificateManagerV2 certificateId={searchId} />
        )}
      </div>
      <Card className="w-[600px] mx-auto mt-8" >
          <CardContent className="pt-6">
              <div className="flex gap-12 items-center justify-center">
                {userProfile == "jeweler" && (
                    <Link href="/create-certificate">
                        <Button className="btn-primary">Créer un certificat</Button>
                    </Link>
                )}
                <Link href="/profil">
                    <Button className="btn-primary">Mon profil</Button>
                </Link>
                <Link href="/mycertificates">
                    <Button className="btn-primary">Mes certificats</Button>
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
} 