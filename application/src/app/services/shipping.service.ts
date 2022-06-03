import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import data from 'src/assets/json/elencoComuni.json';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  packInfo: any = {};
  packList: any = [];
  constructor(private http: HttpClient) { }

  getShipping(
    luogoPartenza: string, 
    luogoDestinazione: string,
    peso: number,
    altezza: number,
    larghezza: number,
    profondita: number,
  ){
    const url = 'https://r6rrln42l4.execute-api.eu-west-1.amazonaws.com/dev/expeditions';
    const params = new HttpParams()
      .set('zoneFrom', this.getRegion(luogoPartenza))
      .set('zoneTO', this.getRegion(luogoDestinazione))
      .set('weight', Number(peso))
      .set('length', Number(altezza))
      .set('width', Number(larghezza))
      .set('depth', Number(profondita))
      
    this.packInfo.start = luogoPartenza;
    this.packInfo.destination = luogoDestinazione;
    this.packInfo.weight = peso;
    this.packInfo.length = altezza;
    this.packInfo.depth = profondita;
    this.packInfo.larghezza = larghezza;


    localStorage.setItem('packInfo', JSON.stringify(this.packInfo));
    console.log("params ", this.packInfo);
    

    return this.http.get<any>(url, { params });


  }



  //NON CANCELLARE FINO A QUANDO NON SEI SICURO SI QUELLO CHE STAI FACENDO
  // getRegione(cap: string): string {
  //   const object = data.find(comune => comune.Cap === cap);
  //   const region = this.parseRegion(object.Region);
  //   console.log(region);
  //   return region;
  // }

  getRegion(fieldInputComune: string): string {
    let cap = fieldInputComune.substring(fieldInputComune.indexOf('-')+1).trim();
    
    const object = data.find(comune => comune.Cap === cap);
    console.log("Campo inserito nella label",object);
    const region = this.parseRegion(object.Region);
    console.log(region);
    return region;
  }




  parseRegion(region: string) {
    switch (region) {
      case 'Sicilia':
      case 'Sardegna':
      case 'Calabria': {
        return 'Siciliy/Sardinia/Calabry';
      }

      default: {
        return 'Italy';
      }
    }
  }



}
