import { Component } from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import * as bcrypt from "bcryptjs";
import {FormsModule} from "@angular/forms";
import {LandingPageComponent} from "./page/landing-page/landing-page.component";
import { FeatureBranchService } from './feature-branch-service/feature-branch.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule, Button, FormsModule, LandingPageComponent],
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

  constructor(_featureBranchService: FeatureBranchService) {
    this.password = '';
    this.loginStatus = '';
    this.isLoggedIn = _featureBranchService.getIsLoggedInByDefault();
  }


  /**
   * I know... I know -
   * But see it that way - I want to have a dummy check so not EVERYONE without a password can enter.
   * So feel free to lock around when you cracked it ;)
   */
  dummyLogin() {
    this.isLoggedIn = bcrypt.compareSync(this.password, this.realPassword);
  }

  isInvalid() {
    return this.isLoggedIn != undefined && !this.isLoggedIn;
  }
}
