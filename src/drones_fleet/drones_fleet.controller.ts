import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DronesFleetService } from './drones_fleet.service';
import { RegisterDroneDTO } from './dto/registerDrone.dto';
import { LoadDroneDTO } from './dto/loadDrone.dto';
import { DroneModelValidationPipe } from './pipes/droneModelValidation.pipes';
import { DroneModel } from './drones_fleet.interface';

@Controller('drones-fleet')
export class DronesFleetController {
    constructor(private dronesFleetService: DronesFleetService){}

    @Post()
    @UsePipes(ValidationPipe)
    registerDrone(
        @Body() registerDroneDTO: RegisterDroneDTO,
        @Body('model', DroneModelValidationPipe) model : DroneModel,

    ){
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

