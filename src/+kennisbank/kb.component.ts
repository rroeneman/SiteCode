import { Component, OnInit, OnDestroy } from '@angular/core';
import { KennisbankService } from './kb.service'; //fetching stored data
import {Router, ActivatedRoute} from '@angular/router';

/**
 * Kennisbank overview voorpagina
 */
@Component({
  selector: 'kb-overview',
  templateUrl: 'kb.component.html',
})
export class KbOverviewComponent implements OnInit, OnDestroy {
  constructor(
    private currentroute: ActivatedRoute,
    private router: Router,
    private _kbService: KennisbankService,
    ) {}
  

  ngOnInit() {
    //console.log('De router', this.currentroute.snapshot.params['id']) 
    //let JsonData = this._kbService.retrieveItem(this.currentroute.snapshot.params['id']);
    //console.log('DATA JSON is: ', JsonData);
    //if(JsonData == undefined && this.currentroute.snapshot.params['id'] != undefined) this.router.navigate(['/404'])
  }

  ngOnDestroy() {
    //this._kbService.removeItem(this.currentroute.snapshot.params['id']);
  }
}


/**
 * Kennisbank pagina's gebaseerd op JSON input
 */
@Component({
  selector: 'kb-pages',
  template: `
  HALLO
  {{title}}
  {{subtitle}}
  {{content}}
  `,
})
export class KbPagesComponent implements OnInit, OnDestroy {
  constructor(
    private currentroute: ActivatedRoute,
    private router: Router,
    private _kbService: KennisbankService,
    ) {}
    public title: any;
    public subtitle: any;
    public content: any;

  ngOnInit() {
    let JsonData = this._kbService.retrieveItem(this.currentroute.snapshot.params['id']);
    console.log('DATA JSON is: ', JsonData);
    //Geen data, dan waarschijnlijk foute url en dus naar de 404
    if(JsonData == undefined) this.router.navigate(['/404'])
  }

  ngOnDestroy() {
    this._kbService.removeItem(this.currentroute.snapshot.params['id']);
  }
}