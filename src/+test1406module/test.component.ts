import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Test1406 overview voorpagina
 */
@Component({
  selector: 'test-first',
  template: `<h1>Test1406</h1>
  <json-schema-form
    loadExternalAssets="true"
    [schema]="exampleJsonObject.schema"
    framework="material-design">
  </json-schema-form>`,
})
export class TestFirstComponent implements OnInit {
  constructor(
    ) {}
    public exampleJsonObject : any;
    
    ngOnInit() {

      this.exampleJsonObject = {"schema":{"type":"object","properties":{"Present":{"type":"object","properties":{"MyCostsCurrent":{"type":"string","title":"sdf","description":""},"OtherPartyCostCurrent":{"type":"string","title":"Hee","description":""}}}}},"form":[{"key":"Present","title":"Present","items":[{"key":"Present.MyCostsCurrent"},{"key":"Present.OtherPartyCostCurrent"}]},{"type":"submit","title":"Next","progressIndicator":null,"fingerprintKey":"Present","previousQuestion":null}]}
/*    
      this.exampleJsonObject = {
        "first_name": "Jane", "last_name": "Doe", "age": 25, "is_company": false,
        "address": {
          "street_1": "123 Main St.", "street_2": "ook iets",
          "city": "Las Vegas", "state": "NV", "zip_code": "89123"
        },
        "phone_numbers": [
          { "number": "702-123-4567", "type": "cell" },
          { "number": "702-987-6543", "type": "work" }
        ], "notes": ""
      };
  */      
    
    }


}

/**
 * Test1406 pagina's gebaseerd op JSON input
 */
@Component({
  selector: 'test-second',
  //templateUrl: 'test.component.html',
  template: ``,
})
export class TestSecondaryComponent implements OnInit, OnDestroy {
  constructor(
    ) {}

    ngOnInit() {
  }

  ngOnDestroy() {
  }
}