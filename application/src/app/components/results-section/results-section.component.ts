import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExpeditionZone } from 'src/app/models/enums/expedition-zone.enum';
import { Expedition } from 'src/app/models/expedition.model';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { Riga } from 'src/app/models/singleResult.model';
import * as _ from 'lodash';



@Component({
  selector: 'app-results-section',
  templateUrl: './results-section.component.html',
  styleUrls: ['./results-section.component.scss']
})
export class ResultsSectionComponent implements OnInit {

  index = 1;
  disable = true;
  currentDateTime = DateTime.now();

  showPrice: boolean =  true;
  showTime: boolean = false;

  subscription: Subscription;

  sortedByExpedition: any[];
  sortedByPrice:any[];
  showMe: boolean = true;
  notShowMe: boolean = !this.showMe;
  righe: Riga[];
  packInfo: {};


  showContent:boolean =  true;
  
  mockResults: Expedition[] = [{ "IdCour": 3, "beta": 10, "Pricing": 6.86, "ExpeditionId": 945, "ExpeditionFrom": ExpeditionZone.Italy, "ExpeditionTo": ExpeditionZone.Italy, "CourierId": 3, "CourierName": "SDA_Extralarge", "MaxTimeExpedition": "3 gg" }, { "IdCour": 2, "beta": 10, "Pricing": 7.96, "ExpeditionId": 865, "ExpeditionFrom": ExpeditionZone.Italy, "ExpeditionTo": ExpeditionZone.Italy, "CourierId": 2, "CourierName": "BRT_Ita", "MaxTimeExpedition": "2 gg" }, { "IdCour": 1, "beta": 10, "Pricing": 11.72, "ExpeditionId": 951, "ExpeditionFrom": ExpeditionZone.Italy, "ExpeditionTo": ExpeditionZone.Italy, "CourierId": 1, "CourierName": "TNT", "MaxTimeExpedition": "2 gg" }, { "IdCour": 4, "beta": 10, "Pricing": 11.72, "ExpeditionId": 902, "ExpeditionFrom": ExpeditionZone.Italy, "ExpeditionTo": ExpeditionZone.Italy, "CourierId": 4, "CourierName": "DHL_Economy_ITA", "MaxTimeExpedition": "2 gg" }]


  


  panels = [
    {
      active: false,
      disabled: false,
      name: 'Dettagli',
      customStyle: {
        'font-size':'18px',
        'background-color': '#fff',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    },
  ];

  constructor(
    private router: Router,
    
  ) { 
    const state = this.router.getCurrentNavigation().extras.state;
  this.righe = state['righe'];
  console.log("queste sono le righe",this.righe);
  this.sortedByPrice = _.orderBy(this.righe, o => o.Pricing);
  console.log("queste sono le righe invertite",this.sortedByPrice);
  this.sortedByExpedition = this.righe.sort((a,b) => (a.MaxTimeExpedition > b.MaxTimeExpedition)? 1 : -1);

  }



  ngOnInit(): void {
    this.packInfo = localStorage.getItem("packInfo");
    console.log("session Storage",this.packInfo );
  }

  orderResults(type: string): void{
    switch(type){
      case 'price':
      console.log(type);
        
      break;
      case 'speed':
      console.log(type);

        break
    }
    
  }

  selectLogo(corriere: string){
    let imgPATH: string;
    switch (corriere) {
      case 'TNT':
        imgPATH ="../../../assets/images/tnt_logo.png" 
        break;
      case 'BRT_Ita':
      case 'BRT_Dpd':
      case 'BRT_Euro_Express':
        imgPATH ="./../../../assets/images/Brt_logo.jpeg" 
        break;
      case 'SDA_Extralarge':
        imgPATH ="./../../../assets/images/corriere-sda-logo.png" 
        break;
      case 'DHL_Economy_ITA':
      case 'DHL_Economy_Eu':
        imgPATH ="./../../../assets/images/dhl_logo.jpeg" 
        break;
    
      default:
        break;
    }

    return imgPATH;
  }


  onBack() {
    this.router.navigate([".."]);
  }

  //create the string for the pickup date
  getStartShippingDate(): string {
    let startShippingMonth;
    let startShippingDay;
    let startShippingDayStr;
    let startShippingDayMonth;
    let startShippingDate = this.currentDateTime;
    let currentHours = this.currentDateTime.toFormat('T');

    // Check if it's after 5pm or if today is Sunday
    //in which case the pickup day is moved forward by 1
    if (currentHours > "17:00" || startShippingDate.toFormat('E') === '7'){
      startShippingDate = this.currentDateTime.plus({ days: 1})
    }
    //get month
    startShippingMonth  = startShippingDate.setLocale('it').toFormat('MMMM');
    //get day 
    startShippingDay    = startShippingDate.toFormat('d'); 
    startShippingDayStr = startShippingDate.setLocale('it').toFormat('ccc'); 

    //creates the string to return
    startShippingDayMonth = `${startShippingDayStr}, ${startShippingDay} ${startShippingMonth}`;

    return startShippingDayMonth;   
  }

  //create the string for the delivery date
  getEndShippingDate(days: string): string{
    let requiredDays = Number(days.slice(0, days.length-2));
    let endShippingMonth;
    let endShippingDay;
    let endShippingDayStr;
    let endShippingDayMonth;
    let endShippingDate;
   
    let startShippingDate           = this.currentDateTime;
    let temporaryEndShippingDay     = this.currentDateTime;
    let currentHours                = this.currentDateTime.toFormat('T');
    temporaryEndShippingDay         = this.currentDateTime.plus({ days: requiredDays});

   
    if(startShippingDate.toFormat('E') === '7' || temporaryEndShippingDay.toFormat('E') === '7' || currentHours > "17:00"){
      requiredDays = requiredDays +1;
    }
    
    endShippingDate = this.currentDateTime.plus({ days: requiredDays});

    endShippingMonth  = endShippingDate.setLocale('it').toFormat('MMMM');
    //get day 
    endShippingDay = endShippingDate.toFormat('d'); 
    endShippingDayStr = endShippingDate.setLocale('it').toFormat('ccc'); 
    //creates the string to return
    endShippingDayMonth = `${endShippingDayStr}, ${endShippingDay} ${endShippingMonth}`;

    return endShippingDayMonth;
  }

  toggleContent(){
    this.showTime = !this.showTime;
    this.showPrice = !this.showPrice;
  }

  toggleDetails(){
    this.showContent = !this.showContent;
  }


  getResultInfo(result){
    console.log(result);
    localStorage.setItem('risultato', JSON.stringify(result));
    this.router.navigate(["/details"]);
  }

  getRoundedPrice(result){
    return parseFloat((Math.round(result * 100) / 100).toFixed(2));
  }

}
