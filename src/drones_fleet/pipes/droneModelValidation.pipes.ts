import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from '@nestjs/common';

import { DroneModel } from '../drones_fleet.model';

export class DroneModelValidationPipe implements PipeTransform {
    readonly allowedModels = [DroneModel.CW, DroneModel.HW, DroneModel.LW, DroneModel.MW];

    transform(value: any) {

        if (!this.isStatusValid(value)) throw new BadRequestException(`" ${value} " is not a valid drone model value.`);

        return value;
    }

    private isStatusValid(status: any) {
        const index = this.allowedModels.indexOf(status);
        return index !== -1;
    }
}