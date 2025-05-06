export interface Shipment {
    id?: number;
    client: string;
    poids: number;
    volume: number;
    provenance: string;
    incoterm: Incoterm;
    magasinCale: string;
    confirme: boolean;
    motifModification: string;
    estimatedDeparture: Date; // or Date if you plan to handle it as a Date object
    estimatedArrival: Date;   // same here
    //userId: number;
    
    // You can add file URLs if you want to show file previews after upload
    insertionBlPath?: string;
    blFinalPath?: string;
    listeCollisagePath?: string;
    facturePath?: string;
  }

  export enum Incoterm {
    EXW = "EXW", 
    FCA = "FCA", 
    CPT = "CPT", 
    CIP = "CIP", 
    DAP = "DAP", 
    DPU = "DPU", 
    DDP = "DDP", 
    FAS = "FAS", 
    FOB = "FOB", 
    CFR = "CFR", 
    CIF = "CIF"
}