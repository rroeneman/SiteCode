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
import { MatSlider, MatButton } from '@angular/material';
//Next imports are specific for DRP
import { LocalStorageService } from 'angular-2-local-storage';
import { DRPMOCKDATA } from './drpBaseData';
import { Script } from './drp-scriptloader'; //gemaakt om Google Charts script te lazy loaden

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
    let stored_data = this.localStorageService.get(key);
    //geen stored data dan standaard static data
    let dataToSend = DRPMOCKDATA;
    if (stored_data){
      for (var key in dataToSend) { dataToSend[key] = stored_data[key]  }
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
})
export class DCMainComponent implements OnInit {
  @Input() tabchange:number;
  @ViewChild(DCDirective) dcHost: DCDirective;
  public items: DCItem[];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private script : Script,
    private _dcService: DynamicContentService,
  ) { }
  
  ngOnInit(){
    //eenmalige initialisatie
    this.items = this._dcService.Items();
  }
  
  //Check bij welke tab hij is, 0 = Claimant, 1 = Defendant, 2 = Analysis 
  ngOnChanges() {
    //wanneer de analyse tab wordt opgevraagd, dan losgaan 
    if(this.tabchange == 2) {
      //vraag het script op
      this.script.load('googlechart')
        //laadt Charts pas als script is ingeladen
        .then(() => this.loadComponent())
        //eventuele foutmeldingen: TODO, een spinner op het scherm voor als het lang duurt.
        .catch(() => console.log('Google Chart loading niet gelukt'));
    }
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
  <div style="margin-top:16px; margin-bottom:16px;">Level of differences</div>
  <div id="gauge_chart" [chartType]="gauge_type" [chartOptions]= "gauge_ChartOptions" [chartData]="gauge_ChartData" GoogleChart></div>    
    <div style="margin-top:16px;"><h2>Recommendation:</h2></div>
    <p>Based on this recommendation, a match with existing dispute resolution offerings can be made.<p>
    <mat-slider color="primary" min="1" max="100" step="1" value="{{ResultNumber}}"></mat-slider>
    <p style="font-size:small; margin-top: -10px">Negotiation - Mediation - Arbitration - Litigation</p>
  `,
  styles:[`
    .mat-slider-horizontal{
      min-width: 300px;
    }
    p{
      white-space: pre-rap;
      margin-top: -5px;
      font-size: small;
    }
  `]
})
export class DCDataComponent implements OnInit { 
  @Input() data: any; 
  public ResultNumber: number;

  // ------ GAUGE - CLOCK -  UAI -----------
  public gauge_type : string = "Gauge";

  public gauge_ChartData = [
        ['Label', 'Value'],
        ['UAI', 30],
        ['Preference', 80]
  ];

  public gauge_ChartOptions = {
        width: 400, height: 120,
        redFrom: 75, redTo: 100,
        yellowFrom: 25, yellowTo: 75,
        greenFrom: 0, greenTo: 25,
        minorTicks: 5
  };

  // ------ BAR CHARTS -----------
  public bar_ChartData = [
        ['Element', 'Procedure'],
        ['Recommmended procedure', 30]
  ];

  public bar_ChartOptions = {
        title: 'Claimant and Defendant profiles combined',
        width: '600px',
        chartArea: {width: '70%'},
        hAxis: {
            title: 'Percentage',
            minValue: 0,
            maxValue: 100,
            textStyle: {
                bold: false,
                fontSize: 10,
                color: '#4d4d4d'
            },
            titleTextStyle: {
                bold: true,
                fontSize: 10,
                color: '#4d4d4d'
            }
        },
      };

 ngOnInit() {
   let uai_cl = Number (this.data['dataToSend'][0].cl_value);
   let uai_de = Number (this.data['dataToSend'][0].de_value);
   this.bar_ChartData[1] = ['UAI', uai_de, uai_cl];
 
   let uaidiff = this.diff(+this.data['dataToSend'][0].cl_value, +this.data['dataToSend'][0].de_value)
   this.gauge_ChartData[1] = ['UAI', uaidiff];

   let pref_cl = Number (this.data['dataToSend'][1].cl_value);
   let pref_de = Number (this.data['dataToSend'][1].de_value);
   this.bar_ChartData[2] = ['Preference', pref_de, pref_cl];    

   let prefdiff = this.diff(+this.data['dataToSend'][1].cl_value, +this.data['dataToSend'][1].de_value)
   this.gauge_ChartData[2] = ['Procedure', prefdiff];

   let prefaverage = Number (this.average(pref_cl,pref_de ) );
   let uaiaverage =  Number (this.average(uai_cl,uai_de ) );
   let totalaverage = this.average(prefaverage,uaiaverage );
   this.ResultNumber = Number (totalaverage);

  }

  //CALC difference between numbers
  diff(a:number,b:number){return Math.abs(a-b);}
  average(x:number,y:number){return((x+y)/2).toFixed(2)}
}