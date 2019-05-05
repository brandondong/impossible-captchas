import { IMAGE_QUESTIONS, AUDIO_QUESTIONS } from "./resources";

export default class CaptchaManager {
  constructor() {
    this._isImageMode = true;
    this.numImageQuestionsAnswered = -1;
    this.numAudioQuestionsAnswered = -1;
  }

  nextQuestion() {
    if (this._isImageMode) {
      this.numImageQuestionsAnswered++;
    } else {
      this.numAudioQuestionsAnswered++;
    }
    const hasImageQuestions = this._hasImageQuestionsLeft();
    const hasAudioQuestions = this._hasAudioQuestionsLeft();
    if (!hasImageQuestions && !hasAudioQuestions) {
      return;
    }
    if (!hasAudioQuestions || (this._isImageMode && hasImageQuestions)) {
      this._isImageMode = true;
      const questionDetails = this._nextQuestionDetail(IMAGE_QUESTIONS, this.numImageQuestionsAnswered);
      const question = questionDetails.question;
      const images = questionDetails.imagesFunc();
      return { question: question, images: images };
    } else {
      this._isImageMode = false;
      const questionDetails = this._nextQuestionDetail(AUDIO_QUESTIONS, this.numAudioQuestionsAnswered);
      const question = { sentence: "Listen to the audio and type the", word: "words" };
      const source = questionDetails.source;
      return { question: question, source: source };
    }
  }

  canSwithQuestionTypes() {
    if (this._isImageMode) {
      return this.numImageQuestionsAnswered >= 3 && this._hasAudioQuestionsLeft();
    }
    return this.numAudioQuestionsAnswered >= 3 && this._hasImageQuestionsLeft();
  }

  switchQuestionTypes() {
    this._isImageMode = !this._isImageMode;
  }

  isImageMode() {
    return this._isImageMode;
  }

  numQuestionsAnswered() {
    return this.numAudioQuestionsAnswered + this.numImageQuestionsAnswered;
  }

  _hasImageQuestionsLeft() {
    return this.numImageQuestionsAnswered < IMAGE_QUESTIONS.length;
  }

  _hasAudioQuestionsLeft() {
    return this.numAudioQuestionsAnswered < AUDIO_QUESTIONS.length;
  }

  _nextQuestionDetail(a, numAnswered) {
    if (numAnswered >= a.length) {
      return a[a.length - 1];
    }
    return a[numAnswered];
  }
}