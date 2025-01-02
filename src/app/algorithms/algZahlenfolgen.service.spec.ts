import { TestBed } from '@angular/core/testing';

import { AlgZahlenfolgenService } from './algZahlenfolgen.service';
import {algZfAnswer, algZfAnswerType, algZfType} from "./typeAlgZF";

describe('AlgZahlenfolgenService', () => {
  let service: AlgZahlenfolgenService;
  let amountGivenNumbers: number;
  let answerEString: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgZahlenfolgenService);
    amountGivenNumbers = service.amountGivenNumbers;
    answerEString = service.nonAnswerString;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test system 1', () => {
    let tasks = service.getTasks(1000,1);
    //assert length parameter works
    expect(tasks.length).toBe(1000);
    for(let task of tasks) {
      //assert systemId
      expect(task.usedSystem).toBe(1);
      //assert givenNumbers
      for(let i = 2; i < amountGivenNumbers; i++) {
        expect(task.givenNumbers[i]).toBe(task.givenNumbers[i-2]+task.givenNumbers[i-1]);
      }
      //Calculate correct Numbers:
      const correctNumber1:number =
        task.givenNumbers[amountGivenNumbers - 2]
        + task.givenNumbers[amountGivenNumbers - 1];
      const correctNumber2:number =
        task.givenNumbers[amountGivenNumbers-1]
        + correctNumber1;
      //Assert answer Array
      assertAnswers(task, correctNumber1, correctNumber2);

    }
  });

  it('should test system 2', () => {
    let tasks = service.getTasks(1000,2);
    //assert length parameter works
    expect(tasks.length).toBe(1000);
    for(let task of tasks) {
      //assert systemId
      expect(task.usedSystem).toBe(2);
      //assert givenNumbers
      for(let i = 3; i < amountGivenNumbers; i++) {
        expect(task.givenNumbers[i]).toBe(
          +task.givenNumbers[i-3]
          +task.givenNumbers[i-2]
          +task.givenNumbers[i-1]);
      }
      //Calculate correct Numbers: (Copy Paste from Alg)
      const correctNumber1:number =
        task.givenNumbers[amountGivenNumbers - 3]
        + task.givenNumbers[amountGivenNumbers - 2]
        + task.givenNumbers[amountGivenNumbers - 1];
      const correctNumber2:number =
        task.givenNumbers[amountGivenNumbers - 2]
        + task.givenNumbers[amountGivenNumbers - 1]
        + correctNumber1;

      //Assert answer Array (Always the same)
      assertAnswers(task, correctNumber1, correctNumber2);
    }
  });

  it('should test system 3', () => {
    const systemToTest= 3;
    let tasks = service.getTasks(1000,systemToTest);
    //assert length parameter works
    expect(tasks.length).toBe(1000);
    for(let task of tasks) {
      //assert systemId
      expect(task.usedSystem).toBe(systemToTest);
      //assert givenNumbers
      for(let i = 2; i < amountGivenNumbers; i++) {
        if(i%2 === 0){ //even
          expect(task.givenNumbers[i]).toBe(
            +task.givenNumbers[i-2]
            +task.givenNumbers[i-1]);
        }else {
          expect(task.givenNumbers[i]).toBe(
            +task.givenNumbers[i-1]
            -task.givenNumbers[i-2]);
        }
      }
      //Calculate correct Numbers: (Copy Paste from Alg)
      const correctNumber1:number =
        task.givenNumbers[amountGivenNumbers - 1]
        - task.givenNumbers[amountGivenNumbers - 2];
      const correctNumber2:number =
        task.givenNumbers[amountGivenNumbers - 1]
        + correctNumber1;

      //Assert answer Array (Always the same)
      assertAnswers(task, correctNumber1, correctNumber2);
    }
  });

  it('should test system 4', () => {
    const systemToTest= 4;
    let tasks = service.getTasks(1000,systemToTest);
    //assert length parameter works
    expect(tasks.length).toBe(1000);
    for(let task of tasks) {
      //assert systemId
      expect(task.usedSystem).toBe(systemToTest);
      //assert givenNumbers
      for(let i = 3; i < amountGivenNumbers; i++) {
          expect(task.givenNumbers[i]).toBe(
            +task.givenNumbers[i-3]
            +task.givenNumbers[i-1]);
      }
      //Calculate correct Numbers: (Copy Paste from Alg)
      const correctNumber1:number =
        task.givenNumbers[amountGivenNumbers - 1] //g
        + task.givenNumbers[amountGivenNumbers - 3]; //e
      const correctNumber2:number =
        correctNumber1 //h
        + task.givenNumbers[amountGivenNumbers - 2]; //f

      //Assert answer Array (Always the same)
      assertAnswers(task, correctNumber1, correctNumber2);
    }
  });

  function assertAnswers(task: algZfType, correctNumber1: number, correctNumber2: number) {
    //Assert one answer is marked correct and return it
    const correctAnswer = assertExactlyOneCorrect(task.answers);
    //Assert max one answer of type string
    assertMaxAnswersOfTypeStringIsOne(task.answers);
    let wrongAnswersWithoutE;
    if (correctAnswer[0].answers === answerEString) {
      //Case Answer E is correct
      //Assert Answer is E
      expect(correctAnswer[0].answerOptionLetter).toBe('E');
      //Filter correct answer out
      wrongAnswersWithoutE = task.answers.filter(a => a.answerOptionLetter !== 'E');
    } else {
      //Case Answer E is incorrect
      // Filter correct answer and answer E out
      wrongAnswersWithoutE = getWrongAnswersWithoutE(task);
    }
    assertWrongAnswersAreReallyWrong(wrongAnswersWithoutE, correctNumber1, correctNumber2);
  }
  function assertExactlyOneCorrect(answers: Array<algZfAnswerType>) {
    const shouldOnlyContainCorrectAnswer = answers.filter(a => a.correct);
    expect(shouldOnlyContainCorrectAnswer.length).toBe(1);
    return shouldOnlyContainCorrectAnswer;
  }
  function assertMaxAnswersOfTypeStringIsOne(answers: Array<algZfAnswerType>) {
    const noMoreThanOne = answers.filter(a => typeof a.answers === 'string');
    expect(noMoreThanOne.length).toBeLessThanOrEqual(1);
  }
  function getWrongAnswersWithoutE(task: algZfType) {
    return task.answers
      .filter(a => a.answerOptionLetter !== 'E')
      .filter(a => !a.correct);
  }
  function assertWrongAnswersAreReallyWrong(wrongAnswersWithoutE: algZfAnswerType[], correctNumber1: number, correctNumber2: number){
    wrongAnswersWithoutE.forEach((answer) => {
      let c1_equals = (<algZfAnswer>answer.answers).eighthNumber === correctNumber1;
      let c2_equals = (<algZfAnswer>answer.answers).ninthNumber === correctNumber2;
      //One match is allowed. Assert that not both are truthy
      expect(c1_equals && c2_equals).not.toBeTruthy();
    });
  }
});
