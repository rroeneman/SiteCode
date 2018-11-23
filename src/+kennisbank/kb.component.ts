import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { KennisbankService } from './kb.service'; //fetching stored data
import {Router, ActivatedRoute} from '@angular/router';

/**
 * Kennisbank overview voorpagina
 */
@Component({
  selector: 'kb-overview',
  templateUrl: 'kb.component.html',
  styleUrls: ['kb.component.css'],
  encapsulation: ViewEncapsulation.None, //to make Styles work
})
export class KbOverviewComponent implements OnInit {
  constructor( 
    private _kbService: KennisbankService,
    private router: Router
  ) {}
  public HTMLcontent: any;
  ngOnInit() {
    let glb = this;
    this._kbService.LoadJsonById("mainpageslinks") 
    .then(() => {glb.HTMLcontent = glb._kbService.retrieveItem("mainpageslinks") } ) 
    .catch((err:any) => {console.error("JSON data for mainpagesLinks failed", err); } );
  }
}

/**
 * Kennisbank pagina's gebaseerd op JSON input
 */
@Component({
  selector: 'kb-pages',
  styleUrls: ['kb.component.css'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'kb.component.pages.html',
})
export class KbPagesComponent implements OnInit {
  constructor(
    private currentroute: ActivatedRoute,
    private router: Router,
    private _kbService: KennisbankService,
    private sanitizer: DomSanitizer,
    ) {
        // override the route reuse strategy, ensures that when routing to this component again it is actually initialised again
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
  };
    }
    HTMLcontent: any;
    //public content: any;
    //public relatedLinks: any;

  ngOnInit() {
    this.HTMLcontent = this._kbService.retrieveItem(this.currentroute.snapshot.params['id']);
    //Geen data, dan waarschijnlijk foute url en dus naar de 404
    if(this.HTMLcontent == undefined) this.router.navigate(['/404'])
    //bypass sanatiser to keep click link, without click link we can't do a routing and need to load page ever time (VERY SLOW!)
    //this.relatedLinks = this.sanitizer.bypassSecurityTrustHtml(JSONdata.relatedLinks);
    //this.content = this.sanitizer.bypassSecurityTrustHtml(JSONdata.content);
    //console.log('DATA JSON is: ', this.relatedLinks, this.content);
  }

  
  //Router events from page, needed because Routerlink cannot be incorporated in innerhtml, and reloading page takes a lot of time
  route(event:any){
    let href = event.target.getAttribute('href')
    if (href && href.substring(0, 4) != 'http') {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }
}