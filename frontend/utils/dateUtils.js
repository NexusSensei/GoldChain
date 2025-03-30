export function formatEVMDate(timestamp) {
    // Vérifier si le timestamp est valide
    if (!timestamp) {
        console.error('Timestamp is undefined or null');
        return 'Date inconnue';
    }

    // Convertir le BigInt en nombre
    const timestampNumber = Number(timestamp);
    
    // Vérifier si la conversion a réussi
    if (isNaN(timestampNumber)) {
        console.error('Invalid timestamp:', timestamp);
        return 'Date inconnue';
    }

    // Créer la date (le timestamp EVM est en secondes)
    const date = new Date(timestampNumber * 1000);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
        console.error('Invalid date created from timestamp:', timestampNumber);
        return 'Date inconnue';
    }
    
    // Formater la date en DD/MM/YYYY HH:mm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
} 