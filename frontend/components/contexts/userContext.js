'use client'
import { createContext, useState, useEffect, useContext } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"
import { useAccount } from "wagmi"
import { publicClient } from "@/utils/client";


const UserContext = createContext();
const ADMIN = "0xdf8b4c520ffe197c5343c6f5aec59570151ef9a492f2c624fd45ddde6135ec42";
const JEWELER_ROLE ="0x61e6a4bb6bca8aa1f17c71895c1ab1bf9c06c812442a0a16aad9f0837c23ca79";
const CUSTOMER_ROLE ="0xaf6786efc154b345802554f1dea27e60ea4c3393b6b38eb8438e22c20e088bd2";



export const UserProvider = ({ children }) => {
    
    const [userProfile, setUserProfile] = useState("unknown");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { address, isConnected } = useAccount();

    const getUserProfile = async () =>  {
        if (!address || !isConnected) {
            setUserProfile("unknown");
            setIsLoading(false);
            return;
        }
        
        console.log("getUserProfile", address)
        try {
            console.log("getUserProfile 1");
            console.log(CUSTOMER_ROLE);
            console.log(address);
            console.log(CONTRACT_ADDRESS);
            console.log(CONTRACT_ABI);
            let data = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "hasRole",
                args: [CUSTOMER_ROLE, address],
            });
            if (data) {

                console.log("customer", data)
                setUserProfile("customer");
            }
            else {
                // -----------------------------------------IsJeweler
                console.log("getUserProfile 2")
                data = await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: "hasRole",
                    args: [JEWELER_ROLE, address],
                });

                if (data) {
                    console.log("jeweler", data)
                    setUserProfile("jeweler");
                } else {
                    // -----------------------------------------IsAdmin
                    console.log("getUserProfile 3")
                    data = await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: "hasRole",
                        args: [ADMIN, address],
                    });
    
                    if (data) {
                        console.log("admin", data)
                        setUserProfile("admin");
                    } else {
                        setUserProfile("unknown");
                    }
                }
            }
        } catch (error) {
            console.error("Error checking roles:", error);
            setUserProfile("unknown");
        } finally {
            setIsLoading(false);
        }
    };

    // Mettre à jour le profil quand l'adresse change
    useEffect(() => {
        getUserProfile();
    }, [address, isConnected]);

    return (
        <UserContext.Provider value={{ userProfile, isLoading, error, getUserProfile }}>
            {children}
        </UserContext.Provider>
    )
} 

export const useUserProfile = () => {
    return useContext(UserContext);
}


