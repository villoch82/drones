import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DronesFleetService } from './drones_fleet.service';
import { RegisterDroneDTO } from './dto/registerDrone.dto';
import { LoadDroneDTO } from './dto/loadDrone.dto';

@Controller('drones-fleet')
export class DronesFleetController {
    constructor(private dronesFleetService: DronesFleetService){}

    @Post()
    registerDrone(@Body() registerDroneDTO: RegisterDroneDTO){
        return this.dronesFleetService.registerDrone(registerDroneDTO);
    }

    @Post('/loadDrone')
    loadDrone(@Body() loadDroneDTO :  LoadDroneDTO): any{
        return this.dronesFleetService.loadDrone(loadDroneDTO);
    } 

    @Get('/availables')
    checkDronesAvailables(){
        return this.dronesFleetService.checkDronesAvailables();
    }

    @Get('/check_battery/:drone_sn')
    checkDroneBatteryLevel(@Param('drone_sn') drone_sn : any){
        return this.dronesFleetService.checkDroneBatteryLevel(drone_sn);
    }


    @Get('/:drone_sn')
    checkDroneLoad(@Param('drone_sn') drone_sn : string): any {
        return this.dronesFleetService.checkDroneCargo(drone_sn);
    }


}
function Params() {
    throw new Error('Function not implemented.');
}

