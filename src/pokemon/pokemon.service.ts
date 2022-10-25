import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ){}

  private handlerException(error: any){
    if(error.code === 11000) throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
       
      console.log(error);
      throw new InternalServerErrorException()
  }
  
  async create(createPokemonDto: CreatePokemonDto) {
    try {

      const poke = await this.pokemonModel.create(createPokemonDto);
      return poke;

    }catch(error){
      this.handlerException(error);
    }
  }

  async findAll(pagination: PaginationDto) {

    const {limit = 10 , offset = 0} = pagination;
    const resp = await this.pokemonModel.find().limit(limit).skip(offset).sort({no: 1}).select('-__v');
    return resp;
  }

  async findOne(term: string) {
    let poke: Pokemon;

    if(!isNaN(+term)){
      poke = await this.pokemonModel.findOne({no: term})
    }

    if(isValidObjectId(term)){
      poke = await this.pokemonModel.findById(term)
    }

    if(!poke) {
      poke = await this.pokemonModel.findOne({name: term.trim()})
    }

    if(!poke) throw new NotFoundException(`Pokemon not found, term: ${term}`)

    return poke;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const poke = await this.findOne(term);
    try {
      await poke.updateOne(updatePokemonDto , {new: true})
      return {...poke.toJSON(), ...updatePokemonDto}
    }catch(error){
      this.handlerException(error)
    }
  }

  async remove(id: string) {

    // const result = await this.pokemonModel.findByIdAndDelete(id) 
    // if(!result) throw new NotFoundException(`Pokemon not found, id: ${id}`)

    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id})
    if(deletedCount === 0) throw new NotFoundException(`Pokemon not found, id: ${id}`)
    return;
  }

  async fillWithSeedData(pokemons: CreatePokemonDto[]){

    await this.pokemonModel.deleteMany({})
    
    try {

      const poke = await this.pokemonModel.insertMany(pokemons);
      return poke;

    }catch(error){
      this.handlerException(error);
    }
  }

}
