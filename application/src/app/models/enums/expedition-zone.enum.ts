export enum ExpeditionZone {
    Italy = 'Italy',
    IslandsAndCalabry = 'Siciliy/Sardinia/Calabry'
}

export namespace ExpeditionZone {
    export function getZoneFromRegion(region: string): ExpeditionZone {
        // TODO extend function to include other countries
        switch (region) {
            case 'Sicilia':
            case 'Sardegna':
            case 'Calabria':
                return ExpeditionZone.IslandsAndCalabry;

            default:
                return ExpeditionZone.Italy;
        }
    }

    export function getAllZones(): ExpeditionZone[] {
        return [
            ExpeditionZone.Italy,
            ExpeditionZone.IslandsAndCalabry
        ]
    }
}