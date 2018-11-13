import { Component, ViewChild } from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import { DOCUMENT } from '@angular/platform-browser';

//Theming, a Menu
import {MatButton, MatIcon, MatSidenav, MatToolbar} from '@angular/material';

@Component({
  selector: 'apphome',
  templateUrl: 'app.component.html',
  styles: [require('../styles.scss')],
}) 
export class AppComponent{
  public toolbarIsSticky: boolean = false;
  //public scrolltext: any;
  //constructor( @Inject(DOCUMENT) private document: Document ) {if(window.location.pathname == '/') this.scrolltext = 'Boutique juridisch adviesbureau, gespecialiseerd in geschillenbeslechting. Voor persoonlijk en geautomatiseerd juridisch advies.';}
  
  //ZORGT DAT MOBIELE MENU SLUIT WANNEER OP EEN LINK WORDT GECLICKED
  @ViewChild(MatSidenav) sidenav:MatSidenav;
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {this.sidenav.close(); }
    })
  }
}