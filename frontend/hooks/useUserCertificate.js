import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";

export const useUserCertificate = (address, certificateNumber) => {
    // Lecture du nombre de certificats
    const { data: certificateCount, error: balanceError, refetch: refetchCertificateCount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "balanceOf",
        args: [address],
        enabled: !!address
    });

    // Lecture du certificat spécifique
    const { data: certificateData, error: tokenError, refetch: refetchCertificate } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenOfOwnerByIndex",
        args: [address, certificateNumber],
        enabled: !!address && certificateCount > 0n && typeof certificateNumber === 'bigint'
    });

    const refetchAll = async () => {
        await refetchCertificateCount();
        await refetchCertificate();
    };

    return {
        certificateCount,
        certificateData,
        balanceError,
        tokenError,
        refetchAll
    };
}; 