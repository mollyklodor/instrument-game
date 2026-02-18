# Instrument Pronunciation Practice

Elementary voice-practice web app using plain HTML/CSS/JS and the Web Speech API.

## Features

- Shows only the instrument image (no name shown before answer).
- Automatically starts listening after a 2-second delay.
- Gives 2 voice attempts per instrument.
- After 2 misses, shows multiple-choice options to continue.
- After correct answer, plays a celebration sound and shows a fun fact.
- Progress counter (`x of 20`).

## Instrument list source

Loaded from your Google Sheet:
- Brass: Trumpet, Trombone, French Horn, Tuba
- Woodwind: Flute, Clarinet, Saxophone, Oboe, Bassoon
- Strings: Violin, Cello, Harp, Guitar
- Percussion: Snare Drum, Bass Drum, Xylophone, Cymbals, Triangle, Tambourine, Maracas

## Run locally (Chromebook-friendly)

1. Open terminal in this folder:
   ```bash
   cd /Users/mollyklodor/Documents/GitHub/instrument-game/pronunciation-practice
   ```
2. Start local server:
   ```bash
   node server.js
   ```
3. Open in Chrome:
   `http://localhost:8080`

## Chromebook notes

- Best in Google Chrome.
- On first run, allow microphone permission.
- Use `localhost` (not `file://`) for reliable speech recognition.

## Replace placeholder images

All instrument placeholders are in `/assets`. Replace each file with a real image using the same filename, or update paths in `script.js`.
