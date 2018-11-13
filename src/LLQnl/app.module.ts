/**
 * PRELOADING STRATEGY * https://coryrylan.com/blog/custom-preloading-and-lazy-loading-strategies-with-angular
 * in approutes in de module, als "data: { preload: true }" dan wordt die meegenomen in load */
import { PreloadingStrategy, Route } from '@angular/router'; import { Observable, of } from 'rxjs'; 
export class AppCustomPreloader implements PreloadingStrategy {  preload(route: Route, load: Function): Observable<any> { return route.data && route.data.preload ? load() : of(null); }}

/**
 * HIER START APP MODULE
 */
import { NgModule, enableProdMode }      from '@angular/core';
enableProdMode();

import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

//theming
import { MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs'; //gesture support

// App is our top level component
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AboutComponent, ContactComponent, JuridischAdviesComponent, MenuFooterComponent, MenuMainComponent, MenuMobileComponent, PrivacyComponent } from './elements.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { LocalStorageModule } from 'angular-2-local-storage'; 

//Routing
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
let appRoutes: Routes = [
  { path: '', component: HomeComponent },
  //{ path: 'about', component: AboutComponent },
  //{ path: 'privacy', component: PrivacyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'juridisch-advies', component: JuridischAdviesComponent },
  //{ path: 'kb/:id', loadChildren: '../+kennisbank#KennisbankModule'  },
  { path: 'kb', loadChildren: '../+kennisbank#KennisbankModule',data: { preload: true }  },
  { path: 'dashboard', loadChildren: '../+dashboard#DashboardModule' },
  { path: 'drp', loadChildren: '../+drp#DRPModule' }, 
  { path: 'decision-support/:id', loadChildren: '../+survey#SurveyModule' },
  { path: 'decision-support', loadChildren: '../+survey#SurveyModule' },
  { path: 'conceptualize', loadChildren: '../+conceptualize#ConceptualizeModule'},
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  declarations: [ AppComponent,
                  HomeComponent,
                  AboutComponent, ContactComponent, JuridischAdviesComponent, MenuFooterComponent, MenuMainComponent, MenuMobileComponent, PrivacyComponent, 
                  PageNotFoundComponent,
                  ],
  imports: [  BrowserModule,
              BrowserAnimationsModule,
              FlexLayoutModule,
              //FormsModule,
              HttpClientModule,
              MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatSidenavModule, MatToolbarModule,
              LocalStorageModule.withConfig({
                prefix: 'llqdrp',
                storageType: 'localStorage'
              }),
              RouterModule.forRoot(appRoutes, { preloadingStrategy: AppCustomPreloader  }) //LET OP: PRELOADING GEBEURT HIER, ZIE https://toddmotto.com/lazy-loading-angular-code-splitting-webpack
            ],
  providers:[AppCustomPreloader ],
  entryComponents: [],
  bootstrap:[ AppComponent ]
})
export class AppModule {
}


