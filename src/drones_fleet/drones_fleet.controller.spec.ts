import { DronesFleetService } from './drones_fleet.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DronesFleetRepository } from './drones_fleet.repository';
import { DronesFleetController } from './drones_fleet.controller';
import { RegisterDroneDTO } from './dto/registerDrone.dto';
import { DroneModel } from './drones_fleet.interface';

describe('DronesService', () => {
    let droneFleetService : DronesFleetService;
    let droneFleetRepository : DronesFleetRepository;

    beforeEach( async () => {
        const app : TestingModule = await Test.createTestingModule({
            controllers: [DronesFleetController],
            providers: [DronesFleetService],
        }).compile();

        droneFleetService = app.get<DronesFleetService>(DronesFleetService);
    });

    describe('registerDrones', () => {
        it('register drone', () => {
            const registerDroneDTO:  RegisterDroneDTO = {
                sn: 'TEST1',
                model: DroneModel.CW,
                weight_limit: 1000,
                battery_capacity: 100
            }
            
            const resultExpected = {
                "sn": "TEST1",
                "model": "Cruiserweight",
                "weight_limit": 1000,
                "battery_capacity": 100,
                "state": "IDLE"
            };

            expect(droneFleetService.registerDrone(registerDroneDTO)).toStrictEqual(resultExpected);
        })
    })
});