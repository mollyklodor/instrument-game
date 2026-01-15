import bassoonImg from "@assets/generated_images/professional_photograph_of_a_bassoon.png";
import clarinetImg from "@assets/generated_images/professional_photograph_of_a_clarinet.png";
import fluteImg from "@assets/generated_images/professional_photograph_of_a_flute.png";
import oboeImg from "@assets/generated_images/professional_photograph_of_an_oboe.png";
import saxophoneImg from "@assets/generated_images/professional_photograph_of_a_saxophone.png";

import trumpetImg from "@assets/generated_images/professional_photograph_of_a_trumpet.png";
import tromboneImg from "@assets/generated_images/professional_photograph_of_a_trombone.png";
import tubaImg from "@assets/generated_images/professional_photograph_of_a_tuba.png";
import frenchHornImg from "@assets/generated_images/professional_photograph_of_a_french_horn.png";

import violinImg from "@assets/generated_images/professional_photograph_of_a_violin.png";
import celloImg from "@assets/generated_images/professional_photograph_of_a_cello.png";
import harpImg from "@assets/generated_images/professional_photograph_of_a_harp.png";
import guitarImg from "@assets/generated_images/professional_photograph_of_a_guitar.png";

import snareDrumImg from "@assets/generated_images/professional_photograph_of_a_snare_drum.png";
import bassDrumImg from "@assets/generated_images/professional_photograph_of_a_bass_drum.png";
import xylophoneImg from "@assets/generated_images/professional_photograph_of_a_xylophone.png";
import cymbalsImg from "@assets/generated_images/professional_photograph_of_cymbals.png";
import triangleImg from "@assets/generated_images/professional_photograph_of_a_triangle_instrument.png";
import tambourineImg from "@assets/generated_images/professional_photograph_of_a_tambourine.png";
import maracasImg from "@assets/generated_images/professional_photograph_of_maracas.png";

export type InstrumentFamily = "Woodwinds" | "Brass" | "Strings" | "Percussion";

export interface Instrument {
  name: string;
  family: InstrumentFamily;
  emoji: string;
  image: string;
  funFact: string;
  alternatives?: string[];
}

export const FAMILIES: { key: string; label: InstrumentFamily; emoji: string; blurb: string }[] = [
  { key: "woodwinds", label: "Woodwinds", emoji: "🪈", blurb: "Flute, clarinet, saxophone and more" },
  { key: "brass", label: "Brass", emoji: "🎺", blurb: "Loud, shiny, and powerful sounds" },
  { key: "strings", label: "Strings", emoji: "🎻", blurb: "Pluck or bow to make music" },
  { key: "percussion", label: "Percussion", emoji: "🥁", blurb: "Tap, shake, strike—keep the beat" },
];

export const INSTRUMENTS: Instrument[] = [
  // Woodwinds
  { name: "flute", family: "Woodwinds", emoji: "🪈", image: fluteImg, funFact: "A flute makes sound when you blow across the top, like blowing over a bottle.", alternatives: [] },
  { name: "clarinet", family: "Woodwinds", emoji: "🎶", image: clarinetImg, funFact: "A clarinet uses a tiny reed that vibrates to make sound.", alternatives: ["clarnet"] },
  { name: "saxophone", family: "Woodwinds", emoji: "🎷", image: saxophoneImg, funFact: "A saxophone is made of metal, but it's still a woodwind because it uses a reed.", alternatives: ["sax"] },
  { name: "oboe", family: "Woodwinds", emoji: "🎶", image: oboeImg, funFact: "An oboe uses two reeds together—it's called a double reed.", alternatives: [] },
  { name: "bassoon", family: "Woodwinds", emoji: "🎶", image: bassoonImg, funFact: "A bassoon is a big woodwind with a low, warm sound.", alternatives: [] },

  // Brass
  { name: "trumpet", family: "Brass", emoji: "🎺", image: trumpetImg, funFact: "A trumpet uses three valves to change notes.", alternatives: ["horn", "bugle"] },
  { name: "trombone", family: "Brass", emoji: "🎺", image: tromboneImg, funFact: "A trombone uses a slide to make notes higher or lower.", alternatives: ["bone"] },
  { name: "tuba", family: "Brass", emoji: "🎺", image: tubaImg, funFact: "A tuba is the biggest brass instrument and makes very low notes.", alternatives: [] },
  { name: "french horn", family: "Brass", emoji: "📯", image: frenchHornImg, funFact: "A French horn has a long tube curled into a circle.", alternatives: ["horn"] },

  // Strings
  { name: "violin", family: "Strings", emoji: "🎻", image: violinImg, funFact: "A violin is played with a bow to make the strings vibrate.", alternatives: [] },
  { name: "cello", family: "Strings", emoji: "🎻", image: celloImg, funFact: "A cello is bigger than a violin and makes deeper notes.", alternatives: ["chello"] },
  { name: "harp", family: "Strings", emoji: "🎵", image: harpImg, funFact: "A harp has many strings you pluck with your fingers.", alternatives: [] },
  { name: "guitar", family: "Strings", emoji: "🎸", image: guitarImg, funFact: "A guitar makes sound when you strum or pluck its strings.", alternatives: [] },

  // Percussion
  { name: "snare drum", family: "Percussion", emoji: "🥁", image: snareDrumImg, funFact: "A snare drum has little wires underneath that buzz when you hit it.", alternatives: ["drum", "snare"] },
  { name: "bass drum", family: "Percussion", emoji: "🥁", image: bassDrumImg, funFact: "A bass drum makes a big BOOM sound and keeps the beat.", alternatives: [] },
  { name: "xylophone", family: "Percussion", emoji: "🎶", image: xylophoneImg, funFact: "A xylophone has bars you tap with mallets to make different notes.", alternatives: ["xylo phone"] },
  { name: "cymbals", family: "Percussion", emoji: "✨", image: cymbalsImg, funFact: "Cymbals crash together to make a bright, loud sound.", alternatives: ["symbols"] },
  { name: "triangle", family: "Percussion", emoji: "🔺", image: triangleImg, funFact: "A triangle is tapped with a metal beater to make a ringing sound.", alternatives: [] },
  { name: "tambourine", family: "Percussion", emoji: "🪘", image: tambourineImg, funFact: "A tambourine jingles when you shake or tap it.", alternatives: [] },
  { name: "maracas", family: "Percussion", emoji: "🪇", image: maracasImg, funFact: "Maracas are shakers filled with tiny beads or seeds.", alternatives: ["maraca"] },
];

export function familyFromParam(param: string | undefined): InstrumentFamily | "All" {
  if (!param) return "All";
  const p = param.toLowerCase();
  if (p === "woodwinds") return "Woodwinds";
  if (p === "brass") return "Brass";
  if (p === "strings") return "Strings";
  if (p === "percussion") return "Percussion";
  if (p === "all") return "All";
  return "All";
}

export function getInstrumentsForFamily(family: InstrumentFamily | "All"): Instrument[] {
  if (family === "All") return INSTRUMENTS;
  return INSTRUMENTS.filter((i) => i.family === family);
}
