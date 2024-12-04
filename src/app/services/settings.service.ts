import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  /** Default Settings **/
  public normalTaskSettingShowTimeAfterAverage: Setting = {
    model: true,
    label: "Zeit nach Ablauf anzeigen",
    description: "Zeigt die Zeit erst an, wenn die durchscnittliche Zeit - die für die Aufgabe geplant ist - abgelaufen ist. ",
  };

  public normalTaskSettingShowSolutionPathFooter: Setting = {
    model: false,
    label: "Lösungswege anzeigen",
  };

  constructor() {}
}

export type Setting = {
  model: boolean | number,
  label: string,
  description?: string,
};
