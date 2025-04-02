'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CertificateManager from "@/components/shared/CertificateManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManagePage() {
  const searchParams = useSearchParams();
  const [certificateNumber, setCertificateNumber] = useState("");
  const [searchId, setSearchId] = useState("");

  // Récupérer l'ID du certificat depuis les paramètres de recherche
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setSearchId(id);
      setCertificateNumber(id);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (certificateNumber) {
      setSearchId(certificateNumber);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gestion de certificat</h1>
      
      <div className="flex flex-col items-center gap-8">
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
                className="bg-[#d4af37] hover:bg-[#b38f2f] text-white"
              >
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchId && (
          <CertificateManager certificateNumber={searchId} />
        )}
      </div>
    </div>
  );
} 