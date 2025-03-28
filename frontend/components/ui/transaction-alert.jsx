import { Alert, AlertDescription } from "@/components/ui/alert"

const TransactionAlert = ({ hash, isConfirming, isConfirmed, error }) => {
  if (!hash) return null;

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Erreur: {error.shortMessage || error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isConfirming) {
    return (
      <Alert className="mt-4">
        <AlertDescription>
          Transaction en cours de confirmation...
        </AlertDescription>
      </Alert>
    );
  }

  if (isConfirmed) {
    return (
      <Alert className="mt-4 bg-green-100 border-green-500 text-green-700">
        <AlertDescription>
          Transaction confirmée !
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mt-4">
      <AlertDescription>
        Hash de la transaction: {hash}
      </AlertDescription>
    </Alert>
  );
}

export default TransactionAlert; 