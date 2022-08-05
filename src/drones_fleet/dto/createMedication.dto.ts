import { IsNotEmpty, IsNumber, Matches } from "class-validator";

export class createMedicationDTO{
    @IsNotEmpty()
    id : string;

    @IsNotEmpty()
    @Matches('[a-zA-Z_-]')
    name: string;

    @IsNotEmpty()
    @IsNumber()
    weight : number;

    @IsNotEmpty()
    @Matches('[A-Z0-9_-]')
    code : string;

    image : string;
}