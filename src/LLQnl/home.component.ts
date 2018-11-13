import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import {MatDivider, MatToolbar} from '@angular/material';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'home_component',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent{
  constructor(
    private router:Router,
    public media: ObservableMedia, //for 
    private meta: Meta,
  ) { 
    this.meta.addTag({ name: 'description', content: 'Juridisch adviesbureau gespecialiseerd in zakelijke partnerships' });
    this.meta.addTag({ name: 'author', content: 'Legal LinQ' });
    this.meta.addTag({ name: 'keywords', content: 'Juridisch advies, Partnership, Samenwerken, Joint venture, VOF, Maatschap' });
  }
}
