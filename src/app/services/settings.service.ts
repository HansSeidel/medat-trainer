import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  /** Default Settings **/
  public normalTaskSettingShowTimeAfterAverage: Setting = {
    preRelease:true,
    model: true,
    label: "Zeit nach Ablauf anzeigen",
    description: "Zeigt die Zeit erst an, wenn die durchscnittliche Zeit - die für die Aufgabe geplant ist - abgelaufen ist. ",
  };

  public normalTaskSettingShowSolutionPathFooter: Setting = {
    preRelease: true,
    model: false,
    label: "Lösungswege anzeigen",
  };

  public kffZfTaskSettingProbabilityAnswerEIsCorrect: Setting = {
    min:0,
    max:0.9,
    model: 0.05,
    numberSteps: 0.1,
    label: "Wahrscheinlichkeit Lösung E ist richtig",
    description: "Anwortmöglichkeit E ist immer definiert als: Keine andere Anwortmöglichkeit ist richtig. Wert:(0-0.9)"
  };

  constructor() {}
}

export type Setting = {
  model: boolean | number,
  label: string,
  description?: string,
  min?: number,
  max?: number,
  maxLength?: number,
  numberSteps?: number,
  preRelease?: boolean,
};

export enum EDifficulty {
  EASY,
  DEFAULT,
  HARD
}
