import { IsInt, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreatePokemonDto {

    @IsNumber()
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;
    
    @IsString()
    @MinLength(2)
    name: string
    
}
