/**
 * 7 given Numbers
 * 2 resulting correct numbers
 * Always ABCDE as answers options.
 * E is always no Match at all.
 */
export type algZfType = {
  givenNumbers: Array<number>,
  answers: Array<algZfAnswerType>,
};

export type algZfAnswerType = {
  answerOptionLetter: string,
  answers: string | {
    eighthNumber: number,
    ninthNumber: number,
  },
  correct: boolean
};
