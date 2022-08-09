import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DronesFleetModule } from './drones_fleet/drones_fleet.module';
import { DronesFleetController } from './drones_fleet/drones_fleet.controller';
import { DronesFleetService } from './drones_fleet/drones_fleet.service';

@Module({
  imports:  [DronesFleetModule, ScheduleModule.forRoot() ],
  controllers: [AppController, DronesFleetController],
  providers: [AppService, DronesFleetService],
})
export class AppModule {}
