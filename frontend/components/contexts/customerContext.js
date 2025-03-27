'use client'
import { createContext, useState, useEffect, useContext } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants"
import { useAccount } from "wagmi"
import { publicClient } from "@/utils/client";


const CustomerContext = createContext();


export const CustomerProvider = ({ children }) => {

    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { address, isConnected } = useAccount();

    const getCustomer = async () => {
        if (!address || !isConnected) {
            setCustomer(null);
            setIsLoading(false);
            return;
        }
        console.log("getOneCustomer", address)
        try {
            let data = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getOneCustomer",
                args: [address]
            });
            if (data) {
                console.log("customer", data)
                setCustomer(data);
            }
            else {
                setCustomer(null);
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
        getCustomer();
    }, [address, isConnected]);

    return (
        <CustomerContext.Provider value={{ customer, isLoading, error, getCustomer }}>
            {children}
        </CustomerContext.Provider>
    )
}



export const useCustomer = () => {
    return useContext(CustomerContext);
}




