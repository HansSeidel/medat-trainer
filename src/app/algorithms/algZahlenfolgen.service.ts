import {Injectable} from '@angular/core';
import {algZfAnswerType, algZfType} from "./typeAlgZF";
import {EDifficulty, SettingsService} from "../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class AlgZahlenfolgenService {
  //Constants for surrounding logic
  private _timeForAllTasksInSeconds: number = 15*60;
  private readonly _amountGivenNumbers: number = 7; //Not meant to be overwritten at the moment
  private readonly _amountGivenSolutionNumbers: number = 2; //Not meant to be overwritten at the moment
  private readonly _amountGivenAnswersOptions: number = 5; //Not meant to be overwritten at the moment

  // Constants defining the algorithm generation. Might be changeable in the future ####
  //All variables below difficulty are based on Default difficulty
  private _difficulty: EDifficulty = EDifficulty.DEFAULT; //TODO for later
  private _amountOfTasks: number = 10;
  private readonly _nonCorrectAnswerIsCorrectProbability: number = 0.05; // DEFINED AS SETTING
  private _nonAnswerIsCorrect: boolean = false;
  private _nonAnswerString: string = "Keine Antwort ist richtig.";

  // Defines the maximum of jumps between two related numbers.
  private _relationMarginBetweenNumbersMaximum: number = 3;
  //Defines the maximum Number allowed, either in the question or in the answer. EXCEPTIONS are allowes
  private _highestNumber: number = 999;
  private _highestNumberOverwriteSystem1_2_3: number = 80;
  private _highestNumberOverwriteSystem4: number = 100;


  constructor(public _settings: SettingsService) {}

  /**
   * Returns _amountOfTasks_ ZF tasks by a random chosen system.
   * Default of _amountOfTasks is 10.
   *
   * @param _amountOfTasks_
   * @param useSpecificSystem - This is just for testing purpose.
   */
  getTasks(_amountOfTasks_? :number, useSpecificSystem?: number) : Array<algZfType> {
    this.amountOfTasks = _amountOfTasks_??this.amountOfTasks;

    let result = [];


    for(let i = 0; i < this.amountOfTasks; i++) {
      let newTask = this.addNewTask(useSpecificSystem?useSpecificSystem-1:undefined);
      newTask.id = i;
      result.push(newTask);
    }
    //Sort solutions:
    result.forEach(task => {
      task.answers.sort((a, b) => a.answerOptionLetter.localeCompare(b.answerOptionLetter));
    });
    console.log("Generated tasks after request in algZahlefolgenService." +
      "\nBe careful, solutions included in object: ", result);
    return result;
  }

  private addNewTask(useSpecificSystemId?: number): algZfType {
    let systemId: number = useSpecificSystemId ?? Math.floor(Math.random()*23);
    return this._taskGeneration[systemId]();
  }

  /**
   * #### System 1 ## System 1 ## System 1 # System 1 ####
   * System 1 - a+b=c b+c=d c+d=e ...
   *  For System 1 - 2 number are needed and the given numbers plus the answer numbers must be validated.
   *
   * @private
   */
  private generateUsingSystem0(): algZfType {
    //init result (id of result will be determined outside). #### System 1 ## System 1 ## System 1 # System 1 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 1};

    //define a and b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //b
    //Define the rest of the given numbers  #### System 1 ## System 1 ## System 1 # System 1 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]+result.givenNumbers[i+1]);
      i++;
    }
    //Define the correct answer numbers #### System 1 ## System 1 ## System 1 # System 1 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      + result.givenNumbers[this.amountGivenNumbers - 1];
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers-1]
      + correctNumber1;

    //Construct result answers set  #### System 1 ## System 1 ## System 1 # System 1 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result,correctNumber1,correctNumber2)
    //Fill the rest answer options by difficulty  #### System 1 ## System 1 ## System 1 # System 1 ####
    result = this.fillTheRestWithFakeAnswers(result,correctNumber1,correctNumber2,1,"+");
    return result;
    // #### System 1 ## System 1 ## System 1 # System 1 #### END
  }

  /**
   * #### System 2 ## System 2 ## System 2 # System 2 ####
   * System 2 - a+b+c=d b+c+d=e c+d+e=f ...
   */
  private generateUsingSystem1(): algZfType {
    //init result (id of result will be determined outside).#### System 2 ## System 2 ## System 2 # System 2 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 2};

    //define a and b and c #### System 2 ## System 2 ## System 2 # System 2 ####
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //c
    //Define the rest of the given numbers  #### System 2 ## System 2 ## System 2 # System 2 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]+result.givenNumbers[i+1]+result.givenNumbers[i+2]);
      i++;
    }
    //Define the correct answer numbers #### System 2 ## System 2 ## System 2 # System 2 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 3]
      + result.givenNumbers[this.amountGivenNumbers - 2]
      + result.givenNumbers[this.amountGivenNumbers - 1];
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      + result.givenNumbers[this.amountGivenNumbers - 1]
      + correctNumber1;

    //Construct result answers set  #### System 2 ## System 2 ## System 2 # System 2 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 2 ## System 2 ## System 2 # System 2 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 2 ## System 2 ## System 2 # System 2 #### END
  }

  /**
   * #### System 3 ## System 3 ## System 3 # System 3 ####
   * System 3 - a+b=c c-b=d d+c=e ...
   */
  private generateUsingSystem2(): algZfType {
    //init result (id of result will be determined outside).#### System 3 ## System 3 ## System 3 # System 3 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 3};

    //define a and b #### System 3 ## System 3 ## System 3 # System 3 ####
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem1_2_3)); //b
    //Define the rest of the given numbers  #### System 3 ## System 3 ## System 3 # System 3 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2 === 0){
        //Even a+b = c    |   c+d = e
        result.givenNumbers.push(result.givenNumbers[i]+result.givenNumbers[i+1]);
      }else {
        //Odd c-b = d     | e-d = f
        result.givenNumbers.push(result.givenNumbers[i+1]-result.givenNumbers[i]);
      }
      i++;
    }
    //Define the correct answer numbers #### System 3 ## System 3 ## System 3 # System 3 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      - result.givenNumbers[this.amountGivenNumbers - 2];
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + correctNumber1;

    //Construct result answers set  #### System 3 ## System 3 ## System 3 # System 3 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 3 ## System 3 ## System 3 # System 3 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+-");
    return result;
    // #### System 3 ## System 3 ## System 3 # System 3 #### END
  }

  /**
   * #### System 4 ## System 4 ## System 4 # System 4 ####
   * System 4 - a+c=d b+d=e c+e=f ...
   */
  private generateUsingSystem3(): algZfType {
    //init result (id of result will be determined outside).#### System 4 ## System 4 ## System 4 # System 4 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 4};

    //define a, b and c #### System 4 ## System 4 ## System 4 # System 4 ####
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4)); //b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4)); //c
    //Define the rest of the given numbers  #### System 4 ## System 4 ## System 4 # System 4 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
        //Even a+c = d
        result.givenNumbers.push(result.givenNumbers[i]+result.givenNumbers[i+2]);
      i++;
    }
    //Define the correct answer numbers #### System 4 ## System 4 ## System 4 # System 4 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + result.givenNumbers[this.amountGivenNumbers - 3]; //e
    const correctNumber2:number =
      correctNumber1 //h
      + result.givenNumbers[this.amountGivenNumbers - 2]; //f

    //Construct result answers set  #### System 4 ## System 4 ## System 4 # System 4 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 4 ## System 4 ## System 4 # System 4 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 4 ## System 4 ## System 4 # System 4 #### END
  }

  private generateUsingSystem4(): algZfType {
    return this._taskGeneration[4-1]();  //Not implmented yet
  }

  private generateUsingSystem5(): algZfType {
    return this._taskGeneration[5-1]();  //Not implmented yet
  }

  private generateUsingSystem6(): algZfType {
    return this._taskGeneration[6-1]();  //Not implmented yet
  }

  private generateUsingSystem7(): algZfType {
    return this._taskGeneration[7-1]();  //Not implmented yet
  }

  private generateUsingSystem8(): algZfType {
    return this._taskGeneration[8-1]();  //Not implmented yet
  }

  private generateUsingSystem9(): algZfType {
    return this._taskGeneration[9-1](); //Not implmented yet
  }

  private generateUsingSystem10(): algZfType {
    return this._taskGeneration[10-1](); //Not implmented yet
  }

  private generateUsingSystem11(): algZfType {
    return this._taskGeneration[11-1](); //Not implmented yet
  }

  private generateUsingSystem12(): algZfType {
    return this._taskGeneration[12-1](); //Not implmented yet
  }

  private generateUsingSystem13(): algZfType {
    return this._taskGeneration[13-1](); //Not implmented yet
  }

  private generateUsingSystem14(): algZfType {
    return this._taskGeneration[14-1](); //Not implmented yet
  }

  private generateUsingSystem15(): algZfType {
    return this._taskGeneration[15-1](); //Not implmented yet
  }

  private generateUsingSystem16(): algZfType {
    return this._taskGeneration[16-1](); //Not implmented yet
  }

  private generateUsingSystem17(): algZfType {
    return this._taskGeneration[17-1](); //Not implmented yet
  }

  private generateUsingSystem18(): algZfType {
    return this._taskGeneration[18-1](); //Not implmented yet
  }

  private generateUsingSystem19(): algZfType {
    return this._taskGeneration[19-1](); //Not implmented yet
  }

  private generateUsingSystem20(): algZfType {
    return this._taskGeneration[20-1](); //Not implmented yet
  }

  private generateUsingSystem21(): algZfType {
    return this._taskGeneration[21-1](); //Not implmented yet
  }

  private generateUsingSystem22(): algZfType {
    return this._taskGeneration[22-1](); //Not implmented yet
  }

  /**
   * This method returns a random number between 0 and this.highest number or overwriteUpperMax value if given.
   * It will not return a negative number since this.highestNumber can not be negative.
   * @param overwriteUpperMax
   * @private
   */
  private getRandomNumberForTask(overwriteUpperMax?: number): number{
    let tmp = this.highestNumber;
    if(overwriteUpperMax) this.highestNumber = overwriteUpperMax;
    let res = Math.floor(Math.random()*this.highestNumber);
    this.highestNumber = tmp;
    return res;
  }

  /**
   * This method will return a random letter from the pool of: "A;B;C;D;E".
   * The given answerList will be used to reduce the list of possible answers.
   * @param answerList
   * @private
   */
  private getRandomRemainingLetter(answerList:  algZfAnswerType[]) : string {
    let letters = ['A','B','C','D','E'];
    let alreadyContained = answerList.map(a => a.answerOptionLetter);
    let res = letters.sort(() => Math.random() - 0.5).filter(l => !alreadyContained.includes(l)).pop();
    return res ?? 'U';
  }

  /**
   * This method refreshes the probability for Answer E being correct.
   * Afterward it will either push E as correct answer and finish OR
   * it will push E as incorrect and push the correct numbers with a random letter.
   *
   * @param result
   * @param correctNumber1
   * @param correctNumber2
   * @private
   */
  private constructionForAnswerE(result: algZfType, correctNumber1: number, correctNumber2: number) {
    this.refreshNonAnswerIsCorrectChance();
    result.answers.push(this.buildAnswer(this.nonAnswerIsCorrect, 'E', false));
    if (!this.nonAnswerIsCorrect) {
      result.answers.push(this.buildAnswer(true, this.getRandomRemainingLetter(result.answers), true,
        correctNumber1, correctNumber2));
    }
    return result;
  }

  /**
   * This method is the preperation step for the method: getFakeAnswerValuesForCorrectValues
   * @param result
   * @param correctNumber1
   * @param correctNumber2
   * @param stepsInBetween From first to result - how many steps in between? (Example: a+b+c=d -> b & c are in between, so 2)
   * @param operations look at getFakeAnswerValuesForCorrectValues
   * @private
   */
  private fillTheRestWithFakeAnswers(result: algZfType, correctNumber1: number, correctNumber2: number, stepsInBetween: number, operations: string) {
    let numberList = [...result.givenNumbers, correctNumber1, correctNumber2];
    while (result.answers.length < this.amountGivenAnswersOptions) {
      let fakeA = this.getFakeAnswerValuesForCorrectValues(numberList, stepsInBetween, operations);
      result.answers.push(this.buildAnswer(false, this.getRandomRemainingLetter(result.answers), true,
        fakeA.eighthNumber, fakeA.ninthNumber));
    }
    return result;
  }

  /**
   * This method returns wrong answerOptions.
   * For EASY Difficulty, The answers options are random within a margin.
   * For DEFAULT The answers are generated by random operations of the given Values.
   * For HARD the answers are generated by Operation of the system but slightly wrong.
   * Operations can include the following strings: +-/*
   * @param fullNumberList
   * @param stepsInBetween From first to result - how many steps in between? (Example: a+b+c=d -> b & c are in between, so 2)
   * @param operations
   * @private
   */
  private getFakeAnswerValuesForCorrectValues(
    fullNumberList: Array<number>,
    stepsInBetween: number,
    operations: string,
    recursion: number = 0) : { eighthNumber: number, ninthNumber: number}  {
    let availableOperations = "+-/*";
    //Define resulting variables:
    let numberEight: number = 0;
    let numberNine: number = 0;
    //Input safety:
    stepsInBetween = stepsInBetween > this.relationMarginBetweenNumbersMaximum || stepsInBetween < 0 ? 0:stepsInBetween;
    //Operations
    let operationFunction = (operation?: string):number => {
      let n = Math.floor(Math.random()*this.relationMarginBetweenNumbersMaximum);
      switch (operation) {
        case '+':return fullNumberList[n] + fullNumberList[n+stepsInBetween];
        case '-':return fullNumberList[n] - fullNumberList[n+stepsInBetween];
        case '*':return fullNumberList[n] * fullNumberList[n+stepsInBetween];
        case '/':return Math.floor(fullNumberList[n] / fullNumberList[n+stepsInBetween])+1; //No 0 value
        default: return this.getRandomNumberForTask();
      }
    };
    if(this.difficulty === EDifficulty.HARD){
      if(operations.includes('+')){
        numberEight = operationFunction('-');
        numberNine = operationFunction('+');
      }
    }else if(this.difficulty === EDifficulty.DEFAULT){
      numberEight = operationFunction(availableOperations.charAt(Math.floor(Math.random()*availableOperations.length)));
      numberNine = operationFunction(availableOperations.charAt(Math.floor(Math.random()*availableOperations.length)));
    }else {
      numberEight = operationFunction();
      numberNine = operationFunction();
    }
    if(numberEight === fullNumberList[fullNumberList.length-2]
      && numberNine === fullNumberList[fullNumberList.length-1]){
      if(recursion > 100){
        console.error("Preventing endless loop Inside of FakeAnswerMethod for ZF Algorithm throw returning -1,-1. Most unlikely scenario.");
        return {eighthNumber:-1,ninthNumber:-1};
      }
      return this.getFakeAnswerValuesForCorrectValues(fullNumberList,stepsInBetween,operations,recursion++);
    }
    return {ninthNumber:Math.abs(numberNine), eighthNumber:Math.abs(numberEight)};
  }

  //Extended switch case mechanic
  private _taskGeneration: (() => algZfType)[] = [
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

  get timeForAllTasksInSeconds(): number {
    return this._timeForAllTasksInSeconds;
  }

  set timeForAllTasksInSeconds(value: number) {
    this._timeForAllTasksInSeconds = value;
  }

  get difficulty(): EDifficulty {
    return this._difficulty;
  }

  set difficulty(value: EDifficulty) {
    this._difficulty = value;
  }

  get amountOfTasks(): number {
    return this._amountOfTasks;
  }

  set amountOfTasks(value: number) {
    this._amountOfTasks = value;
  }

  get relationMarginBetweenNumbersMaximum(): number {
    return this._relationMarginBetweenNumbersMaximum;
  }

  get highestNumber(): number {
    switch (this.difficulty){
      case EDifficulty.DEFAULT: return this._highestNumber;
      case EDifficulty.EASY: return Math.floor(this._highestNumber/2);
      case EDifficulty.HARD: return Math.floor(this._highestNumber*2);
    }
  }

  set highestNumber(value: number) {
    this._highestNumber = Math.abs(value);
  }

  get highestNumberOverwriteSystem1_2_3(): number {
    return this._highestNumberOverwriteSystem1_2_3;
  }

  set highestNumberOverwriteSystem1_2_3(value: number) {
    this._highestNumberOverwriteSystem1_2_3 = Math.abs(value);
  }

  get highestNumberOverwriteSystem4(): number {
    return this._highestNumberOverwriteSystem4;
  }

  set highestNumberOverwriteSystem4(value: number) {
    this._highestNumberOverwriteSystem4 = Math.abs(value);
  }

  get amountGivenNumbers(): number {
    return this._amountGivenNumbers;
  }

  get amountGivenAnswersOptions(): number {
    return this._amountGivenAnswersOptions;
  }

  get amountGivenSolutionNumbers(): number {
    return this._amountGivenSolutionNumbers;
  }

  get nonAnswerIsCorrect(): boolean {
    return this._nonAnswerIsCorrect;
  }

  set nonAnswerIsCorrect(value: boolean) {
    this._nonAnswerIsCorrect = value;
  }

  get nonCorrectAnswerIsCorrectProbability(): number {
    if(typeof this._settings.kffZfTaskSettingProbabilityAnswerEIsCorrect.model !== "number"){
      console.error("TYPE ERROR WITH: _settings.kffZfTaskSettingProbabilityAnswerEIsCorrect." +
        "\nReturning 0.05 instead of setting.");
      return 0.05;
    }
    return <number>this._settings.kffZfTaskSettingProbabilityAnswerEIsCorrect.model;
  }

  /**
   * This method should be called before each task
   * @private
   */
  private refreshNonAnswerIsCorrectChance(){
    this.nonAnswerIsCorrect = Math.random() <= this.nonCorrectAnswerIsCorrectProbability;
  }

  get nonAnswerString(): string {
    return this._nonAnswerString;
  }

  /**
   * Leave eightNumber and NinthNumber empty to use nonCorrectAnswer
   * @param correct
   * @param answerOptionLetter
   * @param eightNumber
   * @param ninthNumber
   * @private
   */
  private buildAnswer(correct: boolean, answerOptionLetter:string, answerAreNumbers: boolean, eightNumber?:number, ninthNumber?: number): algZfAnswerType{
    return {
      answers: answerAreNumbers ? {
        eighthNumber: eightNumber??-1,
        ninthNumber: ninthNumber??-1
      } : this.nonAnswerString ,
      correct: correct,
      answerOptionLetter: answerOptionLetter
    };
  }
}
