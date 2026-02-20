const IMAGE_OVERRIDES = {
  trumpet: "https://commons.wikimedia.org/wiki/Special:FilePath/Trumpet%201.jpg",
  trombone: "https://commons.wikimedia.org/wiki/Special:FilePath/Posaune.jpg",
  "french horn": "https://upload.wikimedia.org/wikipedia/commons/6/63/French_horn_front.png",
  tuba: "https://upload.wikimedia.org/wikipedia/commons/6/69/Tuba.png",
  flute: "https://commons.wikimedia.org/wiki/Special:FilePath/Western%20concert%20flute.jpg",
  clarinet: "https://commons.wikimedia.org/wiki/Special:FilePath/Yamaha_Clarinet_YCL-457II-22_%28rotated%29.jpg",
  saxophone: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Yamaha_YAS-25_Alto_Saxophone_20080502.jpg",
  oboe: "https://commons.wikimedia.org/wiki/Special:FilePath/Oboe%20modern.jpg",
  bassoon: "https://upload.wikimedia.org/wikipedia/commons/a/ab/FoxBassoon.jpg",
  violin: "https://commons.wikimedia.org/wiki/Special:FilePath/Violin%20VL100.png",
  cello: "https://commons.wikimedia.org/wiki/Special:FilePath/Cello%20front%20side.jpg",
  harp: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Harp_%28PSF%29.png",
  guitar: "https://upload.wikimedia.org/wikipedia/commons/4/45/GuitareClassique5.png",
  "snare drum": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Snare_Drum.jpg",
  "bass drum": "https://commons.wikimedia.org/wiki/Special:FilePath/Bass%20drum.jpg",
  cymbals: "https://upload.wikimedia.org/wikipedia/commons/4/49/2006-07-06_crash_paiste_16.jpg",
  xylophone: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXY1Y7funZmcWRhM6DDaGEgT8gOCKxzA8L6w&s",
  triangle: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Triangle_instrument.png",
  tambourine: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Tambourine_2_%28PSF%29.png",
  maracas: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Maracas.jpg",
};

const allInstruments = [
  { family: "Brass", name: "trumpet", funFact: "Has three buttons called valves." },
  { family: "Brass", name: "trombone", funFact: "Uses a long slide to change the sound." },
  { family: "Brass", name: "french horn", funFact: "The tubing is over 12 feet long if you uncurled it!" },
  { family: "Brass", name: "tuba", funFact: "The biggest and lowest sounding brass instrument." },
  { family: "Woodwind", name: "flute", funFact: "One of the only woodwinds you blow across instead of into." },
  { family: "Woodwind", name: "clarinet", funFact: "Uses a single wooden reed to make its sound." },
  { family: "Woodwind", name: "saxophone", funFact: "A shiny gold instrument used in jazz and rock music." },
  { family: "Woodwind", name: "oboe", funFact: "Uses a double reed and has a very clear piercing sound." },
  { family: "Woodwind", name: "bassoon", funFact: "A very tall woodwind that plays very low notes." },
  { family: "Strings", name: "violin", funFact: "The smallest string instrument held under the chin." },
  { family: "Strings", name: "cello", funFact: "Played while sitting down with the instrument on the floor." },
  { family: "Strings", name: "harp", funFact: "Has 47 strings and 7 pedals for the feet." },
  { family: "Strings", name: "guitar", funFact: "Has 6 strings and is very popular for campfire songs." },
  { family: "Percussion", name: "snare drum", funFact: "Has metal wires on the bottom that rattle." },
  { family: "Percussion", name: "bass drum", funFact: "The giant drum that provides the boom in a parade." },
  { family: "Percussion", name: "xylophone", funFact: "Has wooden bars that you hit with mallets." },
  { family: "Percussion", name: "cymbals", funFact: "Metal plates that make a loud crash when hit together." },
  { family: "Percussion", name: "triangle", funFact: "A metal instrument in the shape of a triangle." },
  { family: "Percussion", name: "tambourine", funFact: "A ring with little metal jingles that you shake." },
  { family: "Percussion", name: "maracas", funFact: "Shakers that usually come in a pair of two." },
].map((item) => ({
  ...item,
  image: IMAGE_OVERRIDES[item.name] || `assets/${item.name.replace(/\s+/g, "-")}.svg`,
}));

function shuffleInPlace(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
}

const startScreenEl = document.getElementById("start-screen");
const gameScreenEl = document.getElementById("game-screen");
const endScreenEl = document.getElementById("end-screen");
const familyButtons = Array.from(document.querySelectorAll(".family-button"));
const restartButton = document.getElementById("restart-button");
const finalSummaryEl = document.getElementById("final-summary");

const imageEl = document.getElementById("instrument-image");
const progressEl = document.getElementById("progress");
const statusEl = document.getElementById("status-message");
const listeningEl = document.getElementById("listening-indicator");
const speakButton = document.getElementById("speak-button");
const choicesPanelEl = document.getElementById("choices-panel");
const choicesGridEl = document.getElementById("choices-grid");
const factPanelEl = document.getElementById("fact-panel");
const factTextEl = document.getElementById("fact-text");
const nextButton = document.getElementById("next-button");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let activeInstruments = [];
let selectedFamily = "";
let currentIndex = 0;
let attemptCount = 0;
let score = 0;
let voiceCorrectCount = 0;
let isListening = false;
let finished = false;
let awaitingChoice = false;
let showingFact = false;
let roundAnswered = false;

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}

function getAcceptedAnswers(name) {
  const base = [normalize(name)];

  if (name === "cymbals") {
    base.push("cymbal", "symbol", "symbols");
  }

  return base;
}

function titleCase(value) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function setStatus(message, tone = "") {
  statusEl.textContent = message;
  statusEl.classList.remove("status-success", "status-warning");
  if (tone) {
    statusEl.classList.add(tone);
  }
}

function setListening(state) {
  isListening = state;
  listeningEl.hidden = !state;
  if (state) {
    speakButton.disabled = true;
    speakButton.textContent = "Listening...";
  } else {
    refreshSpeakButton();
  }
}

function refreshSpeakButton() {
  const disabled = finished || awaitingChoice || showingFact || roundAnswered;
  speakButton.disabled = disabled;
  if (disabled) {
    speakButton.textContent = "Start Speaking";
    return;
  }

  speakButton.textContent = `Start Speaking (Attempt ${attemptCount + 1} of 2)`;
}

function updateProgress() {
  progressEl.textContent = `${currentIndex + 1} of ${activeInstruments.length}`;
}

function updateImage() {
  imageEl.src = activeInstruments[currentIndex].image;
  imageEl.alt = "Instrument image";
}

function playCelebrationSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const ctx = new AudioContextClass();
  const notes = [523.25, 659.25, 783.99];
  const now = ctx.currentTime;

  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.0001, now + i * 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + i * 0.12 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now + i * 0.12);
    oscillator.stop(now + i * 0.12 + 0.11);
  });

  setTimeout(() => ctx.close(), 700);
}

function hideChoices() {
  awaitingChoice = false;
  choicesPanelEl.hidden = true;
  choicesGridEl.innerHTML = "";
}

function showChoices() {
  const current = activeInstruments[currentIndex];
  const allNames = activeInstruments.map((item) => item.name);
  const wrongOptions = allNames.filter((name) => name !== current.name);
  const options = [current.name];

  while (options.length < 4 && wrongOptions.length > 0) {
    const idx = Math.floor(Math.random() * wrongOptions.length);
    options.push(wrongOptions.splice(idx, 1)[0]);
  }

  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  choicesGridEl.innerHTML = "";
  options.forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = titleCase(name);
    button.addEventListener("click", () => {
      if (name === current.name) {
        handleCorrectAnswer("choice");
      } else {
        setStatus("Try another choice.", "status-warning");
      }
    });
    choicesGridEl.appendChild(button);
  });

  awaitingChoice = true;
  choicesPanelEl.hidden = false;
  setStatus("Two tries used. Pick the correct instrument to continue.", "status-warning");
  refreshSpeakButton();
}

function showFunFact() {
  const current = activeInstruments[currentIndex];
  factTextEl.textContent = `${titleCase(current.name)} fun fact: ${current.funFact}`;
  factPanelEl.hidden = false;
  showingFact = true;
  refreshSpeakButton();
}

function showEndScreen() {
  const maxScore = activeInstruments.length * 2;
  startScreenEl.hidden = true;
  gameScreenEl.hidden = true;
  endScreenEl.hidden = false;
  finalSummaryEl.textContent = `${selectedFamily} score: ${score} out of ${maxScore}. Voice wins: ${voiceCorrectCount} of ${activeInstruments.length}.`;
}

function beginRound() {
  attemptCount = 0;
  roundAnswered = false;
  showingFact = false;
  awaitingChoice = false;
  hideChoices();
  factPanelEl.hidden = true;
  updateProgress();
  updateImage();
  setStatus(`Tap \"Start Speaking\" when you are ready. ${selectedFamily} challenge.`);
  refreshSpeakButton();
}

function handleCorrectAnswer(method) {
  roundAnswered = true;
  setListening(false);
  hideChoices();

  if (method === "voice") {
    const pointsEarned = attemptCount === 0 ? 2 : 1;
    score += pointsEarned;
    voiceCorrectCount += 1;
  }

  playCelebrationSound();
  setStatus("Correct! Nice work.", "status-success");
  showFunFact();
}

function nextInstrument() {
  currentIndex += 1;

  if (currentIndex >= activeInstruments.length) {
    finished = true;
    showEndScreen();
    return;
  }

  beginRound();
}

function handleIncorrectAnswer() {
  setListening(false);
  attemptCount += 1;

  if (attemptCount < 2) {
    setStatus("Not quite. Tap Start Speaking and try again.", "status-warning");
    refreshSpeakButton();
    return;
  }

  showChoices();
}

function startListening() {
  if (!recognition || isListening || finished || awaitingChoice || showingFact || roundAnswered) {
    return;
  }

  try {
    recognition.start();
  } catch {
    setStatus("Microphone is busy. Tap Start Speaking again.", "status-warning");
  }
}

function setupRecognition() {
  if (!SpeechRecognition) {
    setStatus("Speech recognition is not supported in this browser.", "status-warning");
    speakButton.disabled = true;
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setListening(true);
    setStatus("Listening... say the instrument name.");
  };

  recognition.onresult = (event) => {
    const transcript = normalize(event.results[0][0].transcript || "");
    const acceptedAnswers = getAcceptedAnswers(activeInstruments[currentIndex].name);

    if (acceptedAnswers.some((answer) => transcript.includes(answer))) {
      handleCorrectAnswer("voice");
    } else {
      handleIncorrectAnswer();
    }
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      setListening(false);
      setStatus("Microphone permission is needed to play.", "status-warning");
      return;
    }

    if (!finished && !awaitingChoice && !showingFact && !roundAnswered) {
      setStatus("I did not catch that. Tap Start Speaking and try again.", "status-warning");
      refreshSpeakButton();
    }
  };

  recognition.onend = () => {
    setListening(false);
  };

  return true;
}

function ensureRecognition() {
  if (recognition) {
    return true;
  }
  return setupRecognition();
}

function showStartScreen() {
  startScreenEl.hidden = false;
  gameScreenEl.hidden = true;
  endScreenEl.hidden = true;
}

function startGame(family) {
  selectedFamily = family;
  const ready = ensureRecognition();
  if (!ready) {
    return;
  }

  activeInstruments = allInstruments.filter((item) => item.family === selectedFamily);
  shuffleInPlace(activeInstruments);

  currentIndex = 0;
  score = 0;
  voiceCorrectCount = 0;
  finished = false;

  startScreenEl.hidden = true;
  endScreenEl.hidden = true;
  gameScreenEl.hidden = false;

  beginRound();
}

familyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startGame(button.dataset.family);
  });
});

restartButton.addEventListener("click", showStartScreen);
speakButton.addEventListener("click", startListening);
nextButton.addEventListener("click", () => {
  if (!finished) {
    nextInstrument();
  }
});
