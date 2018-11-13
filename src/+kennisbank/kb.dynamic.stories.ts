/**
 * KBData = Kennisbank Component met content voorpagina
 * insert deze dynamische content als volgt in een html: <kennisbank-content [datanummer]="selectedIndex"></kennisbank-content> 
 */
import {OnInit} from '@angular/core';

@Component({
  selector: 'basic-component-select',
  templateUrl: 'kb.component.html',
})
export class KBDataComponent implements OnInit  {
  @Input() data: any; 
  public Results : any;
  
  ngOnInit() {
    if(this.data != null) {
        this.Results = JSON.stringify(this.data);
        console.log("Data uit KBDataComponent: ", this.data, this.Results)
    }
  }
}



/**
 * SOURCE: https://angular.io/guide/dynamic-component-loader
 * 
 */

/**
 * ALL IMPORTS FOR:
 *  - directive (KBDirective)
 *  - component placeholder (KBPlaceholderComponent)
 *  - type class (KBItem)
 *  - main module (KBMainComponent)
 *  - several dynamic data modules (DCDataComponent, or ResultDrpComponent)
 * 
 * Add to .module:
 *  - import { KBMainComponent, KBDirective} from './dc.drp-graphs.component';
 *  - import .... all dynamic data modules like normal component modules
 *  - declarations: [ KBMainComponent, KBDirective (+ all dynamic data components)],
 *   - entryComponents: [ KBMainComponent, (+ all dynamic data components) ]
 *
  * Add to main component html:
 *  <dynamic-content-modulename [data]="dataToBeViewed" [setActive]="someBooleanValue" ></dynamic-content> //is selector of main component
 *  'setActive = true' will trigger the rendering of the data (to prevent unneccesary rendering)
 *  'data' holds the data that is transferred to the dynamic components.
 */
import { Component, Input, ViewChild, ComponentFactoryResolver, Type, Directive, ViewContainerRef, OnChanges } from '@angular/core';
//import { KennisbankService } from './kb.service'; //fetching stored data
//import { ActivatedRoute } from '@angular/router'; //used for reference of result component

// Directive: Selector will be placed in the component where the dynamic data will be shown like this: "<ng-template kenisbank-main-content></ng-template>"
@Directive({ selector: '[kenisbank-main-content]', })
export class KBDirective { constructor( public viewContainerRef: ViewContainerRef ) { } }
// PLACEHOLDER COMPONENT
export interface KBPlaceholderComponent { data: any; }
// KBItem, import 'type' from angular core
export class KBItem {  constructor( public component: Type<any>, public data: any) {} }

// MAIN COMPONENT, initialisatie, inladen scripts
@Component({
  selector: 'kennisbank-content',
  template: `<ng-template kenisbank-main-content></ng-template>`
})
export class KBMainComponent implements OnChanges {
  @Input() datanummer:number;
  @ViewChild(KBDirective) dcHost: KBDirective;
  public items: KBItem;
  public data: any = null; 
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    //private _surveyService: KennisbankService, //retrieven stored data, answers for instance
    //private activatedRoute: ActivatedRoute, //the relevant component is transferred through router
  ) {}
  
  ngOnChanges() {
    //DE MAGIE ...
    let kbItem = new KBItem(KBDataComponent, this.datanummer ); //hier kan nog data bij, of component kan dynamisch worden gekozen, zie survey
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(kbItem.component);
    let viewContainerRef = this.dcHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<KBPlaceholderComponent>componentRef.instance).data = kbItem.data;
	}
}


