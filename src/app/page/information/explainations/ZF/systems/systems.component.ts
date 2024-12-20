import {Component, Input} from '@angular/core';
import {AlgZahlenfolgenService} from "../../../../../algorithms/algZahlenfolgen.service";

@Component({
  selector: 'app-systems',
  standalone: true,
  imports: [],
  templateUrl: './systems.component.html',
  styleUrl: './systems.component.css'
})
export class SystemsComponent {
  @Input() forInformation: boolean = false;
  @Input() systemId!: number;

  constructor(public _zfService: AlgZahlenfolgenService) {
  }
}
