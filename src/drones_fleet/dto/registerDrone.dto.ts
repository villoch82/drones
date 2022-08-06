import { IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength } from "class-validator";
import { DroneModel, DroneState } from '../drones_fleet.interface';

export class RegisterDroneDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
   
    sn: string;

    @IsNotEmpty()
    model: DroneModel;

    @IsNotEmpty()
    weight_limit: number;

    @IsNumber()
    battery_capacity : number;
}