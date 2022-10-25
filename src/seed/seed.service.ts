import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from '../pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  
  constructor(
    private readonly pokemonSrv: PokemonService,
    private readonly http: AxiosAdapter
  ){}

  async loadDB() {
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');

    let toLoad: CreatePokemonDto[] = [];
     
    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no = +segments[segments.length-2]

      toLoad.push({
        name,
        no
      })
    })
    
    return this.pokemonSrv.fillWithSeedData(toLoad);;
  }

 
}
