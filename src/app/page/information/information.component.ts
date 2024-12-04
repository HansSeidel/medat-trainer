import { Component } from '@angular/core';
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [
    AccordionModule
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {

}
