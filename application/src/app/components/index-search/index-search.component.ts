import { Component, OnInit } from '@angular/core';
import { flattenDeep, groupBy } from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
import { ShippingService } from "src/app/services/shipping.service";
import { forkJoin } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Comune } from 'src/app/models/comune.model'
import { PackageModel } from 'src/app/models/package.model';
import citiesList from 'src/assets/json/elencoComuni.json';

@Component({
  selector: 'app-index-search',
  templateUrl: './index-search.component.html',
  styleUrls: ['./index-search.component.scss']
})
export class IndexSearchComponent implements OnInit {
  citiesList: Comune[] = citiesList;
  package = [new PackageModel()];
  packInfo: any = {};
  packList: any = [];

  expeditionForm: FormGroup;
  fields: any;

  extras: NavigationExtras;


  selectField: FormControl = new FormControl();
 


  ngOnInit(): void {
    this.fields = {
      isRequired: true,
      expedition: {
        start: '',
        destination: '',
        packs: [
          new PackageModel()
        ],
      },
    };


    this.expeditionForm = this.fb.group({
      expedition: this.fb.group({
        start: new FormControl(''),
        destination: new FormControl(''),
        packs: this.fb.array([]),
      }),
    })
    this.patch()
    
  }


  patch() {
    const control = <FormArray>this.expeditionForm.get('expedition.packs');
    this.fields.expedition.packs.forEach((x) => {
      control.push(this.patchValues(x));
    });
  }

  patchValues(pack: PackageModel) {
    return this.fb.group({
      weight: null,
      height: null,
      width: null,
      depth: null
    });
  }


  addPackage() {
    const control = <FormArray>this.expeditionForm.get('expedition.packs');
    control.push(this.patchValues(new PackageModel()));
    console.log("COSA è QUESTO?", control.controls)
    
  }

  removePack(formIndex: number) {
    const control = <FormArray>this.expeditionForm.get('expedition.packs');
    control.removeAt(formIndex);
  }

  duplicatePack(formIndex: number) {
    const control = <FormArray>this.expeditionForm.get('expedition.packs');
    control.push(control.controls[formIndex])
    console.log("PEPEPE", control.controls[formIndex])
  }



  constructor(private fb: FormBuilder,
    private shippingService: ShippingService,
    private router: Router) {
  }

  onSubmit() {
    this.shippingService.getRegion(this.expeditionForm.get('expedition.start').value);

    const capFrom   = this.expeditionForm.get('expedition.start').value;
    const capTo     = this.expeditionForm.get('expedition.destination').value;
    const packages  = this.expeditionForm.get('expedition.packs').value;
    
    this.packInfo.from = capFrom;
    this.packInfo.to = capTo;
    this.packInfo.packages = packages;

    localStorage.setItem('packInformation', JSON.stringify(this.packInfo));

    console.log("OGGETTO PACCHI", JSON.parse(localStorage.getItem('packInformation')));
    

    const cliclavoro = packages.map(pack => this.shippingService.getShipping(capFrom, capTo, pack.weight, pack.height, pack.width, pack.depth));
    
    
   
    

    forkJoin(cliclavoro).subscribe((res: any[]) => {
      const allValues = flattenDeep(res);
      const groupedValues = groupBy(allValues, this.getCourierId)

      const CourierId = Object.keys(groupedValues);

      const mappa = new Map<string, number>();
      for (let id of CourierId) {
        const solutions = groupedValues[id];
        const price = solutions.map(x => x.Pricing).reduce((a, b) => a + b, 0);
        mappa.set(id, price);
      }

      console.log(mappa);

      const tableRowsResults = res[0].map(value => {
        return {
          CourierId: value.CourierId,
          CourierName: value.CourierName,
          ExpeditionFrom: value.ExpeditionFrom,
          ExpeditionTo: value.ExpeditionTo,
          MaxTimeExpedition: value.MaxTimeExpedition,
          Pricing: mappa.get(value.CourierId.toString())
        }
      })

      console.log("table rows",tableRowsResults);

      this.extras = {
        state: {
          righe: tableRowsResults
        }
      }

      this.router.navigate(['results'], this.extras);
    })

  }

  getCourierId(x) {
    return x.CourierId;
  }

}

