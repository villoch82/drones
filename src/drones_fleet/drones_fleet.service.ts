import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Drone, DroneModel, DroneState, Load, Medication } from './drones_fleet.model';
import { LoadDroneDTO } from './dto/loadDrone.dto';
import { RegisterDroneDTO } from './dto/registerDrone.dto';

@Injectable()
export class DronesFleetService {
    private drones : Drone[] = [
        {
            sn: 'ABC_1',
            model: DroneModel.CW,
            weight_limit : 1000,
            battery_capacity : 95,
            state : DroneState.LOADING,
        },
        {
            sn: 'ABC_2',
            model: DroneModel.CW,
            weight_limit : 600,
            battery_capacity : 18, 
            state : DroneState.DELIVERING,
        }
    ];

    private medication : Medication[] = [
        {
            id : '1',
            name: 'Medicine 1',
            weight : 300,
            code : 'ABC_123',
            image : '/url_to_image/3',
        },
        {
            id : '2',
            name: 'Medicine 2',
            weight : 400,
            code : 'ABC_124',
            image : '/url_to_image/4',
        },
        {
            id : '3',
            name: 'Medicine 3',
            weight : 900,
            code : 'ABC_154',
            image : '/url_to_image/14',
        },
    ];

    private load : Load[] = [
        {
            drone_sn : 'ABC_1',
            medication_id : '1',
        },
        {
            drone_sn : 'ABC_1',
            medication_id : '2',
        }
    ];

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
        if( this.drones.length < 10 ) 
            this.drones.push(drone);
        else
            return null;
        return drone;
    }

    loadDrone(loadDroneDTO :  LoadDroneDTO){
        const {drone_sn, medication_id} = loadDroneDTO;

        let drone = this.getDronebyId(drone_sn);
        let medication = this.getMedicationbyId(medication_id);

        //Set the drone status to LOADING and 
        //preventing the drone from being in this state if battery level < 25%
        if (drone.battery_capacity >= 25)
            drone.state = DroneState.LOADING;
        else
            throw new BadRequestException("Actual battery capacity is not enought for load the drone.");

        //prevent the dorne from being loaded with more weight that it can carry
        if ( medication.weight > (drone.weight_limit - this.getDroneLoadedWeight(drone_sn) ))
            throw new BadRequestException("Actual cargo exceed drone's weigth limit.");



        const load : Load = {
            drone_sn,
            medication_id,
        }

        this.load.push(load);
        return load;
    }

    checkDroneCargo(drone_sn: string): Medication[] {
        const drone_load = this.load.filter(load => load.drone_sn === drone_sn);
        let meds_loaded : Medication[] = [];

        drone_load.forEach(med => meds_loaded.push(this.getMedicationbyId(med.medication_id)))

        return meds_loaded;
    }

    checkDronesAvailables() : Drone[] {
        let drones = this.drones;
        drones = drones.filter(drone => 
            drone.state === DroneState.LOADING ||
            drone.state === DroneState.IDLE
            );

        return drones;
    }

    checkDroneBatteryLevel(drone_sn: string) : number {
        let drones = this.drones.find(drone => drone.sn === drone_sn)

        if(drones)
            return drones.battery_capacity;
        else
            throw new NotFoundException("No drones match the identification supplied");
        
    }

    private getDronebyId(drone_sn: string) : Drone {
        const drone = this.drones.find(drone => drone.sn === drone_sn);

        if (! drone ) 
            throw new NotFoundException("No drones matchs the identification supplied");

        return drone;
    }

    private getMedicationbyId(id: string) : Medication {
        const med = this.medication.find(med => med.id === id);

        if (! med ) 
        throw new NotFoundException("No medications matchs the identification supplied");

    return med;
    }

    private getDroneLoadedWeight(drone_sn : string) : number {

        let weight = 0;
        const meds = this.checkDroneCargo(drone_sn);

        meds.forEach(med => 
            weight += med.weight);

        return weight;
    }

}
