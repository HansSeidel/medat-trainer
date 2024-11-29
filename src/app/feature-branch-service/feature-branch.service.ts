import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureBranchService {

  constructor() { }

  public getIsLoggedInByDefault() :boolean {
      return true;
  }
}
