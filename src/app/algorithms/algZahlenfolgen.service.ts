import {Injectable} from '@angular/core';
import {algZfAnswerType, algZfType} from "./typeAlgZF";
import {EDifficulty} from "../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class AlgZahlenfolgenService {
  //Constants for surrounding logic
  private _timeForAllTasksInSeconds: number = 15*60;
  private readonly _maxGivenNumbers: number = 7; //Not meant to be overwritten at the moment
  private readonly _maxGivenAnswers: number = 7; //Not meant to be overwritten at the moment
  private readonly _maxGivenAnswersOptions: number = 2; //Not meant to be overwritten at the moment

  // Constants defining the algorithm generation. Might be changeable in the future ####
  //All variables below difficulty are based on Default difficulty
  private _difficulty: EDifficulty = EDifficulty.DEFAULT; //TODO for later
  private _amountOfTasks: number = 10;
  private _nonCorrectAnswerIsCorrectProbability: number = 0.05;
  private _nonAnswerIsCorrect: boolean = false;
  private _nonAnswerString: string = "Keine Antwort ist richtig.";

  // Defines the maximum of jumps between two related numbers.
  private _relationMarginBetweenNumbersMaximum: number = 3;
  //Defines the maximum Number allowed, either in the question or in the answer. EXCEPTIONS are allowes
  private _highestNumber: number = 999;


  constructor() {}

  getTasks(_amountOfTasks_? :number) : Array<algZfType> {
    this.amountOfTasks = _amountOfTasks_??this.amountOfTasks;

    let result = [];


    for(let i = 0; i < this.amountOfTasks; i++) {
      result.push(this.addNewTask());
    }
    console.log(result);
    return result;
  }

  private addNewTask(): algZfType {
    let systemId: number = Math.floor(Math.random()*23);
    this.refreshNonAnswerIsCorrectChance();
    return this._taskGeneration[systemId]();
  }

  /**
   * System 1 - a+b=c b+c=d c+d=e ...
   *  For System 1 - 2 number are needed and the given numbers plus the answer numbers must be validated.
   *
   * @private
   */
  private generateUsingSystem0(): algZfType {
    //init result
    let result :algZfType = {
      answers: new Array<algZfAnswerType>(),
      givenNumbers: new Array<number>(),
      usedSystem: 1};

    //define a and b
    result.givenNumbers.push(this.getRandomNumberForTask(80)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(80)); //b
    //Define the rest of the given numbers
    let i = 0;
    while (result.givenNumbers.length < this.maxGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]+result.givenNumbers[i+1]);
      i++;
    }
    //Define the correct answer numbers
    const correctNumber1:number = result.givenNumbers[this.maxGivenNumbers - 2] + result.givenNumbers[this.maxGivenNumbers - 1];
    const correctNumber2:number = result.givenNumbers[this.maxGivenNumbers-1]+correctNumber1;

    //Construct result answers set
    //Add nonCorrectAnswer
    result.answers.push(this.buildAnswer(this.nonAnswerIsCorrect,'E'));
    if(!this.nonAnswerIsCorrect){
      result.answers.push(this.buildAnswer(true,this.getRandomRemainingLetter(result.answers),
        correctNumber1, correctNumber2));
    }
    //Fill the rest answer options by difficulty
    let numberList = [...result.givenNumbers,correctNumber1,correctNumber2];
    while (result.answers.length < this.maxGivenAnswers-2){
      let fakeA = this.getFakeAnswerValuesForCorrectValues(numberList,1,"+");
      result.answers.push(this.buildAnswer(false,this.getRandomRemainingLetter(result.answers),
        fakeA.eighthNumber,fakeA.ninthNumber));
    }
    return result;  //Not implmented yet
  }

  private generateUsingSystem1(): algZfType {
    return this._taskGeneration[1-1]();  //Not implmented yet
  }

  private generateUsingSystem2(): algZfType {
    return this._taskGeneration[2-1]();  //Not implmented yet
  }

  private generateUsingSystem3(): algZfType {
    return this._taskGeneration[3-1]();  //Not implmented yet
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
   * This method returns wrong answerOptions.
   * For EASY Difficulty, The answers options are random within a margin.
   * For DEFAULT The answers are generated by random operations of the given Values.
   * For HARD the answers are generated by Operation of the system but slightly wrong.
   * Operations can include the following strings: +-/*
   * @param fullNumberList
   * @param stepsInBetween
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

  get maxGivenNumbers(): number {
    return this._maxGivenNumbers;
  }

  get maxGivenAnswersOptions(): number {
    return this._maxGivenAnswersOptions;
  }

  get maxGivenAnswers(): number {
    return this._maxGivenAnswers;
  }

  get nonAnswerIsCorrect(): boolean {
    return this._nonAnswerIsCorrect;
  }

  set nonAnswerIsCorrect(value: boolean) {
    this._nonAnswerIsCorrect = value;
  }

  /**
   * This method should be called before each task
   * @private
   */
  private refreshNonAnswerIsCorrectChance(){
    this.nonAnswerIsCorrect = Math.random() <= this._nonCorrectAnswerIsCorrectProbability;
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
  private buildAnswer(correct: boolean, answerOptionLetter:string, eightNumber?:number, ninthNumber?: number): algZfAnswerType{
    return {
      answers: eightNumber && ninthNumber?{
        eighthNumber: eightNumber,
        ninthNumber: ninthNumber
      } : this.nonAnswerString ,
      correct: correct,
      answerOptionLetter: answerOptionLetter
    };
  }
}
