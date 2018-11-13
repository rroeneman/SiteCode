/**
 * SOURCE: https://angular.io/guide/dynamic-component-loader
 * 
 */

/**
 * ALL IMPORTS FOR:
 *  - directive (DCDirective)
 *  - component placeholder (DCPlaceholderComponent)
 *  - type class (DCItem)
 *  - main module (DCMainComponent)
 *  - several dynamic data modules (DCDataComponent, or ResultDrpComponent)
 * 
 * Add to .module:
 *  - import { DCMainComponent, DCDirective} from './dc.drp-graphs.component';
 *  - import .... all dynamic data modules like normal component modules
 *  - declarations: [ DCMainComponent, DCDirective (+ all dynamic data components)],
 *   - entryComponents: [ DCMainComponent, (+ all dynamic data components) ]
 *
  * Add to main component html:
 *  <dynamic-content-modulename [data]="dataToBeViewed" [setActive]="someBooleanValue" ></dynamic-content> //is selector of main component
 *  'setActive = true' will trigger the rendering of the data (to prevent unneccesary rendering)
 *  'data' holds the data that is transferred to the dynamic components.
 */
import { Component, Input, ViewChild, ComponentFactoryResolver, Type, Directive, ViewContainerRef, OnChanges } from '@angular/core';
import { SurveyService } from './surveyservice'; //fetching stored data
import { ActivatedRoute } from '@angular/router'; //used for reference of result component
//import { resultComponent } from './survey-routing'; //import of all relevant components
import { BasicResultComponent } from './survey.component';

// Directive: Selector will be placed in the component where the dynamic data will be shown like this: "<ng-template dynamic-content-data></ng-template>"
@Directive({ selector: '[dynamic-content-data]', })
export class DCDirective { constructor( public viewContainerRef: ViewContainerRef ) { } }
// PLACEHOLDER COMPONENT
export interface DCPlaceholderComponent { data: any; }
// DCItem, import 'type' from angular core
export class DCItem {  constructor( public component: Type<any>, public data: any) {} }

// MAIN COMPONENT, initialisatie, inladen scripts
@Component({
  selector: 'dynamic-content-survey',
  template: `<ng-template dynamic-content-data></ng-template>`
})
export class DCMainComponent implements OnChanges {
  @Input() setActive:boolean;
  @Input() currentFingerprintKey:any;
  @ViewChild(DCDirective) dcHost: DCDirective;
  public items: DCItem;
  public data: any = null; 
  
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private _surveyService: SurveyService, //retrieven stored data, answers for instance
    private activatedRoute: ActivatedRoute, //the relevant component is transferred through router
  ) {}
  
  ngOnChanges() {
    //update display of answers
    this.data = [this._surveyService.ResultCachedLatest(), 
                  this._surveyService.GetAnswers(),
                  this.currentFingerprintKey];
    //DE MAGIE, nog eens uitzoeken wat hier nu gebeurt, 
    //lijkt erop dat component viruteel wordt gebouwd op basis van een template.
    //de template wordt aangeleverd via de routing
    let dcItem = new DCItem(this.activatedRoute.snapshot.data.resultComponent, this.data );
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(dcItem.component);
    let viewContainerRef = this.dcHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<DCPlaceholderComponent>componentRef.instance).data = dcItem.data;
	}
}
