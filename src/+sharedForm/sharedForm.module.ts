import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

//theming
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, MatOptionModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule, MatToolbarModule, MatFormField, MatSlider } from '@angular/material';

//Component stuff
import { SharedFormComponent } from './sharedForm.component';
import { DCMainComponent2, DCDirective2 } from './dc.component'; //main dynamic components/directive
import { SharedFormSettingsButtonComponent, SharedFormSettingsComponent, SharedFormSettingsFormValidator } from './sharedForm.SettingsFunctions.component'
import { SharedFormRawResultsComponent } from './sharedForm.rawResults.component';

//All thememing and forms for SettingsFunctions component

import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
//import {saveAs} from 'file-saver';

//Schema form 
import { MaterialDesignFrameworkModule } from 'angular7-json-schema-form';

//Service Shared Forms en Script loader //(Injectables)
import{ SharedFormService } from './sharedForm.service'; 
import { Script } from './sharedForm.scriptload.service';

//Routing, timely loading services (Injectables)
import {ScriptLoadResolver, FormDataLoadResolver} from './sharedForm.router.service';

//HTTP request handerls
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyInterceptor } from './http.interceptor';

@NgModule({ 
  imports: [CommonModule,
            FlexLayoutModule,
            MatProgressSpinnerModule,
            MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, //for SettingsFunctions
            FormsModule, ReactiveFormsModule, //for SettingsFunctions en export
            HttpClientModule, //for Service
            MaterialDesignFrameworkModule,  //JsonSchemaFormModule.forRoot(MaterialDesignFrameworkModule),    // https://www.npmjs.com/package/angular7-json-schema-form
            ],
  declarations: [ SharedFormSettingsButtonComponent, SharedFormComponent, DCMainComponent2, DCDirective2, 
    SharedFormSettingsComponent, SharedFormSettingsFormValidator, SharedFormRawResultsComponent 
  ],
  exports: [ SharedFormComponent, DCMainComponent2, SharedFormSettingsButtonComponent, 
    //@angular/material modules:
    MatButtonModule, MatInputModule, MatFormFieldModule, MatSliderModule,
    FormsModule, ReactiveFormsModule, 
  ],

  providers:[  { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi:true }, ],
  
  entryComponents: [SharedFormSettingsComponent, SharedFormRawResultsComponent],
})
export class SharedFormModule {

    static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedFormModule,
      providers: [ SharedFormService, Script, ScriptLoadResolver, FormDataLoadResolver ]
    };
  }
}