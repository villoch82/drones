import { DroneModel } from "../drones_fleet.model"

export class RegisterDroneDTO {
    sn: string;
    model: DroneModel;
    weight_limit: number;
}