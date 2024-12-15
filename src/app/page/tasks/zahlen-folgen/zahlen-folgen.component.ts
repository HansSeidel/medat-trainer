import { Component } from '@angular/core';
import {AlgZahlenfolgenService} from "../../../algorithms/algZahlenfolgen.service";
import {algZfType} from "../../../algorithms/typeAlgZF";

@Component({
  selector: 'app-zahlen-folgen',
  standalone: true,
  imports: [],
  templateUrl: './zahlen-folgen.component.html',
  styleUrl: './zahlen-folgen.component.css'
})
export class ZahlenFolgenComponent {

  public zfTasks: Array<algZfType>;

  constructor(private _zfService: AlgZahlenfolgenService) {
    this.zfTasks = this._zfService.getTasks();
  }
}
