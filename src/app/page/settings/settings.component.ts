import { Component } from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {CheckboxModule} from "primeng/checkbox";
import {SettingsService} from "../../services/settings.service";
import {FormsModule} from "@angular/forms";
import {TooltipModule} from "primeng/tooltip";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    AccordionModule,
    CheckboxModule,
    FormsModule,
    TooltipModule,
    NgTemplateOutlet
  ],
  providers: [SettingsService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  //public normalTaskSettingShowTimeAfterAverage: boolean;

  constructor(public _settings: SettingsService) {
    //this.normalTaskSettingShowTimeAfterAverage = _settings.normalTaskSettingShowTimeAfterAverage;
  }
}
