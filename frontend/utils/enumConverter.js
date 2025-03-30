export class EnumConverter {
    static MATERIALS = {
        "0": "Or",
        "1": "Argent",
        "2": "Platine",
        "3": "Palladium",
        "4": "Titane",
        "5": "Rhodium",
        "6": "Cuivre",
        "7": "Autre"
    };

    static GEMSTONES = {
        "0": "Aucune",
        "1": "Diamant",
        "2": "Saphir",
        "3": "Rubis",
        "4": "Emeraude",
        "5": "Autre"
    };

    static CERTIFICATE_LEVELS = {
        "0": "Aucun",
        "1": "Document",
        "2": "Puce NFC",
        "3": "Puce RFID"
    };

    static getMaterialLabel(value) {
        return this.MATERIALS[value] || "Inconnu";
    }

    static getGemstoneLabel(value) {
        return this.GEMSTONES[value] || "Inconnu";
    }

    static getCertificateLevelLabel(value) {
        return this.CERTIFICATE_LEVELS[value] || "Inconnu";
    }
} 