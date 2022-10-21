import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from '../pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;

  constructor(
    private readonly pokemonSrv: PokemonService,
  ){}

  async loadDB() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    let toLoad: CreatePokemonDto[] = [];
     
    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no = +segments[segments.length-2]

      toLoad.push({
        name,
        no
      })
    })
    
    this.pokemonSrv.fillWithSeedData([]);
    return toLoad;
  }

 
}
