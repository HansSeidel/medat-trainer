import { Component } from '@angular/core';
import {AlgZahlenfolgenService} from "../../../algorithms/algZahlenfolgen.service";
import {algZfAnswer, algZfType} from "../../../algorithms/typeAlgZF";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {CardModule} from "primeng/card";
import {translateExpression} from "@angular/compiler-cli/src/ngtsc/translator";

@Component({
  selector: 'app-zahlen-folgen',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    CardModule
  ],
  templateUrl: './zahlen-folgen.component.html',
  styleUrl: './zahlen-folgen.component.css'
})
export class ZahlenFolgenComponent {

  public zfTasks: Array<algZfType> | undefined;
  private lockedAnswers: Array<string> | undefined;

  constructor(private _zfService: AlgZahlenfolgenService) {
    this.zfTasks = this._zfService.getTasks();
  }

  public isStringAnswer(answers: string | algZfAnswer) {
    return typeof answers === 'string';
  }

  getAnswerFormatted(answers: string | algZfAnswer) {
    if(this.isStringAnswer(answers)) {
      return answers;
    }
    return `${(<algZfAnswer>answers).eighthNumber} | ${(<algZfAnswer>answers).ninthNumber}`;
  }

  chose(id: number, answerOptionLetter: string) {
    if(!this.lockedAnswers) this.lockedAnswers = [];
    this.lockedAnswers[id] = answerOptionLetter;
  }

  isChoosen(id: number, answerOptionLetter: string) {
    if(!this.lockedAnswers) return 'hover:bg-black-alpha-20';
    return this.lockedAnswers[id] === answerOptionLetter? 'bg-green-300':'hover:bg-black-alpha-20';
  }
}
