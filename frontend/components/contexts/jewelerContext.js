'use client'
import { createContext, useState, useEffect, useContext } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"
import { useAccount } from "wagmi"
import { publicClient } from "@/utils/client";


const JewelerContext = createContext();


export const JewelerProvider = ({ children }) => {

    const [jeweler, setJeweler] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { address, isConnected } = useAccount();

    const getJeweler = async () => {
        if (!address || !isConnected) {
            setJeweler(null);
            setIsLoading(false);
            return;
        }
        console.log("getOneJeweler", address)
        try {
            let data = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getOneJeweler",
                args: [address]
            });
            if (data) {
                console.log("jeweler", data)
                setJeweler(data);
            }
            else {
                setJeweler(null);
            }
        }
        catch (error) {
            setError(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getJeweler();
    }, [address, isConnected]);

    return (
        <JewelerContext.Provider value={{ jeweler, isLoading, error, getJeweler }}>
            {children}
        </JewelerContext.Provider>
    )
}


export const useJeweler = () => {
    return useContext(JewelerContext);
} 