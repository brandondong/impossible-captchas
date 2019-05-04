const RESOURCES = "resources/";
const AUDIO = RESOURCES + "audio/";
const IMAGES = RESOURCES + "images/";

const PLAUSIBLE_IMAGE_QUESTIONS = [
  { question: { sentence: "Select all squares that contain", word: "hills" }, imagesFunc: () => _imageSet("egypt_hill", "jpg") },
  { question: { sentence: "Select all images that rhyme with", word: "orange" }, imagesFunc: () => _shuffleArray(_imageSet("orange", "jpg")) }
];

const IMPLAUSIBLE_IMAGE_QUESTIONS = [
  { question: { sentence: "Select all squares that contain the colour", word: "white" }, imagesFunc: () => _shuffleArray(_imageSet("white", "jpg"), 0, 14) },
  { question: { sentence: "Select all squares that contain", word: "animals" }, imagesFunc: () => _shuffleArray(_imageSet("animals", "jpg")) },
  { question: { sentence: "Select all squares that contain", word: "vegetables" }, imagesFunc: () => _shuffleArray(_imageSet("vegetables", "jpg")) },
  { question: { sentence: "Select all squares that contain", word: "vehicles" }, imagesFunc: () => _shuffleArray(_imageSet("vehicles", "jpg")) },
  { question: { sentence: "Select all squares that contain the colour", word: "red" }, imagesFunc: () => _imageSet("strawberries", "png") },
  { question: { sentence: "Select all squares that contain", word: "black dots" }, imagesFunc: () => _imageSet("grid_illusion", "png") },
  { question: { sentence: "Select squares where the <b>colour</b> of the text has", word: "five letters" }, imagesFunc: _stroopEffect }
];

const PLAUSIBLE_AUDIO_QUESTIONS = [
  { source: _audioPath("pair_pear.mp3") }
];

const IMPLAUSIBLE_AUDIO_QUESTIONS = [
  { source: _audioPath("poland.mp3") },
  { source: _audioPath("laurel_yanny.mp3") },
  { source: _audioPath("vinny.mp3") },
  { source: _audioPath("laugh.mp3") },
  { source: _audioPath("bark.mp3") },
  { source: _audioPath("fast.mp3") },
  { source: _audioPath("meatball_parade.mp3") }
];

// TODO randomize before joining evenly.

const IMAGE_QUESTIONS = joinEvenly(PLAUSIBLE_IMAGE_QUESTIONS, IMPLAUSIBLE_IMAGE_QUESTIONS);
const AUDIO_QUESTIONS = joinEvenly(PLAUSIBLE_AUDIO_QUESTIONS, IMPLAUSIBLE_AUDIO_QUESTIONS);

function joinEvenly(a1, a2) {
  const minLength = Math.min(a1.length, a2.length);
  const a1Each = Math.floor(a1.length / minLength);
  const a2Each = Math.floor(a2.length / minLength);
  let a1Extra = a1.length % minLength;
  let a2Extra = a2.length % minLength;
  const joined = [];
  let a1Index = 0;
  let a2Index = 0;
  for (let i = 0; i < minLength; i++) {
    for (let j = 0; j < a1Each; j++) {
      joined.push(a1[a1Index]);
      a1Index++;
    }
    if (a1Extra > 0) {
      joined.push(a1[a1Index]);
      a1Index++;
      a1Extra--;
    }
    for (let j = 0; j < a2Each; j++) {
      joined.push(a2[a2Index]);
      a2Index++;
    }
    if (a2Extra > 0) {
      joined.push(a2[a2Index]);
      a2Index++;
      a2Extra--;
    }
  }
  return joined;
}

function _imageSet(filename, ext) {
  const imageSet = [];
  for (let i = 0; i < 16; i++) {
    imageSet.push(`${IMAGES}${filename}/${i}.${ext}`);
  }
  return imageSet;
}

function _stroopEffect() {
  const images = _imageSet("stroop", "png");
  _shuffleArray(images, 0, 3);
  _shuffleArray(images, 4, 15);
  return images;
}

function _audioPath(filename) {
  return AUDIO + filename;
}

function _shuffleArray(array, start = 0, end = array.length - 1) {
  // Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array.
  for (let i = end - start; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const actualI = i + start;
    const actualJ = j + start;
    [array[actualI], array[actualJ]] = [array[actualJ], array[actualI]];
  }
  return array;
}

export { IMAGE_QUESTIONS, AUDIO_QUESTIONS };