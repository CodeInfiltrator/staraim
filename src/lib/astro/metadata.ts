/**
 * Editorial metadata for the objects Staraim can identify.
 * Kept separate from the raw catalogue so the catalogue stays compact.
 */

export interface ObjectMeta {
  name: string;
  category: string;
  blurb: string;
  description: string;
  facts: Record<string, string>;
}

export const PLANET_META: Record<string, ObjectMeta> = {
  Mercury: {
    name: "Mercury",
    category: "Planet",
    blurb: "The smallest planet, and the fastest traveller around the Sun.",
    description:
      "Mercury is a cratered, airless world of extreme temperatures — swinging from 430 °C in sunlight to −180 °C at night. It completes an orbit in just 88 days.",
    facts: { "Distance from Sun": "0.39 AU", Radius: "2,440 km", "Orbital period": "88 days", Moons: "0" },
  },
  Venus: {
    name: "Venus",
    category: "Planet",
    blurb: "The brightest planet in our night sky.",
    description:
      "Wrapped in a dense carbon-dioxide atmosphere, Venus is the hottest planet in the solar system. Its thick cloud deck reflects sunlight, making it shine as the evening or morning star.",
    facts: { "Distance from Sun": "0.72 AU", Radius: "6,052 km", "Orbital period": "225 days", Moons: "0" },
  },
  Mars: {
    name: "Mars",
    category: "Planet",
    blurb: "The red planet — home to Olympus Mons, the tallest volcano known.",
    description:
      "Mars is a cold desert world with a thin atmosphere, enormous volcanoes and deep canyon systems. Rusty iron oxide gives its surface its familiar red hue.",
    facts: { "Distance from Sun": "1.52 AU", Radius: "3,390 km", "Orbital period": "687 days", Moons: "2" },
  },
  Jupiter: {
    name: "Jupiter",
    category: "Planet",
    blurb: "The largest planet in our solar system.",
    description:
      "Jupiter is a gas giant of turbulent bands and swirling storms. Its Great Red Spot is a hurricane that has raged for centuries, and its magnetosphere is the strongest in the solar system.",
    facts: { "Distance from Sun": "5.20 AU", Radius: "69,911 km", "Orbital period": "11.9 years", Moons: "95" },
  },
  Saturn: {
    name: "Saturn",
    category: "Planet",
    blurb: "The ringed planet — a disc of ice and rock a quarter of a million km across.",
    description:
      "Saturn's rings are made of countless particles of water ice, from dust grains to house-sized boulders. The planet itself is so light that it would float in water.",
    facts: { "Distance from Sun": "9.58 AU", Radius: "58,232 km", "Orbital period": "29.5 years", Moons: "146" },
  },
  Uranus: {
    name: "Uranus",
    category: "Planet",
    blurb: "An ice giant tipped on its side.",
    description:
      "Uranus rotates at an axial tilt of 98°, effectively rolling around the Sun on its side. Its pale cyan colour comes from methane in the upper atmosphere.",
    facts: { "Distance from Sun": "19.2 AU", Radius: "25,362 km", "Orbital period": "84 years", Moons: "28" },
  },
  Neptune: {
    name: "Neptune",
    category: "Planet",
    blurb: "The windiest planet — storms reach 2,100 km/h.",
    description:
      "Neptune was found with mathematics before it was ever seen. It is a dark, cold world of supersonic winds and a surprisingly active interior that radiates more heat than it receives.",
    facts: { "Distance from Sun": "30.1 AU", Radius: "24,622 km", "Orbital period": "165 years", Moons: "16" },
  },
};

export const SUN_META: ObjectMeta = {
  name: "Sun",
  category: "Sun",
  blurb: "A G-type main sequence star, and the centre of everything.",
  description:
    "The Sun holds 99.8% of the mass of the solar system and converts about four million tonnes of matter into energy every second. Light leaving its surface takes around eight minutes and twenty seconds to reach Earth.",
  facts: { "Distance from Earth": "1 AU", Radius: "696,340 km", "Surface temperature": "5,772 K", Age: "4.6 billion years" },
};

export const MOON_META: ObjectMeta = {
  name: "Moon",
  category: "Moon",
  blurb: "Earth's only natural satellite, and the calibration target for Staraim.",
  description:
    "The Moon keeps one face permanently turned towards Earth while it orbits, a synchronous rotation caused by tidal locking. Its surface is marked by billions of impacts and vast basaltic maria.",
  facts: { "Distance from Earth": "384,400 km", Radius: "1,737 km", "Orbital period": "27.3 days", "Surface gravity": "1/6 g" },
};

/** Famous Messier objects get a hand-written note; the rest use a type template. */
export const DSO_META: Record<string, { blurb: string; description: string }> = {
  M1: {
    blurb: "The Crab Nebula — a supernova remnant from 1054 AD.",
    description:
      "The expanding remnant of a star that exploded in the year 1054 and was recorded by Chinese astronomers. Its central pulsar spins thirty times a second and powers a blue glow across the debris field.",
  },
  M8: {
    blurb: "The Lagoon Nebula, glowing in the direction of Sagittarius.",
    description:
      "A vast stellar nursery roughly 4,100 light years away, split by a dark dust lane. Young hot stars ionise the hydrogen gas and make the cloud glow pink.",
  },
  M13: {
    blurb: "The Great Hercules Cluster — 300,000 stars in a ball.",
    description:
      "Around 22,000 light years away and 145 light years across, M13 is one of the brightest globular clusters in the northern sky. It is about 12 billion years old.",
  },
  M16: {
    blurb: "The Eagle Nebula, home of the Pillars of Creation.",
    description:
      "Famous for its towering columns of cold gas and dust, sculpted by radiation from newborn stars. The pillars are several light years tall and slowly evaporating.",
  },
  M17: {
    blurb: "The Omega Nebula, also called the Swan.",
    description:
      "A bright emission nebula in the direction of Sagittarius, shining through a cloud of gas threaded with dark dust lanes.",
  },
  M20: {
    blurb: "The Trifid Nebula, split into three by dark lanes.",
    description:
      "A combination of an emission nebula, a reflection nebula and a dark nebula all overlapping in one field of view.",
  },
  M27: {
    blurb: "The Dumbbell Nebula — the first planetary nebula discovered.",
    description:
      "A planetary nebula about 1,400 light years away, shaped by the outflow of a dying sun-like star. Its glow is the exposed core of the star itself.",
  },
  M31: {
    blurb: "The Andromeda Galaxy — the nearest large galaxy to the Milky Way.",
    description:
      "A spiral galaxy 2.5 million light years away, and the most distant object readily visible to the naked eye from a dark site. It is on a slow collision course with our own galaxy.",
  },
  M33: {
    blurb: "The Triangulum Galaxy, a face-on spiral.",
    description:
      "About 2.7 million light years distant and around 60,000 light years across, one of the most distant galaxies visible without optical aid.",
  },
  M42: {
    blurb: "The Orion Nebula — the closest massive star-forming region.",
    description:
      "Only 1,344 light years away and visible as a fuzzy patch in Orion's sword. Inside it, the Trapezium cluster illuminates the gas and carves the famous dark bay, the Fish's Mouth.",
  },
  M44: {
    blurb: "The Beehive Cluster in Cancer, one of the nearest open clusters.",
    description:
      "A naked-eye cluster about 577 light years away whose brightest stars form a shape reminiscent of a swarm of bees.",
  },
  M45: {
    blurb: "The Pleiades — a young open cluster in Taurus.",
    description:
      "Also known as the Seven Sisters, this cluster is around 100 million years old and 444 light years away. The blue haze is dust reflecting the light of the hot young stars.",
  },
  M51: {
    blurb: "The Whirlpool Galaxy, with a classic spiral structure.",
    description:
      "A face-on grand design spiral about 23 million light years away, interacting with a smaller companion galaxy NGC 5195.",
  },
  M57: {
    blurb: "The Ring Nebula — a dying star's shell of gas.",
    description:
      "A small, bright planetary nebula in Lyra. The ring shape is a bubble of gas expelled by a sun-like star late in its life.",
  },
  M81: {
    blurb: "Bode's Galaxy, a grand design spiral in Ursa Major.",
    description:
      "A near-perfect spiral with a bright nucleus, about 12 million light years away and easily picked out in binoculars from a dark sky.",
  },
  M82: {
    blurb: "The Cigar Galaxy, a starburst powerhouse.",
    description:
      "An edge-on starburst galaxy in Ursa Major. Its intense rate of star formation was triggered by a close encounter with M81.",
  },
  M87: {
    blurb: "A giant elliptical galaxy with a famous black hole.",
    description:
      "The central black hole in M87 was the first ever imaged, and its jets of relativistic plasma reach thousands of light years.",
  },
  M97: {
    blurb: "The Owl Nebula — two dark eyes in a round face.",
    description:
      "A planetary nebula in Ursa Major, named for the two darker oval voids visible through the small telescope.",
  },
  M104: {
    blurb: "The Sombrero Galaxy, a galaxy seen perfectly edge-on.",
    description:
      "A bright, dusty spiral in Virgo whose enormous central bulge gives it the look of a wide-brimmed hat.",
  },
};

export const DSO_TYPE_BLURB: Record<string, string> = {
  "Open cluster": "A loose gathering of young stars, held together by shared motion.",
  "Globular cluster": "A dense, ancient sphere of hundreds of thousands of stars.",
  Nebula: "A cloud of gas and dust, often a birthplace of new stars.",
  "Planetary nebula": "The glowing shell of gas shed by a dying star.",
  Galaxy: "A gravitationally bound island of stars, gas and dark matter.",
  "Supernova remnant": "The expanding debris of an exploded star.",
  "Dark nebula": "A cold cloud of dust that blocks the light behind it.",
  "Cluster of galaxies": "A group of galaxies bound together by gravity.",
  "Milky Way patch": "A brighter region of our own galaxy's spiral arm.",
  Asterism: "An unofficial pattern of stars recognised by eye.",
};
