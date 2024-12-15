import { Injectable } from '@angular/core';
import {algZfType} from "./typeAlgZF";

@Injectable({
  providedIn: 'root'
})
export class AlgZahlenfolgenService {
  // Constants defining the algorithm generation. Might be changeable in the future ####

  private amountOfTasks: number = 15;
  // Defines the maximum of jumps between two related numbers.
  private relationMarginBetweenNumbersMaximum: number = 3;


  constructor() { }

  getTasks(_amountOfTasks_? :number) : Array<algZfType> {
    this.amountOfTasks = _amountOfTasks_??this.amountOfTasks;

    let result = [];


    for(let i = 0; i < this.amountOfTasks; i++) {
      result.push(this.addNewTask());
    }
    return new Array<algZfType>();
  }

  private addNewTask(): algZfType {
    let systemId: number = Math.floor(Math.random()*23);
    return this.taskGeneration[systemId]();
  }

  /**
   * System 1 -
   * @private
   */
  private generateUsingSystem0(): algZfType {
    return {answers: [], givenNumbers: []};  //Not implmented yet
  }

  private generateUsingSystem1(): algZfType {
    return this.taskGeneration[1-1]();  //Not implmented yet
  }

  private generateUsingSystem2(): algZfType {
    return this.taskGeneration[2-1]();  //Not implmented yet
  }

  private generateUsingSystem3(): algZfType {
    return this.taskGeneration[3-1]();  //Not implmented yet
  }

  private generateUsingSystem4(): algZfType {
    return this.taskGeneration[4-1]();  //Not implmented yet
  }

  private generateUsingSystem5(): algZfType {
    return this.taskGeneration[5-1]();  //Not implmented yet
  }

  private generateUsingSystem6(): algZfType {
    return this.taskGeneration[6-1]();  //Not implmented yet
  }

  private generateUsingSystem7(): algZfType {
    return this.taskGeneration[7-1]();  //Not implmented yet
  }

  private generateUsingSystem8(): algZfType {
    return this.taskGeneration[8-1]();  //Not implmented yet
  }

  private generateUsingSystem9(): algZfType {
    return this.taskGeneration[9-1](); //Not implmented yet
  }

  private generateUsingSystem10(): algZfType {
    return this.taskGeneration[10-1](); //Not implmented yet
  }

  private generateUsingSystem11(): algZfType {
    return this.taskGeneration[11-1](); //Not implmented yet
  }

  private generateUsingSystem12(): algZfType {
    return this.taskGeneration[12-1](); //Not implmented yet
  }

  private generateUsingSystem13(): algZfType {
    return this.taskGeneration[13-1](); //Not implmented yet
  }

  private generateUsingSystem14(): algZfType {
    return this.taskGeneration[14-1](); //Not implmented yet
  }

  private generateUsingSystem15(): algZfType {
    return this.taskGeneration[15-1](); //Not implmented yet
  }

  private generateUsingSystem16(): algZfType {
    return this.taskGeneration[16-1](); //Not implmented yet
  }

  private generateUsingSystem17(): algZfType {
    return this.taskGeneration[17-1](); //Not implmented yet
  }

  private generateUsingSystem18(): algZfType {
    return this.taskGeneration[18-1](); //Not implmented yet
  }

  private generateUsingSystem19(): algZfType {
    return this.taskGeneration[19-1](); //Not implmented yet
  }

  private generateUsingSystem20(): algZfType {
    return this.taskGeneration[20-1](); //Not implmented yet
  }

  private generateUsingSystem21(): algZfType {
    return this.taskGeneration[21-1](); //Not implmented yet
  }

  private generateUsingSystem22(): algZfType {
    return this.taskGeneration[22-1](); //Not implmented yet
  }



  //Extended switch case mechanic
  private taskGeneration: (() => algZfType)[] = [
    () => this.generateUsingSystem0(),
    () => this.generateUsingSystem1(),
    () => this.generateUsingSystem2(),
    () => this.generateUsingSystem3(),
    () => this.generateUsingSystem4(),
    () => this.generateUsingSystem5(),
    () => this.generateUsingSystem6(),
    () => this.generateUsingSystem7(),
    () => this.generateUsingSystem8(),
    () => this.generateUsingSystem9(),
    () => this.generateUsingSystem10(),
    () => this.generateUsingSystem11(),
    () => this.generateUsingSystem12(),
    () => this.generateUsingSystem13(),
    () => this.generateUsingSystem14(),
    () => this.generateUsingSystem15(),
    () => this.generateUsingSystem16(),
    () => this.generateUsingSystem17(),
    () => this.generateUsingSystem18(),
    () => this.generateUsingSystem19(),
    () => this.generateUsingSystem20(),
    () => this.generateUsingSystem21(),
    () => this.generateUsingSystem22()
  ];
}
