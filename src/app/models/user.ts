
export interface User {
    idUser?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    blocked?: boolean;
    //comments?: Comment[];
    //?: Shipment[];
}

export enum Role{
    Commercial ='Commercial', 
    Magasinage = "Magasinage"
}