/**
 * 7 given Numbers
 * 2 resulting correct numbers
 * Always ABCDE as answers options.
 * E is always no Match at all.
 */
export type algZfType = {
  id: number,
  givenNumbers: Array<number>,
  answers: Array<algZfAnswerType>,
  usedSystem: number
};

export type algZfAnswerType = {
  answerOptionLetter: string,
  answers: string | algZfAnswer,
  correct: boolean
};

export type algZfAnswer = {
  eighthNumber: number,
  ninthNumber: number,
}
