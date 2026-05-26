export type STEMMActivity = {
  id: string;
  title: string;
  area: string;
  overview: string;
  equipment: string[];
  instructions: string[];
  sensorUse: string;
  screenName?: string;
};

export const stemmActivities: STEMMActivity[] = [
  {
    id: "parachute",
    title: "Parachute Drop Challenge",
    area: "Engineering + Physics",
    screenName: "ParachuteDrop",
    overview:
      "Design and test a parachute for a small toy. Record drop time, landing accuracy, and improve the design through repeated testing.",
    equipment: [
      "Mobile phone",
      "Small toy",
      "Paper or plastic",
      "String",
      "Tape",
      "Scissors",
    ],
    instructions: [
      "Drop the toy without a parachute as a baseline test.",
      "Build a parachute using available materials.",
      "Record the fall using the phone camera or timer.",
      "Enter the drop result in the app.",
      "Redesign and test again.",
    ],
    sensorUse: "Timer, camera recording, GPS location tagging, result history.",
  },
  {
    id: "sound",
    title: "Sound Pollution Hunter",
    area: "Environmental Science",
    overview:
      "Measure and compare sound levels from classroom actions such as talking, walking, stamping, or dropping objects.",
    equipment: ["Mobile phone", "Classroom space"],
    instructions: [
      "Choose three classroom actions.",
      "Predict which action will be loudest.",
      "Record the sound result.",
      "Compare loud and quiet zones.",
      "Reflect on hearing safety.",
    ],
    sensorUse: "Microphone concept, GPS tagging, results and comments.",
  },
  {
    id: "human-performance",
    title: "Human Performance Lab",
    area: "Medical Science + Biomechanics",
    overview:
      "Measure body movement, smoothness, and coordination during stretching or physical movement challenges.",
    equipment: ["Mobile phone", "Open safe movement space"],
    instructions: [
      "Hold the phone firmly.",
      "Start the movement challenge.",
      "Move slowly and smoothly.",
      "Review sensor values.",
      "Compare attempts.",
    ],
    sensorUse: "Accelerometer, gyroscope, timer, progress analytics.",
  },
  {
    id: "reaction",
    title: "Reaction Board Challenge",
    area: "Neuroscience + Mathematics",
    overview:
      "Measure reaction time and compare performance using dominant and non-dominant hands.",
    equipment: ["Mobile phone"],
    instructions: [
      "Wait for the reaction prompt.",
      "Tap as quickly as possible.",
      "Repeat with another hand.",
      "Compare reaction times.",
      "Record improvement.",
    ],
    sensorUse: "Touch input, timer, results history, analytics.",
  },
  {
    id: "breathing",
    title: "Breathing Pace Trainer",
    area: "Medical Science",
    overview:
      "Compare breathing movement at rest and after light exercise using phone motion sensors.",
    equipment: ["Mobile phone", "Flat surface or mat"],
    instructions: [
      "Place phone gently on chest or hold safely.",
      "Record breathing at rest.",
      "Complete light exercise.",
      "Record breathing again.",
      "Compare results.",
    ],
    sensorUse: "Accelerometer, timer, health reflection, progress history.",
  },
  {
    id: "earthquake",
    title: "Earthquake-Resistant Structure",
    area: "Engineering + Earth Science",
    overview:
      "Build a structure that reduces phone movement during simulated vibration.",
    equipment: ["Phone", "Cardboard", "Paper", "Tape", "Cups"],
    instructions: [
      "Build a vibration-reducing platform.",
      "Place the phone safely on top.",
      "Measure movement using sensors.",
      "Modify the structure.",
      "Compare movement results.",
    ],
    sensorUse: "Accelerometer, gyroscope, vibration/movement analytics.",
  },
];
