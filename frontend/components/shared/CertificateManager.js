'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CertificateDisplay from "@/components/shared/CertificateDisplay";
import { ComboboxCertificateStatus } from "@/components/shared/CertificateStatusCombobox";
import { useCertificate } from "@/hooks/useCertificate";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

const CertificateManager = ({ certificateNumber }) => {
  const { address, isConnected } = useAccount();
  const [certificateStatus, setCertificateStatus] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [updateStatusHash, setUpdateStatusHash] = useState(null);
  const [transferHash, setTransferHash] = useState(null);
  
  // Récupérer les détails du certificat
  const {
    certificateDetails,
    detailsError,
    refetchDetails
  } = useCertificate(certificateNumber);

  // Vérifier si l'adresse de transfert est valide
  useEffect(() => {
    setIsValidAddress(transferAddress !== "" && isAddress(transferAddress));
  }, [transferAddress]);

  // Configuration pour la mise à jour du statut
  const { 
    writeContract: updateStatus, 
    isPending: isUpdatingStatus 
  } = useWriteContract();

  // Attendre la transaction de mise à jour du statut
  const { isLoading: isConfirmingStatusUpdate } = useWaitForTransactionReceipt({
    hash: updateStatusHash,
    onSuccess: () => {
      setStatusMessage({
        type: "success",
        message: "Le statut du certificat a été mis à jour avec succès."
      });
      refetchDetails();
    },
    onError: (error) => {
      setStatusMessage({
        type: "error",
        message: `Erreur lors de la mise à jour du statut: ${error.message}`
      });
    },
  });

  // Configuration pour le transfert
  const { 
    writeContract: transfer, 
    isPending: isTransferring 
  } = useWriteContract();

  // Attendre la transaction de transfert
  const { isLoading: isConfirmingTransfer } = useWaitForTransactionReceipt({
    hash: transferHash,
    onSuccess: () => {
      setStatusMessage({
        type: "success",
        message: "Le certificat a été transféré avec succès."
      });
      setTransferAddress("");
      refetchDetails();
    },
    onError: (error) => {
      setStatusMessage({
        type: "error",
        message: `Erreur lors du transfert: ${error.message}`
      });
    },
  });

  // Gérer la mise à jour du statut
  const handleUpdateStatus = async () => {
    if (!certificateStatus) {
      setStatusMessage({
        type: "error",
        message: "Veuillez sélectionner un statut."
      });
      return;
    }

    try {
      const hash = await updateStatus({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateCertificateStatus',
        args: [BigInt(certificateNumber), BigInt(certificateStatus)],
      });
      setUpdateStatusHash(hash);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: `Erreur lors de la mise à jour du statut: ${error.message}`
      });
    }
  };

  // Gérer le transfert
  const handleTransfer = async () => {
    if (!isValidAddress) {
      setStatusMessage({
        type: "error",
        message: "Veuillez entrer une adresse valide."
      });
      return;
    }

    try {
      const hash = await transfer({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'safeTransferFrom',
        args: [address, transferAddress, BigInt(certificateNumber)],
      });
      setTransferHash(hash);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: `Erreur lors du transfert: ${error.message}`
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Affichage des détails du certificat */}
      <CertificateDisplay 
        certificateNumber={certificateNumber} 
        title="Détails du certificat"
        description="Informations du certificat à gérer"
      />

      {/* Message de statut */}
      {statusMessage.message && (
        <div className={`p-4 rounded-md ${statusMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {statusMessage.message}
        </div>
      )}

      {/* Gestion du statut */}
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Gérer le statut du certificat</CardTitle>
          <CardDescription>
            Modifier le statut du certificat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <ComboboxCertificateStatus setCertificateStatus={setCertificateStatus} />
              </div>
              <Button 
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus || isConfirmingStatusUpdate || !certificateStatus}
                className="btn-primary"
              >
                {isUpdatingStatus || isConfirmingStatusUpdate ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion du transfert */}
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Transférer le certificat</CardTitle>
          <CardDescription>
            Transférer le certificat à une autre adresse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Adresse du destinataire"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button 
                onClick={handleTransfer}
                disabled={isTransferring || isConfirmingTransfer || !isValidAddress}
                className="btn-primary"
              >
                {isTransferring || isConfirmingTransfer ? "Transfert..." : "Transférer"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateManager; 