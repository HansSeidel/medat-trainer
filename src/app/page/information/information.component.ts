import { Component } from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {AlgZahlenfolgenService} from "../../algorithms/algZahlenfolgen.service";
import {SystemsComponent} from "./explainations/ZF/systems/systems.component";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [
    AccordionModule,
    SystemsComponent,
    InputNumberModule,
    FormsModule
  ],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  systemId: number = 1;

  constructor(public _zfService: AlgZahlenfolgenService) {
  }
}
