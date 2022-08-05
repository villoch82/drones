//Drones

export interface Drone {
    //id: string;
    sn: string;
    model: DroneModel;
    weight_limit : number,
    battery_capacity : number,
    state : DroneState,
}

export enum DroneModel {
    LW = 'Lightweight',
    MW = 'Middleweight',
    CW = 'Cruiserweight',
    HW = 'Heavyweight',
}

export enum DroneState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    DELIVERING = 'DELIVERING',
    RETURNING = 'RETURNING'
}

//Medications

export interface Medication {
    id : string,
    name: string,
    weight : number,
    code : string,
    image : string,
}

//Drones <=> Medications ManyToMany
export interface Load {
    drone_sn : string,
    medication_id : string,
}

