import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  // stepbar
  index = 2;
  disable = true;

  packInformation = JSON.parse(localStorage.getItem('packInformation'));
  result = JSON.parse(localStorage.getItem('risultato'));


  constructor(
    private router: Router
  ) { }

  onBack() {
    this.router.navigate(["/results"]);
  }

  ngOnInit(): void {
    
    
  }

}
