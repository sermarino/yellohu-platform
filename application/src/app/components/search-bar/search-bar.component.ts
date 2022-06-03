import { Component, ElementRef, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpeditionZone } from 'src/app/models/enums/expedition-zone.enum';

import comuni from 'src/assets/json/elencoComuni.json';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  value = '';
  title = 'Input a number';



 


  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  @ViewChild('capFromInput') capFromInput: ElementRef;


  onChange(value: string): void {
    this.updateValue(value);
  }


   // '.' at the end or only '-' in the input box.
   onBlur(): void {
    if (this.value.charAt(this.value.length - 1) === '.' || this.value === '-') {
      this.updateValue(this.value.slice(0, -1));
    }
  }

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.value = value;
    }
    this.inputElement!.nativeElement.value = this.value;
    this.updateTitle();
  }


  updateTitle(): void {
    this.title = (this.value !== '-' ? this.formatNumber(this.value) : '-') || 'Input a number';
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }



  countryList = ExpeditionZone.getAllZones();
  zone: ExpeditionZone;

  options: string[];
  filteredOptions: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.updateModel(ExpeditionZone.Italy);
  
  }


  updateModel(zone: ExpeditionZone) {
    this.zone = zone;

    if (this.capFromInput) {
      this.capFromInput.nativeElement.value = '';
    }

    const filteredComuni = comuni.filter(comune => {
      const comuneZone = ExpeditionZone.getZoneFromRegion(comune.Region);
      return comuneZone === this.zone;
    });

    this.options = filteredComuni.map(comune => comune.Field);
    this.filteredOptions = this.options.slice();
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value) {
      this.filteredOptions = this.options.filter(option => option.includes(value));
    } else {
      this.filteredOptions = this.options.slice();
    }
  }

  search() {
    this.router.navigate(['results'])
  }

}
