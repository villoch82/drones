import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Drone, DroneModel, DroneState, Load, Medication } from './drones_fleet.interface';
import { LoadDroneDTO } from './dto/loadDrone.dto';
import { RegisterDroneDTO } from './dto/registerDrone.dto';
import { DronesFleetRepository } from './drones_fleet.repository';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DronesFleetService {
    
    private readonly dronesFleetRepository = new DronesFleetRepository();
    private logger = new Logger('DronesFleetService');

    registerDrone(registerDroneDTO: RegisterDroneDTO) : Drone {
        const {sn, model, weight_limit, battery_capacity} = registerDroneDTO;

        const drone: Drone = {
            sn,
            model,
            weight_limit,
            battery_capacity,
            state : DroneState.IDLE,
        };

        //Prevent register more than 10 drones
        if( this.dronesFleetRepository.getDronesLength() < 10 ) 
            this.dronesFleetRepository.registerDrone(drone);
        else
            throw new BadRequestException('The fleet is alredy completed');
        return drone;
    }

    loadDrone(loadDroneDTO :  LoadDroneDTO){
        const {drone_sn, medication_id} = loadDroneDTO;

        let drone = this.dronesFleetRepository.getDronebyId(drone_sn);
        let medication = this.dronesFleetRepository.getMedicationbyId(medication_id);
        

        if(drone.state != DroneState.IDLE &&  drone.state != DroneState.LOADING)
            throw new BadRequestException("Drone's must be in IDLE or LOADING state.");
            
        //Set the drone status to LOADING and 
        //preventing the drone from being in this state if battery level < 25%
        if (drone.battery_capacity >= 25)
            this.dronesFleetRepository.modifyDroneState(drone, DroneState.LOADING);
        else
            throw new BadRequestException("Actual battery capacity is not enought to load the drone.");

        //prevent the dorne from being loaded with more weight that it can carry
        if ( medication.weight > (drone.weight_limit - this.dronesFleetRepository.getDroneLoadedWeight(drone_sn) ))
            throw new BadRequestException("Actual cargo exceed drone's weigth limit.");

        return this.dronesFleetRepository.loadDrone(loadDroneDTO);
    }

    checkDroneCargo(drone_sn: string): Medication[] {
        const dronesCargo = this.dronesFleetRepository.getDroneCargo(drone_sn);
        if (dronesCargo.length == 0)
            throw new NotFoundException("Drone has no medication items loaded");
        return dronesCargo;
    }

    checkDronesAvailables() : Drone[] {
        return this.dronesFleetRepository.getDronesAvailables();
    }

    checkDroneBatteryLevel(drone_sn: string) : number {
        let drone = this.dronesFleetRepository.getDronebyId(drone_sn);
        return drone.battery_capacity;   
    }


    @Cron('10 * * * * *')
    checkDronesBatteryLevel() {
        let drones = this.dronesFleetRepository.getDrones();

        for ( let i = 0; i < drones.length; i++ ){
            this.logger.log('Drone ' + drones[i].sn + ', battery level: ' + drones[i].battery_capacity);
        }

    }


}
