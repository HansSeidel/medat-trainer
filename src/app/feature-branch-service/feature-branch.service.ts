import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureBranchService {

  constructor() { }

  getIsLoggedInByDefault(): boolean {
    return true;
  }
}
