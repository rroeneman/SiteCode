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
export class KbOverviewComponent {}

/**
 * Kennisbank pagina's gebaseerd op JSON input
 */
@Component({
  selector: 'kb-pages',
  template: `
  <div [innerHTML]="HTMLcontent.content"></div>
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
    public HTMLcontent: any;

  ngOnInit() {
    this.HTMLcontent = this._kbService.retrieveItem(this.currentroute.snapshot.params['id']);
    console.log('DATA JSON is: ', this.HTMLcontent);
    //Geen data, dan waarschijnlijk foute url en dus naar de 404
    if(this.HTMLcontent == undefined) this.router.navigate(['/404'])
    
    //this.HTMLcontent = JSON.parse(String(JsonData));


  }

  ngOnDestroy() {
    this._kbService.removeItem(this.currentroute.snapshot.params['id']);
  }
}