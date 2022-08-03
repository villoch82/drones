import { Module } from '@nestjs/common';
import { DronesFleetController } from './drones_fleet.controller';
import { DronesFleetService } from './drones_fleet.service';

@Module({
  controllers: [DronesFleetController],
  providers: [DronesFleetService]
})
export class DronesFleetModule {}
