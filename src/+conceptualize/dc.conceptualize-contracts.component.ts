/**
 * SOURCE: https://angular.io/guide/dynamic-component-loader
 * 
 */

/**
 * ALL IMPORTS FOR:
 *  - directive (DCDirective)
 *  - component placeholder (DCPlaceholderComponent)
 *  - type class (DCItem) 
 *  - service (DynamicContentService)
 *  - main module (DCMainComponent)
 *  - dynamic data module (DCDataComponent)
 * 
 * Add to .module:
 *  - import { DCMainComponent, DCDirective, DCDataComponent, DynamicContentService } from './dc.drp-graphs.component';
 *  - declarations: [ DCMainComponent, DCDataComponent, DCDirective ],
 *  - providers:[ DynamicContentService ],
 *   - entryComponents: [ DCMainComponent, DCDataComponent ]
 *
  * Add to main component html:
 *  <dynamic-content [items]="items" [tabchange]="selectedIndex" ></dynamic-content> //is selector of main component
 *  'tabchange' and 'items' are holding data to be transferred to corresponding '@Input statement in main component.
 */
import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, Type, Directive, ViewContainerRef, Injectable } from '@angular/core';
//Next imports are specific for DRP
import { LocalStorageService } from 'angular-2-local-storage';
import { Script } from './conceptualize-scriptloader';

// Directive: Selector will be placed in the component where the dynamic data will be shown like this: "<ng-template dynamic-content-data></ng-template>"
@Directive({ selector: '[dynamic-content-data]', })
export class DCDirective { constructor( public viewContainerRef: ViewContainerRef ) { } }

// PLACEHOLDER COMPONENT
export interface DCPlaceholderComponent { data: any; }

// DCItem, import 'type' from angular core
export class DCItem {  constructor( public component: Type<any>, public data: any) {} }

/**
 * SERVICE NEEDED
 */
@Injectable() 
export class DynamicContentService {
  constructor (
    private localStorageService: LocalStorageService
  ) { }
  //hiermee wordt de standaard set data of de opgeslagen data opgehaald.
  
  Items() {
    let stored_data = this.localStorageService.get('conceptualizeText');
    //geen stored data dan standaard static data
    let dataToSend :any = [];
    dataToSend[0] = [];
    dataToSend[0][0]='Contract not loaded yet';
    dataToSend[0][1]='Comments will appear in this row';
    
    if (stored_data){
      //for (var key in dataToSend) { dataToSend[key] = stored_data[key]  }
      dataToSend = stored_data;
      console.log('Stored data was used');
      console.log(dataToSend);
    }
    return [ new DCItem(DCDataComponent, { dataToSend }),  ];
  }
}

/**
 * MAIN COMPONENT, initialisatie, inladen scripts
 */

@Component({
  selector: 'dynamic-content',
  template: `<ng-template dynamic-content-data></ng-template>`
  //add to upper component template:     <dynamic-content [textArrayChangeEvent]="textUpdate"></dynamic-content>
})
export class DCMainComponent implements OnInit {
  @Input() textArrayChangeEvent: any;
  @ViewChild(DCDirective) dcHost: DCDirective;
  public items: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private script : Script,
    private _dcService: DynamicContentService,
  ) { }
  
  ngOnInit(){
    //eenmalige initialisatie
    //console.log('DC onInit activated');
    //this.ngOnChanges();    
  }
  
  //Check bij welke tab hij is, 0 = Claimant, 1 = Defendant, 2 = Analysis 
  ngOnChanges() {
    this.items = this._dcService.Items();
    console.log('DC activated, ngOnchange, items is: ');
    console.log(this.items);
    this.loadComponent();
	}
  
  //DE MAGIE, nog eens uitzoeken wat hier nu gebeurt.
  loadComponent() {
    let dcItem = this.items[0];
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(dcItem.component);
    let viewContainerRef = this.dcHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<DCPlaceholderComponent>componentRef.instance).data = dcItem.data;
  }
}

/**
 * DATA COMPONENT, HIER WORDT DE DYNAMISCHE CONTENT OPGEBOUWD/SAMENGESTELD
 */
@Component({ 
  template: `
  <div style="margin-top:16px; margin-bottom:16px;">Contract table</div>
  <div [innerHTML]="ConceptualizeDCContractTable"></div>

    <table><tr><td><button md-raised-button (click)="mergeBelow(1)">Fix deze button index nummer werkt niet</button></td></tr></table>
  `,
  styles:[`
    p{
      white-space: pre-rap;
      margin-top: -5px;
      font-size: small;
    }
  `]
})
export class DCDataComponent implements OnInit { 
  @Input() data: any; 
  public ConceptualizeDCContractTable: any;

  ngOnInit() {
    this.arrayToTable(this.data);
  }
  //assumes two dimensionsal table, each element has the row 'text' and 'comment'.
  arrayToTable(myArray: any) {
    var result = "";
    for(var i=0; i<myArray['dataToSend'].length; i++) {
        //generate control buttons for each row
        let controls = '<button md-raised-button (click)="mergeBelow('+i+')">Merge</button>';
        result += "<tr>";
        result += "<td>" + controls + "</td>";
        result += "<td>" + myArray['dataToSend'][i][0] + "</td>";
        result += "<td>" + myArray['dataToSend'][i][1] + "</td>";
        result += "</tr>";
    }
    console.log('Tabel: ' +result)
    //insert the table data
    this.ConceptualizeDCContractTable = '<table border=1>' + result + '</table>';
  }
  mergeBelow(indexNumber: number){
    console.log('Merge Below is hit with number r: ' +indexNumber);
  }
}