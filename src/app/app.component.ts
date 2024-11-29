import { Component } from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import * as bcrypt from "bcryptjs";
import {FormsModule} from "@angular/forms";
import {LandingPageComponent} from "./page/landing-page/landing-page.component";
import { FeatureBranchService } from './feature-branch-service/feature-branch.service';
import {WipComponent} from "./dev/wip/wip.component";
import {MenuItem} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule, Button, FormsModule, LandingPageComponent, WipComponent, TabMenuModule],
  providers: [FeatureBranchService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private realPassword: string = "$2a$10$VTFbhs1nV2CYwKadwKnhF.8uFNxgQ.AAb/xvbaME3BvNgBuhaBJ62";
  title = 'medat-trainer';
  password: string;
  isLoggedIn: boolean;
  loginStatus: string;

  items: MenuItem[];
  activeItem: MenuItem;

  constructor(_featureBranchService: FeatureBranchService, public _auth: AuthService, _router: Router) {
    this.password = '';
    this.loginStatus = '';
    this.isLoggedIn = _featureBranchService.getIsLoggedInByDefault();
    this._auth.setAuthenticated(this.isLoggedIn);
    this.items = [
      { label: 'Tasks', icon: 'pi pi-calculator', routerLink: './tasks'},
      { label: 'Settings', icon: 'pi pi-cog', routerLink: './settings'},
      { label: 'Information', icon: 'pi pi-info', routerLink: './information'}
    ];
    this.activeItem = this.items[0];
    if(this.isLoggedIn){
      _router.navigate(['./tasks']);
    }
  }


  /**
   * I know... I know -
   * But see it that way - I want to have a dummy check so not EVERYONE without a password can enter.
   * So feel free to lock around when you cracked it ;)
   */
  dummyLogin() {
    this.isLoggedIn = bcrypt.compareSync(this.password, this.realPassword);
    this._auth.setAuthenticated(this.isLoggedIn);
  }

  isInvalid() {
    return this.isLoggedIn != undefined && !this.isLoggedIn;
  }
}
