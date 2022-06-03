import { ExpeditionZone } from "./enums/expedition-zone.enum";

export class Expedition {
    IdCour: number;
    beta: number;
    Pricing: number;
    ExpeditionId: number;
    ExpeditionFrom: ExpeditionZone;
    ExpeditionTo: ExpeditionZone;
    CourierId: number;
    CourierName: string;
    MaxTimeExpedition: string;
}