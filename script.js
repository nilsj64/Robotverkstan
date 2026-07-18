"use strict";

// ----- Game data ------------------------------------------------------------

const BRAND = {
  // Update productName when a final public name is chosen.
  // Keep worldName as "Robotverkstan" if the workshop remains part of the game world.
  productName: "Robotverkstan",
  worldName: "Robotverkstan",
  tagline: "Programmera roboten, lös åtta kluriga uppdrag och upptäck hur teknik fungerar.",
  shortDescription:
    "Ett lekfullt spel där barn lär sig programmering, robotik och AI genom att bygga, testa och förbättra en robot.",
};

const COMMANDS = {
  forward: { label: "Framåt", symbol: "↑", shortLabel: "Framåt" },
  left: { label: "Sväng vänster", symbol: "↶", shortLabel: "Vänster" },
  right: { label: "Sväng höger", symbol: "↷", shortLabel: "Höger" },
  repeat: { label: "Upprepa", symbol: "↻", shortLabel: "Upprepa" },
  pickup: { label: "Plocka upp", symbol: "⌐", shortLabel: "Plocka upp" },
  drop: { label: "Lämna", symbol: "▣", shortLabel: "Lämna" },
  sensorRight: {
    label: "Om hinder: sväng höger",
    symbol: "◉",
    shortLabel: "Sensor: hinder → höger",
    sensor: true,
  },
};

const DIRECTION_ORDER = ["north", "east", "south", "west"];
const DIRECTION_LABELS = {
  north: "uppåt",
  east: "åt höger",
  south: "nedåt",
  west: "åt vänster",
};
const DIRECTION_ROTATIONS = { north: "-90deg", east: "0deg", south: "90deg", west: "180deg" };
const DIRECTION_VECTORS = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

const LEVELS = [
  {
    id: 1,
    title: "Första stegen",
    cardText: "Sätt instruktioner i rätt ordning.",
    icon: "👣",
    color: "#4d69e8",
    mission: "Hjälp roboten att köra rakt fram till laddstationen.",
    size: 5,
    start: { x: 1, y: 2, direction: "east" },
    goal: { x: 3, y: 2 },
    obstacles: [],
    energy: [],
    commands: ["forward"],
    maxCommands: 5,
    targetCommands: 2,
    learning: "Ett program är en lista med instruktioner som körs i ordning.",
  },
  {
    id: 2,
    title: "Rätt riktning",
    cardText: "Lär roboten att svänga.",
    icon: "↪️",
    color: "#8b5cf6",
    mission: "Sväng runt hörnet och hitta fram till målet.",
    size: 5,
    start: { x: 1, y: 3, direction: "north" },
    goal: { x: 3, y: 1 },
    obstacles: [],
    energy: [],
    commands: ["forward", "left", "right"],
    maxCommands: 8,
    targetCommands: 5,
    learning: "Roboten följer instruktionerna exakt – även när de blir tokiga.",
  },
  {
    id: 3,
    title: "Runt verktygslådan",
    cardText: "Hitta en väg runt ett hinder.",
    icon: "🧰",
    color: "#ff6f61",
    mission: "Verktygslådan blockerar vägen. Programmera en omväg.",
    size: 5,
    start: { x: 0, y: 2, direction: "east" },
    goal: { x: 4, y: 2 },
    obstacles: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    energy: [],
    commands: ["forward", "left", "right"],
    maxCommands: 12,
    targetCommands: 10,
    learning: "När du ändrar och testar ett program igen felsöker du.",
  },
  {
    id: 4,
    title: "Hämta energin",
    cardText: "Lös ett uppdrag i flera steg.",
    icon: "⚡",
    color: "#e4a900",
    mission: "Samla energicellen först och kör sedan till målet.",
    size: 5,
    start: { x: 0, y: 4, direction: "north" },
    goal: { x: 3, y: 1 },
    obstacles: [{ x: 2, y: 3 }],
    energy: [{ x: 0, y: 2 }],
    commands: ["forward", "left", "right"],
    maxCommands: 11,
    targetCommands: 8,
    learning: "Ett större problem kan delas upp i flera mindre steg.",
  },
  {
    id: 5,
    title: "Sensorn",
    cardText: "Låt roboten känna av ett hinder.",
    icon: "📡",
    color: "#18a89f",
    mission: "Använd sensorn när väggen är framför roboten.",
    size: 5,
    start: { x: 1, y: 3, direction: "north" },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 1, y: 1 }],
    energy: [],
    commands: ["forward", "left", "right", "sensorRight"],
    maxCommands: 8,
    targetCommands: 4,
    learning: "Sensorer ger roboten information om det som finns runt omkring.",
  },
  {
    id: 6,
    title: "Robotprovet",
    cardText: "Kombinera allt du har lärt dig.",
    icon: "🏁",
    color: "#d95176",
    mission: "Samla energin, använd sensorn och nå den sista laddstationen.",
    size: 5,
    start: { x: 0, y: 4, direction: "north" },
    goal: { x: 3, y: 1 },
    obstacles: [
      { x: 0, y: 1 },
      { x: 2, y: 3 },
    ],
    energy: [{ x: 0, y: 2 }],
    commands: ["forward", "left", "right", "sensorRight"],
    maxCommands: 12,
    targetCommands: 8,
    learning: "Smart beteende byggs av instruktioner, information och noggranna tester.",
  },
  {
    id: 7,
    title: "Upprepa!",
    cardText: "Gör många steg med en loop.",
    icon: "loop",
    color: "#4f8f3a",
    chapter: "Robotlaboratoriet",
    mission: "Få roboten till målet med en loop.",
    size: 5,
    start: { x: 0, y: 2, direction: "east" },
    goal: { x: 4, y: 2 },
    obstacles: [],
    energy: [],
    commands: ["forward", "repeat"],
    repeatCommands: ["forward"],
    maxCommands: 2,
    targetCommands: 2,
    successMessage:
      "En loop upprepar instruktioner. Du skrev Framåt en gång, men roboten gjorde det flera gånger.",
    learning: "En loop upprepar instruktioner och kan göra programmet kortare.",
  },
  {
    id: 8,
    title: "Robotarmen",
    cardText: "Styr en griparm och leverera ett paket.",
    icon: "arm",
    color: "#9b6a2f",
    chapter: "Robotlaboratoriet",
    mission: "Hämta paketet, lämna det på leveransplatsen och kör till målet.",
    size: 6,
    start: { x: 0, y: 5, direction: "north" },
    goal: { x: 5, y: 2 },
    obstacles: [
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 2, y: 1 },
    ],
    energy: [],
    package: { x: 0, y: 3 },
    delivery: { x: 4, y: 2 },
    commands: ["forward", "left", "right", "repeat", "pickup", "drop"],
    repeatCommands: ["forward", "left", "right"],
    maxCommands: 13,
    targetCommands: 12,
    successMessage:
      "Du styrde robotens rörelser och robotarm med ett program. Robotarmar och motorer kallas aktuatorer – de får roboten att göra saker i världen. Det här är programmering och robotik. AI används när datorer till exempel lär sig mönster från många exempel.",
    learning: "Aktuatorer, som motorer och robotarmar, får roboten att göra saker i världen.",
  },
];

const AI_FEATURE_KEYS = ["shine", "transparency", "roundness", "blueAmount", "roughness"];
const AI_OBJECTS = [
  createAIObject("m1", "Blank konservburk", "metal", "training", {
    type: "can",
    variant: "tall",
    accent: "silver",
    detail: "highlight-ridges",
    background: "#eef1f6",
  }, {
    shine: 0.9, transparency: 0.05, roundness: 0.75, blueAmount: 0.15, roughness: 0.15,
  }, "En blank, rund konservburk."),
  createAIObject("m2", "Matt verkstadsburk", "metal", "training", {
    type: "can",
    variant: "short",
    accent: "graphite",
    detail: "matte-dots",
    background: "#e5e8ed",
  }, {
    shine: 0.3, transparency: 0.05, roundness: 0.75, blueAmount: 0.12, roughness: 0.55,
  }, "En matt, rund burk med skrovlig yta."),
  createAIObject("m3", "Målad verktygsask", "metal", "training", {
    type: "box",
    variant: "handle",
    accent: "blue",
    detail: "panel-line",
    background: "#dbe5ff",
  }, {
    shine: 0.55, transparency: 0.05, roundness: 0.25, blueAmount: 0.65, roughness: 0.25,
  }, "En blåmålad, kantig ask."),
  createAIObject("m4", "Skruv", "metal", "training", {
    type: "screw",
    variant: "flat-head",
    accent: "steel",
    detail: "thread",
    background: "#eceef3",
  }, {
    shine: 0.72, transparency: 0, roundness: 0.2, blueAmount: 0.08, roughness: 0.7,
  }, "En blank skruv med räfflad yta."),
  createAIObject("m5", "Rund bricka", "metal", "training", {
    type: "washer",
    variant: "wide",
    accent: "silver",
    detail: "inner-ring",
    background: "#f0f2f6",
  }, {
    shine: 0.82, transparency: 0, roundness: 0.9, blueAmount: 0.05, roughness: 0.25,
  }, "En blank och rund bricka."),
  createAIObject("m6", "Verkstadslock", "metal", "training", {
    type: "lid",
    variant: "domed",
    accent: "tin",
    detail: "tab",
    background: "#e8ebf0",
  }, {
    shine: 0.68, transparency: 0.03, roundness: 0.92, blueAmount: 0.1, roughness: 0.2,
  }, "Ett runt lock med lätt glans."),
  createAIObject("p1", "Blå flaska", "plastic", "training", {
    type: "bottle",
    variant: "tall",
    accent: "blue",
    detail: "cap-band",
    background: "#d8f0ff",
  }, {
    shine: 0.55, transparency: 0.35, roundness: 0.65, blueAmount: 0.9, roughness: 0.15,
  }, "En blå, halvgenomskinlig flaska."),
  createAIObject("p2", "Genomskinlig mugg", "plastic", "training", {
    type: "cup",
    variant: "handle-right",
    accent: "clear",
    detail: "fill-line",
    background: "#e9fbff",
  }, {
    shine: 0.45, transparency: 0.9, roundness: 0.72, blueAmount: 0.15, roughness: 0.1,
  }, "En nästan helt genomskinlig, rund mugg."),
  createAIObject("p3", "Mjuk påse", "plastic", "training", {
    type: "bag",
    variant: "soft",
    accent: "rose",
    detail: "crease",
    background: "#fff0f2",
  }, {
    shine: 0.25, transparency: 0.75, roundness: 0.35, blueAmount: 0.25, roughness: 0.3,
  }, "En tunn, skrynklig och genomskinlig påse."),
  createAIObject("p4", "Silverfärgad sked", "plastic", "training", {
    type: "spoon",
    variant: "slim",
    accent: "silver",
    detail: "blue-dot",
    background: "#f0f1f4",
  }, {
    shine: 0.82, transparency: 0.05, roundness: 0.55, blueAmount: 0.08, roughness: 0.12,
  }, "En blank, silverfärgad sked."),
  createAIObject("p5", "Matt låda", "plastic", "training", {
    type: "box",
    variant: "plain",
    accent: "mint",
    detail: "corner-tape",
    background: "#e8f4ef",
  }, {
    shine: 0.2, transparency: 0.12, roundness: 0.25, blueAmount: 0.45, roughness: 0.5,
  }, "En matt, kantig låda."),
  createAIObject("p6", "Färgglad leksaksbit", "plastic", "training", {
    type: "block",
    variant: "notched",
    accent: "yellow",
    detail: "dual-tone",
    background: "#fff0c9",
  }, {
    shine: 0.35, transparency: 0.05, roundness: 0.6, blueAmount: 0.85, roughness: 0.35,
  }, "En färgglad, rundad leksaksbit."),
  createAIObject("t1", "Matt verkstadsburk", "metal", "testing", {
    type: "can",
    variant: "mid",
    accent: "steel",
    detail: "offset-ridges",
    background: "#e4e7eb",
  }, {
    shine: 0.28, transparency: 0.04, roundness: 0.8, blueAmount: 0.1, roughness: 0.5,
  }, "En matt, rund och sträv burk."),
  createAIObject("t2", "Blank förpackning", "plastic", "testing", {
    type: "container",
    variant: "tray",
    accent: "violet",
    detail: "clear-window",
    background: "#f8f0ff",
  }, {
    shine: 0.78, transparency: 0.35, roundness: 0.4, blueAmount: 0.35, roughness: 0.08,
  }, "En blank förpackning med rundade hörn och ett genomskinligt fält."),
  createAIObject("t3", "Målad kapsyl", "metal", "testing", {
    type: "cap",
    variant: "crimped",
    accent: "blue",
    detail: "center-dot",
    background: "#dbe8ff",
  }, {
    shine: 0.58, transparency: 0.03, roundness: 0.85, blueAmount: 0.7, roughness: 0.22,
  }, "En blåmålad, rund och räfflad kapsyl."),
  createAIObject("t4", "Genomskinlig låda", "plastic", "testing", {
    type: "crate",
    variant: "open-top",
    accent: "clear",
    detail: "grid",
    background: "#e5fbff",
  }, {
    shine: 0.42, transparency: 0.82, roundness: 0.25, blueAmount: 0.2, roughness: 0.18,
  }, "En genomskinlig, kantig och slät låda."),
  createAIObject("s1", "Bucklig burk", "metal", "sorting", {
    type: "can",
    variant: "dented",
    accent: "graphite",
    detail: "dent-mark",
    background: "#e2e5e9",
  }, {
    shine: 0.38, transparency: 0.03, roundness: 0.78, blueAmount: 0.18, roughness: 0.58,
  }, "En bucklig, matt och rund burk."),
  createAIObject("s2", "Blank bricka", "plastic", "sorting", {
    type: "tray",
    variant: "oval",
    accent: "violet",
    detail: "shine-arc",
    background: "#f1efff",
  }, {
    shine: 0.76, transparency: 0.08, roundness: 0.82, blueAmount: 0.3, roughness: 0.1,
  }, "En blank och rund bricka."),
  createAIObject("s3", "Blå ask", "metal", "sorting", {
    type: "box",
    variant: "latch",
    accent: "blue",
    detail: "double-band",
    background: "#d8e6ff",
  }, {
    shine: 0.62, transparency: 0.04, roundness: 0.28, blueAmount: 0.78, roughness: 0.28,
  }, "En blåmålad, kantig ask."),
];

const STORAGE_KEY = "robotverkstan-progress-v1";
const DEFAULT_PROGRESS = Object.freeze({
  unlockedLevel: 1,
  bestStars: {},
  hasSeenInfo: false,
  sensorIntro: {
    shown: false,
    dismissed: false,
    used: false,
  },
  aiLab: {
    labels: {},
    trained: false,
    installed: false,
    completed: false,
    hasSeenIntro: false,
  },
});

const state = {
  currentScreen: "start",
  currentLevelIndex: 0,
  robot: { x: 0, y: 0, direction: "east" },
  collectedItems: new Set(),
  programCommands: [],
  executionState: {
    running: false,
    runId: 0,
    activeCommandIndex: -1,
    activeNestedIndex: -1,
    repeatIteration: 0,
    repeatTotal: 0,
  },
  packageState: createEmptyPackageState(),
  unlockedLevel: 1,
  bestStars: {},
  hasSeenInfo: false,
  sensorIntro: {
    shown: false,
    dismissed: false,
    used: false,
  },
  sensorIntroVisible: false,
  completionShown: false,
  aiLab: createDefaultAILabState(),
};

// ----- DOM references -------------------------------------------------------

const elements = {
  screens: [...document.querySelectorAll(".screen")],
  startScreen: document.querySelector("#start-screen"),
  levelScreen: document.querySelector("#level-screen"),
  gameScreen: document.querySelector("#game-screen"),
  aiLabScreen: document.querySelector("#ai-lab-screen"),
  brandButton: document.querySelector("#brand-button"),
  brandProductNames: [...document.querySelectorAll("[data-brand-product-name]")],
  brandHeaderLabel: document.querySelector("[data-brand-header-label]"),
  metaDescription: document.querySelector('meta[name="description"]'),
  heroText: document.querySelector(".hero-text"),
  startButton: document.querySelector("#start-button"),
  learnHeroButton: document.querySelector("#learn-hero-button"),
  learnHeaderButton: document.querySelector("#learn-header-button"),
  backStartButton: document.querySelector("#back-start-button"),
  backLevelsButton: document.querySelector("#back-levels-button"),
  levelGrid: document.querySelector("#level-grid"),
  progressBadge: document.querySelector("#progress-badge"),
  resetProgressButton: document.querySelector("#reset-progress-button"),
  backAILevelsButton: document.querySelector("#back-ai-levels-button"),
  aiStageProgress: document.querySelector("#ai-stage-progress"),
  aiCameraStatus: document.querySelector("#ai-camera-status"),
  aiLabContent: document.querySelector("#ai-lab-content"),
  aiStatus: document.querySelector("#ai-status"),
  gameTitle: document.querySelector("#game-title"),
  missionNumber: document.querySelector("#mission-number"),
  missionText: document.querySelector("#mission-text"),
  objectiveStatus: document.querySelector("#objective-status"),
  levelProgressText: document.querySelector("#level-progress-text"),
  levelProgressFill: document.querySelector("#level-progress-fill"),
  directionLegend: document.querySelector("#direction-legend"),
  board: document.querySelector("#game-board"),
  energyLegend: document.querySelector("#energy-legend"),
  packageLegend: document.querySelector("#package-legend"),
  deliveryLegend: document.querySelector("#delivery-legend"),
  programList: document.querySelector("#program-list"),
  emptyProgram: document.querySelector("#empty-program"),
  commandCount: document.querySelector("#command-count"),
  commandPalette: document.querySelector("#command-palette"),
  sensorTip: document.querySelector("#sensor-tip"),
  sensorTipDismiss: document.querySelector("#sensor-tip-dismiss"),
  clearProgramButton: document.querySelector("#clear-program-button"),
  resetLevelButton: document.querySelector("#reset-level-button"),
  runProgramButton: document.querySelector("#run-program-button"),
  statusMessage: document.querySelector("#status-message"),
  learnDialog: document.querySelector("#learn-dialog"),
  closeLearnButton: document.querySelector("#close-learn-button"),
  learnOkButton: document.querySelector("#learn-ok-button"),
  completionDialog: document.querySelector("#completion-dialog"),
  completionTitle: document.querySelector("#completion-title"),
  completionStars: document.querySelector("#completion-stars"),
  completionMessage: document.querySelector("#completion-message"),
  completionLearning: document.querySelector("#completion-learning"),
  nextLevelButton: document.querySelector("#next-level-button"),
  retryLevelButton: document.querySelector("#retry-level-button"),
  completionLevelsButton: document.querySelector("#completion-levels-button"),
  confirmDialog: document.querySelector("#confirm-dialog"),
  cancelResetButton: document.querySelector("#cancel-reset-button"),
  confirmResetButton: document.querySelector("#confirm-reset-button"),
};

// ----- Persistence ----------------------------------------------------------

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return;
    state.bestStars = sanitizeStars(saved.bestStars);
    const migratedUnlock =
      state.bestStars["6"] && !state.bestStars["7"]
        ? Math.max(Number(saved.unlockedLevel) || 1, 7)
        : saved.unlockedLevel;
    state.unlockedLevel = clampNumber(migratedUnlock, 1, LEVELS.length, 1);
    state.hasSeenInfo = Boolean(saved.hasSeenInfo);
    state.sensorIntro = sanitizeSensorIntro(saved.sensorIntro);
    state.aiLab = sanitizeAILab(saved.aiLab);
  } catch {
    applyDefaultProgress();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        unlockedLevel: state.unlockedLevel,
        bestStars: state.bestStars,
        hasSeenInfo: state.hasSeenInfo,
        sensorIntro: state.sensorIntro,
        aiLab: getPersistentAILabState(),
      }),
    );
  } catch {
    // In-memory state remains fully usable when storage is blocked.
  }
}

function applyDefaultProgress() {
  state.unlockedLevel = DEFAULT_PROGRESS.unlockedLevel;
  state.bestStars = {};
  state.hasSeenInfo = DEFAULT_PROGRESS.hasSeenInfo;
  state.sensorIntro = { ...DEFAULT_PROGRESS.sensorIntro };
  state.sensorIntroVisible = false;
  state.aiLab = createDefaultAILabState();
}

function sanitizeStars(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    LEVELS.map((level) => [String(level.id), value[level.id] ?? value[String(level.id)]])
      .map(([key, stars]) => [String(key), clampNumber(stars, 1, 3, 0)])
      .filter(([, stars]) => stars > 0),
  );
}

function clampNumber(value, minimum, maximum, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function sanitizeSensorIntro(value) {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_PROGRESS.sensorIntro };
  }
  return {
    shown: Boolean(value.shown),
    dismissed: Boolean(value.dismissed),
    used: Boolean(value.used),
  };
}

function createDefaultAILabState() {
  return {
    labels: {},
    trained: false,
    installed: false,
    trainingSignature: "",
    installedSignature: "",
    modelOutdated: false,
    completed: false,
    hasSeenIntro: false,
    stage: "training",
    activeCandidateId: null,
    training: false,
    trainingStep: "",
    testIndex: 0,
    testScanned: false,
    testRevealed: false,
    currentPrediction: null,
    testResults: [],
    scanRunning: false,
    sortingIndex: 0,
    sortingResults: [],
    sortingRunning: false,
    runId: 0,
  };
}

function sanitizeAILab(value) {
  const clean = createDefaultAILabState();
  if (!value || typeof value !== "object") return clean;
  const trainingIds = new Set(getAIObjectsByGroup("training").map((item) => item.id));
  if (value.labels && typeof value.labels === "object") {
    Object.entries(value.labels).forEach(([id, label]) => {
      if (trainingIds.has(id) && (label === "metal" || label === "plastic")) {
        clean.labels[id] = label;
      }
    });
  }
  const currentSignature = createAITrainingSignature(clean.labels);
  const savedSignature = typeof value.trainingSignature === "string" ? value.trainingSignature : "";
  const savedInstalledSignature = typeof value.installedSignature === "string" ? value.installedSignature : "";
  const signatureMatches = !savedSignature || savedSignature === currentSignature;
  clean.trainingSignature = savedSignature || (value.trained ? currentSignature : "");
  clean.installedSignature = savedInstalledSignature;
  clean.modelOutdated = Boolean(value.modelOutdated)
    || (Boolean(value.trained || value.installed) && !signatureMatches);
  clean.trained = Boolean(value.trained)
    && Object.keys(clean.labels).length === 6
    && signatureMatches
    && !clean.modelOutdated;
  const testObjects = getAIObjectsByGroup("testing");
  const savedTestComplete = Array.isArray(value.testResults)
    && value.testResults.length === testObjects.length
    && value.testResults.every((result, index) =>
      result
      && result.objectId === testObjects[index].id
      && ["metal", "plastic"].includes(result.predictedLabel)
      && typeof result.correct === "boolean"
      && ["Osäker", "Ganska säker", "Säker"].includes(result.confidenceBand));
  if (clean.trained && (savedTestComplete || value.installed || value.completed)) {
    clean.testResults = evaluateAIModel(clean.labels);
    clean.testIndex = clean.testResults.length;
  }
  clean.installed = Boolean(value.installed) && clean.trained && clean.testResults.length === 4 && (!savedInstalledSignature || savedInstalledSignature === currentSignature);
  clean.hasSeenIntro = Boolean(value.hasSeenIntro);
  const sortingCount = clampNumber(value.sortingIndex, 0, getAIObjectsByGroup("sorting").length, 0);
  clean.sortingIndex = clean.installed ? sortingCount : 0;
  clean.stage = clean.completed ? "complete" : clean.installed ? "sorting" : clean.trained ? "testing" : "training";
  if (clean.installed) {
    clean.sortingResults = getAIObjectsByGroup("sorting")
      .slice(0, clean.sortingIndex)
      .map((item) => {
        const prediction = predictAIObject(item, clean.labels);
        return {
          item,
          predictedLabel: prediction.label,
          correct: prediction.label === item.trueCategory,
        };
      });
  }
  clean.completed = Boolean(value.completed) && clean.installed && clean.sortingResults.length === getAIObjectsByGroup("sorting").length && clean.sortingResults.every((result) => result.correct);
  clean.stage = clean.completed ? "complete" : clean.installed ? "sorting" : clean.trained ? "testing" : "training";
  return clean;
}

function getPersistentAILabState() {
  return {
    labels: state.aiLab.labels,
    trained: state.aiLab.trained,
    installed: state.aiLab.installed,
    trainingSignature: state.aiLab.trainingSignature,
    installedSignature: state.aiLab.installedSignature,
    modelOutdated: state.aiLab.modelOutdated,
    completed: state.aiLab.completed,
    hasSeenIntro: state.aiLab.hasSeenIntro,
    testResults: state.aiLab.testResults.length === getAIObjectsByGroup("testing").length
      ? state.aiLab.testResults.map((result) => ({
          objectId: result.objectId,
          predictedLabel: result.predictedLabel,
          correct: result.correct,
          confidenceBand: result.confidenceBand,
        }))
      : [],
    sortingIndex: state.aiLab.sortingIndex,
  };
}

function applyBranding() {
  document.title = BRAND.productName;
  elements.metaDescription?.setAttribute("content", BRAND.shortDescription);
  elements.brandHeaderLabel?.setAttribute("aria-label", `${BRAND.worldName}s toppfält`);
  elements.brandProductNames.forEach((element) => {
    element.textContent = BRAND.productName;
  });
  if (elements.heroText) {
    elements.heroText.textContent = BRAND.tagline;
  }
}

// ----- Navigation and screens ----------------------------------------------

function showScreen(screenName) {
  cancelExecution();
  cancelAILabProcess();
  closeCompletionDialog();
  state.currentScreen = screenName;
  elements.screens.forEach((screen) => {
    const isTarget = screen.id === `${screenName}-screen`;
    screen.classList.toggle("is-active", isTarget);
    screen.setAttribute("aria-hidden", String(!isTarget));
  });

  if (screenName === "level") renderLevelSelection();
  if (screenName === "ai-lab") renderAILab();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  requestAnimationFrame(() => document.querySelector(`#${screenName}-screen h1`)?.focus?.());
}

function openLevel(levelIndex) {
  if (levelIndex + 1 > state.unlockedLevel) {
    showStatus("Den nivån är låst. Klara nivån före först.", "warning");
    return false;
  }
  state.currentLevelIndex = levelIndex;
  state.currentScreen = "game";
  elements.screens.forEach((screen) => {
    const isGame = screen === elements.gameScreen;
    screen.classList.toggle("is-active", isGame);
    screen.setAttribute("aria-hidden", String(!isGame));
  });
  initializeLevel();
  window.scrollTo({ top: 0, behavior: "auto" });
  return true;
}

function openLearnDialog() {
  state.hasSeenInfo = true;
  saveProgress();
  if (!elements.learnDialog.open) elements.learnDialog.showModal();
}

function closeLearnDialog() {
  if (elements.learnDialog.open) elements.learnDialog.close();
}

// ----- Level selection ------------------------------------------------------

function renderLevelSelection() {
  const completedCount = Object.keys(state.bestStars).filter(
    (key) => Number(key) >= 1 && Number(key) <= LEVELS.length,
  ).length;
  elements.progressBadge.textContent = `${completedCount} av ${LEVELS.length} klara`;
  const cards = [];
  let previousChapter = "";
  LEVELS.forEach((level, index) => {
      const chapter = level.chapter || "Programmeringsverkstan";
      if (chapter !== previousChapter) {
        const heading = document.createElement("h2");
        heading.className = "chapter-heading";
        heading.textContent = chapter;
        cards.push(heading);
        previousChapter = chapter;
      }
      const isUnlocked = level.id <= state.unlockedLevel;
      const stars = state.bestStars[level.id] || 0;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `level-card${isUnlocked ? "" : " is-locked"}`;
      card.style.setProperty("--level-color", level.color);
      card.disabled = !isUnlocked;
      card.dataset.levelIndex = String(index);
      card.setAttribute(
        "aria-label",
        isUnlocked
          ? `Nivå ${level.id}: ${level.title}. ${stars ? `${stars} stjärnor.` : "Inte klarad."}`
          : `Nivå ${level.id}: ${level.title}. Låst.`,
      );
      card.innerHTML = `
        <span class="level-card-top">
          <span class="level-card-number">${String(level.id).padStart(2, "0")}</span>
          <span class="level-card-icon" aria-hidden="true">${renderLevelIcon(isUnlocked ? level.icon : "lock", level.id)}</span>
        </span>
        <h2>${level.title}</h2>
        <p>${level.cardText}</p>
        <span class="level-stars" aria-hidden="true">${renderStarsHtml(stars)}</span>
        ${isUnlocked ? '<span class="level-card-action" aria-hidden="true">Öppna <i>→</i></span>' : ""}
      `;
      cards.push(card);
    });
  const aiUnlocked = Boolean(state.bestStars["8"]);
  const aiCard = document.createElement("button");
  aiCard.type = "button";
  aiCard.className = `ai-chapter-card${aiUnlocked ? "" : " is-locked"}`;
  aiCard.disabled = !aiUnlocked;
  aiCard.dataset.aiChapter = "true";
  const aiState = !aiUnlocked
    ? "Låst"
    : state.aiLab.completed
      ? "Kapitel klart"
      : state.aiLab.trained
        ? "Modell tränad"
        : "Redo att träna";
  aiCard.setAttribute(
    "aria-label",
    aiUnlocked
      ? `AI-labbet. ${aiState}. Träna robotens kamera med egna exempel.`
      : "AI-labbet är låst. Klara Robotarmen först.",
  );
  aiCard.innerHTML = `
    <span class="ai-chapter-icon" aria-hidden="true">${aiUnlocked ? "AI" : renderLevelIcon("lock")}</span>
    <span class="ai-chapter-copy">
      <h2>AI-labbet</h2>
      <p>Träna robotens kamera med egna exempel.</p>
      <strong>${aiUnlocked ? "Det du lär roboten påverkar hur den sorterar." : "Klara Robotarmen först."}</strong>
    </span>
    <span class="ai-chapter-state">${aiState}</span>
  `;
  const aiHeading = document.createElement("h2");
  aiHeading.className = "chapter-heading";
  aiHeading.textContent = "AI-labbet";
  cards.push(aiHeading, aiCard);
  elements.levelGrid.replaceChildren(...cards);
}

// ----- Level and board rendering -------------------------------------------

function initializeLevel({ keepProgram = false } = {}) {
  cancelExecution();
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  state.packageState = createPackageState(level);
  if (!keepProgram) state.programCommands = [];
  state.completionShown = false;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;

  elements.gameTitle.textContent = level.title;
  elements.missionNumber.textContent = String(level.id).padStart(2, "0");
  elements.missionText.textContent = level.mission;
  elements.levelProgressText.textContent = `Nivå ${level.id} av ${LEVELS.length}`;
  elements.levelProgressFill.style.width = `${(level.id / LEVELS.length) * 100}%`;
  elements.board.style.setProperty("--grid-size", level.size);
  elements.board.setAttribute(
    "aria-label",
    `Robotbana med ${level.size} gånger ${level.size} rutor`,
  );
  elements.energyLegend.hidden = level.energy.length === 0;
  elements.packageLegend.hidden = !level.package;
  elements.deliveryLegend.hidden = !level.delivery;

  renderBoard();
  renderCommandPalette();
  renderProgram();
  updateObjectiveStatus();
  updateControls();
  updateSensorTip();
  showStatus("Bygg ett program och tryck på Kör!", "info");
}

function renderBoard() {
  const level = getCurrentLevel();
  const fragment = document.createDocumentFragment();

  for (let y = 0; y < level.size; y += 1) {
    for (let x = 0; x < level.size; x += 1) {
      const cell = document.createElement("div");
      const isGoal = samePosition({ x, y }, level.goal);
      const isObstacle = hasPosition(level.obstacles, x, y);
      const isDelivery = samePosition({ x, y }, level.delivery || { x: -1, y: -1 });
      const hasPackage = isPackageAt(x, y);
      const hasDeliveredPackage = Boolean(level.delivery && state.packageState.delivered && isDelivery);
      const energyIndex = level.energy.findIndex((item) => item.x === x && item.y === y);
      const hasEnergy = energyIndex >= 0 && !state.collectedItems.has(energyIndex);

      cell.className = `grid-cell${isGoal ? " is-goal" : ""}${isDelivery ? " is-delivery" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute(
        "aria-label",
        describeCell(x, y, { isGoal, isObstacle, hasEnergy, isDelivery, hasPackage, hasDeliveredPackage }),
      );
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);

      if (isObstacle) {
        const obstacle = document.createElement("span");
        obstacle.className = "wall-object";
        obstacle.setAttribute("aria-hidden", "true");
        cell.append(obstacle);
      }
      if (hasEnergy) {
        const energy = document.createElement("span");
        energy.className = "energy-cell";
        energy.dataset.energyIndex = String(energyIndex);
        energy.textContent = "⚡";
        energy.setAttribute("aria-hidden", "true");
        cell.append(energy);
      }
      if (hasPackage || hasDeliveredPackage) {
        const packageElement = document.createElement("span");
        packageElement.className = `package-object${hasDeliveredPackage ? " is-delivered" : ""}`;
        packageElement.textContent = "▣";
        packageElement.setAttribute("aria-hidden", "true");
        cell.append(packageElement);
      }
      fragment.append(cell);
    }
  }

  const robot = document.createElement("div");
  robot.className = "robot-piece";
  robot.id = "robot-piece";
  robot.setAttribute("role", "img");
  robot.innerHTML =
    '<span class="robot-visual" aria-hidden="true"><span class="carried-package" aria-hidden="true">▣</span><span class="robot-arm-effect" aria-hidden="true"></span></span>';
  fragment.append(robot);
  elements.board.replaceChildren(fragment);
  updateRobotVisual();
}

function describeCell(x, y, contents) {
  const parts = [`Rad ${y + 1}, kolumn ${x + 1}`];
  if (contents.isGoal) parts.push("mål");
  if (contents.isObstacle) parts.push("hinder");
  if (contents.hasEnergy) parts.push("energicell");
  if (contents.isDelivery) parts.push("leveransplats");
  if (contents.hasPackage) parts.push("paket");
  if (contents.hasDeliveredPackage) parts.push("levererat paket");
  if (x === state.robot.x && y === state.robot.y) parts.push("robotens startruta");
  return parts.join(", ");
}

function updateRobotVisual() {
  const robotPiece = document.querySelector("#robot-piece");
  if (!robotPiece) return;
  robotPiece.style.setProperty("--robot-x", state.robot.x);
  robotPiece.style.setProperty("--robot-y", state.robot.y);
  robotPiece.style.setProperty("--direction", DIRECTION_ROTATIONS[state.robot.direction]);
  robotPiece.setAttribute(
    "aria-label",
    `Roboten är på rad ${state.robot.y + 1}, kolumn ${state.robot.x + 1} och tittar ${
      DIRECTION_LABELS[state.robot.direction]
    }.`,
  );
  elements.directionLegend.textContent = `Roboten tittar ${DIRECTION_LABELS[state.robot.direction]}`;
  robotPiece.classList.toggle("is-carrying", state.packageState.carrying);
}

function updateObjectiveStatus() {
  const level = getCurrentLevel();
  if (level.package) {
    const armText = state.packageState.carrying ? "Robotarm: håller paket" : "Robotarm: tom";
    const packageText = state.packageState.delivered ? "Paket: levererat" : "Paket: väntar";
    elements.objectiveStatus.textContent = `${armText} · ${packageText}`;
    return;
  }
  if (level.energy.length === 0) {
    elements.objectiveStatus.textContent = "Mål: nå laddstationen ★";
    return;
  }
  const remaining = level.energy.length - state.collectedItems.size;
  elements.objectiveStatus.textContent =
    remaining > 0 ? `Energi kvar: ${remaining} ⚡` : "Energi klar! Kör till målet ★";
}

// ----- Program editing ------------------------------------------------------

function renderCommandPalette() {
  const level = getCurrentLevel();
  elements.commandPalette.replaceChildren(
    ...level.commands.map((commandId) => {
      const command = COMMANDS[commandId];
      const button = document.createElement("button");
      button.type = "button";
      button.className = `command-button${command.sensor ? " sensor-command" : ""}`;
      button.dataset.command = commandId;
      button.innerHTML = `
        <span class="command-symbol" aria-hidden="true">${command.symbol}</span>
        <span>${command.label}</span>
      `;
      button.setAttribute("aria-label", `Lägg till instruktionen ${command.label}`);
      if (commandId === "repeat") button.classList.add("repeat-command");
      return button;
    }),
  );
}

function updateSensorTip() {
  const isEligible =
    getCurrentLevel().id === 5 &&
    !state.sensorIntro.dismissed &&
    !state.sensorIntro.used &&
    !state.executionState.running;
  if (isEligible && !state.sensorIntro.shown && !state.sensorIntroVisible) {
    state.sensorIntroVisible = true;
    markSensorIntroShown();
  }
  const shouldShow = isEligible && state.sensorIntroVisible;
  elements.sensorTip.hidden = !shouldShow;
}

function renderProgram({ newCommandIndex = -1 } = {}) {
  const authoredCount = countAuthoredBlocks(state.programCommands);
  elements.programList.replaceChildren(
    ...state.programCommands.map((commandBlock, index) => {
      const commandId = getCommandType(commandBlock);
      const command = COMMANDS[commandId];
      const item = document.createElement("li");
      const isRepeat = commandId === "repeat";
      item.className = `program-step${isRepeat ? " repeat-step" : ""}${
        state.executionState.activeCommandIndex === index ? " is-active" : ""
      }${index === newCommandIndex ? " is-new" : ""}`;
      item.dataset.commandIndex = String(index);
      if (!isRepeat) {
        item.innerHTML = `
        <span class="program-command-name">
          <span class="command-symbol" aria-hidden="true">${command.symbol}</span>
          <span>${command.shortLabel}</span>
        </span>
        <button class="remove-command" type="button" aria-label="Ta bort instruktion ${
          index + 1
        }: ${command.label}" ${state.executionState.running ? "disabled" : ""}>×</button>
      `;
        return item;
      }

      const nestedCommands = commandBlock.commands || [];
      const repeatInfo =
        state.executionState.activeCommandIndex === index && state.executionState.repeatTotal
          ? `<span class="repeat-iteration">Upprepning ${state.executionState.repeatIteration} av ${state.executionState.repeatTotal}</span>`
          : "";
      item.innerHTML = `
        <div class="repeat-main">
          <span class="program-command-name">
            <span class="command-symbol" aria-hidden="true">${command.symbol}</span>
            <span>Upprepa ${commandBlock.count} gånger</span>
          </span>
          ${repeatInfo}
          <div class="repeat-count-controls" aria-label="Ändra antal upprepningar">
            <button class="repeat-count-button" type="button" data-repeat-action="decrease" aria-label="Minska upprepningar för instruktion ${
              index + 1
            }" ${state.executionState.running || commandBlock.count <= 2 ? "disabled" : ""}>−</button>
            <button class="repeat-count-button" type="button" data-repeat-action="increase" aria-label="Öka upprepningar för instruktion ${
              index + 1
            }" ${state.executionState.running || commandBlock.count >= 5 ? "disabled" : ""}>+</button>
          </div>
          <button class="remove-command" type="button" aria-label="Ta bort hela upprepa-blocket ${
            index + 1
          }" ${state.executionState.running ? "disabled" : ""}>×</button>
        </div>
        <div class="repeat-nested" aria-label="Instruktioner i loopen">
          <div class="nested-list">
            ${
              nestedCommands.length
                ? nestedCommands
                    .map((nested, nestedIndex) => {
                      const nestedCommand = COMMANDS[getCommandType(nested)];
                      const activeNested =
                        state.executionState.activeCommandIndex === index &&
                        state.executionState.activeNestedIndex === nestedIndex;
                      return `<span class="nested-command${activeNested ? " is-active" : ""}" data-nested-index="${nestedIndex}">
                        <span><span class="command-symbol" aria-hidden="true">${nestedCommand.symbol}</span>${nestedCommand.shortLabel}</span>
                        <button class="remove-nested-command" type="button" aria-label="Ta bort ${nestedCommand.label} från upprepa-blocket" ${
                          state.executionState.running ? "disabled" : ""
                        }>×</button>
                      </span>`;
                    })
                    .join("")
                : '<span class="repeat-empty">Lägg en instruktion här innan du kör.</span>'
            }
          </div>
          <div class="nested-command-palette">
            ${(getCurrentLevel().repeatCommands || ["forward", "left", "right"])
              .map((nestedId) => {
                const nestedCommand = COMMANDS[nestedId];
                const disabled = state.executionState.running || authoredCount >= getCurrentLevel().maxCommands;
                return `<button class="nested-add-command" type="button" data-nested-command="${nestedId}" aria-label="Lägg ${nestedCommand.label} i upprepa-blocket" ${
                  disabled ? "disabled title=\"Programmet är fullt\"" : ""
                }><span aria-hidden="true">${nestedCommand.symbol}</span><span>${nestedCommand.shortLabel}</span></button>`;
              })
              .join("")}
          </div>
        </div>
      `;
      return item;
    }),
  );

  const level = getCurrentLevel();
  elements.programList.parentElement.classList.toggle("is-empty", state.programCommands.length === 0);
  elements.emptyProgram.classList.toggle("is-hidden", state.programCommands.length > 0);
  elements.commandCount.textContent = `${authoredCount} / ${level.maxCommands}`;
  elements.commandCount.classList.toggle(
    "is-full",
    authoredCount >= level.maxCommands,
  );
  updateControls();
}

function addCommand(commandId) {
  const level = getCurrentLevel();
  if (state.executionState.running) return;
  if (!level.commands.includes(commandId)) return;
  if (!canAddAuthoredBlocks(1)) {
    showStatus("Programmet är fullt. Ta bort en instruktion för att lägga till en ny.", "warning");
    return;
  }
  state.programCommands.push(createCommandBlock(commandId));
  renderProgram({ newCommandIndex: state.programCommands.length - 1 });
  showStatus(`Instruktionen ${COMMANDS[commandId].label} lades till.`, "info");
  elements.programList.lastElementChild?.scrollIntoView({ block: "nearest" });
}

function removeCommand(index) {
  if (state.executionState.running || index < 0 || index >= state.programCommands.length) return;
  const [removed] = state.programCommands.splice(index, 1);
  renderProgram();
  showStatus(`${COMMANDS[getCommandType(removed)].label} togs bort.`, "info");
}

function updateRepeatCount(index, change) {
  if (state.executionState.running) return;
  const command = state.programCommands[index];
  if (getCommandType(command) !== "repeat") return;
  command.count = clampNumber(command.count + change, 2, 5, 3);
  renderProgram();
  showStatus(`Loopen upprepas ${command.count} gånger.`, "info");
}

function addNestedCommand(index, commandId) {
  const level = getCurrentLevel();
  if (state.executionState.running) return;
  const command = state.programCommands[index];
  if (getCommandType(command) !== "repeat") return;
  if (!(level.repeatCommands || ["forward", "left", "right"]).includes(commandId)) return;
  if (!canAddAuthoredBlocks(1)) {
    showStatus("Programmet är fullt. Ta bort en instruktion för att lägga till en ny.", "warning");
    return;
  }
  command.commands.push(createCommandBlock(commandId));
  renderProgram();
  showStatus(`${COMMANDS[commandId].label} lades in i loopen.`, "info");
}

function removeNestedCommand(index, nestedIndex) {
  if (state.executionState.running) return;
  const command = state.programCommands[index];
  if (getCommandType(command) !== "repeat") return;
  const [removed] = command.commands.splice(nestedIndex, 1);
  renderProgram();
  showStatus(`${COMMANDS[getCommandType(removed)].label} togs bort från loopen.`, "info");
}

function clearProgram() {
  if (state.executionState.running || state.programCommands.length === 0) return;
  state.programCommands = [];
  renderProgram();
  showStatus("Programmet är tomt. Bygg ett nytt!", "info");
}

function updateControls() {
  const running = state.executionState.running;
  const level = getCurrentLevel();
  const full = countAuthoredBlocks(state.programCommands) >= level.maxCommands;
  elements.commandPalette.querySelectorAll("button").forEach((button) => {
    button.disabled = running || full;
    if (full && !running) button.title = "Programmet är fullt";
    else button.removeAttribute("title");
  });
  elements.clearProgramButton.disabled = running || state.programCommands.length === 0;
  elements.resetLevelButton.disabled = false;
  elements.runProgramButton.disabled = running;
  elements.runProgramButton.classList.toggle("is-running", running);
  elements.runProgramButton.querySelector("span:last-child").textContent = running
    ? "Roboten kör…"
    : "Kör programmet";
  updateSensorTip();
}

// ----- Command execution ----------------------------------------------------

async function runProgram() {
  if (state.executionState.running) return;
  if (state.programCommands.length === 0) {
    showStatus("Lägg till minst en instruktion först.", "warning");
    return;
  }
  const executionPlan = compileProgram(state.programCommands);
  if (!executionPlan.ok) {
    showStatus(executionPlan.message, "warning");
    return;
  }

  resetRobotForRun();
  state.executionState.running = true;
  state.executionState.runId += 1;
  const runId = state.executionState.runId;
  state.completionShown = false;
  updateControls();
  showStatus("Roboten följer programmet steg för steg…", "info");

  const commandDelay = prefersReducedMotion() ? 80 : 520;
  for (const step of executionPlan.steps) {
    if (!isRunActive(runId)) return;
    state.executionState.activeCommandIndex = step.topIndex;
    state.executionState.activeNestedIndex = step.nestedIndex;
    state.executionState.repeatIteration = step.iteration;
    state.executionState.repeatTotal = step.totalIterations;
    renderProgram();
    await wait(prefersReducedMotion() ? 20 : 150);
    if (!isRunActive(runId)) return;

    const result = await executeCommand(step.commandId, runId, commandDelay);
    if (!isRunActive(runId)) return;
    if (result === "collision") {
      finishFailedRun("Oj! Väggen var i vägen. Ändra programmet och testa igen.");
      return;
    }
    if (result && result.type === "failure") {
      finishFailedRun(result.message);
      return;
    }
    if (checkCompletion()) {
      finishSuccessfulRun();
      return;
    }
  }

  if (!isRunActive(runId)) return;
  const level = getCurrentLevel();
  finishFailedRun(
    level.package && !state.packageState.delivered
      ? "Paketet är inte levererat ännu."
      : state.collectedItems.size < level.energy.length
        ? "Programmet tog slut. Kom ihåg att hämta all energi först!"
        : "Programmet tog slut före målet. Vad kan du lägga till?",
  );
}

function resetRobotForRun() {
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  state.packageState = createPackageState(level);
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  renderBoard();
  updateObjectiveStatus();
}

async function executeCommand(commandId, runId, delay) {
  if (commandId === "forward") {
    const moved = attemptMoveForward();
    if (!moved) {
      animateRobotReaction("is-bumping", prefersReducedMotion() ? 40 : 360);
      await wait(delay);
      return "collision";
    }
    updateRobotVisual();
    await wait(delay);
    if (!isRunActive(runId)) return "cancelled";
    collectEnergyAtRobot();
    return "moved";
  }

  if (commandId === "left" || commandId === "right") {
    turnRobot(commandId);
    updateRobotVisual();
    animateRobotReaction("is-turning", prefersReducedMotion() ? 40 : 220);
    await wait(delay);
    return "turned";
  }

  if (commandId === "sensorRight") {
    markSensorIntroUsed();
    showSensorPulse();
    const obstacleAhead = isBlockedAhead();
    showStatus(
      obstacleAhead
        ? "Sensorn hittar ett hinder. Roboten svänger höger!"
        : "Sensorn ser fri väg. Roboten fortsätter utan att svänga.",
      "info",
    );
    if (obstacleAhead) {
      turnRobot("right");
      updateRobotVisual();
      animateRobotReaction("is-turning", prefersReducedMotion() ? 40 : 220);
    }
    await wait(delay);
    return obstacleAhead ? "sensor-turned" : "sensor-clear";
  }

  if (commandId === "pickup") {
    const result = await executePickup(runId, delay);
    return result;
  }

  if (commandId === "drop") {
    const result = await executeDrop(runId, delay);
    return result;
  }

  return "unknown";
}

function attemptMoveForward() {
  const vector = DIRECTION_VECTORS[state.robot.direction];
  const next = { x: state.robot.x + vector.x, y: state.robot.y + vector.y };
  if (isBlocked(next.x, next.y)) return false;
  state.robot.x = next.x;
  state.robot.y = next.y;
  return true;
}

function turnRobot(turnDirection) {
  const currentIndex = DIRECTION_ORDER.indexOf(state.robot.direction);
  const change = turnDirection === "left" ? -1 : 1;
  state.robot.direction =
    DIRECTION_ORDER[(currentIndex + change + DIRECTION_ORDER.length) % DIRECTION_ORDER.length];
}

function isBlockedAhead() {
  const vector = DIRECTION_VECTORS[state.robot.direction];
  return isBlocked(state.robot.x + vector.x, state.robot.y + vector.y);
}

function isBlocked(x, y) {
  const level = getCurrentLevel();
  const outside = x < 0 || y < 0 || x >= level.size || y >= level.size;
  return outside || hasPosition(level.obstacles, x, y) || isPackageAt(x, y);
}

function collectEnergyAtRobot() {
  const level = getCurrentLevel();
  const energyIndex = level.energy.findIndex(
    (item) => item.x === state.robot.x && item.y === state.robot.y,
  );
  if (energyIndex < 0 || state.collectedItems.has(energyIndex)) return;

  const energyElement = elements.board.querySelector(`[data-energy-index="${energyIndex}"]`);
  energyElement?.classList.add("is-collected");
  state.collectedItems.add(energyIndex);
  updateObjectiveStatus();
  showStatus("Zap! Energicellen är insamlad.", "success");
  window.setTimeout(() => energyElement?.remove(), prefersReducedMotion() ? 10 : 380);
}

function checkCompletion() {
  const level = getCurrentLevel();
  return (
    samePosition(state.robot, level.goal) &&
    state.collectedItems.size === level.energy.length &&
    (!level.package || state.packageState.delivered)
  );
}

function finishFailedRun(message) {
  state.executionState.running = false;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  clearBoardEffects();
  renderProgram();
  updateControls();
  showStatus(message, "warning");
}

function finishSuccessfulRun() {
  if (state.completionShown) return;
  state.completionShown = true;
  state.executionState.running = false;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  clearBoardEffects();
  const level = getCurrentLevel();
  const authoredCount = countAuthoredBlocks(state.programCommands);
  const stars = calculateStars(authoredCount, level.targetCommands);

  state.bestStars[level.id] = Math.max(state.bestStars[level.id] || 0, stars);
  state.unlockedLevel = Math.max(
    state.unlockedLevel,
    Math.min(LEVELS.length, level.id + 1),
  );
  saveProgress();
  renderProgram();
  updateControls();
  showStatus("Uppdrag klart! Roboten hittade rätt.", "success");
  animateRobotClass("is-celebrating");

  window.setTimeout(() => {
    if (!state.completionShown || state.currentScreen !== "game") return;
    showCompletionDialog(stars);
  }, prefersReducedMotion() ? 20 : 450);
}

function calculateStars(commandCount, targetCount) {
  if (commandCount <= targetCount) return 3;
  if (commandCount <= targetCount + 2) return 2;
  return 1;
}

function cancelExecution() {
  state.executionState.runId += 1;
  state.executionState.running = false;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  clearBoardEffects();
  updateControlsIfReady();
}

function updateControlsIfReady() {
  if (elements.commandPalette.children.length && state.currentScreen === "game") {
    renderProgram();
    updateControls();
  }
}

function isRunActive(runId) {
  return state.executionState.running && state.executionState.runId === runId;
}

function showSensorPulse() {
  clearBoardEffects();
  const target = getForwardCell();
  const pulse = document.createElement("span");
  pulse.className = "sensor-pulse";
  pulse.style.setProperty("--robot-x", state.robot.x);
  pulse.style.setProperty("--robot-y", state.robot.y);
  pulse.style.setProperty("--sensor-rotation", DIRECTION_ROTATIONS[state.robot.direction]);
  pulse.setAttribute("aria-hidden", "true");
  elements.board.append(pulse);
  if (target) {
    const targetMarker = document.createElement("span");
    targetMarker.className = "sensor-target";
    targetMarker.style.setProperty("--target-x", target.x);
    targetMarker.style.setProperty("--target-y", target.y);
    targetMarker.setAttribute("aria-hidden", "true");
    elements.board.append(targetMarker);
  }
  window.setTimeout(clearBoardEffects, prefersReducedMotion() ? 40 : 380);
}

function animateRobotClass(className, duration, selector = ".robot-visual") {
  const visual = elements.board.querySelector(selector);
  if (!visual) return;
  visual.classList.remove(className);
  void visual.offsetWidth;
  visual.classList.add(className);
  if (duration) window.setTimeout(() => visual.classList.remove(className), duration);
}

function animateRobotReaction(className, duration) {
  const selector = className === "is-turning" ? "#robot-piece" : ".robot-visual";
  animateRobotClass(className, duration, selector);
}

function clearBoardEffects() {
  elements.board.querySelector(".sensor-pulse")?.remove();
  elements.board.querySelector(".sensor-target")?.remove();
  elements.board.querySelector("#robot-piece")?.classList.remove("is-turning");
  const visual = elements.board.querySelector(".robot-visual");
  if (!visual) return;
  visual.classList.remove("is-bumping", "is-arm-active", "is-delivering");
}

function getForwardCell() {
  const vector = DIRECTION_VECTORS[state.robot.direction];
  const next = { x: state.robot.x + vector.x, y: state.robot.y + vector.y };
  if (!isWithinBoard(next.x, next.y)) return next;
  return next;
}

function isWithinBoard(x, y) {
  const level = getCurrentLevel();
  return x >= 0 && y >= 0 && x < level.size && y < level.size;
}

function markSensorIntroUsed() {
  if (state.sensorIntro.used) return;
  state.sensorIntro.used = true;
  state.sensorIntroVisible = false;
  saveProgress();
  updateSensorTip();
}

function dismissSensorIntro() {
  if (state.sensorIntro.dismissed) return;
  state.sensorIntro.dismissed = true;
  state.sensorIntroVisible = false;
  saveProgress();
  updateSensorTip();
}

function markSensorIntroShown() {
  if (state.sensorIntro.shown) return;
  state.sensorIntro.shown = true;
  saveProgress();
}

function createCommandBlock(commandId) {
  if (commandId === "repeat") {
    return { type: "repeat", count: 3, commands: [] };
  }
  return { type: commandId };
}

function getCommandType(command) {
  return typeof command === "string" ? command : command?.type;
}

function countAuthoredBlocks(commands) {
  return commands.reduce((total, command) => {
    if (getCommandType(command) !== "repeat") return total + 1;
    return total + 1 + countAuthoredBlocks(command.commands || []);
  }, 0);
}

function canAddAuthoredBlocks(amount) {
  return countAuthoredBlocks(state.programCommands) + amount <= getCurrentLevel().maxCommands;
}

function compileProgram(commands) {
  const steps = [];
  for (let topIndex = 0; topIndex < commands.length; topIndex += 1) {
    const command = commands[topIndex];
    const commandId = getCommandType(command);
    if (commandId !== "repeat") {
      steps.push({
        commandId,
        topIndex,
        nestedIndex: -1,
        iteration: 0,
        totalIterations: 0,
      });
      continue;
    }
    const nested = command.commands || [];
    if (nested.length === 0) {
      return { ok: false, message: "Loopen är tom. Lägg en instruktion i Upprepa-blocket först." };
    }
    const invalidNested = nested.find((nestedCommand) => {
      const nestedType = getCommandType(nestedCommand);
      return nestedType === "repeat" || nestedType === "pickup" || nestedType === "drop";
    });
    if (invalidNested) {
      return { ok: false, message: "Loopen kan bara innehålla rörelseinstruktioner just nu." };
    }
    const repeatCount = clampNumber(command.count, 2, 5, 3);
    for (let iteration = 1; iteration <= repeatCount; iteration += 1) {
      nested.forEach((nestedCommand, nestedIndex) => {
        steps.push({
          commandId: getCommandType(nestedCommand),
          topIndex,
          nestedIndex,
          iteration,
          totalIterations: repeatCount,
        });
      });
    }
  }
  return { ok: true, steps };
}

function createEmptyPackageState() {
  return {
    carrying: false,
    delivered: false,
    collected: false,
    position: null,
  };
}

function createPackageState(level) {
  if (!level.package) return createEmptyPackageState();
  return {
    carrying: false,
    delivered: false,
    collected: false,
    position: { ...level.package },
  };
}

function isPackageAt(x, y) {
  return (
    !state.packageState.carrying &&
    !state.packageState.delivered &&
    state.packageState.position?.x === x &&
    state.packageState.position?.y === y
  );
}

async function executePickup(runId, delay) {
  const level = getCurrentLevel();
  if (!level.package) return { type: "failure", message: "Här finns inget paket att hämta." };
  if (state.packageState.carrying) {
    return { type: "failure", message: "Robotarmen håller redan ett paket." };
  }
  if (state.packageState.collected || state.packageState.delivered) {
    return { type: "failure", message: "Paketet är redan hämtat." };
  }
  const target = getForwardCell();
  if (!target || !isPackageAt(target.x, target.y)) {
    return { type: "failure", message: "Robotarmen hittar inget paket framför sig." };
  }
  animateArm("is-arm-active", delay);
  await wait(delay);
  if (!isRunActive(runId)) return "cancelled";
  state.packageState.carrying = true;
  state.packageState.collected = true;
  state.packageState.position = null;
  renderBoard();
  updateObjectiveStatus();
  showStatus("Robotarmen plockade upp paketet.", "success");
  return "picked-up";
}

async function executeDrop(runId, delay) {
  const level = getCurrentLevel();
  if (!level.delivery) return { type: "failure", message: "Här finns ingen leveransplats." };
  if (!state.packageState.carrying) {
    return { type: "failure", message: "Robotarmen är tom. Hämta paketet först." };
  }
  const target = getForwardCell();
  if (!target || !samePosition(target, level.delivery)) {
    return { type: "failure", message: "Leveransplatsen måste vara framför roboten." };
  }
  animateArm("is-delivering", delay);
  await wait(delay);
  if (!isRunActive(runId)) return "cancelled";
  state.packageState.carrying = false;
  state.packageState.delivered = true;
  state.packageState.position = { ...level.delivery };
  renderBoard();
  updateObjectiveStatus();
  showStatus("Paketet är levererat.", "success");
  return "delivered";
}

function animateArm(className, duration) {
  const visual = elements.board.querySelector(".robot-visual");
  if (!visual) return;
  visual.classList.remove("is-arm-active", "is-delivering");
  void visual.offsetWidth;
  visual.classList.add(className);
  if (duration) window.setTimeout(() => visual.classList.remove(className), duration);
}

// ----- AI lab ---------------------------------------------------------------

function createAIObject(id, name, trueCategory, group, visual, features, description) {
  return {
    id,
    name,
    trueCategory,
    group,
    visual: normalizeAIVisual(visual),
    features,
    description,
  };
}

function normalizeAIVisual(visual) {
  if (!visual || typeof visual !== "object") {
    return {
      type: "generic",
      variant: "plain",
      accent: "silver",
      detail: "none",
      background: "#eef1ff",
    };
  }
  return {
    type: visual.type || "generic",
    variant: visual.variant || "plain",
    accent: visual.accent || "silver",
    detail: visual.detail || "none",
    background: visual.background || "#eef1ff",
  };
}

function getAIObjectsByGroup(group) {
  return AI_OBJECTS.filter((item) => item.group === group);
}

function openAILab() {
  if (!state.bestStars["8"]) {
    showStatus("Klara Robotarmen först.", "warning");
    return;
  }
  showScreen("ai-lab");
}

function renderAILab() {
  const stageLabels = {
    training: "Steg 1 av 2 · Träningslabbet",
    testing: "Steg 1 av 2 · Testa modellen",
    sorting: "Steg 2 av 2 · Sorteringsuppdraget",
    complete: "AI-labbet klart",
  };
  elements.aiStageProgress.textContent = stageLabels[state.aiLab.stage] || stageLabels.training;
  elements.aiCameraStatus.textContent = state.aiLab.completed
    ? "Kamera installerad · Uppdrag klart"
    : state.aiLab.installed
      ? "Kamera installerad"
      : state.aiLab.trained
        ? "AI-kameran är tränad"
        : "AI-kameran är otränad";

  const intro = state.aiLab.hasSeenIntro ? "" : renderAILabIntroduction();
  if (state.aiLab.training) {
    elements.aiLabContent.innerHTML = `${intro}${renderAITrainingProgress()}`;
    return;
  }
  if (state.aiLab.stage === "testing") {
    elements.aiLabContent.innerHTML = `${intro}${renderAITestStage()}`;
    return;
  }
  if (state.aiLab.stage === "sorting") {
    elements.aiLabContent.innerHTML = `${intro}${renderAISortingStage()}`;
    return;
  }
  if (state.aiLab.stage === "complete") {
    elements.aiLabContent.innerHTML = `${intro}${renderAICompleteStage()}`;
    return;
  }
  elements.aiLabContent.innerHTML = `${intro}${renderAITrainingStage()}`;
}

function renderAILabIntroduction() {
  return `
    <section class="ai-intro" aria-labelledby="ai-intro-title">
      <h2 id="ai-intro-title">Så lär sig AI-kameran</h2>
      <p>Robotens kamera kan se egenskaper som färg, glans, form och genomskinlighet, men den vet inte automatiskt vad ett föremål är. Du behöver visa märkta exempel.</p>
      <p><strong>Program följer regler exakt. AI jämför nya saker med exempel och gör en bedömning.</strong></p>
      <details>
        <summary>Hur fungerar det?</summary>
        <p>När du tränar AI:n sparas egenskaperna hos dina exempel. Ett nytt föremål jämförs sedan med de mest lika exemplen. AI:n kan därför bli osäker eller ge fel svar.</p>
      </details>
      <button class="text-button ai-intro-dismiss" type="button" data-ai-action="dismiss-intro">Jag fattar</button>
    </section>
  `;
}

function renderAITrainingStage() {
  const trainingObjects = getAIObjectsByGroup("training");
  const selectedCount = Object.keys(state.aiLab.labels).length;
  const metalItems = getSelectedAIObjects("metal");
  const plasticItems = getSelectedAIObjects("plastic");
  const balance =
    metalItems.length === plasticItems.length
      ? "Jämn träning"
      : metalItems.length > plasticItems.length
        ? "Fler metallexempel"
        : "Fler plastexempel";

  return `
    <div class="ai-training-layout">
      <section class="ai-panel" aria-labelledby="training-cards-title">
        <div class="ai-panel-heading">
          <div>
            <p class="card-kicker">Träningslabbet</p>
            <h2 id="training-cards-title">Välj och märk sex kort</h2>
            <p>Du märker korten. AI:n lär sig från märkningen du ger – även om märkningen blir fel. Facit är dolt medan du tränar.</p>
          </div>
          <span class="ai-count">${selectedCount} / 6 valda</span>
        </div>
        <div class="ai-object-grid">
          ${trainingObjects.map(renderAITrainingCandidate).join("")}
        </div>
      </section>
      <aside class="ai-summary" aria-label="Min träningssamling">
        ${renderAIModelOutdatedNotice()}
        <div class="ai-summary-heading">
          <div><p class="card-kicker">Dina märkta kort</p><h2>Min träningssamling</h2></div>
          <div class="ai-balance">${balance}</div>
        </div>
        ${renderAISummaryGroup("Mina metallexempel", "metal", metalItems)}
        ${renderAISummaryGroup("Mina plastexempel", "plastic", plasticItems)}
        <p class="ai-helper-text">En jämn och varierad träningssamling kan hjälpa AI:n, men det är testet som visar hur modellen fungerar.</p>
        <button class="primary-button ai-train-action" type="button" data-ai-action="train">Träna AI-kameran</button>
      </aside>
    </div>
  `;
}

function renderAIModelOutdatedNotice() {
  if (!state.aiLab.modelOutdated) return "";
  return `
    <section class="ai-model-outdated" role="status" aria-labelledby="ai-model-outdated-title">
      <h3 id="ai-model-outdated-title">Modellen behöver tränas igen</h3>
      <p>Du har ändrat träningskorten. Den gamla modellen använder fortfarande de tidigare exemplen.</p>
    </section>
  `;
}

function renderAITrainingCandidate(item) {
  const assignedLabel = state.aiLab.labels[item.id];
  const active = state.aiLab.activeCandidateId === item.id;
  const assignmentText = assignedLabel ? ` Märkt som ${formatAICategory(assignedLabel)}.` : " Inte märkt.";
  return `
    <article class="ai-object-card${assignedLabel ? " is-selected" : ""}${active ? " is-active" : ""}">
      <button class="ai-card-main" type="button" data-ai-candidate="${item.id}" aria-expanded="${active || Boolean(assignedLabel)}" aria-label="${item.name}. ${item.description}${assignmentText} Välj kortet för att visa märkning.">
        ${renderAIObjectVisual(item, { decorative: true })}
        <strong>${item.name}</strong>
        <small>${item.description}</small>
        ${active ? renderAIFeatures(item) : ""}
        ${assignedLabel ? `<span class="ai-assigned-label">Märkt som ${formatAICategory(assignedLabel)}</span>` : ""}
      </button>
      ${
        active || assignedLabel
          ? `<div class="ai-label-actions" aria-label="Märk ${item.name}">
              <button class="ai-label-button" type="button" data-ai-label-id="${item.id}" data-label="metal" aria-label="Märk ${item.name} som Metall" aria-pressed="${assignedLabel === "metal"}">${assignedLabel === "metal" ? '<span aria-hidden="true">✓ </span>' : ""}Metall</button>
              <button class="ai-label-button" type="button" data-ai-label-id="${item.id}" data-label="plastic" aria-label="Märk ${item.name} som Plast" aria-pressed="${assignedLabel === "plastic"}">${assignedLabel === "plastic" ? '<span aria-hidden="true">✓ </span>' : ""}Plast</button>
            </div>`
          : ""
      }
    </article>
  `;
}

function renderAISummaryGroup(title, label, items) {
  return `
    <section class="ai-summary-group">
      <h3>${title}</h3>
      ${
        items.length
          ? `<div class="ai-summary-list">${items.map((item) => renderAISummaryItem(item, label)).join("")}</div>`
          : '<p class="ai-summary-empty">Inga kort ännu.</p>'
      }
    </section>
  `;
}

function renderAISummaryItem(item, label) {
  const otherLabel = label === "metal" ? "plastic" : "metal";
  return `
    <div class="ai-summary-item">
      ${renderAIObjectVisual(item, { size: "summary", decorative: true })}
      <span><strong>${item.name}</strong><small>Märkt som ${formatAICategory(label)}</small></span>
      <span class="ai-summary-actions">
        <button class="ai-item-action" type="button" data-ai-label-id="${item.id}" data-label="${otherLabel}" aria-label="Märk ${item.name} som ${formatAICategoryTitle(otherLabel)}">Byt till ${formatAICategory(otherLabel)}</button>
        <button class="ai-item-action" type="button" data-ai-remove="${item.id}" aria-label="Ta bort ${item.name} från träningssamlingen">Ta bort</button>
      </span>
    </div>
  `;
}

function renderAITrainingProgress() {
  return `
    <section class="ai-panel ai-training-progress" aria-live="polite">
      <div class="ai-scanner" aria-hidden="true"></div>
      <h2>${state.aiLab.trainingStep || "Läser träningskort…"}</h2>
      <p class="ai-helper-text">AI-kameran jämför de fem synliga egenskaperna i dina sex märkta exempel.</p>
    </section>
  `;
}

function renderAITestStage() {
  const testObjects = getAIObjectsByGroup("testing");
  if (state.aiLab.testResults.length === testObjects.length && state.aiLab.testIndex >= testObjects.length) {
    return renderAITestSummary();
  }
  const item = testObjects[state.aiLab.testIndex] || testObjects[0];
  const prediction = state.aiLab.currentPrediction;
  return `
    <section class="ai-panel ai-sequential-test" aria-labelledby="ai-test-title">
      <div class="ai-panel-heading">
        <div>
          <p class="card-kicker">Test med nya föremål</p>
          <h2 id="ai-test-title" tabindex="-1">Testa AI-kameran</h2>
          <p>Nu testar vi AI:n på nya föremål som inte fanns i träningen.</p>
        </div>
        <span class="ai-count">Test ${state.aiLab.testIndex + 1} av ${testObjects.length}</span>
      </div>
      <div class="ai-current-test${state.aiLab.scanRunning ? " is-scanning" : ""}">
        <article class="ai-current-object">
          <div class="ai-test-camera" aria-hidden="true"><span></span></div>
          ${renderAIObjectVisual(item, { size: "test", decorative: true })}
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          ${renderAIFeatures(item, true)}
        </article>
        <div class="ai-test-workflow">
          ${renderAICurrentTestState(item, prediction)}
        </div>
      </div>
    </section>
  `;
}

function renderAICurrentTestState(item, prediction) {
  if (state.aiLab.scanRunning) {
    return `<div class="ai-scan-state" role="status"><strong>AI-kameran undersöker föremålet…</strong><span>Jämför med dina märkta exempel.</span></div>`;
  }
  if (!state.aiLab.testScanned || !prediction) {
    return `
      <div class="ai-before-scan">
        <p><strong>AI:n jämför nya saker med exempel som du har märkt.</strong></p>
        <button class="primary-button" type="button" data-ai-action="scan">Låt AI:n undersöka</button>
      </div>`;
  }
  const revealed = state.aiLab.testRevealed;
  return `
    <section class="ai-prediction-panel" aria-labelledby="ai-prediction-title">
      <p class="card-kicker">AI-kamerans svar</p>
      <h3 id="ai-prediction-title" tabindex="-1">AI:n tror: ${formatAICategoryTitle(prediction.predictedLabel)}</h3>
      <div class="ai-confidence"><span>AI:ns säkerhetsnivå</span><strong>${prediction.confidenceBand}</strong></div>
      <p class="ai-confidence-note">Säkerhetsnivån visar hur tydligt träningsexemplen pekar åt samma håll. Den garanterar inte att svaret är rätt.</p>
      <p class="ai-model-reason">${getPreRevealExplanation(prediction)}</p>
    </section>
    ${renderAINeighbors(prediction)}
    ${revealed ? renderAIFacit(item, prediction) : `<button class="primary-button" type="button" data-ai-action="reveal">Visa facit</button>`}
  `;
}

function renderAINeighbors(prediction) {
  return `
    <section class="ai-neighbors" aria-labelledby="ai-neighbors-title">
      <h3 id="ai-neighbors-title">AI:n jämförde mest med:</h3>
      <div class="ai-neighbor-grid">
        ${prediction.neighbors.map((neighbor) => {
          const item = getAIObject(neighbor.objectId);
          return `<article class="ai-neighbor-card">
            ${renderAIObjectVisual(item, { size: "neighbor", decorative: true })}
            <strong>${item.name}</strong>
            <span>Märkt som ${formatAICategory(neighbor.assignedLabel)}</span>
            <small>${neighbor.similarity}</small>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

function renderAIFacit(item, prediction) {
  const finalAction = state.aiLab.testIndex === getAIObjectsByGroup("testing").length - 1
    ? "Visa testresultatet"
    : "Nästa test";
  return `
    <section class="ai-facit ${prediction.correct ? "is-correct" : "is-incorrect"}" aria-labelledby="ai-facit-title">
      <h3 id="ai-facit-title" tabindex="-1">Rätt svar: ${formatAICategoryTitle(item.trueCategory)}</h3>
      <p class="ai-result-mark ${prediction.correct ? "is-correct" : "is-incorrect"}">${prediction.correct ? "AI:n bedömde rätt." : "AI:n bedömde fel."}</p>
      <p>${getPostRevealFeedback(prediction)}</p>
      <div class="ai-test-actions">
        <button class="primary-button" type="button" data-ai-action="next-test">${finalAction}</button>
      </div>
    </section>`;
}

function renderAITestSummary() {
  const results = state.aiLab.testResults;
  const score = results.filter((result) => result.correct).length;
  const messages = [
    "AI:n behöver bättre träning.",
    "AI:n behöver bättre träning.",
    "AI:n har börjat hitta mönster, men behöver bättre exempel.",
    "Bra modell! Den klarade de flesta nya föremålen.",
    "Stark modell! Dina exempel fungerade bra på nya föremål.",
  ];
  return `<section class="ai-panel" aria-labelledby="ai-test-summary-title">
    <div class="ai-panel-heading"><div><p class="card-kicker">Test med nya föremål</p><h2 id="ai-test-summary-title" tabindex="-1">AI-testet</h2><p>${messages[score]}</p></div><span class="ai-count">${score} / 4 rätt</span></div>
    <div class="ai-test-grid">${results.map(renderAITestResult).join("")}</div>
    <aside class="ai-improvement"><strong>Så kan du förbättra modellen</strong><p>${getDatasetSuggestion(results)}</p></aside>
    <div class="ai-test-actions"><button class="secondary-button" type="button" data-ai-action="improve">Förbättra träningsdata</button><button class="primary-button" type="button" data-ai-action="install">Installera i roboten</button></div>
  </section>`;
}

function renderAITestResult(result) {
  const item = getAIObject(result.objectId);
  return `<article class="ai-test-card ${result.correct ? "is-correct" : "is-incorrect"}">
    ${renderAIObjectVisual(item, { decorative: true })}<strong>${item.name}</strong>
    <div class="ai-test-result"><span>AI:n sa: <strong>${formatAICategory(result.predictedLabel)}</strong></span><span>Rätt svar: <strong>${formatAICategory(item.trueCategory)}</strong></span><span>Säkerhetsnivå: <strong>${result.confidenceBand}</strong></span><span class="ai-result-mark ${result.correct ? "is-correct" : "is-incorrect"}">${result.correct ? "Rätt bedömning" : "Fel bedömning"}</span></div>
  </article>`;
}

function renderAIFeatures(item, open = false) {
  const labels = { shine: "Glans", transparency: "Genomskinlighet", roundness: "Rundhet", blueAmount: "Blå färg", roughness: "Strävhet" };
  return `<details class="ai-features"${open ? " open" : ""}><summary>Det kameran ser</summary><dl>${AI_FEATURE_KEYS.map((key) => `<div><dt>${labels[key]}</dt><dd>${formatAIFeatureLevel(item.features[key])}</dd></div>`).join("")}</dl></details>`;
}

function renderAIConceptStrip() {
  return `
    <div class="ai-concept-strip" aria-label="Så samarbetar robotens delar">
      <span><strong>Program</strong><br />ger exakta instruktioner.</span>
      <span><strong>Sensor</strong><br />samlar information.</span>
      <span><strong>AI</strong><br />bedömer en kategori från exempel.</span>
      <span><strong>Aktuator</strong><br />flyttar föremålet.</span>
    </div>
  `;
}

function renderAISortingStage() {
  const sortingObjects = getAIObjectsByGroup("sorting");
  const current = sortingObjects[state.aiLab.sortingIndex];
  if (!current) {
    const score = state.aiLab.sortingResults.filter((result) => result.correct).length;
    return `<section class="ai-panel ai-complete-card" aria-labelledby="sorting-summary-title"><p class="eyebrow">Sorteringsresultat</p><h2 id="sorting-summary-title">${score} av 3 föremål hamnade rätt</h2><p class="completion-message">Programmet och robotarmen fungerade, men AI-kamerans bedömningar behöver bättre träningsdata.</p><div class="sorting-history">${state.aiLab.sortingResults.map(renderAISortingHistory).join("")}</div><div class="ai-test-actions"><button class="secondary-button" type="button" data-ai-action="improve">Förbättra modellen</button><button class="primary-button" type="button" data-ai-action="restart-sort">Kör sorteringen igen</button></div></section>`;
  }
  return `
    <section class="sorting-console" aria-labelledby="sorting-title">
      <div class="sorting-stage" id="sorting-stage">
        <span class="sorting-camera">KAMERA · AI-MODELL</span>
        <span class="sorting-robot" role="img" aria-label="Samma robot som använder sin kamera och robotarm"></span>
        ${renderAIObjectVisual(current, { size: "sorting", className: "sorting-object", decorative: true })}
        <span class="sorting-bin metal">METALL</span>
        <span class="sorting-bin plastic">PLAST</span>
      </div>
      <div class="sorting-controls">
        <p class="card-kicker">Sorteringsuppdraget</p>
        <h2 id="sorting-title">Föremål ${state.aiLab.sortingIndex + 1} av ${sortingObjects.length}: ${current.name}</h2>
        <p>Programmet startar kameran. Sensorn samlar egenskaper. Din AI-modell bedömer materialet. Robotarmen sorterar efter svaret.</p>
        <div class="sorting-history">
          ${
            state.aiLab.sortingResults.length
              ? state.aiLab.sortingResults.map(renderAISortingHistory).join("")
              : '<p class="ai-summary-empty">Inga föremål sorterade ännu.</p>'
          }
        </div>
        <button class="primary-button" type="button" data-ai-action="sort" ${state.aiLab.sortingRunning ? "disabled" : ""}>
          ${state.aiLab.sortingRunning ? "Roboten sorterar…" : "Låt modellen sortera"}
        </button>
        <button class="secondary-button" type="button" data-ai-action="improve" ${state.aiLab.sortingRunning ? "disabled" : ""}>Förbättra träningsdata</button>
        ${renderAIConceptStrip()}
      </div>
    </section>
  `;
}

function renderAISortingHistory(result) {
  return `
    <div class="sorting-history-item">
      <span class="sorting-history-label">${renderAIObjectVisual(result.item, { size: "history", decorative: true })}<span>${result.item.name}</span></span>
      <strong>${formatAICategory(result.predictedLabel)} ${result.correct ? "✓" : "· fel"}</strong>
    </div>
  `;
}

function renderAICompleteStage() {
  const score = state.aiLab.sortingResults.filter((result) => result.correct).length;
  return `
    <section class="ai-panel ai-complete-card">
      <div class="completion-robot" aria-hidden="true"></div>
      <p class="eyebrow">AI-labbet klart!</p>
      <h2>Din modell styrde robotens sortering</h2>
      <p class="completion-message">Roboten sorterade ${score} av 3 föremål rätt med modellen som byggdes av dina märkta exempel.</p>
      <div class="learning-card">
        <span aria-hidden="true">💡</span>
        <p><strong>Det du lärde roboten förändrade spelet.</strong> Programmet startade arbetet, kameran samlade information, AI:n gjorde en bedömning och robotarmen utförde handlingen.</p>
      </div>
      <div class="ai-test-actions">
        <button class="secondary-button" type="button" data-ai-action="improve">Träna en ny modell</button>
        <button class="primary-button" type="button" data-ai-action="levels">Till uppdragskartan</button>
      </div>
    </section>
  `;
}

function renderAIObjectVisual(item, options = {}) {
  const visual = normalizeAIVisual(item?.visual);
  const size = options.size || "card";
  const className = options.className ? ` ${options.className}` : "";
  const accessibility = options.decorative
    ? ' aria-hidden="true"'
    : ` role="img" aria-label="${item.description}"`;
  return `
    <span
      class="ai-object-visual ai-object-visual--${size} ai-type-${visual.type} ai-variant-${visual.variant} ai-accent-${visual.accent} ai-detail-${visual.detail}${className}"
      style="--object-bg:${visual.background}"
      ${accessibility}
    >
      <span class="ai-object-body"></span>
      <span class="ai-object-detail ai-object-detail-primary"></span>
      <span class="ai-object-detail ai-object-detail-secondary"></span>
    </span>
  `;
}

function getSelectedAIObjects(label) {
  return getAIObjectsByGroup("training").filter((item) => state.aiLab.labels[item.id] === label);
}

function selectAICandidate(id) {
  if (state.aiLab.training) return;
  if (!state.aiLab.labels[id] && Object.keys(state.aiLab.labels).length >= 6) {
    showAIStatus("Träningssamlingen är full. Ta bort ett kort för att välja ett annat.", "warning");
    return;
  }
  state.aiLab.activeCandidateId = state.aiLab.activeCandidateId === id ? null : id;
  renderAILab();
}

function labelAITrainingObject(id, label) {
  if (state.aiLab.training || !["metal", "plastic"].includes(label)) return;
  const isNew = !state.aiLab.labels[id];
  if (isNew && Object.keys(state.aiLab.labels).length >= 6) {
    showAIStatus("Träningssamlingen är full. Ta bort ett kort för att välja ett annat.", "warning");
    return;
  }
  if (state.aiLab.labels[id] === label) {
    state.aiLab.activeCandidateId = null;
    renderAILab();
    return;
  }
  const hadTrainedModel = state.aiLab.trained || Boolean(state.aiLab.trainingSignature);
  const hadInstalledModel = state.aiLab.installed;
  state.aiLab.labels[id] = label;
  state.aiLab.activeCandidateId = null;
  invalidateAIModel({ hadModel: hadTrainedModel });
  saveProgress();
  renderAILab();
  showAIStatus(
    hadInstalledModel
      ? "Träningsdatan har ändrats. Den installerade AI-modellen är nu gammal. Träna och testa modellen igen."
      : hadTrainedModel
        ? "Träningsdatan har ändrats. Träna modellen igen."
        : `${getAIObject(id).name} märktes som ${formatAICategory(label)}.`,
    "info",
  );
}

function removeAITrainingObject(id) {
  if (state.aiLab.training || !state.aiLab.labels[id]) return;
  const hadTrainedModel = state.aiLab.trained || Boolean(state.aiLab.trainingSignature);
  const hadInstalledModel = state.aiLab.installed;
  delete state.aiLab.labels[id];
  state.aiLab.activeCandidateId = null;
  invalidateAIModel({ hadModel: hadTrainedModel });
  saveProgress();
  renderAILab();
  showAIStatus(
    hadInstalledModel
      ? "Träningsdatan har ändrats. Den installerade AI-modellen är nu gammal. Träna och testa modellen igen."
      : hadTrainedModel
        ? "Träningsdatan har ändrats. Träna modellen igen."
        : "Kortet togs bort från träningssamlingen.",
    "info",
  );
}

function invalidateAIModel({ hadModel = state.aiLab.trained || state.aiLab.installed } = {}) {
  state.aiLab.runId += 1;
  state.aiLab.trained = false;
  state.aiLab.installed = false;
  state.aiLab.installedSignature = "";
  state.aiLab.modelOutdated = Boolean(hadModel);
  state.aiLab.completed = false;
  state.aiLab.stage = "training";
  state.aiLab.testResults = [];
  resetCurrentAITest();
  state.aiLab.sortingIndex = 0;
  state.aiLab.sortingResults = [];
}

async function trainAIModel() {
  if (state.aiLab.training) return;
  const labels = Object.values(state.aiLab.labels);
  if (labels.length !== 6) {
    showAIStatus("Välj sex träningskort först.", "warning");
    return;
  }
  const metalCount = labels.filter((label) => label === "metal").length;
  const plasticCount = labels.filter((label) => label === "plastic").length;
  if (metalCount === 0 || plasticCount === 0) {
    showAIStatus("AI:n behöver exempel på både metall och plast.", "warning");
    return;
  }
  if (metalCount < 2 || plasticCount < 2) {
    showAIStatus("Lägg till minst två exempel i varje kategori.", "warning");
    return;
  }

  state.aiLab.training = true;
  state.aiLab.runId += 1;
  const runId = state.aiLab.runId;
  const steps = ["Läser träningskort…", "Jämför egenskaper…", "AI-kameran är tränad!"];
  const delay = prefersReducedMotion() ? 0 : 430;
  for (const step of steps) {
    if (runId !== state.aiLab.runId) return;
    state.aiLab.trainingStep = step;
    renderAILab();
    if (delay) await wait(delay);
  }
  if (runId !== state.aiLab.runId) return;
  state.aiLab.training = false;
  state.aiLab.trained = true;
  state.aiLab.installed = false;
  state.aiLab.installedSignature = "";
  state.aiLab.trainingSignature = createAITrainingSignature(state.aiLab.labels);
  state.aiLab.modelOutdated = false;
  state.aiLab.completed = false;
  state.aiLab.stage = "testing";
  state.aiLab.testResults = [];
  resetCurrentAITest();
  state.aiLab.sortingIndex = 0;
  state.aiLab.sortingResults = [];
  saveProgress();
  renderAILab();
  showAIStatus("AI-kameran är tränad! Testa hur den bedömer nya föremål.", "success");
}

function predictAIObject(item, labels = state.aiLab.labels) {
  const examples = getAIObjectsByGroup("training")
    .filter((example) => labels[example.id])
    .map((example) => ({
      item: example,
      label: labels[example.id],
      distance: calculateAIDistance(example, item),
    }))
    .sort((first, second) => first.distance - second.distance || first.item.id.localeCompare(second.item.id));
  if (!examples.length) return { objectId: item.id, label: "metal", predictedLabel: "metal", confidence: 0, confidenceBand: "Osäker", neighbors: [] };
  const neighbors = examples.slice(0, Math.min(3, examples.length));
  const votes = { metal: 0, plastic: 0 };
  neighbors.forEach((neighbor) => {
    votes[neighbor.label] += 1 / Math.max(neighbor.distance, 0.000001);
  });
  const difference = Math.abs(votes.metal - votes.plastic);
  const label =
    difference < 0.0000001
      ? neighbors[0].label
      : votes.metal > votes.plastic
        ? "metal"
        : "plastic";
  const total = votes.metal + votes.plastic;
  const margin = total ? Math.abs(votes.metal - votes.plastic) / total : 0;
  const supportingNeighbors = neighbors.filter((neighbor) => neighbor.label === label).length;
  const confidenceBand = getAIConfidenceBand(margin, supportingNeighbors);
  return {
    objectId: item.id,
    label,
    predictedLabel: label,
    confidence: total ? votes[label] / total : 0,
    trueCategory: item.trueCategory,
    correct: label === item.trueCategory,
    metalScore: votes.metal,
    plasticScore: votes.plastic,
    scoreMargin: margin,
    confidenceBand,
    neighbors: neighbors.map((neighbor) => ({
      objectId: neighbor.item.id,
      assignedLabel: neighbor.label,
      trueCategory: neighbor.item.trueCategory,
      distance: neighbor.distance,
      similarity: getAISimilarityDescriptor(neighbor.distance),
    })),
  };
}

function calculateAIDistance(first, second) {
  return Math.sqrt(
    AI_FEATURE_KEYS.reduce((sum, key) => {
      const difference = first.features[key] - second.features[key];
      return sum + difference * difference;
    }, 0),
  );
}

function evaluateAIModel(labels = state.aiLab.labels) {
  return getAIObjectsByGroup("testing").map((item) => predictAIObject(item, labels));
}

function getAIConfidenceBand(margin, supportingNeighbors) {
  if (margin < 0.22 || supportingNeighbors < 2) return "Osäker";
  if (margin >= 0.55 && supportingNeighbors === 3) return "Säker";
  return "Ganska säker";
}

function getAISimilarityDescriptor(distance) {
  if (distance <= 0.4) return "Mycket lik";
  if (distance <= 0.75) return "Ganska lik";
  return "Lite lik";
}

function formatAIFeatureLevel(value) {
  if (value < 1 / 3) return "Låg";
  if (value < 2 / 3) return "Medel";
  return "Hög";
}

function formatAICategoryTitle(label) {
  const category = formatAICategory(label);
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function resetCurrentAITest() {
  state.aiLab.testIndex = 0;
  state.aiLab.testScanned = false;
  state.aiLab.testRevealed = false;
  state.aiLab.currentPrediction = null;
  state.aiLab.scanRunning = false;
}

async function scanCurrentAITest() {
  if (!state.aiLab.trained || state.aiLab.scanRunning || state.aiLab.testScanned) return;
  const item = getAIObjectsByGroup("testing")[state.aiLab.testIndex];
  if (!item) return;
  state.aiLab.runId += 1;
  const runId = state.aiLab.runId;
  state.aiLab.currentPrediction = predictAIObject(item);
  state.aiLab.scanRunning = true;
  renderAILab();
  showAIStatus("AI-kameran undersöker föremålet…", "info");
  await wait(prefersReducedMotion() ? 0 : 800);
  if (runId !== state.aiLab.runId || state.currentScreen !== "ai-lab") return;
  state.aiLab.scanRunning = false;
  state.aiLab.testScanned = true;
  renderAILab();
  showAIStatus(`AI:n tror: ${formatAICategoryTitle(state.aiLab.currentPrediction.predictedLabel)}. Säkerhetsnivå: ${state.aiLab.currentPrediction.confidenceBand}.`, "info");
  focusAIElement("#ai-prediction-title");
}

function revealCurrentAIFacit() {
  if (!state.aiLab.testScanned || state.aiLab.testRevealed || !state.aiLab.currentPrediction) return;
  state.aiLab.testRevealed = true;
  if (!state.aiLab.testResults.some((result) => result.objectId === state.aiLab.currentPrediction.objectId)) {
    state.aiLab.testResults.push(state.aiLab.currentPrediction);
  }
  saveProgress();
  renderAILab();
  showAIStatus(state.aiLab.currentPrediction.correct ? "AI:n bedömde rätt." : "AI:n bedömde fel.", state.aiLab.currentPrediction.correct ? "success" : "warning");
  focusAIElement("#ai-facit-title");
}

function advanceAITest() {
  if (!state.aiLab.testRevealed || state.aiLab.scanRunning) return;
  state.aiLab.testIndex += 1;
  state.aiLab.testScanned = false;
  state.aiLab.testRevealed = false;
  state.aiLab.currentPrediction = null;
  saveProgress();
  renderAILab();
  if (state.aiLab.testIndex < getAIObjectsByGroup("testing").length) {
    showAIStatus(`Test ${state.aiLab.testIndex + 1} av 4.`, "info");
    focusAIElement("#ai-test-title");
  } else {
    showAIStatus("Alla fyra tester är klara.", "success");
    focusAIElement("#ai-test-summary-title");
  }
}

function focusAIElement(selector) {
  requestAnimationFrame(() => elements.aiLabContent.querySelector(selector)?.focus());
}

function getPreRevealExplanation(prediction) {
  return `De starkast liknande exemplen var märkta som ${formatAICategory(prediction.predictedLabel)}. Därför valde AI:n ${formatAICategory(prediction.predictedLabel)}.`;
}

function getPostRevealFeedback(prediction) {
  const mislabelled = prediction.neighbors.filter((neighbor) => neighbor.assignedLabel !== neighbor.trueCategory);
  if (mislabelled.length > 1) return "Flera liknande träningskort hade fel märkning. AI:n lärde sig från de märkningarna.";
  if (mislabelled.length === 1) return `Ett liknande träningskort var märkt som ${formatAICategoryTitle(mislabelled[0].assignedLabel)}. AI:n lär sig från märkningen du gav, även när märkningen blir fel.`;
  const mixed = new Set(prediction.neighbors.map((neighbor) => neighbor.assignedLabel)).size > 1;
  if (prediction.confidenceBand === "Osäker" || prediction.scoreMargin < 0.3) return "Det nya föremålet liknade exempel från båda kategorierna. Därför var AI:n osäker.";
  if (mixed) return "Det nya föremålet liknade exempel från båda kategorierna. De starkaste likheterna avgjorde svaret.";
  const counts = getAssignedLabelCounts();
  const other = prediction.predictedLabel === "metal" ? "plastic" : "metal";
  if (counts[prediction.predictedLabel] >= counts[other] * 2) return `AI:n fick fler exempel märkta som ${formatAICategory(prediction.predictedLabel)}. Det kan göra att den oftare väljer den kategorin.`;
  if (hasLowAIVariety(prediction.predictedLabel)) return `Dina ${formatAICategory(prediction.predictedLabel)}exempel liknade varandra mycket. Ett mer annorlunda exempel kan hjälpa AI:n med nya föremål.`;
  return prediction.correct
    ? "De mest liknande träningsexemplen pekade tydligt mot rätt kategori."
    : "Träningsexemplen pekade mot fel kategori för det här föremålet. Försök välja mer varierade exempel och träna igen.";
}

function getAssignedLabelCounts() {
  return Object.values(state.aiLab.labels).reduce((counts, label) => ({ ...counts, [label]: counts[label] + 1 }), { metal: 0, plastic: 0 });
}

function hasLowAIVariety(label) {
  const items = getSelectedAIObjects(label);
  if (items.length < 2) return false;
  const distances = items.flatMap((item, index) => items.slice(index + 1).map((other) => calculateAIDistance(item, other)));
  return distances.reduce((sum, value) => sum + value, 0) / distances.length < 0.45;
}

function getDatasetSuggestion(results) {
  const selected = getAIObjectsByGroup("training").filter((item) => state.aiLab.labels[item.id]);
  if (selected.some((item) => state.aiLab.labels[item.id] !== item.trueCategory)) return "Kontrollera märkningarna. Ett felmärkt kort kan lära AI:n fel.";
  const counts = getAssignedLabelCounts();
  if (Math.max(counts.metal, counts.plastic) >= Math.min(counts.metal, counts.plastic) * 2) return "Prova en jämnare blandning av metallexempel och plastexempel.";
  if (hasLowAIVariety("metal") || hasLowAIVariety("plastic")) return "Byt ut ett mycket likt kort mot ett exempel som ser annorlunda ut.";
  if (results.filter((result) => result.confidenceBand === "Osäker").length >= 2) return "AI:n var osäker flera gånger. Mer varierade exempel kan göra skillnaden tydligare.";
  return "Din modell fungerade bra. Testa att byta ett exempel och se hur resultatet förändras.";
}

function returnToAITraining() {
  state.aiLab.runId += 1;
  state.aiLab.stage = "training";
  state.aiLab.training = false;
  state.aiLab.scanRunning = false;
  state.aiLab.sortingRunning = false;
  state.aiLab.activeCandidateId = null;
  saveProgress();
  renderAILab();
  showAIStatus("Ändra ett träningskort om du vill bygga och testa en ny modell.", "info");
}

function createAITrainingSignature(labels) {
  return Object.entries(labels)
    .sort(([firstId], [secondId]) => firstId.localeCompare(secondId))
    .map(([id, label]) => `${id}:${label}`)
    .join("|");
}

function installAIModel() {
  if (!state.aiLab.trained || state.aiLab.testResults.length !== getAIObjectsByGroup("testing").length) return;
  if (state.aiLab.trainingSignature !== createAITrainingSignature(state.aiLab.labels)) {
    showAIStatus("Träningsdatan har ändrats. Träna modellen igen.", "warning");
    return;
  }
  state.aiLab.installed = true;
  state.aiLab.installedSignature = state.aiLab.trainingSignature;
  state.aiLab.stage = "sorting";
  state.aiLab.sortingIndex = 0;
  state.aiLab.sortingResults = [];
  saveProgress();
  renderAILab();
  showAIStatus("Modellen är installerad i robotens kamera.", "success");
}

async function runAISortingStep() {
  if (!state.aiLab.installed || state.aiLab.sortingRunning) return;
  if (state.aiLab.installedSignature !== createAITrainingSignature(state.aiLab.labels)) {
    invalidateAIModel({ hadModel: true });
    saveProgress();
    renderAILab();
    showAIStatus("Träningsdatan har ändrats. Den installerade AI-modellen är nu gammal. Träna och testa modellen igen.", "warning");
    return;
  }
  const item = getAIObjectsByGroup("sorting")[state.aiLab.sortingIndex];
  if (!item) return;
  state.aiLab.sortingRunning = true;
  state.aiLab.runId += 1;
  const runId = state.aiLab.runId;
  renderAILab();
  showAIStatus("Kameran samlar egenskaper och modellen jämför exempel…", "info");
  await wait(prefersReducedMotion() ? 0 : 500);
  if (runId !== state.aiLab.runId) return;
  const prediction = predictAIObject(item);
  elements.aiLabContent.querySelector("#sorting-stage")?.classList.add(`sort-${prediction.label}`);
  showAIStatus(`AI:n bedömer ${formatAICategory(prediction.label)}. Robotarmen sorterar.`, "info");
  await wait(prefersReducedMotion() ? 0 : 720);
  if (runId !== state.aiLab.runId) return;
  state.aiLab.sortingResults.push({
    item,
    predictedLabel: prediction.label,
    correct: prediction.label === item.trueCategory,
  });
  state.aiLab.sortingIndex += 1;
  state.aiLab.sortingRunning = false;
  if (state.aiLab.sortingIndex >= getAIObjectsByGroup("sorting").length) {
    const allCorrect = state.aiLab.sortingResults.every((result) => result.correct);
    state.aiLab.completed = allCorrect;
    state.aiLab.stage = allCorrect ? "complete" : "sorting";
  }
  saveProgress();
  renderAILab();
  showAIStatus(
    state.aiLab.completed
      ? "Alla föremål sorterades rätt! AI-labbet är klart."
      : state.aiLab.sortingIndex >= getAIObjectsByGroup("sorting").length
        ? "Sorteringen är klar, men modellen behöver förbättras för att klara hela uppdraget."
        : "Föremålet är sorterat. Nästa föremål väntar.",
    state.aiLab.completed ? "success" : "warning",
  );
}

function dismissAIIntroduction() {
  state.aiLab.hasSeenIntro = true;
  saveProgress();
  renderAILab();
}

function cancelAILabProcess() {
  if (!state.aiLab) return;
  state.aiLab.runId += 1;
  state.aiLab.training = false;
  state.aiLab.sortingRunning = false;
  state.aiLab.scanRunning = false;
}

function restartAISorting() {
  if (!state.aiLab.installed || state.aiLab.sortingRunning) return;
  state.aiLab.sortingIndex = 0;
  state.aiLab.sortingResults = [];
  state.aiLab.completed = false;
  state.aiLab.stage = "sorting";
  saveProgress();
  renderAILab();
  showAIStatus("Sorteringen startar om med den installerade modellen.", "info");
}

function showAIStatus(message, type = "info") {
  elements.aiStatus.textContent = message;
  elements.aiStatus.className = `status-message is-${type} ai-status`;
}

function getAIObject(id) {
  return AI_OBJECTS.find((item) => item.id === id);
}

function formatAICategory(label) {
  return label === "metal" ? "metall" : "plast";
}

// ----- Completion -----------------------------------------------------------

function showCompletionDialog(stars) {
  const level = getCurrentLevel();
  const isFinalLevel = level.id === LEVELS.length;
  elements.completionTitle.textContent = isFinalLevel
    ? "Robotlaboratoriet klart!"
    : "Snyggt programmerat!";
  elements.completionStars.innerHTML = renderStarsHtml(stars);
  elements.completionStars.setAttribute(
    "aria-label",
    `${stars} ${stars === 1 ? "stjärna" : "stjärnor"} av 3`,
  );
  elements.completionMessage.textContent = isFinalLevel
    ? "AI-labbet har öppnat! Nu kan du träna robotens kamera med egna exempel."
    : level.id === 6
      ? "Robotlaboratoriet har öppnat! Nu väntar loopar och robotarmar."
      : level.successMessage ||
        `Du klarade ${level.title} med ${countAuthoredBlocks(state.programCommands)} instruktioner.`;
  elements.completionLearning.textContent = level.learning;
  elements.nextLevelButton.textContent = isFinalLevel ? "Till uppdragskartan" : "Nästa uppdrag →";
  if (!elements.completionDialog.open) elements.completionDialog.showModal();
}

function closeCompletionDialog() {
  if (elements.completionDialog.open) elements.completionDialog.close();
}

function retryCurrentLevel() {
  closeCompletionDialog();
  initializeLevel();
}

function goToNextLevel() {
  const currentLevel = getCurrentLevel();
  closeCompletionDialog();
  if (currentLevel.id >= LEVELS.length) {
    showScreen("level");
    return;
  }
  openLevel(state.currentLevelIndex + 1);
}

// ----- Messages and helpers -------------------------------------------------

function showStatus(message, type = "info") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message is-${type}`;
}

function getCurrentLevel() {
  return LEVELS[state.currentLevelIndex];
}

function samePosition(first, second) {
  return first.x === second.x && first.y === second.y;
}

function hasPosition(list, x, y) {
  return list.some((item) => item.x === x && item.y === y);
}

function renderStarsHtml(stars) {
  return [1, 2, 3]
    .map((position) =>
      position <= stars
        ? '<span class="earned">★</span>'
        : '<span class="empty-star">★</span>',
    )
    .join("");
}

function renderLevelIcon(icon, levelId = 1) {
  const iconName = typeof icon === "string" && /^(?:loop|arm|lock)$/.test(icon) ? icon : `level-${levelId}`;
  return `<span class="workshop-icon workshop-icon-${iconName}"></span>`;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function resetAllProgress() {
  cancelExecution();
  applyDefaultProgress();
  saveProgress();
  elements.confirmDialog.close();
  renderLevelSelection();
  elements.progressBadge.textContent = "Framstegen är nollställda";
}

// ----- Events ---------------------------------------------------------------

function bindEvents() {
  document.addEventListener("pointerdown", () => {
    document.body.classList.add("is-pointer-input");
  });
  document.addEventListener("keydown", () => {
    document.body.classList.remove("is-pointer-input");
  });

  elements.startButton.addEventListener("click", () => showScreen("level"));
  elements.brandButton.addEventListener("click", () => showScreen("start"));
  elements.backStartButton.addEventListener("click", () => showScreen("start"));
  elements.backLevelsButton.addEventListener("click", () => showScreen("level"));
  elements.backAILevelsButton.addEventListener("click", () => showScreen("level"));

  elements.learnHeaderButton.addEventListener("click", openLearnDialog);
  elements.learnHeroButton.addEventListener("click", openLearnDialog);
  elements.closeLearnButton.addEventListener("click", closeLearnDialog);
  elements.learnOkButton.addEventListener("click", closeLearnDialog);
  elements.learnDialog.addEventListener("click", (event) => {
    if (event.target === elements.learnDialog) closeLearnDialog();
  });

  elements.levelGrid.addEventListener("click", (event) => {
    const aiCard = event.target.closest("[data-ai-chapter]");
    if (aiCard) {
      openAILab();
      return;
    }
    const card = event.target.closest("[data-level-index]");
    if (card) openLevel(Number(card.dataset.levelIndex));
  });

  elements.aiLabContent.addEventListener("click", (event) => {
    const action = event.target.closest("[data-ai-action]")?.dataset.aiAction;
    if (action === "dismiss-intro") dismissAIIntroduction();
    if (action === "train") trainAIModel();
    if (action === "improve") returnToAITraining();
    if (action === "install") installAIModel();
    if (action === "scan") scanCurrentAITest();
    if (action === "reveal") revealCurrentAIFacit();
    if (action === "next-test") advanceAITest();
    if (action === "sort") runAISortingStep();
    if (action === "restart-sort") restartAISorting();
    if (action === "levels") showScreen("level");

    const candidate = event.target.closest("[data-ai-candidate]");
    if (candidate) selectAICandidate(candidate.dataset.aiCandidate);
    const labelButton = event.target.closest("[data-ai-label-id]");
    if (labelButton) labelAITrainingObject(labelButton.dataset.aiLabelId, labelButton.dataset.label);
    const removeButton = event.target.closest("[data-ai-remove]");
    if (removeButton) removeAITrainingObject(removeButton.dataset.aiRemove);
  });

  elements.commandPalette.addEventListener("click", (event) => {
    const commandButton = event.target.closest("[data-command]");
    if (commandButton) addCommand(commandButton.dataset.command);
  });
  elements.sensorTipDismiss.addEventListener("click", dismissSensorIntro);

  elements.programList.addEventListener("click", (event) => {
    const nestedAddButton = event.target.closest("[data-nested-command]");
    if (nestedAddButton) {
      const item = nestedAddButton.closest("[data-command-index]");
      if (item) addNestedCommand(Number(item.dataset.commandIndex), nestedAddButton.dataset.nestedCommand);
      return;
    }
    const repeatCountButton = event.target.closest("[data-repeat-action]");
    if (repeatCountButton) {
      const item = repeatCountButton.closest("[data-command-index]");
      const change = repeatCountButton.dataset.repeatAction === "increase" ? 1 : -1;
      if (item) updateRepeatCount(Number(item.dataset.commandIndex), change);
      return;
    }
    const nestedRemoveButton = event.target.closest(".remove-nested-command");
    if (nestedRemoveButton) {
      const item = nestedRemoveButton.closest("[data-command-index]");
      const nestedItem = nestedRemoveButton.closest("[data-nested-index]");
      if (item && nestedItem) {
        removeNestedCommand(Number(item.dataset.commandIndex), Number(nestedItem.dataset.nestedIndex));
      }
      return;
    }
    const removeButton = event.target.closest(".remove-command");
    const item = removeButton?.closest("[data-command-index]");
    if (item) removeCommand(Number(item.dataset.commandIndex));
  });

  elements.clearProgramButton.addEventListener("click", clearProgram);
  elements.resetLevelButton.addEventListener("click", () => initializeLevel({ keepProgram: true }));
  elements.runProgramButton.addEventListener("click", runProgram);

  elements.retryLevelButton.addEventListener("click", retryCurrentLevel);
  elements.nextLevelButton.addEventListener("click", goToNextLevel);
  elements.completionLevelsButton.addEventListener("click", () => showScreen("level"));
  elements.completionDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    showScreen("level");
  });

  elements.resetProgressButton.addEventListener("click", () => elements.confirmDialog.showModal());
  elements.cancelResetButton.addEventListener("click", () => elements.confirmDialog.close());
  elements.confirmResetButton.addEventListener("click", resetAllProgress);
  elements.confirmDialog.addEventListener("click", (event) => {
    if (event.target === elements.confirmDialog) elements.confirmDialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.executionState.running) {
      initializeLevel({ keepProgram: true });
      showStatus("Körningen stoppades. Programmet finns kvar.", "info");
    }
    if (event.key === "Escape" && state.currentScreen === "ai-lab" && (state.aiLab.training || state.aiLab.sortingRunning)) {
      cancelAILabProcess();
      renderAILab();
      showAIStatus("Arbetet stoppades. Dina träningskort finns kvar.", "info");
    }
  });
}

function initializeApp() {
  applyBranding();
  loadProgress();
  bindEvents();
  elements.screens.forEach((screen) => {
    screen.setAttribute("aria-hidden", String(screen !== elements.startScreen));
  });
  renderLevelSelection();
}

initializeApp();

// Small read-only testing surface used by the local acceptance checks.
window.__robotverkstan = Object.freeze({
  levels: LEVELS,
  commands: COMMANDS,
  state,
  openLevel,
  initializeLevel,
  addCommand,
  clearProgram,
  runProgram,
  calculateStars,
  countAuthoredBlocks,
  compileProgram,
  isBlocked,
  checkCompletion,
  cancelExecution,
  aiObjects: AI_OBJECTS,
  predictAIObject,
  evaluateAIModel,
  calculateAIDistance,
  createAITrainingSignature,
  openAILab,
});
