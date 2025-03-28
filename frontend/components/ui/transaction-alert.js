import { Alert, AlertDescription } from "@/components/ui/alert"

const TransactionAlert = ({ hash, isConfirming, isConfirmed, error }) => {
    if (!hash && !isConfirming && !isConfirmed && !error) return null;

    return (
        <div className="space-y-2">
            {hash && (
                <Alert>
                    <AlertDescription>
                        Hash de la transaction: {hash}
                    </AlertDescription>
                </Alert>
            )}
            {isConfirming && (
                <Alert>
                    <AlertDescription>
                        En attente de confirmation...
                    </AlertDescription>
                </Alert>
            )}
            {isConfirmed && (
                <Alert className="bg-green-50">
                    <AlertDescription className="text-green-800">
                        Transaction confirmée avec succès
                    </AlertDescription>
                </Alert>
            )}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Erreur: {error.shortMessage || error.message}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default TransactionAlert; 