import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

export const useCertificate = (certificateId) => {
    // Lecture des détails du certificat
    const { data: certificateDetails, error: detailsError, refetch: refetchDetails } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getOneCertificate",
        args: [certificateId],
        enabled: !!certificateId && typeof certificateId === 'bigint'
    });

    return {
        certificateDetails,
        detailsError,
        refetchDetails
    };
}; 