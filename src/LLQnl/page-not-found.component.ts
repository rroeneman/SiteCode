import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'no-content',
  template: `
    <div>
      <h1>404: page missing</h1>
     <!--TODO, MAAK WERKENDE BUTTON 
      <button md-raised-button color="primary" (click)="backClick()">GO BACK</button>  
    -->
    </div>
  `
})
export class PageNotFoundComponent {
  private _location: Location;
  private activatedRoute: ActivatedRoute;

  backClick(){
    this._location.back();
    console.log('heb wel')
  }
}