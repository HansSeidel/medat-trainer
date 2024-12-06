import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {TooltipModule} from "primeng/tooltip";
import {TabMenuModule} from "primeng/tabmenu";
import {MenuItem} from "primeng/api";
import {WipComponent} from "../../dev/wip/wip.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    Button,
    DividerModule,
    TooltipModule,
    TabMenuModule,
    WipComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  notImplementedYet: string = "This part is not implemented yet but might come soon";


  constructor() {
  }
}
