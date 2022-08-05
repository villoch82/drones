import { NotFoundException } from "@nestjs/common";
import { Drone, DroneModel, DroneState, Load, Medication } from "./drones_fleet.model";
import { LoadDroneDTO } from "./dto/loadDrone.dto";

export class DronesFleetRepository {
    private drones : Drone[] = [
        {
            sn: 'D1',
            model: DroneModel.CW,
            weight_limit : 1000,
            battery_capacity : 95,
            state : DroneState.LOADING,
        },
        {
            sn: 'D2',
            model: DroneModel.CW,
            weight_limit : 600,
            battery_capacity : 18, 
            state : DroneState.DELIVERING,
        }
        ,
        {
            sn: 'D3',
            model: DroneModel.CW,
            weight_limit : 2600,
            battery_capacity : 1, 
            state : DroneState.IDLE,
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

    dronesLength(){
        return this.drones.length;
    }

    dronesAppend(drone: Drone) {
        return this.drones.push(drone);
    }

    dronesModifyState(drone_obj : Drone, state: DroneState) {
        let mod = this.drones.find(drone => drone.sn === drone_obj.sn);
        mod.state = state;
    }

    loadDrone(loadDroneDTO :  LoadDroneDTO){
        const { drone_sn, medication_id} = loadDroneDTO;

        const load : Load = {
            drone_sn,
            medication_id
        }

        this.load.push(load);
        return load;
    }

    getDronesAvailables() : Drone[] {
        let drones = this.drones;
        drones = drones.filter(drone => 
            drone.state === DroneState.LOADING ||
            drone.state === DroneState.IDLE
            );

        return drones;
    }

    getDronebyId(drone_sn: string) : Drone {
        const drone = this.drones.find(drone => drone.sn === drone_sn);

        if (! drone ) 
            throw new NotFoundException("No drones matchs the identification supplied");

        return drone;
    }

    getMedicationbyId(id: string) : Medication {
        const med = this.medication.find(med => med.id === id);

        if (! med ) 
        throw new NotFoundException("No medications matchs the identification supplied");

    return med;
    }



    getDroneLoadedWeight(drone_sn : string) : number {

        let weight = 0;
        const meds = this.getDroneCargo(drone_sn);

        meds.forEach(med => 
            weight += med.weight);

        return weight;
    }

    getDroneCargo(drone_sn: string): Medication[] {
        const drone_load = this.load.filter(load => load.drone_sn === drone_sn);
        let meds_loaded : Medication[] = [];

        drone_load.forEach(med => meds_loaded.push(this.getMedicationbyId(med.medication_id)))

        return meds_loaded;
    }
}