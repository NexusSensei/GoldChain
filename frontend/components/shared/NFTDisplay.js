'use client'

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnumConverter } from "@/utils/enumConverter";

const NFTDisplay = () => {
    const [nftId, setNftId] = useState("");
    const [searchId, setSearchId] = useState(null);

    // Lecture du tokenURI
    const {
        data: tokenURI,
        error: tokenError,
        isLoading: isLoadingToken,
        status
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'tokenURI',
        args: searchId !== null ? [BigInt(searchId)] : undefined,
        enabled: searchId !== null && searchId !== ""  // Ne s'exécute que si searchId est défini et non vide
    });

    // État pour stocker les métadonnées décodées
    const [metadata, setMetadata] = useState(null);

    // Fonction pour décoder les métadonnées
    const decodeMetadata = (tokenURI) => {
        try {
            // Le tokenURI est au format "data:application/json;base64,..."
            const base64Data = tokenURI.split('base64,')[1];
            const jsonString = atob(base64Data);
            const parsed = JSON.parse(jsonString);

            // Convertir les valeurs enum en labels
            if (parsed.attributes) {
                console.log("Attributs reçus:", parsed.attributes);
                parsed.attributes = parsed.attributes.map(attr => {
                    let value = attr.value;
                    console.log("Trait type:", attr.trait_type, "Value:", attr.value);
                    switch(attr.trait_type) {
                        case "mainMaterial":
                            value = EnumConverter.getMaterialLabel(Number(attr.value));
                            break;
                        case "mainGemStones":
                            value = EnumConverter.getGemstoneLabel(Number(attr.value));
                            break;
                        case "CertificateLevel":
                            value = EnumConverter.getCertificateLevelLabel(Number(attr.value));
                            break;
                    }
                    return { ...attr, value };
                });
            }

            return parsed;
        } catch (error) {
            console.error("Erreur lors du décodage des métadonnées:", error);
            return null;
        }
    };

    // Mise à jour des métadonnées quand tokenURI change
    useEffect(() => {
        if (tokenURI) {
            const decodedMetadata = decodeMetadata(tokenURI);
            if (decodedMetadata) {
                setMetadata(decodedMetadata);
            }
        } else {
            setMetadata(null);
        }
    }, [tokenURI]);

    const handleSearch = () => {
        if (nftId) {
            setSearchId(nftId);
        }
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <CardTitle>Rechercher un NFT</CardTitle>
                <CardDescription>
                    Entrez le numéro du NFT à consulter
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-8">
                    {/* Zone de recherche */}
                    <div className="flex gap-4">
                        <Input
                            type="number"
                            placeholder="Numéro du NFT"
                            value={nftId}
                            onChange={(e) => setNftId(e.target.value)}
                            className="flex-1"
                        />
                        <Button 
                            onClick={handleSearch}
                            className="bg-[#d4af37] hover:bg-[#b38f2f] text-white"
                        >
                            Rechercher
                        </Button>
                    </div>

                    {/* État de chargement - n'affiche que pendant une recherche active */}
                    {isLoadingToken && searchId && (
                        <div className="text-center text-gray-600">
                            Chargement du NFT...
                        </div>
                    )}

                    {/* Affichage des erreurs - n'affiche que pendant une recherche active */}
                    {tokenError && searchId && (
                        <div className="text-red-500">
                            Erreur lors de la lecture du NFT: {tokenError.message}
                        </div>
                    )}

                    {/* Affichage des métadonnées et de l'image */}
                    {metadata && (
                        <div className="flex flex-col gap-8">
                            {/* Nom et Description */}
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-[#d4af37] mb-2">{metadata.name}</h3>
                                {metadata.description && (
                                    <p className="text-gray-600">{metadata.description}</p>
                                )}
                            </div>

                            <div className="border-2 border-[#d4af37] rounded-lg p-6 bg-white shadow-lg">
                                <div className="flex flex-col-reverse md:flex-row gap-8">
                                    {/* Attributs */}
                                    <div className="flex-grow">
                                        <div className="space-y-4">
                                            {metadata.attributes && metadata.attributes.map((attr, index) => (
                                                <div key={index} className="border-b border-gray-200 pb-2">
                                                    <div className="text-sm text-gray-600">{attr.trait_type}</div>
                                                    <div className="font-medium">{attr.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Image SVG */}
                                    {metadata?.image && (
                                        <div className="flex-shrink-0 w-full md:w-[300px] mx-auto">
                                            <img 
                                                width={300} 
                                                src={metadata.image}
                                                alt={metadata.name || "NFT Image"}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message quand aucun NFT n'est trouvé */}
                    {!metadata && !tokenError && searchId && !isLoadingToken && (
                        <div className="text-center text-gray-500">NFT non trouvé</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default NFTDisplay; 