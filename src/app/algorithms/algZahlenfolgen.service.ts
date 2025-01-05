import {Injectable} from '@angular/core';
import {algZfAnswerType, algZfType} from "./typeAlgZF";
import {EDifficulty, SettingsService} from "../services/settings.service";

@Injectable({
  providedIn: 'root'
})
export class AlgZahlenfolgenService {
  //Constants for surrounding logic
  private _timeForAllTasksInSeconds: number = 15*60;
  private readonly _amountGivenNumbers: number = 7; //Not meant to be overwritten at the moment. Not that it will produce logic errors (wrong - correct answers), if overwritten.
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
  //Defines the maximum Number allowed for creation of the calculation bas. EXCEPTIONS are allowed (See overwrites)
  private _highestNumber: number = 999;
  private _highestNumberOverwriteSystem1_2_3: number = 80;
  private _highestNumberOverwriteSystem4_7: number = 100;
  private _highestNumberOverwriteSystem5_9_10_11: number | undefined;
  private _highestNumberOverwriteSystem5_10_LAYER1: number = 75;
  private _highestNumberOverwriteSystem6 = 65;
  private _highestNumberOverwriteSystem6_LAYER1: number = 20;
  private _highestNumberOverwriteSystem8: number = 20;
  private _highestNumberOverwriteSystem9_11_LAYER1: number | undefined;
  private _highestNumberMultiplier: number = 10;
  private _highestNumberMultiplierOverwriteSystem6_LAYER1: number = 4;
  private _highestNumberMultiplierOverwriteSystem7_LAYER2: number | undefined;
  private _highestNumberMultiplierOverwriteSystem8_LAYER1: number = 8;
  private _highestNumberMultiplierOverwriteSystem9_10_LAYER1:  number | undefined;
  private _highestNumberMultiplierOverwriteSystem9_LAYER2: number = 6;


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
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4_7)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4_7)); //b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4_7)); //c
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

  /**
   * #### System 5 ## System 5 ## System 5 # System 5 ####
   * System 5 - a+j=b b+k=c c+l=d [j+k=l k+l=m ...]...
   */
  private generateUsingSystem4(): algZfType {
    //init result (id of result will be determined outside).#### System 5 ## System 5 ## System 5 # System 5 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 5};

    //define a, b and c #### System 5 ## System 5 ## System 5 # System 5 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let j = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //j
    let k = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //k

    //Define the rest of the given numbers  #### System 5 ## System 5 ## System 5 # System 5 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      //calculate b
      result.givenNumbers.push(result.givenNumbers[i]+j);
      //Calculate new k (l)
      let tmpK = j+k;
      //Shift left
      j = k;
      k = tmpK;
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 5 ## System 5 ## System 5 # System 5 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + j; //p
    const correctNumber2:number =
      correctNumber1 //h
      + k; //q

    //Construct result answers set  #### System 5 ## System 5 ## System 5 # System 5 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 5 ## System 5 ## System 5 # System 5 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 5 ## System 5 ## System 5 # System 5 #### END
  }

  /**
   * #### System 6 ## System 6 ## System 6 # System 6 ####
   * System 6 - a*x=b b+y=c c*x=d ...
   * OR       -  a*x=b b-y=c c*x=d ...
   */
  private generateUsingSystem5(): algZfType {
    //init result (id of result will be determined outside).#### System 6 ## System 6 ## System 6 # System 6 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 6};

    //define a, b and c #### System 6 ## System 6 ## System 6 # System 6 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem6)); //a
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem6_LAYER1); //x
    let y = this.getRandomNumberForTask(this.highestNumberOverwriteSystem6_LAYER1); //y
    //Randomise + or -
    y *= Math.random() > 0.5 ? 1:-1;
    //Define the rest of the given numbers  #### System 6 ## System 6 ## System 6 # System 6 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]*x);
      }else { //Odd
        result.givenNumbers.push(result.givenNumbers[i]+y);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 6 ## System 6 ## System 6 # System 6 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      * x;
    const correctNumber2:number =
      correctNumber1 //h
      + y;

    //Construct result answers set  #### System 6 ## System 6 ## System 6 # System 6 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 6 ## System 6 ## System 6 # System 6 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+*");
    return result;
    // #### System 6 ## System 6 ## System 6 # System 6 #### END
  }

  /**
   * #### System 7 ## System 7 ## System 7 # System 7 ####
   * System 7 - a+j=b b+k=c c+l=d ...
   *          - j+p=k k+2p=l ...
   */
  private generateUsingSystem6(): algZfType {
    //init result (id of result will be determined outside).#### System 7 ## System 7 ## System 7 # System 7 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 7};

    //define a, b and c #### System 7 ## System 7 ## System 7 # System 7 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem4_7)); //a
    let j = this.getRandomNumberForTask(this.highestNumberOverwriteSystem4_7); //j
    let p = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem7_LAYER2); //p

    //Define the rest of the given numbers  #### System 7 ## System 7 ## System 7 # System 7 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
        result.givenNumbers.push(result.givenNumbers[i]+j);
        j += p;
        p *= 2;
        i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 7 ## System 7 ## System 7 # System 7 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + j;
    const correctNumber2:number =
      correctNumber1 //h
      + j + p;

    //Construct result answers set  #### System 7 ## System 7 ## System 7 # System 7 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 7 ## System 7 ## System 7 # System 7 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 7 ## System 7 ## System 7 # System 7 #### END
  }

  /**
   * This System is fairly complicated to created, since no decimal values are allowed.
   * Therefore, the following variables will build the base for the generation
   *    a -> Being the standpoint for the System.
   *    z -> Being the higher one of x and z
   * Note that y is skipped to avoid decimals. For this to work, y must be the a common divisor.
   * So, y will be calculated.
   *
   * #### System 8 ## System 8 ## System 8 # System 8 ####
   * System 8 - a*x=b b/y=c c+z=d d*x=e ...
   */
  private generateUsingSystem7(): algZfType {
    //init result (id of result will be determined outside).#### System 8 ## System 8 ## System 8 # System 8 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 8};

    //define a, x and z #### System 8 ## System 8 ## System 8 # System 8 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem8)); //a
    let x = 0,y = 0,z = 0;
    while (Math.random() < 0.01){ //Low chance to allow y being one.
      x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem8_LAYER1); //x
      z = this.getRandomNumberForTask(this.highestNumberOverwriteSystem8,x); //z
      y = this.getGreatestCommonDivider(x,z);
      if(y!==1) break;
    }

    //Define the rest of the given numbers  #### System 8 ## System 8 ## System 8 # System 8 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%3===0){//First
        result.givenNumbers.push(result.givenNumbers[i]*x);
      } else if(i%3===1){ //Second
        result.givenNumbers.push(result.givenNumbers[i]/y);
      }else { //Third
        result.givenNumbers.push(result.givenNumbers[i]+z);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 8 ## System 8 ## System 8 # System 8 ####
    let correctNumber1:number;
    let correctNumber2:number;
    if(i%3===0){//First
      correctNumber1 = result.givenNumbers.push(result.givenNumbers[i]*x);
      correctNumber2 = correctNumber1/y;
    } else if(i%3===1){ //Second
      correctNumber1 = result.givenNumbers.push(result.givenNumbers[i]/y);
      correctNumber2 = correctNumber1+z;
    }else { //Third
      correctNumber1 = result.givenNumbers.push(result.givenNumbers[i]+z);
      correctNumber2 = correctNumber1*x;
    }

    //Construct result answers set  #### System 8 ## System 8 ## System 8 # System 8 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 8 ## System 8 ## System 8 # System 8 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "*/+");
    return result;
    // #### System 8 ## System 8 ## System 8 # System 8 #### END
  }

  /**
   * #### System 9 ## System 9 ## System 9 # System 9 ####
   * System 9 - a+j=b b+k=c c+l=d ...
   *          - j*x=l k*y=m ...
   */
  private generateUsingSystem8(): algZfType {
    //init result (id of result will be determined outside).#### System 9 ## System 9 ## System 9 # System 9 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 9};

    //define a, b and c #### System 9 ## System 9 ## System 9 # System 9 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let j = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //j
    let k = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //k
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_LAYER2); //x
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_LAYER2); //y

    //Define the rest of the given numbers  #### System 9 ## System 9 ## System 9 # System 9 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+j);
        j *= x;
      }else{ // Odd
        result.givenNumbers.push(result.givenNumbers[i]+k);
        k *= y;
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 9 ## System 9 ## System 9 # System 9 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + j; //p
    const correctNumber2:number =
      correctNumber1 //h
      + k; //q

    //Construct result answers set  #### System 9 ## System 9 ## System 9 # System 9 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 9 ## System 9 ## System 9 # System 9 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 9 ## System 9 ## System 9 # System 9 #### END
  }

  /**
   * #### System 10 ## System 10 ## System 10 # System 10 ####
   * System 10 - a+x=b b*y=c c+x=d ...
   *          - x++ y++...
   */
  private generateUsingSystem9(): algZfType {
    //init result (id of result will be determined outside).#### System 10 ## System 10 ## System 10 # System 10 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 10};

    //define a, b and c #### System 10 ## System 10 ## System 10 # System 10 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let x = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //x
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //y

    //Define the rest of the given numbers  #### System 10 ## System 10 ## System 10 # System 10 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+x);
        x++;
      }else{ // Odd
        result.givenNumbers.push(result.givenNumbers[i]*y);
        y++;
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 10 ## System 10 ## System 10 # System 10 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + x; //p
    const correctNumber2:number =
      correctNumber1 //h
      * y; //q

    //Construct result answers set  #### System 10 ## System 10 ## System 10 # System 10 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 10 ## System 10 ## System 10 # System 10 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+*");
    return result;
    // #### System 10 ## System 10 ## System 10 # System 10 #### END
  }

  /**
   * #### System 11 ## System 11 ## System 11 # System 11 ####
   * System 11 - a+x=b b-y=c c+x=d ...
   */
  private generateUsingSystem10(): algZfType {
    //init result (id of result will be determined outside).#### System 11 ## System 11 ## System 11 # System 11 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 10};

    //define a, b and c #### System 11 ## System 11 ## System 11 # System 11 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let y = this.getRandomNumberForTask(this.highestNumberOverwriteSystem9_11_LAYER1); //y
    let x = this.getRandomNumberForTask(this.highestNumberOverwriteSystem9_11_LAYER1,y); //x

    //Define the rest of the given numbers  #### System 11 ## System 11 ## System 11 # System 11 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+x);
      }else{ // Odd
        result.givenNumbers.push(result.givenNumbers[i]-y);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 11 ## System 11 ## System 11 # System 11 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + x;
    const correctNumber2:number =
      correctNumber1 //h
      - y;

    //Construct result answers set  #### System 11 ## System 11 ## System 11 # System 11 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 11 ## System 11 ## System 11 # System 11 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+-");
    return result;
    // #### System 11 ## System 11 ## System 11 # System 11 #### END
  }

  /**
   * #### System 12 ## System 12 ## System 12 # System 12 ####
   * System 12 - a+y=c b*x=d c+y=e ...
   */
  private generateUsingSystem11(): algZfType {
    //init result (id of result will be determined outside).#### System 12 ## System 12 ## System 12 # System 12 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 12};

    //define a, b and c #### System 12 ## System 12 ## System 12 # System 12 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //x
    let y = this.getRandomNumberForTask(this.highestNumberOverwriteSystem9_11_LAYER1); //y

    //Define the rest of the given numbers  #### System 12 ## System 12 ## System 12 # System 12 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+y);
      }else{ // Odd
        result.givenNumbers.push(result.givenNumbers[i]*x);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 12 ## System 12 ## System 12 # System 12 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + y;
    const correctNumber2:number =
      correctNumber1 //h
      * x;

    //Construct result answers set  #### System 12 ## System 12 ## System 12 # System 12 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 12 ## System 12 ## System 12 # System 12 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+*");
    return result;
    // #### System 12 ## System 12 ## System 12 # System 12 #### END
  }

  /**
   * #### System 13 ## System 13 ## System 13 # System 13 ####
   * System 13 - a+(j+ i*y)=c b-(i*z)=d c+j=e ...
   */
  private generateUsingSystem12(): algZfType {
    //init result (id of result will be determined outside).#### System 13 ## System 13 ## System 13 # System 13 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 13};

    //define a, b and c #### System 13 ## System 13 ## System 13 # System 13 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    let z = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //z //TODO This makes minusValues possible
    let j = this.getRandomNumberForTask(this.highestNumberOverwriteSystem9_11_LAYER1); //j
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //y

    //Define the rest of the given numbers  #### System 13 ## System 13 ## System 13 # System 13 ####
    let i = 0;
    let yMultiplier = 0; //First y is meant to be zero
    let zMultiplier = 1; //First z is meant to be z
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+ j + (yMultiplier*y));
        yMultiplier++;
      }else{ // Odd
        result.givenNumbers.push(result.givenNumbers[i]- zMultiplier * z);
        zMultiplier++;
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 13 ## System 13 ## System 13 # System 13 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1] //g
      + j;
    const correctNumber2:number =
      correctNumber1 //h
      - z;

    //Construct result answers set  #### System 13 ## System 13 ## System 13 # System 13 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 13 ## System 13 ## System 13 # System 13 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+*-");
    return result;
    // #### System 13 ## System 13 ## System 13 # System 13 #### END
  }

  /**
   * #### System 14 ## System 14 ## System 14 # System 14 ####
   * System 14 - a-b=c b-c=d c-d=e ...
   */
  private generateUsingSystem13(): algZfType {
    //init result (id of result will be determined outside).#### System 14 ## System 14 ## System 14 # System 14 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 14};

    //define a, b and c #### System 14 ## System 14 ## System 14 # System 14 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b

    //Define the rest of the given numbers  #### System 14 ## System 14 ## System 14 # System 14 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]-result.givenNumbers[i+1]);
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 14 ## System 14 ## System 14 # System 14 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      - result.givenNumbers[this.amountGivenNumbers - 1];
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      - correctNumber1;

    //Construct result answers set  #### System 14 ## System 14 ## System 14 # System 14 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 14 ## System 14 ## System 14 # System 14 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "-");
    return result;
    // #### System 14 ## System 14 ## System 14 # System 14 #### END
  }

  /**
   * #### System 15 ## System 15 ## System 15 # System 15 ####
   * System 15 - a+digitSum(a) = b    b + digitSum(b) = c
   */
  private generateUsingSystem14(): algZfType {
    //init result (id of result will be determined outside).#### System 15 ## System 15 ## System 15 # System 15 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 14};

    //define a, b and c #### System 15 ## System 15 ## System 15 # System 15 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    //Define the rest of the given numbers  #### System 15 ## System 15 ## System 15 # System 15 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]+this.getDigitSum(result.givenNumbers[i]));
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 15 ## System 15 ## System 15 # System 15 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + this.getDigitSum(result.givenNumbers[this.amountGivenNumbers - 1]);
    const correctNumber2:number =
      correctNumber1 + this.getDigitSum(correctNumber1);

    //Construct result answers set  #### System 15 ## System 15 ## System 15 # System 15 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 15 ## System 15 ## System 15 # System 15 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 15 ## System 15 ## System 15 # System 15 #### END
  }

  /**
   * #### System 16 ## System 16 ## System 16 # System 16 ####
   * System 16 - a-c=d  b-d=e  c-e=f ...
   */
  private generateUsingSystem15(): algZfType {
    //init result (id of result will be determined outside).#### System 16 ## System 16 ## System 16 # System 16 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 16};

    //define a, b and c #### System 16 ## System 16 ## System 16 # System 16 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //c
    //Define the rest of the given numbers  #### System 16 ## System 16 ## System 16 # System 16 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]-this.getDigitSum(result.givenNumbers[i+2]));
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 16 ## System 16 ## System 16 # System 16 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 3]
      - result.givenNumbers[this.amountGivenNumbers - 1];
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
    - correctNumber1;

    //Construct result answers set  #### System 16 ## System 16 ## System 16 # System 16 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 16 ## System 16 ## System 16 # System 16 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "-");
    return result;
    // #### System 16 ## System 16 ## System 16 # System 16 #### END
  }

  /**
   * #### System 17 ## System 17 ## System 17 # System 17 ####
   * System 17 - a+b=c  b-x=e  c+d=e ...
   */
  private generateUsingSystem16(): algZfType {
    //init result (id of result will be determined outside).#### System 17 ## System 17 ## System 17 # System 17 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 17};

    //define a, b and c #### System 17 ## System 17 ## System 17 # System 17 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    let x = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //x
    //Define the rest of the given numbers  #### System 17 ## System 17 ## System 17 # System 17 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //EVEN
        result.givenNumbers.push(result.givenNumbers[i]+this.getDigitSum(result.givenNumbers[i+1]));
      }else { //ODD
        result.givenNumbers.push(result.givenNumbers[i]-x);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 17 ## System 17 ## System 17 # System 17 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      - x;
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + correctNumber1;

    //Construct result answers set  #### System 17 ## System 17 ## System 17 # System 17 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 17 ## System 17 ## System 17 # System 17 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 17 ## System 17 ## System 17 # System 17 #### END
  }

  /**
   * #### System 18 ## System 18 ## System 18 # System 18 ####
   * System 18 - ax=d  b+x=e  cx=f ...
   */
  private generateUsingSystem17(): algZfType {
    //init result (id of result will be determined outside).#### System 18 ## System 18 ## System 18 # System 18 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 18};

    //define a, b and c #### System 18 ## System 18 ## System 18 # System 18 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_LAYER2); //x
    //Define the rest of the given numbers  #### System 18 ## System 18 ## System 18 # System 18 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2===0){ //EVEN
        result.givenNumbers.push(result.givenNumbers[i]*x);
      }else { //ODD
        result.givenNumbers.push(result.givenNumbers[i]+x);
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 18 ## System 18 ## System 18 # System 18 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 3]
      * x;
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      + x;

    //Construct result answers set  #### System 18 ## System 18 ## System 18 # System 18 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 18 ## System 18 ## System 18 # System 18 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "+");
    return result;
    // #### System 18 ## System 18 ## System 18 # System 18 #### END
  }

  /**
   * #### System 19 ## System 19 ## System 19 # System 19 ####
   * System 19 - a(x-i)=b ...
   */
  private generateUsingSystem18(): algZfType {
    //init result (id of result will be determined outside).#### System 19 ## System 19 ## System 19 # System 19 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 19};

    //define a, b and c #### System 19 ## System 19 ## System 19 # System 19 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1,6)+5; //x
    //Define the rest of the given numbers  #### System 19 ## System 19 ## System 19 # System 19 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
        result.givenNumbers.push(result.givenNumbers[i]*(x-i));
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 19 ## System 19 ## System 19 # System 19 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      * (x-i);
    i++;
    const correctNumber2:number =
      correctNumber1
      * (x-i);

    //Construct result answers set  #### System 19 ## System 19 ## System 19 # System 19 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 19 ## System 19 ## System 19 # System 19 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "*");
    return result;
    // #### System 19 ## System 19 ## System 19 # System 19 #### END
  }

  /**
   * What the fuck system:
   * #### System 20 ## System 20 ## System 20 # System 20 ####
   * System 20 - a+j=b b+k=c ...
   *            - j+r=k  k+s=l ...
   *            - r+(y*2^(î+1))=s
   */
  private generateUsingSystem19(): algZfType {
    //init result (id of result will be determined outside).#### System 20 ## System 20 ## System 20 # System 20 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 20};

    //define a, b and c #### System 20 ## System 20 ## System 20 # System 20 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    let j = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //j
    let r = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_10_LAYER1); //r
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //y
    //Define the rest of the given numbers  #### System 20 ## System 20 ## System 20 # System 20 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      result.givenNumbers.push(result.givenNumbers[i]+j);
      j += r; //j -> k
      r += y; //r -> s
      y *= 2; //y = y * (2^(i+1))
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 20 ## System 20 ## System 20 # System 20 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + j;
    const correctNumber2:number =
      correctNumber1
      + j + r;

    //Construct result answers set  #### System 20 ## System 20 ## System 20 # System 20 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 20 ## System 20 ## System 20 # System 20 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "*");
    return result;
    // #### System 20 ## System 20 ## System 20 # System 20 #### END
  }

  /**
   * #### System 21 ## System 21 ## System 21 # System 21 ####
   * System 21 - a+x=c b+y=d ...
   *            - x = x*z y = y*z
   */
  private generateUsingSystem20(): algZfType {
    //init result (id of result will be determined outside).#### System 21 ## System 21 ## System 21 # System 21 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 21};

    //define a, b and c #### System 21 ## System 21 ## System 21 # System 21 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b
    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //x
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //y
    let z = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //z
    //Define the rest of the given numbers  #### System 21 ## System 21 ## System 21 # System 21 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2==0){
        result.givenNumbers.push(result.givenNumbers[i]+x);
        x *= z;
      }else {
        result.givenNumbers.push(result.givenNumbers[i]+y);
        y *= z;
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 21 ## System 21 ## System 21 # System 21 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + y;
    const correctNumber2:number =
      correctNumber1
      + x;

    //Construct result answers set  #### System 21 ## System 21 ## System 21 # System 21 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 21 ## System 21 ## System 21 # System 21 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "*");
    return result;
    // #### System 21 ## System 21 ## System 21 # System 21 #### END
  }

  /**
   * What the fuck Part 2
   * #### System 22 ## System 22 ## System 22 # System 22 ####
   * System 22 - a+x=c by=d c-z=e d+m=f
   *            - x+a=z y+b=m z+c=n m+a=o ...
   */
  private generateUsingSystem21(): algZfType {
    //init result (id of result will be determined outside).#### System 22 ## System 22 ## System 22 # System 22 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 21};

    //define a, b and c #### System 22 ## System 22 ## System 22 # System 22 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b

    let x = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //x
    let y = this.getRandomMultiplierForTask(this.highestNumberMultiplierOverwriteSystem9_10_LAYER1); //y

    //Define the rest of the given numbers  #### System 22 ## System 22 ## System 22 # System 22 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2==0){ //Use x and
        if(i%3==0){ // add it. Then use a
          result.givenNumbers.push(result.givenNumbers[i]+x);
          x += result.givenNumbers[0]; //a
        }
        if(i%3==1){ // multiply it. Then use b
          result.givenNumbers.push(result.givenNumbers[i]*x);
          x += result.givenNumbers[1]; // b
        }
        if(i%3==2){ // subtract it. Then use c
          result.givenNumbers.push(result.givenNumbers[i]-x);
          x += result.givenNumbers[2]; // c
        }
      }else{ //Use y
        if(i%3==0){ // add it. Then use a
          result.givenNumbers.push(result.givenNumbers[i]+y);
          y += result.givenNumbers[0]; //a
        }
        if(i%3==1){ // multiply it. Then use b
          result.givenNumbers.push(result.givenNumbers[i]*y);
          y += result.givenNumbers[1]; // b
        }
        if(i%3==2){ // subtract it. Then use c
          result.givenNumbers.push(result.givenNumbers[i]-y);
          y += result.givenNumbers[2]; // c
        }
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 22 ## System 22 ## System 22 # System 22 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      - y;
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      + x;

    //Construct result answers set  #### System 22 ## System 22 ## System 22 # System 22 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 22 ## System 22 ## System 22 # System 22 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "**-");
    return result;
    // #### System 22 ## System 22 ## System 22 # System 22 #### END
  }

  /**
   * #### System 23 ## System 23 ## System 23 # System 23 ####
   * System 23 - a+x=c b-y=d c+z=e ...
   *            - x+q=z y-q=m
   */
  private generateUsingSystem22(): algZfType {
    //init result (id of result will be determined outside).#### System 23 ## System 23 ## System 23 # System 23 ####
    let result :algZfType = {id: -1,  answers: new Array<algZfAnswerType>(),givenNumbers: new Array<number>(),
      usedSystem: 21};

    //define a, b and c #### System 23 ## System 23 ## System 23 # System 23 ####
    //TODO Tweak Overwrite variables by testing what feels right.
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //a
    result.givenNumbers.push(this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11)); //b

    let x = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11); //x
    let y = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11); //y
    let q = this.getRandomNumberForTask(this.highestNumberOverwriteSystem5_9_10_11); //q

    //Define the rest of the given numbers  #### System 23 ## System 23 ## System 23 # System 23 ####
    let i = 0;
    while (result.givenNumbers.length < this.amountGivenNumbers){
      if(i%2==0){ //Even
        result.givenNumbers.push(result.givenNumbers[i]+x);
        x += q;
      }else{ //Odd
        result.givenNumbers.push(result.givenNumbers[i]+y);
        y -= q;
      }
      i++;
    }
    //Beware to cut off the end if more than one element gets pushed in the loop.

    //Define the correct answer numbers #### System 23 ## System 23 ## System 23 # System 23 ####
    const correctNumber1:number =
      result.givenNumbers[this.amountGivenNumbers - 2]
      - y;
    const correctNumber2:number =
      result.givenNumbers[this.amountGivenNumbers - 1]
      + x;

    //Construct result answers set  #### System 23 ## System 23 ## System 23 # System 23 ####
    //Add nonCorrectAnswer and correct answer (or only AnswerE if E is correct)
    result = this.constructionForAnswerE(result, correctNumber1, correctNumber2);
    //Fill the rest answer options by difficulty  #### System 23 ## System 23 ## System 23 # System 23 ####
    result = this.fillTheRestWithFakeAnswers(result, correctNumber1, correctNumber2, 2, "**-");
    return result;
    // #### System 23 ## System 23 ## System 23 # System 23 #### END
  }

  /**
   * This method returns a random number between 0 and this.highest number or overwriteUpperMax value if given.
   * It will not return a negative number since this.highestNumber can not be negative.
   * @param overwriteUpperMax
   * @param lowerLimit
   * @private
   */
  private getRandomNumberForTask(overwriteUpperMax?: number, lowerLimit?: number): number{
    let tmp = this.highestNumber;
    if(overwriteUpperMax) this.highestNumber = overwriteUpperMax;
    let res = lowerLimit && lowerLimit < this.highestNumber ?
                      Math.abs(Math.floor(Math.random() * (this.highestNumber-lowerLimit))) + lowerLimit : //If lower limit
                      Math.abs(Math.floor(Math.random()*this.highestNumber)); //If no lower limit
    this.highestNumber = tmp;
    return res;
  }

  /**
   * This method returns a random number between 0 and this.highest number or overwriteUpperMax value if given.
   * It will not return a negative number since this.highestNumber can not be negative.
   * @param overwriteUpperMax
   * @param lowerLimit
   * @private
   * @returns Non 0 Multiplier
   */
  private getRandomMultiplierForTask(overwriteUpperMax?: number, lowerLimit?: number): number{
    let tmp = this.highestNumberMultiplier;
    if(overwriteUpperMax) this.highestNumberMultiplier = overwriteUpperMax;
    let res = lowerLimit && lowerLimit < this.highestNumberMultiplier ?
      Math.abs(Math.floor(Math.random() * (this.highestNumberMultiplier-lowerLimit))) + lowerLimit : //If lower limit
      Math.abs(Math.floor(Math.random()*this.highestNumberMultiplier)); //If no lower limit
    this.highestNumberMultiplier = tmp;
    return res === 0? 1:res;
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

  get highestNumberOverwriteSystem4_7(): number {
    return this._highestNumberOverwriteSystem4_7;
  }

  set highestNumberOverwriteSystem4_7(value: number) {
    this._highestNumberOverwriteSystem4_7 = Math.abs(value);
  }

  get highestNumberOverwriteSystem5_9_10_11(): number | undefined{
    return this._highestNumberOverwriteSystem5_9_10_11;
  }

  set highestNumberOverwriteSystem5_9_10_11(value: number | undefined) {
    if(value)this._highestNumberOverwriteSystem5_9_10_11 = Math.abs(value);
  }

  get highestNumberOverwriteSystem5_10_LAYER1(): number{
    return this._highestNumberOverwriteSystem5_10_LAYER1;
  }

  set highestNumberOverwriteSystem5_10_LAYER1(value: number) {
    this._highestNumberOverwriteSystem5_10_LAYER1 = Math.abs(value);
  }

  get highestNumberOverwriteSystem6(): number{
    return this._highestNumberOverwriteSystem6;
  }

  set highestNumberOverwriteSystem6(value: number) {
    this._highestNumberOverwriteSystem6 = Math.abs(value);
  }

  get highestNumberOverwriteSystem6_LAYER1(): number{
    return this._highestNumberOverwriteSystem6_LAYER1;
  }

  set highestNumberOverwriteSystem6_LAYER1(value: number) {
    this._highestNumberOverwriteSystem6_LAYER1 = Math.abs(value);
  }

  get highestNumberOverwriteSystem8(): number{
    return this._highestNumberOverwriteSystem8;
  }

  set highestNumberOverwriteSystem8(value: number) {
    this._highestNumberOverwriteSystem8 = Math.abs(value);
  }

  get highestNumberOverwriteSystem9_11_LAYER1(): number | undefined{
    return this._highestNumberOverwriteSystem9_11_LAYER1;
  }

  set highestNumberOverwriteSystem9_11_LAYER1(value: number) {
    this._highestNumberOverwriteSystem9_11_LAYER1 = Math.abs(value);
  }
  //################## MULTIPLIER

  get highestNumberMultiplier(): number{
    return this._highestNumberMultiplier;
  }

  set highestNumberMultiplier(value: number) {
    this._highestNumberMultiplier = Math.abs(value);
  }

  get highestNumberMultiplierOverwriteSystem6_LAYER1(): number{
    return this._highestNumberMultiplierOverwriteSystem6_LAYER1;
  }

  set highestNumberMultiplierOverwriteSystem6_LAYER1(value: number) {
    this._highestNumberMultiplierOverwriteSystem6_LAYER1 = Math.abs(value);
  }

 get highestNumberMultiplierOverwriteSystem7_LAYER2(): number | undefined{
    return this._highestNumberMultiplierOverwriteSystem7_LAYER2;
  }

  set highestNumberMultiplierOverwriteSystem7_LAYER2(value: number) {
    this._highestNumberMultiplierOverwriteSystem7_LAYER2 = Math.abs(value);
  }

  get highestNumberMultiplierOverwriteSystem8_LAYER1(): number | undefined{
    return this._highestNumberMultiplierOverwriteSystem8_LAYER1;
  }

  set highestNumberMultiplierOverwriteSystem8_LAYER1(value: number) {
    this._highestNumberMultiplierOverwriteSystem8_LAYER1 = Math.abs(value);
  }

  get highestNumberMultiplierOverwriteSystem9_10_LAYER1(): number | undefined{
    return this._highestNumberMultiplierOverwriteSystem9_10_LAYER1;
  }

  set highestNumberMultiplierOverwriteSystem9_10_LAYER1(value: number) {
    this._highestNumberMultiplierOverwriteSystem9_10_LAYER1 = Math.abs(value);
  }

  get highestNumberMultiplierOverwriteSystem9_LAYER2(): number | undefined{
    return this._highestNumberMultiplierOverwriteSystem9_LAYER2;
  }

  set highestNumberMultiplierOverwriteSystem9_LAYER2(value: number) {
    this._highestNumberMultiplierOverwriteSystem9_LAYER2 = Math.abs(value);
  }

  //##########
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

  /**
   * If a or b is decimal, the decimal places will be thrown away.
   * @param a
   * @param b
   * @private
   * @returns The greatest divider of 2 numbers.
   */
  private getGreatestCommonDivider(a: number, b: number): number {
    const dividersA: number[] = this.getDividers(Math.abs(a));
    const dividersB: number[] = this.getDividers(Math.abs(b));

    let res = 1;
    for(const dividerA of dividersA) {
      for(const dividerB of dividersB) {
        if(dividerA === dividerB && dividerB > res) {
          res = dividerA;
        }
      }
    }
    return res;
  }

  /**
   *
   * @param num - decimals will be thrown away
   * @private
   * @returns all dividers including 1 and num
   */
  private getDividers(num: number): number[] {
    let res :number[] = [1];
    num = Math.floor(num);
    res.push(num);
    for(let i = Math.floor(num/2)+1; i > 1; i--){
      if(num%i === 0) res.push(i); //Divider found -> go to next i
    }
    return res;
  }

  /**
   * This method is performance horror.
   * It is limited to 1.000 iterations. This can be overwritten -> which will may lead to performance drops for a high start.
   * If start is above 1.000 it will return 2 as well, except the exceedMaximum is set
   * @returns Next prime number from param start or 2.
   */
  private getNextPrimeFrom(start?: number, exceedMaximum?: number): number{
    if(!start) return 2;
    if(!exceedMaximum) exceedMaximum = 1000;
    //Iter from start to exceedMaximum
    for(let i = start; i <= exceedMaximum; i++){
      //Iter backwards to find dividers
      for(let j = Math.floor(start/2)+2; j > 0; j--){
        if(j === 1) return i; //Non divider found -> isPrime.
        if(i%j === 0) break; //Divider found -> go to next i
      }
    }
    return 2;
  }

  /**
   *
   * @param num
   * @private
   * @returns The digit sum of the number.
   */
  private getDigitSum(num:number):number{
    let res = 0;
    while (num >= 10){
      res += num % 10;
      num = Math.floor(num / 10);
    }
    return res;
  }
}
