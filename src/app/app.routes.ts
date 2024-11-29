import { Routes } from '@angular/router';
import {LandingPageComponent} from "./page/landing-page/landing-page.component";
import {SettingsComponent} from "./page/settings/settings.component";
import {InformationComponent} from "./page/information/information.component";
import {AuthService} from "./auth.service";

export const routes: Routes = [
  {
    path: 'tasks',
    component: LandingPageComponent,
    title: 'Aufgaben',
    canActivate: [AuthService]
  },
  {
    path: 'information',
    component: InformationComponent,
    title: 'Informationen',
    canActivate: [AuthService]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Einstellungen',
    canActivate: [AuthService]
  }
];
