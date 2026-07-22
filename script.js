"use strict";

// ----- Game data ------------------------------------------------------------

const BRAND = {
  // Update productName when a final public name is chosen.
  // Keep worldName as "Robotverkstan" if the workshop remains part of the game world.
  productName: "Robotverkstan",
  worldName: "Robotverkstan",
  tagline: "Programmera roboten, felsök steg för steg och upptäck hur regler, sensorer och AI fungerar.",
  shortDescription:
    "Ett lekfullt spel där barn lär sig programmering, robotik och AI genom att bygga, testa och förbättra en robot.",
};

const COMMANDS = {
  forward: { label: "Framåt", symbol: "↑", shortLabel: "Framåt" },
  left: { label: "Sväng vänster", symbol: "↶", shortLabel: "Vänster" },
  right: { label: "Sväng höger", symbol: "↷", shortLabel: "Höger" },
  repeat: { label: "Upprepa", symbol: "↻", shortLabel: "Upprepa" },
  if: { label: "Om sensorn…", symbol: "◇", shortLabel: "Om" },
  pickup: { label: "Plocka upp", symbol: "⌐", shortLabel: "Plocka upp" },
  drop: { label: "Lämna", symbol: "▣", shortLabel: "Lämna" },
  aiScan: { label: "Skanna med AI-kameran", symbol: "◎", shortLabel: "Skanna" },
  ifAI: { label: "Om modellen gissar metall", symbol: "AI", shortLabel: "Om modellens gissning" },
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
  {
    id: 9,
    title: "Om det är stopp",
    cardText: "Låt en regel reagera på sensorn.",
    icon: "condition",
    color: "#168a8e",
    chapter: "Roboten reagerar",
    mission: "Vägen är blockerad. Låt sensorn ge information och Om-blocket välja svängen.",
    size: 5,
    start: { x: 0, y: 2, direction: "east" },
    goal: { x: 2, y: 0 },
    obstacles: [{ x: 2, y: 2 }],
    energy: [],
    commands: ["forward", "left", "right", "if"],
    branchCommands: ["forward", "left", "right"],
    conditionSensor: "obstacleAhead",
    maxCommands: 10,
    targetCommands: 8,
    learning: "Sensorn gav information. Om-blocket valde vilken instruktion som skulle köras.",
  },
  {
    id: 10,
    title: "Roboten väljer väg",
    cardText: "Samma regel kan ge olika svar.",
    icon: "condition",
    color: "#207a78",
    chapter: "Roboten reagerar",
    mission: "Använd samma sorts villkor flera gånger. Ibland är det stopp och ibland är vägen fri.",
    size: 5,
    start: { x: 0, y: 4, direction: "north" },
    goal: { x: 1, y: 2 },
    obstacles: [{ x: 0, y: 2 }, { x: 2, y: 3 }],
    energy: [],
    commands: ["forward", "left", "right", "if"],
    branchCommands: ["forward", "left", "right"],
    conditionSensor: "obstacleAhead",
    maxCommands: 14,
    targetCommands: 11,
    learning: "Samma villkor kan välja olika grenar när sensorn får ny information.",
  },
  {
    id: 11,
    title: "Paketvakten",
    cardText: "Koppla paketsensorn till robotarmen.",
    icon: "package-sensor",
    color: "#9b6a2f",
    chapter: "Roboten reagerar",
    mission: "Kontrollera om paketet är framför roboten, plocka upp det och leverera det.",
    size: 5,
    start: { x: 0, y: 4, direction: "north" },
    goal: { x: 3, y: 2 },
    obstacles: [{ x: 2, y: 1 }],
    energy: [],
    package: { x: 0, y: 2 },
    delivery: { x: 4, y: 2 },
    commands: ["forward", "left", "right", "repeat", "if", "pickup", "drop"],
    repeatCommands: ["forward", "left", "right"],
    branchCommands: ["forward", "left", "right", "pickup"],
    conditionSensor: "packageAhead",
    maxCommands: 12,
    targetCommands: 11,
    learning: "Sensorn upptäckte paketet. Programmet bestämde när robotarmen skulle plocka upp det.",
  },
  {
    id: 12,
    title: "Sorteringslinjen",
    cardText: "Kombinera programmet med din tränade modell.",
    icon: "ai-mission",
    color: "#1e3a5f",
    chapter: "AI-uppdraget",
    signature: true,
    mission: "Samma program sorterar tre föremål. Modellen gissar material och dina regler väljer station.",
    size: 6,
    start: { x: 2, y: 5, direction: "north" },
    goal: { x: 2, y: 5 },
    obstacles: [{ x: 0, y: 3 }, { x: 5, y: 3 }],
    energy: [],
    package: { x: 2, y: 3 },
    stations: { metal: { x: 1, y: 4 }, plastic: { x: 3, y: 4 } },
    commands: ["forward", "left", "right", "pickup", "drop", "aiScan", "ifAI"],
    branchCommands: ["forward", "left", "right", "drop"],
    maxCommands: 18,
    targetCommands: 16,
    learning: "Du skrev reglerna som styrde roboten och tränade modellen som gjorde gissningarna. Båda delarna behövde fungera.",
  },
];

const LEVEL_HINTS = {
  1: ["Hur många rutor är det till laddstationen?", "Varje Framåt flyttar roboten en ruta.", "Prova två Framåt-instruktioner i ordning."],
  2: ["Roboten behöver både köra och byta riktning.", "Titta på pilen som visar vart roboten tittar.", "Kör två steg upp, sväng höger och fortsätt mot målet."],
  3: ["En vägg stoppar Framåt.", "Planera svängen innan roboten når verktygslådan.", "Gör en omväg ovanför hindret och sväng tillbaka mot målet."],
  4: ["Energicellen måste hämtas före målet.", "Dela rutten i två delar: energi, sedan mål.", "Kör upp till energin, sväng mot målet och kontrollera riktningen efter varje sväng."],
  5: ["Sensorn tittar på rutan framför roboten.", "Kör fram tills hindret är framför roboten.", "Lägg sensorinstruktionen efter två Framåt och fortsätt sedan mot målet."],
  6: ["Uppdraget kräver både energi, sensor och mål.", "Följ programmet tills sensorn står framför den övre väggen.", "Hämta energin först och låt sensorn välja svängen vid hindret."],
  7: ["Vilken instruktion behöver roboten göra flera gånger?", "Prova att lägga Framåt inuti Upprepa-blocket.", "Loopen behöver fyra varv för att nå målet."],
  8: ["Paketet måste hämtas innan roboten kör genom det.", "Ställ roboten bredvid paketet och använd Plocka upp.", "Leveransplatsen måste vara framför roboten när Lämna körs."],
  9: ["Sensorn ger information. Villkoret väljer vad programmet gör.", "Lägg svängen i DÅ-delen när sensorn hittar hindret.", "Kör fram till väggen, använd Om-blocket och fortsätt sedan mot målet."],
  10: ["Samma sensorfråga kan få olika svar på olika platser.", "Följ spåret och leta efter både JA och NEJ.", "Använd tre Om-block: två vid hinder och ett där vägen är fri."],
  11: ["Paketsensorn hittar paketet men robotarmen måste plocka.", "Lägg Plocka upp i DÅ-grenen.", "Efter hämtningen kan en loop köra längs den raka leveransvägen."],
  12: ["Kameran måste skanna innan AI-villkoret kan läsa gissningen.", "DÅ-grenen går till metallstationen och ANNARS till plaststationen.", "Varje gren behöver lämna föremålet och återvända till den markerade säkra rutan."],
};

const MASTERY_CRITERIA = {
  1: ["Nå laddstationen", "Klara körningen utan kollision", "Använd högst 2 instruktioner"],
  2: ["Nå laddstationen", "Klara körningen utan kollision", "Använd högst 5 instruktioner"],
  3: ["Nå laddstationen", "Klara körningen utan kollision", "Felsök vägen runt hindret"],
  4: ["Nå laddstationen", "Samla all energi", "Använd högst 8 instruktioner"],
  5: ["Nå laddstationen", "Använd sensorn", "Använd högst 4 instruktioner"],
  6: ["Klara hela uppdraget", "Använd sensorn", "Samla energi utan kollision"],
  7: ["Nå laddstationen", "Använd en loop", "Använd högst 2 byggda block"],
  8: ["Leverera paketet", "Undvik ogiltiga armkommandon", "Använd högst 12 byggda block"],
  9: ["Nå laddstationen", "Använd ett villkor", "Låt sensorn välja rätt del"],
  10: ["Nå laddstationen", "Få både JA och NEJ", "Använd högst 11 byggda block"],
  11: ["Leverera paketet", "Använd paketsensorns villkor", "Undvik ogiltiga armkommandon"],
  12: ["Sortera alla tre föremål", "Slutför utan programfel", "Använd AI-villkoret och högst 16 block"],
};

LEVELS.forEach((level) => {
  level.hints = LEVEL_HINTS[level.id];
  level.mastery = MASTERY_CRITERIA[level.id];
});

LEVELS[0].prediction = { question: "Var tror du att roboten stannar?", options: ["Före målet", "På målet", "Efter målet"] };
LEVELS[6].prediction = { question: "Hur många Framåt tror du att loopen kör?", options: ["2", "3", "4"] };
LEVELS[8].prediction = { question: "Vad händer när sensorn hittar ett hinder?", options: ["DÅ-delen körs", "ANNARS-delen körs"] };
LEVELS[11].prediction = { question: "Vilken station väljer modellen för första föremålet?", options: ["Metall", "Plast"] };

const AI_FEATURE_KEYS = ["shine", "transparency", "roundness", "blueAmount", "roughness"];
const AI_DATASET_VERSION = 2;
const AI_OBJECTS = [
  createAIObject("metal-can", "Konservburk", "metal", "training", { type: "can", background: "#eef1f6" }, { shine: 0.88, transparency: 0.02, roundness: 0.86, blueAmount: 0.1, roughness: 0.18 }, "En räfflad konservburk av metall."),
  createAIObject("metal-screw", "Skruv", "metal", "training", { type: "screw", background: "#eceef3" }, { shine: 0.72, transparency: 0, roundness: 0.2, blueAmount: 0.08, roughness: 0.68 }, "En metallskruv med huvud och gängor."),
  createAIObject("metal-spoon", "Metallsked", "metal", "training", { type: "spoon", background: "#f0f1f4" }, { shine: 0.82, transparency: 0.02, roundness: 0.7, blueAmount: 0.05, roughness: 0.15 }, "En blank sked av metall."),
  createAIObject("metal-key", "Nyckel", "metal", "training", { type: "key", background: "#edf0f4" }, { shine: 0.68, transparency: 0, roundness: 0.45, blueAmount: 0.08, roughness: 0.4 }, "En metallnyckel med ring och tänder."),
  createAIObject("metal-nut", "Mutter", "metal", "training", { type: "nut", background: "#eef0f3" }, { shine: 0.62, transparency: 0, roundness: 0.85, blueAmount: 0.05, roughness: 0.65 }, "En sexkantig mutter av metall."),
  createAIObject("metal-whisk", "Metallvisp", "metal", "training", { type: "whisk", background: "#edf1f4" }, { shine: 0.76, transparency: 0, roundness: 0.55, blueAmount: 0.05, roughness: 0.35 }, "En köksvisp av böjda metalltrådar."),
  createAIObject("metal-cup", "Metallmugg", "metal", "training", { type: "metal-cup", background: "#eaf0f3" }, { shine: 0.7, transparency: 0.03, roundness: 0.72, blueAmount: 0.12, roughness: 0.2 }, "En stadig mugg med blank metallyta."),
  createAIObject("metal-wrench", "Skiftnyckel", "metal", "training", { type: "wrench", background: "#eceff3" }, { shine: 0.65, transparency: 0, roundness: 0.28, blueAmount: 0.06, roughness: 0.55 }, "En skiftnyckel av metall med ställbart gap."),
  createAIObject("plastic-shampoo", "Schampoflaska", "plastic", "training", { type: "shampoo", background: "#e9f4ff" }, { shine: 0.38, transparency: 0.25, roundness: 0.68, blueAmount: 0.5, roughness: 0.18 }, "En mjuk plastflaska med snäpplock."),
  createAIObject("plastic-lunchbox", "Matlåda i plast", "plastic", "training", { type: "lunchbox", background: "#e9f7ef" }, { shine: 0.28, transparency: 0.08, roundness: 0.25, blueAmount: 0.3, roughness: 0.3 }, "En formgjuten matlåda av plast med lock."),
  createAIObject("plastic-block", "Byggkloss", "plastic", "training", { type: "block", background: "#fff1cb" }, { shine: 0.35, transparency: 0.02, roundness: 0.55, blueAmount: 0.75, roughness: 0.35 }, "En plastkloss med knoppar ovanpå."),
  createAIObject("plastic-cup", "Plastmugg", "plastic", "training", { type: "plastic-cup", background: "#e8f8fb" }, { shine: 0.42, transparency: 0.5, roundness: 0.7, blueAmount: 0.25, roughness: 0.1 }, "En tunn, formgjuten mugg av plast."),
  createAIObject("plastic-detergent", "Diskmedelsflaska", "plastic", "training", { type: "detergent", background: "#e7f8ee" }, { shine: 0.45, transparency: 0.3, roundness: 0.6, blueAmount: 0.65, roughness: 0.15 }, "En böjlig plastflaska med pipkork."),
  createAIObject("plastic-funnel", "Plasttratt", "plastic", "training", { type: "funnel", background: "#f2ecff" }, { shine: 0.3, transparency: 0.2, roundness: 0.65, blueAmount: 0.45, roughness: 0.25 }, "En plasttratt med bred öppning och smalt rör."),
  createAIObject("plastic-shovel", "Leksaksspade", "plastic", "training", { type: "shovel", background: "#fff0df" }, { shine: 0.32, transparency: 0.03, roundness: 0.4, blueAmount: 0.7, roughness: 0.4 }, "En liten formgjuten leksaksspade av plast."),
  createAIObject("plastic-basket", "Plastkorg", "plastic", "training", { type: "basket", background: "#f3edff" }, { shine: 0.25, transparency: 0.15, roundness: 0.3, blueAmount: 0.55, roughness: 0.5 }, "En plastkorg med handtag och tydliga slitsar."),
  createAIObject("test-nail", "Spik", "metal", "testing", { type: "nail", background: "#eef1f4" }, { shine: 0.7, transparency: 0, roundness: 0.15, blueAmount: 0.05, roughness: 0.6 }, "En metallspik med platt huvud och spets."),
  createAIObject("test-metal-tray", "Aluminiumform", "metal", "testing", { type: "metal-tray", background: "#edf0f4" }, { shine: 0.62, transparency: 0.02, roundness: 0.55, blueAmount: 0.08, roughness: 0.25 }, "En räfflad form av blank aluminium."),
  createAIObject("test-plastic-ruler", "Plastlinjal", "plastic", "testing", { type: "ruler", background: "#e8f5ff" }, { shine: 0.3, transparency: 0.12, roundness: 0.18, blueAmount: 0.6, roughness: 0.2 }, "En genomskinlig plastlinjal med måttstreck."),
  createAIObject("test-spray-bottle", "Sprayflaska i plast", "plastic", "testing", { type: "spray", background: "#eaf8f2" }, { shine: 0.42, transparency: 0.3, roundness: 0.6, blueAmount: 0.55, roughness: 0.2 }, "En plastflaska med handtag och spraymunstycke."),
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
const demoParams = new URLSearchParams(window.location.search);
const requestedDemoLevel = Number(demoParams.get("level"));
const demoState = {
  enabled: demoParams.get("demo") === "1",
  unlockAll: demoParams.get("demo") === "1",
  requestedLevel: Number.isInteger(requestedDemoLevel) && LEVELS.some((level) => level.id === requestedDemoLevel)
    ? requestedDemoLevel
    : null,
  requestedScreen: demoParams.get("screen") === "ai-lab" ? "ai-lab" : null,
};
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
  signatureMission: {
    program: [],
    updatedAt: null,
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
    traceMode: false,
    plan: [],
    pointer: 0,
    history: [],
    failure: null,
    activeCommandIndex: -1,
    activeNestedIndex: -1,
    activeBranch: "",
    activeBranchIndex: -1,
    repeatIteration: 0,
    repeatTotal: 0,
    lastSensorResult: null,
    metrics: createAttemptMetrics(),
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
  hintLevel: 0,
  prediction: { choice: "", skipped: false, compared: false },
  signatureState: createSignatureState(),
  signatureProgram: [],
  signatureProgramUpdatedAt: null,
  returnToSignature: false,
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
  demoNotice: document.querySelector("#demo-notice"),
  developmentDemoButton: document.querySelector("#development-demo-button"),
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
  masteryPanel: document.querySelector("#mastery-panel"),
  masteryToggle: document.querySelector("#mastery-toggle"),
  masteryCriteria: document.querySelector("#mastery-criteria"),
  predictionPanel: document.querySelector("#prediction-panel"),
  predictionQuestion: document.querySelector("#prediction-question"),
  predictionOptions: document.querySelector("#prediction-options"),
  predictionSkip: document.querySelector("#prediction-skip"),
  predictionResult: document.querySelector("#prediction-result"),
  conditionIntro: document.querySelector("#condition-intro"),
  sensorTip: document.querySelector("#sensor-tip"),
  sensorTipDismiss: document.querySelector("#sensor-tip-dismiss"),
  clearProgramButton: document.querySelector("#clear-program-button"),
  resetLevelButton: document.querySelector("#reset-level-button"),
  runProgramButton: document.querySelector("#run-program-button"),
  traceStartButton: document.querySelector("#trace-start-button"),
  tracePanel: document.querySelector("#trace-panel"),
  tracePosition: document.querySelector("#trace-position"),
  traceDescription: document.querySelector("#trace-description"),
  traceNextButton: document.querySelector("#trace-next-button"),
  traceRunButton: document.querySelector("#trace-run-button"),
  traceRewindButton: document.querySelector("#trace-rewind-button"),
  traceExitButton: document.querySelector("#trace-exit-button"),
  hintButton: document.querySelector("#hint-button"),
  hintPanel: document.querySelector("#hint-panel"),
  hintTitle: document.querySelector("#hint-title"),
  hintText: document.querySelector("#hint-text"),
  nextHintButton: document.querySelector("#next-hint-button"),
  hintCloseButton: document.querySelector("#hint-close-button"),
  signatureFeedback: document.querySelector("#signature-feedback"),
  statusMessage: document.querySelector("#status-message"),
  learnDialog: document.querySelector("#learn-dialog"),
  closeLearnButton: document.querySelector("#close-learn-button"),
  learnOkButton: document.querySelector("#learn-ok-button"),
  completionDialog: document.querySelector("#completion-dialog"),
  completionTitle: document.querySelector("#completion-title"),
  completionStars: document.querySelector("#completion-stars"),
  completionMessage: document.querySelector("#completion-message"),
  completionLearning: document.querySelector("#completion-learning"),
  completionCriteria: document.querySelector("#completion-criteria"),
  nextLevelButton: document.querySelector("#next-level-button"),
  retryLevelButton: document.querySelector("#retry-level-button"),
  completionLevelsButton: document.querySelector("#completion-levels-button"),
  confirmDialog: document.querySelector("#confirm-dialog"),
  confirmTitle: document.querySelector("#confirm-title"),
  confirmMessage: document.querySelector("#confirm-message"),
  cancelResetButton: document.querySelector("#cancel-reset-button"),
  confirmResetButton: document.querySelector("#confirm-reset-button"),
};

// ----- Persistence ----------------------------------------------------------

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return;
    state.bestStars = sanitizeStars(saved.bestStars);
    const migratedUnlock = state.bestStars["8"]
      ? Math.max(Number(saved.unlockedLevel) || 1, 9)
      : state.bestStars["6"] && !state.bestStars["7"]
        ? Math.max(Number(saved.unlockedLevel) || 1, 7)
        : saved.unlockedLevel;
    state.unlockedLevel = clampNumber(migratedUnlock, 1, LEVELS.length, 1);
    state.hasSeenInfo = Boolean(saved.hasSeenInfo);
    state.sensorIntro = sanitizeSensorIntro(saved.sensorIntro);
    state.aiLab = sanitizeAILab(saved.aiLab);
    const signatureMission = sanitizeSignatureMission(
      saved.signatureMission || { program: saved.signatureProgram },
    );
    state.signatureProgram = signatureMission.program;
    state.signatureProgramUpdatedAt = signatureMission.updatedAt;
  } catch {
    applyDefaultProgress();
  }
}

function saveProgress() {
  if (demoState.enabled) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        unlockedLevel: state.unlockedLevel,
        bestStars: state.bestStars,
        hasSeenInfo: state.hasSeenInfo,
        sensorIntro: state.sensorIntro,
        aiLab: getPersistentAILabState(),
        signatureMission: getPersistentSignatureMissionState(),
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
  state.signatureProgram = [];
  state.signatureProgramUpdatedAt = null;
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

function sanitizeSignatureMission(value) {
  const program = sanitizeSignatureProgram(value?.program);
  const parsedUpdatedAt = typeof value?.updatedAt === "string" ? Date.parse(value.updatedAt) : NaN;
  return {
    program,
    updatedAt: program.length && Number.isFinite(parsedUpdatedAt)
      ? new Date(parsedUpdatedAt).toISOString()
      : null,
  };
}

function sanitizeSignatureProgram(value) {
  const level = LEVELS.find((candidate) => candidate.signature);
  if (!level || !Array.isArray(value) || value.length > level.maxCommands) return [];
  const topLevelCommands = new Set(level.commands);
  const branchCommands = new Set(level.branchCommands || []);
  let valid = true;

  const cleanBranch = (commands) => {
    if (!Array.isArray(commands) || commands.length > level.maxCommands) {
      valid = false;
      return [];
    }
    return commands.map((command) => {
      const type = getCommandType(command);
      if (!branchCommands.has(type)) valid = false;
      return { type };
    });
  };

  const program = value.map((command) => {
    const type = getCommandType(command);
    if (!topLevelCommands.has(type)) {
      valid = false;
      return { type: "" };
    }
    if (type !== "ifAI") return { type };
    if (!command || typeof command !== "object" || Array.isArray(command)) {
      valid = false;
      return { type: "ifAI", sensor: "modelPredictsMetal", thenCommands: [], elseCommands: [] };
    }
    return {
      type: "ifAI",
      sensor: "modelPredictsMetal",
      thenCommands: cleanBranch(command.thenCommands),
      elseCommands: cleanBranch(command.elseCommands),
    };
  });

  return valid && countAuthoredBlocks(program) <= level.maxCommands ? program : [];
}

function getPersistentSignatureMissionState() {
  return {
    program: sanitizeSignatureProgram(state.signatureProgram),
    updatedAt: state.signatureProgramUpdatedAt,
  };
}

function createAttemptMetrics() {
  return {
    criticalErrors: 0,
    invalidArmActions: 0,
    sensorsUsed: 0,
    conditionsUsed: 0,
    trueBranches: 0,
    falseBranches: 0,
    repeatUsed: false,
    aiConditionalUsed: false,
    modelErrors: 0,
    programErrors: 0,
  };
}

function createSignatureState() {
  return {
    objectIndex: 0,
    currentObjectId: "s1",
    lastPrediction: null,
    sortedResults: [],
    cycleDelivered: false,
    pendingModelError: false,
  };
}

function createDefaultAILabState() {
  return {
    datasetVersion: AI_DATASET_VERSION,
    trainingDeckIds: createAITrainingDeck(),
    trainingIndex: 0,
    labels: {},
    trained: false,
    installed: false,
    trainingSignature: "",
    installedSignature: "",
    modelOutdated: false,
    completed: false,
    hasSeenIntro: false,
    stage: "training",
    training: false,
    trainingStep: "",
    testIndex: 0,
    testScanned: false,
    testRevealed: false,
    currentPrediction: null,
    testResults: [],
    scanRunning: false,
    runId: 0,
  };
}

function createAITrainingDeck() {
  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const otherIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
    }
    return result;
  };
  const trainingObjects = getAIObjectsByGroup("training");
  const metalIds = shuffle(trainingObjects.filter((item) => item.trueCategory === "metal")).slice(0, 5).map((item) => item.id);
  const plasticIds = shuffle(trainingObjects.filter((item) => item.trueCategory === "plastic")).slice(0, 5).map((item) => item.id);
  return shuffle([...metalIds, ...plasticIds]);
}

function isValidAITrainingDeck(ids) {
  if (!Array.isArray(ids) || ids.length !== 10 || new Set(ids).size !== 10) return false;
  const items = ids.map(getAIObject);
  return items.every((item) => item?.group === "training")
    && items.filter((item) => item.trueCategory === "metal").length === 5
    && items.filter((item) => item.trueCategory === "plastic").length === 5;
}

function sanitizeAILab(value) {
  const clean = createDefaultAILabState();
  if (!value || typeof value !== "object") return clean;
  clean.hasSeenIntro = Boolean(value.hasSeenIntro);
  clean.completed = Boolean(value.completed);
  if (value.datasetVersion !== AI_DATASET_VERSION) return clean;
  if (isValidAITrainingDeck(value.trainingDeckIds)) clean.trainingDeckIds = [...value.trainingDeckIds];
  const trainingIds = new Set(clean.trainingDeckIds);
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
    && Object.keys(clean.labels).length === clean.trainingDeckIds.length
    && signatureMatches
    && !clean.modelOutdated;
  const testObjects = getAIObjectsByGroup("testing");
  const savedTestResultsValid = Array.isArray(value.testResults)
    && value.testResults.length <= testObjects.length
    && value.testResults.every((result, index) =>
      result
      && result.objectId === testObjects[index].id
      && ["metal", "plastic"].includes(result.predictedLabel)
      && typeof result.correct === "boolean"
      && ["Osäker", "Ganska säker", "Säker", "Osäker gissning", "Ganska säker gissning", "Stark gissning"].includes(result.confidenceBand));
  if (clean.trained && (savedTestResultsValid || value.installed || value.completed)) {
    const evaluatedResults = evaluateAIModel(clean.labels);
    const savedResultCount = value.installed || value.completed
      ? testObjects.length
      : savedTestResultsValid
        ? value.testResults.length
        : 0;
    clean.testResults = evaluatedResults.slice(0, savedResultCount);
    const savedTestIndex = clampNumber(value.testIndex, 0, testObjects.length, savedResultCount);
    if (savedResultCount === testObjects.length) {
      clean.testIndex = testObjects.length;
    } else if (savedTestIndex === savedResultCount) {
      clean.testIndex = savedTestIndex;
      clean.testScanned = Boolean(value.testScanned) && !value.testRevealed;
    } else if (savedTestIndex + 1 === savedResultCount && value.testScanned && value.testRevealed) {
      clean.testIndex = savedTestIndex;
      clean.testScanned = true;
      clean.testRevealed = true;
    } else {
      clean.testIndex = savedResultCount;
    }
    if (clean.testScanned) clean.currentPrediction = evaluatedResults[clean.testIndex] || null;
  }
  clean.installed = Boolean(value.installed) && clean.trained && clean.testResults.length === 4 && (!savedInstalledSignature || savedInstalledSignature === currentSignature);
  if (clean.installed && !clean.installedSignature) clean.installedSignature = currentSignature;
  const hasSavedTrainingIndex = Number.isFinite(Number(value.trainingIndex));
  clean.trainingIndex = clampNumber(value.trainingIndex, 0, clean.trainingDeckIds.length, 0);
  if (!hasSavedTrainingIndex && Object.keys(clean.labels).length === clean.trainingDeckIds.length) {
    clean.trainingIndex = clean.trainingDeckIds.length;
  }
  clean.completed = Boolean(value.completed);
  const savedTrainingStage = value.stage === "training";
  clean.stage = clean.completed && clean.installed && value.stage === "complete"
    ? "complete"
    : clean.installed
      ? savedTrainingStage ? "training" : "sorting"
      : clean.trained
        ? savedTrainingStage ? "training" : "testing"
        : "training";
  return clean;
}

function getPersistentAILabState() {
  return {
    datasetVersion: state.aiLab.datasetVersion,
    trainingDeckIds: state.aiLab.trainingDeckIds,
    trainingIndex: state.aiLab.trainingIndex,
    labels: state.aiLab.labels,
    trained: state.aiLab.trained,
    installed: state.aiLab.installed,
    trainingSignature: state.aiLab.trainingSignature,
    installedSignature: state.aiLab.installedSignature,
    modelOutdated: state.aiLab.modelOutdated,
    completed: state.aiLab.completed,
    hasSeenIntro: state.aiLab.hasSeenIntro,
    stage: state.aiLab.stage,
    testIndex: state.aiLab.testIndex,
    testScanned: state.aiLab.testScanned,
    testRevealed: state.aiLab.testRevealed,
    testResults: state.aiLab.testResults.map((result) => ({
      objectId: result.objectId,
      predictedLabel: result.predictedLabel,
      correct: result.correct,
      confidenceBand: result.confidenceBand,
    })),
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
  preserveSignatureProgram();
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
  const level = LEVELS[levelIndex];
  if (!level || !isLevelUnlocked(level)) {
    showStatus(
      level?.signature
        ? "Klara Paketvakten och installera en giltig AI-modell först."
        : "Den nivån är låst. Klara nivån före först.",
      "warning",
    );
    return false;
  }
  state.currentLevelIndex = levelIndex;
  if (level.signature) state.programCommands = structuredClone(state.signatureProgram);
  state.currentScreen = "game";
  elements.screens.forEach((screen) => {
    const isGame = screen === elements.gameScreen;
    screen.classList.toggle("is-active", isGame);
    screen.setAttribute("aria-hidden", String(!isGame));
  });
  initializeLevel({ keepProgram: Boolean(level.signature && state.signatureProgram.length) });
  window.scrollTo({ top: 0, behavior: "auto" });
  return true;
}

function openLearnDialog() {
  state.hasSeenInfo = true;
  saveProgress();
  if (!elements.learnDialog.open) elements.learnDialog.showModal();
}

function startDevelopmentDemo() {
  const demoUrl = new URL(window.location.href);
  demoUrl.searchParams.set("demo", "1");
  demoUrl.searchParams.delete("level");
  demoUrl.searchParams.delete("screen");
  window.location.assign(demoUrl.toString());
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
      const isUnlocked = isLevelUnlocked(level);
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
          : level.signature
            ? `Sorteringslinjen är låst. ${getSignatureLockText()}`
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
        ${isUnlocked ? '<span class="level-card-action" aria-hidden="true">Öppna <i>→</i></span>' : level.signature ? `<span class="level-lock-reason">${getSignatureLockText()}</span>` : ""}
      `;
      cards.push(card);
    });
  const aiUnlocked = demoState.unlockAll || Boolean(state.bestStars["8"]);
  const aiCard = document.createElement("button");
  aiCard.type = "button";
  aiCard.className = `ai-chapter-card${aiUnlocked ? "" : " is-locked"}`;
  aiCard.disabled = !aiUnlocked;
  aiCard.dataset.aiChapter = "true";
  const aiState = !aiUnlocked
    ? "Låst"
    : state.aiLab.completed
      ? "Kapitel klart"
      : state.aiLab.installed
        ? "Modell installerad"
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

function isLevelUnlocked(level) {
  if (demoState.unlockAll) return true;
  if (level.signature) return Boolean(state.bestStars["11"] && state.aiLab.installed && state.aiLab.installedSignature === createAITrainingSignature(state.aiLab.labels));
  return level.id <= state.unlockedLevel;
}

function getSignatureLockText() {
  const requirements = [];
  if (!state.bestStars["11"]) requirements.push("Klara Paketvakten");
  if (!state.aiLab.installed) requirements.push("Träna och installera AI-kameran");
  return requirements.join(" · ") || "Redo";
}

function preserveSignatureProgram() {
  if (!getCurrentLevel()?.signature) return;
  state.signatureProgram = sanitizeSignatureProgram(state.programCommands);
  state.signatureProgramUpdatedAt = new Date().toISOString();
  saveProgress();
}

// ----- Level and board rendering -------------------------------------------

function initializeLevel({ keepProgram = false } = {}) {
  cancelExecution();
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  state.packageState = createPackageState(level);
  state.signatureState = createSignatureState();
  if (!keepProgram) state.programCommands = [];
  state.completionShown = false;
  state.hintLevel = 0;
  state.prediction = { choice: "", skipped: false, compared: false };
  state.executionState.plan = [];
  state.executionState.pointer = 0;
  state.executionState.history = [];
  state.executionState.traceMode = false;
  state.executionState.failure = null;
  state.executionState.metrics = createAttemptMetrics();
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.activeBranch = "";
  state.executionState.activeBranchIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;

  elements.gameTitle.textContent = level.title;
  elements.missionNumber.textContent = String(level.id).padStart(2, "0");
  elements.missionText.textContent = level.mission;
  elements.levelProgressText.textContent = level.signature ? "AI-uppdraget" : `Nivå ${level.id} av 11`;
  elements.levelProgressFill.style.width = `${(Math.min(level.id, 11) / 11) * 100}%`;
  elements.board.style.setProperty("--grid-size", level.size);
  elements.board.setAttribute(
    "aria-label",
    `Robotbana med ${level.size} gånger ${level.size} rutor`,
  );
  elements.energyLegend.hidden = level.energy.length === 0;
  elements.packageLegend.hidden = !level.package;
  elements.deliveryLegend.hidden = !level.delivery && !level.stations;
  elements.deliveryLegend.lastChild.textContent = level.stations ? "Sorteringsstationer" : "Leverans";

  renderBoard();
  renderCommandPalette();
  renderProgram();
  renderMasteryCriteria();
  renderPredictionPrompt();
  renderHintPanel();
  renderTracePanel();
  renderSignatureFeedback();
  updateObjectiveStatus();
  updateControls();
  updateSensorTip();
  showStatus(level.signature ? "Bygg en rutin som körs för alla tre föremål." : "Bygg ett program och tryck på Kör!", "info");
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
      const isMetalStation = samePosition({ x, y }, level.stations?.metal || { x: -1, y: -1 });
      const isPlasticStation = samePosition({ x, y }, level.stations?.plastic || { x: -1, y: -1 });
      const hasPackage = isPackageAt(x, y);
      const hasDeliveredPackage = Boolean(state.packageState.delivered && samePosition(state.packageState.position || { x: -1, y: -1 }, { x, y }));
      const energyIndex = level.energy.findIndex((item) => item.x === x && item.y === y);
      const hasEnergy = energyIndex >= 0 && !state.collectedItems.has(energyIndex);

      cell.className = `grid-cell${isGoal ? " is-goal" : ""}${isDelivery ? " is-delivery" : ""}${isMetalStation ? " is-metal-station" : ""}${isPlasticStation ? " is-plastic-station" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute(
        "aria-label",
        describeCell(x, y, { isGoal, isObstacle, hasEnergy, isDelivery, isMetalStation, isPlasticStation, hasPackage, hasDeliveredPackage }),
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
        packageElement.textContent = level.signature ? "◆" : "▣";
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
  if (contents.isMetalStation) parts.push("metallstation");
  if (contents.isPlasticStation) parts.push("plaststation");
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
  if (level.signature) {
    const total = getAIObjectsByGroup("sorting").length;
    const guess = state.signatureState.lastPrediction
      ? ` · Modellen gissar: ${formatAICategory(state.signatureState.lastPrediction.predictedLabel)}`
      : "";
    elements.objectiveStatus.textContent = `Sorterade: ${state.signatureState.sortedResults.length} / ${total}${guess}`;
    return;
  }
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

function renderMasteryCriteria() {
  const level = getCurrentLevel();
  elements.masteryCriteria.innerHTML = level.mastery.map((criterion, index) => `<li><span aria-hidden="true">☆</span><span>${index + 1}. ${criterion}</span></li>`).join("");
}

function toggleMasteryCriteria() {
  const expanded = elements.masteryToggle.getAttribute("aria-expanded") === "true";
  elements.masteryToggle.setAttribute("aria-expanded", String(!expanded));
  elements.masteryToggle.textContent = expanded ? "Visa" : "Dölj";
  elements.masteryCriteria.hidden = expanded;
}

function renderPredictionPrompt() {
  const prediction = getCurrentLevel().prediction;
  const hidden = !prediction || state.prediction.skipped || state.prediction.compared;
  elements.predictionPanel.hidden = hidden;
  elements.conditionIntro.hidden = getCurrentLevel().id !== 9;
  if (!prediction) return;
  elements.predictionQuestion.textContent = prediction.question;
  elements.predictionOptions.replaceChildren(...prediction.options.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `prediction-option${state.prediction.choice === option ? " is-selected" : ""}`;
    button.dataset.prediction = option;
    button.setAttribute("aria-pressed", String(state.prediction.choice === option));
    button.textContent = option;
    return button;
  }));
  elements.predictionResult.textContent = state.prediction.choice ? `Du gissar: ${state.prediction.choice}. Nu testar vi.` : "";
}

function choosePrediction(choice) {
  const options = getCurrentLevel().prediction?.options || [];
  if (!options.includes(choice) || state.executionState.running) return;
  state.prediction.choice = choice;
  renderPredictionPrompt();
}

function comparePrediction(actual) {
  if (!state.prediction.choice || state.prediction.compared) return;
  const level = getCurrentLevel();
  let actualLabel = "";
  if (level.id === 1 && actual === "complete") actualLabel = "På målet";
  if (level.id === 7 && actual === "complete") {
    const repeat = state.programCommands.find((command) => getCommandType(command) === "repeat");
    actualLabel = repeat ? String(repeat.count) : "Ingen loop";
  }
  if (level.id === 9 && typeof actual === "boolean") actualLabel = actual ? "DÅ-delen körs" : "ANNARS-delen körs";
  if (level.signature && actual?.predictedLabel) actualLabel = formatAICategoryTitle(actual.predictedLabel);
  if (!actualLabel) return;
  state.prediction.compared = true;
  elements.predictionPanel.hidden = false;
  elements.predictionResult.textContent = state.prediction.choice === actualLabel
    ? `Din förutsägelse stämde: ${actualLabel}.`
    : `Du gissade ${state.prediction.choice}. Det som hände var: ${actualLabel}.`;
}

function renderHintPanel() {
  const hints = getCurrentLevel().hints || [];
  const visible = state.hintLevel > 0;
  elements.hintPanel.hidden = !visible;
  if (!visible) return;
  elements.hintTitle.textContent = `Ledtråd ${state.hintLevel} av ${hints.length}`;
  elements.hintText.textContent = hints[state.hintLevel - 1];
  elements.nextHintButton.hidden = state.hintLevel >= hints.length;
}

function revealHint() {
  const hints = getCurrentLevel().hints || [];
  if (!hints.length || state.executionState.running) return;
  state.hintLevel = Math.min(hints.length, Math.max(1, state.hintLevel + 1));
  renderHintPanel();
  elements.hintPanel.focus?.();
}

function renderSignatureFeedback() {
  const level = getCurrentLevel();
  if (!level?.signature) {
    elements.signatureFeedback.hidden = true;
    return;
  }
  const failure = state.executionState.failure;
  if (!failure) {
    elements.signatureFeedback.hidden = true;
    elements.signatureFeedback.replaceChildren();
    return;
  }
  elements.signatureFeedback.hidden = false;
  const isFinalModelFailure = failure.category === "ai_attempt_incomplete"
    || (failure.category === "ai_prediction_wrong"
      && state.signatureState.objectIndex >= getAIObjectsByGroup("sorting").length - 1);
  if (isFinalModelFailure) {
    const incorrectResults = state.signatureState.sortedResults.filter((result) => !result.correct);
    elements.signatureFeedback.innerHTML = `<h3>Försöket är klart</h3><p>${incorrectResults.length} av 3 föremål sorterades fel eftersom modellen gissade fel.</p><ul>${incorrectResults.map((result) => {
      const item = getAIObject(result.objectId);
      return `<li><strong>${item.name}:</strong> modellen gissade ${formatAICategory(result.predictedLabel)}, rätt svar var ${formatAICategory(result.trueCategory)}.</li>`;
    }).join("")}</ul><div class="signature-actions"><button class="secondary-button" type="button" data-signature-action="improve">Förbättra träningen</button><button class="secondary-button" type="button" data-signature-action="trace">Se spåret</button></div>`;
    return;
  }
  if (failure.category === "ai_prediction_wrong") {
    const result = state.signatureState.sortedResults.at(-1);
    const item = getAIObject(result.objectId);
    const neighbors = result.neighbors.map((neighbor) => getAIObject(neighbor.objectId)?.name).filter(Boolean);
    elements.signatureFeedback.innerHTML = `<h3>Modellen gissade fel</h3><p>Programmet följde grenen för <strong>${formatAICategory(result.predictedLabel)}</strong>, men ${item.name} är <strong>${formatAICategory(result.trueCategory)}</strong>.</p><p>Modellen jämförde mest med: ${neighbors.join(", ")}.</p><div class="signature-actions"><button class="secondary-button" type="button" data-signature-action="improve">Förbättra träningen</button><button class="secondary-button" type="button" data-signature-action="trace">Se spåret</button><button class="text-button" type="button" data-signature-action="continue">Fortsätt försöket</button></div>`;
    return;
  }
  elements.signatureFeedback.innerHTML = `<h3>Programmet behöver ändras</h3><p>${failure.message}</p><p>Modellens gissning ändras inte av ett rörelsefel.</p><button class="secondary-button" type="button" data-signature-action="trace">Se spåret</button>`;
}

function improveTrainingFromMission() {
  preserveSignatureProgram();
  state.returnToSignature = true;
  state.aiLab.stage = "training";
  showScreen("ai-lab");
  showAIStatus("Du kom tillbaka eftersom modellen gissade fel. Förbättra exemplen, testa och installera igen.", "warning");
}

async function continueSignatureAttempt() {
  if (!getCurrentLevel().signature || !state.executionState.failure || state.executionState.running) return;
  if (state.signatureState.objectIndex >= getAIObjectsByGroup("sorting").length - 1) {
    showStatus("Försöket är klart, men minst ett föremål hamnade fel. Förbättra träningen och försök igen.", "warning");
    return;
  }
  const compiled = compileProgram(state.programCommands);
  if (!compiled.ok) {
    showStatus(compiled.message, "warning");
    return;
  }
  state.executionState.running = true;
  state.signatureState.objectIndex += 1;
  state.signatureState.currentObjectId = getAIObjectsByGroup("sorting")[state.signatureState.objectIndex].id;
  state.signatureState.lastPrediction = null;
  state.signatureState.pendingModelError = false;
  state.packageState = createPackageState(getCurrentLevel());
  state.robot = { ...getCurrentLevel().start };
  state.executionState.failure = null;
  state.executionState.plan = compiled.steps;
  state.executionState.pointer = 0;
  state.executionState.runId += 1;
  const runId = state.executionState.runId;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.activeBranch = "";
  state.executionState.activeBranchIndex = -1;
  state.executionState.lastSensorResult = null;
  renderBoard();
  updateObjectiveStatus();
  renderProgram();
  renderSignatureFeedback();
  renderTracePanel();
  updateControls();
  showStatus("Nästa föremål är framme. Samma program körs igen.", "info");
  await runExecutionLoop(runId);
  updateControls();
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
      const isConditional = commandId === "if" || commandId === "ifAI";
      item.className = `program-step${isRepeat ? " repeat-step" : ""}${isConditional ? " conditional-step" : ""}${
        state.executionState.activeCommandIndex === index ? " is-active" : ""
      }${index === newCommandIndex ? " is-new" : ""}`;
      item.dataset.commandIndex = String(index);
      if (!isRepeat && !isConditional) {
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

      if (isConditional) {
        item.innerHTML = renderConditionalBlock(commandBlock, index, authoredCount);
        return item;
      }

      const nestedCommands = commandBlock.commands || [];
      const repeatInfo =
        state.executionState.activeCommandIndex === index && state.executionState.repeatTotal
          ? `<span class="repeat-iteration">Varv ${state.executionState.repeatIteration} av ${state.executionState.repeatTotal}</span>`
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
  const programListWrap = elements.programList.parentElement;
  programListWrap.classList.toggle("is-empty", state.programCommands.length === 0);
  programListWrap.classList.toggle(
    "has-conditional",
    state.programCommands.some((command) => ["if", "ifAI"].includes(getCommandType(command))),
  );
  elements.emptyProgram.classList.toggle("is-hidden", state.programCommands.length > 0);
  elements.commandCount.textContent = `${authoredCount} / ${level.maxCommands}`;
  elements.commandCount.classList.toggle(
    "is-full",
    authoredCount >= level.maxCommands,
  );
  updateControls();
}

function renderConditionalBlock(commandBlock, index, authoredCount) {
  const isAI = commandBlock.type === "ifAI";
  const sensor = commandBlock.sensor || getCurrentLevel().conditionSensor || "obstacleAhead";
  const conditionLabel = isAI
    ? "modellen gissar metall"
    : sensor === "packageAhead"
      ? "sensorn hittar ett paket framför roboten"
      : "sensorn hittar ett hinder framför roboten";
  const thenLabel = isAI
    ? "DÅ – modellen gissar metall"
    : sensor === "packageAhead"
      ? "DÅ – när paketet finns framför roboten"
      : "DÅ – när det finns ett hinder";
  const elseLabel = isAI
    ? "ANNARS – modellen gissar plast"
    : sensor === "packageAhead"
      ? "ANNARS – när inget paket finns framför roboten"
      : "ANNARS – när vägen är fri";
  const sensorResult = state.executionState.activeCommandIndex === index && state.executionState.lastSensorResult
    ? `<span class="condition-result">${state.executionState.lastSensorResult}</span>`
    : "";
  return `
    <div class="conditional-main" role="group" aria-label="OM ${conditionLabel}">
      <span class="conditional-keyword">OM</span>
      <span class="condition-sensor"><span aria-hidden="true">${isAI ? "AI" : "◉"}</span>${conditionLabel}</span>
      ${sensorResult}
      <button class="remove-command" type="button" aria-label="Ta bort hela Om-blocket ${index + 1}" ${state.executionState.running ? "disabled" : ""}>×</button>
    </div>
    ${renderConditionalBranch(commandBlock, index, "then", thenLabel, authoredCount)}
    ${renderConditionalBranch(commandBlock, index, "else", elseLabel, authoredCount)}
  `;
}

function renderConditionalBranch(commandBlock, topIndex, branch, label, authoredCount) {
  const branchCommands = branch === "then" ? commandBlock.thenCommands : commandBlock.elseCommands;
  const allowed = getCurrentLevel().branchCommands || ["forward", "left", "right"];
  const isActiveBranch = state.executionState.activeCommandIndex === topIndex && state.executionState.activeBranch === branch;
  return `
    <section class="condition-branch${isActiveBranch ? " is-active" : ""}" data-branch="${branch}" aria-labelledby="condition-branch-${topIndex}-${branch}">
      <h4 class="branch-label" id="condition-branch-${topIndex}-${branch}">${label}</h4>
      <div class="branch-list">
        ${branchCommands.length
          ? branchCommands.map((nested, branchIndex) => {
              const nestedCommand = COMMANDS[getCommandType(nested)];
              const isActive = isActiveBranch && state.executionState.activeBranchIndex === branchIndex;
              return `<span class="nested-command${isActive ? " is-active" : ""}" data-branch-index="${branchIndex}">
                <span><span class="command-symbol" aria-hidden="true">${nestedCommand.symbol}</span>${nestedCommand.shortLabel}</span>
                <button class="remove-branch-command" type="button" aria-label="Ta bort ${nestedCommand.label} från ${label}" ${state.executionState.running ? "disabled" : ""}>×</button>
              </span>`;
            }).join("")
          : '<span class="repeat-empty">Lägg en instruktion här.</span>'}
      </div>
      <p class="branch-add-label">Lägg till i ${branch === "then" ? "DÅ" : "ANNARS"}</p>
      <div class="nested-command-palette branch-palette">
        ${allowed.map((commandId) => {
          const nestedCommand = COMMANDS[commandId];
          const disabled = state.executionState.running || authoredCount >= getCurrentLevel().maxCommands;
          return `<button class="nested-add-command" type="button" data-branch-add="${commandId}" aria-label="Lägg ${nestedCommand.label} i ${label}" ${disabled ? 'disabled title="Programmet är fullt"' : ""}><span aria-hidden="true">${nestedCommand.symbol}</span><span>${nestedCommand.shortLabel}</span></button>`;
        }).join("")}
      </div>
    </section>`;
}

function addCommand(commandId) {
  const level = getCurrentLevel();
  if (state.executionState.running) return;
  if (!level.commands.includes(commandId)) return;
  if (!canAddAuthoredBlocks(1)) {
    showStatus("Programmet är fullt. Ta bort en instruktion för att lägga till en ny.", "warning");
    return;
  }
  clearExecutionHistoryForEdit();
  state.programCommands.push(createCommandBlock(commandId));
  preserveSignatureProgram();
  renderProgram({ newCommandIndex: state.programCommands.length - 1 });
  showStatus(`Instruktionen ${COMMANDS[commandId].label} lades till.`, "info");
  elements.programList.lastElementChild?.scrollIntoView({ block: "nearest" });
}

function removeCommand(index) {
  if (state.executionState.running || index < 0 || index >= state.programCommands.length) return;
  clearExecutionHistoryForEdit();
  const [removed] = state.programCommands.splice(index, 1);
  preserveSignatureProgram();
  renderProgram();
  showStatus(`${COMMANDS[getCommandType(removed)].label} togs bort.`, "info");
}

function updateRepeatCount(index, change) {
  if (state.executionState.running) return;
  const command = state.programCommands[index];
  if (getCommandType(command) !== "repeat") return;
  clearExecutionHistoryForEdit();
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
  clearExecutionHistoryForEdit();
  command.commands.push(createCommandBlock(commandId));
  renderProgram();
  showStatus(`${COMMANDS[commandId].label} lades in i loopen.`, "info");
}

function removeNestedCommand(index, nestedIndex) {
  if (state.executionState.running) return;
  const command = state.programCommands[index];
  if (getCommandType(command) !== "repeat") return;
  clearExecutionHistoryForEdit();
  const [removed] = command.commands.splice(nestedIndex, 1);
  renderProgram();
  showStatus(`${COMMANDS[getCommandType(removed)].label} togs bort från loopen.`, "info");
}

function clearProgram() {
  if (state.executionState.running || state.programCommands.length === 0) return;
  clearExecutionHistoryForEdit();
  state.programCommands = [];
  preserveSignatureProgram();
  renderProgram();
  showStatus("Programmet är tomt. Bygg ett nytt!", "info");
}

function addBranchCommand(index, branch, commandId) {
  if (state.executionState.running || !["then", "else"].includes(branch)) return;
  const command = state.programCommands[index];
  if (!["if", "ifAI"].includes(getCommandType(command))) return;
  if (!(getCurrentLevel().branchCommands || []).includes(commandId) || !canAddAuthoredBlocks(1)) {
    showStatus("Programmet är fullt eller instruktionen passar inte i DÅ- eller ANNARS-delen.", "warning");
    return;
  }
  clearExecutionHistoryForEdit();
  const list = branch === "then" ? command.thenCommands : command.elseCommands;
  list.push(createCommandBlock(commandId));
  preserveSignatureProgram();
  renderProgram();
  showStatus(`${COMMANDS[commandId].label} lades i ${branch === "then" ? "DÅ" : "ANNARS"}-delen.`, "info");
}

function removeBranchCommand(index, branch, branchIndex) {
  if (state.executionState.running || !["then", "else"].includes(branch)) return;
  const command = state.programCommands[index];
  if (!["if", "ifAI"].includes(getCommandType(command))) return;
  const list = branch === "then" ? command.thenCommands : command.elseCommands;
  if (branchIndex < 0 || branchIndex >= list.length) return;
  clearExecutionHistoryForEdit();
  const [removed] = list.splice(branchIndex, 1);
  preserveSignatureProgram();
  renderProgram();
  showStatus(`${COMMANDS[getCommandType(removed)].label} togs bort från ${branch === "then" ? "DÅ" : "ANNARS"}-delen.`, "info");
}

function clearExecutionHistoryForEdit() {
  if (state.executionState.running) return;
  state.executionState.traceMode = false;
  state.executionState.plan = [];
  state.executionState.pointer = 0;
  state.executionState.history = [];
  state.executionState.failure = null;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.activeBranch = "";
  state.executionState.activeBranchIndex = -1;
  state.executionState.lastSensorResult = null;
  renderTracePanel();
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
  elements.traceStartButton.disabled = running;
  elements.hintButton.disabled = running;
  renderTracePanel();
  updateSensorTip();
}

// ----- Command execution ----------------------------------------------------

async function runProgram() {
  if (state.executionState.running) return;
  if (!prepareExecution(false)) return;
  state.executionState.running = true;
  const runId = state.executionState.runId;
  updateControls();
  showStatus("Roboten följer programmet steg för steg…", "info");
  await runExecutionLoop(runId);
}

function prepareExecution(traceMode) {
  if (state.programCommands.length === 0) {
    showStatus("Lägg till minst en instruktion först.", "warning");
    return false;
  }
  const executionPlan = compileProgram(state.programCommands);
  if (!executionPlan.ok) {
    showStatus(executionPlan.message, "warning");
    return false;
  }
  if (getCurrentLevel().signature && !isLevelUnlocked(getCurrentLevel())) {
    showStatus("AI-modellen måste vara giltig och installerad innan uppdraget körs.", "warning");
    return false;
  }
  resetRobotForRun();
  state.executionState.runId += 1;
  state.executionState.traceMode = traceMode;
  state.executionState.plan = executionPlan.steps;
  state.executionState.pointer = 0;
  state.executionState.history = [];
  state.executionState.failure = null;
  state.executionState.metrics = createAttemptMetrics();
  state.completionShown = false;
  comparePrediction("start");
  renderTracePanel();
  return true;
}

async function runExecutionLoop(runId) {
  const commandDelay = prefersReducedMotion() ? 40 : 480;
  while (isRunActive(runId)) {
    if (state.executionState.pointer >= state.executionState.plan.length) {
      if (await handleExecutionPlanEnd(runId)) continue;
      return;
    }
    const continued = await executeNextStep(runId, commandDelay);
    if (!continued) return;
  }
}

async function executeNextStep(runId, commandDelay) {
  if (!isRunActive(runId)) return false;
  const step = state.executionState.plan[state.executionState.pointer];
  if (!step) return false;
  if (step.originalCommandType === "repeat") state.executionState.metrics.repeatUsed = true;
  state.executionState.history.push(createExecutionSnapshot());
  applyActiveSource(step);
  renderProgram();
  renderTracePanel();
  await wait(prefersReducedMotion() ? 0 : 120);
  if (!isRunActive(runId)) return false;

  let result;
  if (step.kind === "condition") result = await executeConditionStep(step, runId, commandDelay);
  else result = await executeCommand(step.commandId, runId, commandDelay);
  if (!isRunActive(runId)) return false;
  state.executionState.pointer += 1;

  if (result === "collision") {
    state.executionState.metrics.criticalErrors += 1;
    state.executionState.metrics.programErrors += 1;
    finishFailedRun("collision", "Roboten försökte köra framåt, men ett hinder var i vägen.");
    return false;
  }
  if (result?.type === "failure") {
    if (result.category?.includes("arm") || result.category?.includes("package")) state.executionState.metrics.invalidArmActions += 1;
    state.executionState.metrics.criticalErrors += 1;
    state.executionState.metrics.programErrors += 1;
    finishFailedRun(result.category || "program_action_wrong", result.message);
    return false;
  }
  if (result?.type === "model-error") {
    state.executionState.metrics.modelErrors += 1;
    finishFailedRun("ai_prediction_wrong", result.message);
    return false;
  }
  updateTraceStatus(step, result);
  if (!getCurrentLevel().signature && checkCompletion()) {
    finishSuccessfulRun();
    return false;
  }
  return true;
}

function applyActiveSource(step) {
  state.executionState.activeCommandIndex = step.topIndex;
  state.executionState.activeNestedIndex = step.nestedIndex;
  state.executionState.activeBranch = step.branch || "";
  state.executionState.activeBranchIndex = step.branchIndex ?? -1;
  state.executionState.repeatIteration = step.iteration || 0;
  state.executionState.repeatTotal = step.totalIterations || 0;
}

async function handleExecutionPlanEnd(runId) {
  const level = getCurrentLevel();
  if (level.signature && state.packageState.delivered && samePosition(state.robot, level.goal) && !state.packageState.carrying) {
    if (state.signatureState.objectIndex < getAIObjectsByGroup("sorting").length - 1) {
      state.signatureState.objectIndex += 1;
      state.signatureState.currentObjectId = getAIObjectsByGroup("sorting")[state.signatureState.objectIndex].id;
      state.signatureState.lastPrediction = null;
      state.packageState = createPackageState(level);
      state.robot = { ...level.start };
      const compiled = compileProgram(state.programCommands);
      state.executionState.plan = compiled.steps;
      state.executionState.pointer = 0;
      renderBoard();
      updateObjectiveStatus();
      showStatus(`Nästa föremål är framme. Samma program körs igen (${state.signatureState.objectIndex + 1} av 3).`, "info");
      return true;
    }
    if (state.signatureState.sortedResults.some((result) => !result.correct)) {
      finishFailedRun("ai_attempt_incomplete", "Försöket är klart, men modellen gissade fel på minst ett föremål.");
    } else {
      finishSuccessfulRun();
    }
    return false;
  }
  const category = level.package && !state.packageState.delivered
    ? level.signature && !state.signatureState.lastPrediction
      ? "missing_scan"
      : "goal_before_delivery"
    : state.collectedItems.size < level.energy.length
      ? "energy_missing"
      : state.executionState.metrics.conditionsUsed > 0
        ? "condition_branch_dead_end"
        : "program_ended_early";
  const message = category === "missing_scan"
    ? "Kameran behöver skanna föremålet och programmet måste lämna det vid en station."
    : category === "goal_before_delivery"
      ? "Programmet tog slut innan paketet var levererat."
      : category === "energy_missing"
        ? "Programmet tog slut innan all energi var insamlad."
        : category === "condition_branch_dead_end"
          ? "Villkoret valde en gren, men programmet nådde inte målet. Följ spåret och kontrollera grenens instruktioner."
        : "Programmet tog slut innan roboten nådde målet.";
  state.executionState.metrics.programErrors += 1;
  finishFailedRun(category, message);
  return false;
}

function startTraceMode() {
  if (state.executionState.running || !prepareExecution(true)) return;
  showStatus("Spårläge är klart. Tryck på Nästa steg.", "info");
  elements.traceNextButton.focus();
}

async function runNextTraceStep() {
  if (state.executionState.running) return;
  if (!state.executionState.traceMode && !prepareExecution(true)) return;
  if (state.executionState.failure) {
    showStatus("Spola tillbaka eller ändra programmet för att fortsätta.", "warning");
    return;
  }
  state.executionState.running = true;
  const runId = state.executionState.runId;
  updateControls();
  if (state.executionState.pointer >= state.executionState.plan.length) {
    await handleExecutionPlanEnd(runId);
  } else {
    await executeNextStep(runId, prefersReducedMotion() ? 20 : 360);
    if (state.executionState.running) state.executionState.running = false;
  }
  updateControls();
  renderTracePanel();
}

async function runTraceToEnd() {
  if (state.executionState.running) return;
  if (!state.executionState.traceMode && !prepareExecution(true)) return;
  if (state.executionState.failure) return;
  state.executionState.running = true;
  const runId = state.executionState.runId;
  updateControls();
  await runExecutionLoop(runId);
  renderTracePanel();
}

function rewindTrace() {
  if (state.executionState.running || !state.executionState.history.length) return;
  state.executionState.runId += 1;
  const snapshot = state.executionState.history.pop();
  restoreExecutionSnapshot(snapshot);
  state.executionState.failure = null;
  state.executionState.traceMode = true;
  renderBoard();
  updateObjectiveStatus();
  renderProgram();
  renderTracePanel();
  renderSignatureFeedback();
  showStatus("Ett steg spolades tillbaka. Programmet är oförändrat.", "info");
}

function exitTraceMode() {
  if (state.executionState.running) return;
  initializeLevel({ keepProgram: true });
  showStatus("Spårläget avslutades. Programmet finns kvar.", "info");
}

function createExecutionSnapshot() {
  return {
    robot: { ...state.robot },
    collectedItems: [...state.collectedItems],
    packageState: structuredClone(state.packageState),
    signatureState: structuredClone(state.signatureState),
    plan: structuredClone(state.executionState.plan),
    pointer: state.executionState.pointer,
    activeCommandIndex: state.executionState.activeCommandIndex,
    activeNestedIndex: state.executionState.activeNestedIndex,
    activeBranch: state.executionState.activeBranch,
    activeBranchIndex: state.executionState.activeBranchIndex,
    repeatIteration: state.executionState.repeatIteration,
    repeatTotal: state.executionState.repeatTotal,
    lastSensorResult: state.executionState.lastSensorResult,
    metrics: structuredClone(state.executionState.metrics),
  };
}

function restoreExecutionSnapshot(snapshot) {
  state.robot = { ...snapshot.robot };
  state.collectedItems = new Set(snapshot.collectedItems);
  state.packageState = structuredClone(snapshot.packageState);
  state.signatureState = structuredClone(snapshot.signatureState);
  state.executionState.plan = structuredClone(snapshot.plan);
  state.executionState.pointer = snapshot.pointer;
  state.executionState.activeCommandIndex = snapshot.activeCommandIndex;
  state.executionState.activeNestedIndex = snapshot.activeNestedIndex;
  state.executionState.activeBranch = snapshot.activeBranch;
  state.executionState.activeBranchIndex = snapshot.activeBranchIndex;
  state.executionState.repeatIteration = snapshot.repeatIteration;
  state.executionState.repeatTotal = snapshot.repeatTotal;
  state.executionState.lastSensorResult = snapshot.lastSensorResult;
  state.executionState.metrics = structuredClone(snapshot.metrics);
  state.executionState.running = false;
}

function resetRobotForRun() {
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  state.packageState = createPackageState(level);
  if (level.signature) state.signatureState = createSignatureState();
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.activeBranch = "";
  state.executionState.activeBranchIndex = -1;
  state.executionState.lastSensorResult = null;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  renderBoard();
  updateObjectiveStatus();
}

async function executeConditionStep(step, runId, delay) {
  let result;
  if (step.sensor === "modelPredictsMetal") {
    if (!state.signatureState.lastPrediction) {
      return { type: "failure", category: "missing_scan", message: "Kameran behöver skanna föremålet först." };
    }
    result = state.signatureState.lastPrediction.predictedLabel === "metal";
    state.executionState.metrics.aiConditionalUsed = true;
  } else {
    showSensorPulse();
    state.executionState.metrics.sensorsUsed += 1;
    const target = getForwardCell();
    result = step.sensor === "packageAhead"
      ? Boolean(target && isPackageAt(target.x, target.y))
      : isBlockedAhead();
  }
  state.executionState.metrics.conditionsUsed += 1;
  if (result) state.executionState.metrics.trueBranches += 1;
  else state.executionState.metrics.falseBranches += 1;
  const branch = result ? "then" : "else";
  const branchSteps = structuredClone(result ? step.thenSteps : step.elseSteps).map((branchStep) => ({
    ...branchStep,
    originalCommandType: step.commandId,
  }));
  state.executionState.plan.splice(state.executionState.pointer + 1, 0, ...branchSteps);
  state.executionState.activeBranch = branch;
  state.executionState.lastSensorResult = step.sensor === "modelPredictsMetal"
    ? `Modellens gissning: ${formatAICategory(state.signatureState.lastPrediction.predictedLabel)} · ${branch === "then" ? "DÅ" : "ANNARS"}`
      : step.sensor === "obstacleAhead"
        ? result
          ? "Sensorn hittade ett hinder. DÅ-delen körs."
          : "Vägen är fri. ANNARS-delen körs."
        : `${result ? "JA" : "NEJ"} – ${result ? "paket hittat" : "inget paket"} · ${branch === "then" ? "DÅ" : "ANNARS"}`;
  if (getCurrentLevel().id === 9) comparePrediction(result);
  renderProgram();
  const conditionStatus = step.sensor === "obstacleAhead"
    ? result
      ? "Sensorn hittade ett hinder. DÅ-delen körs."
      : "Vägen är fri. ANNARS-delen körs."
    : `Sensorn gav information. ${branch === "then" ? "DÅ" : "ANNARS"}-delen körs.`;
  showStatus(conditionStatus, "info");
  await wait(delay);
  return { type: "condition", result, branch };
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
    state.executionState.metrics.sensorsUsed += 1;
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

  if (commandId === "aiScan") {
    if (!getCurrentLevel().signature || !state.packageState.carrying) {
      return { type: "failure", category: "missing_package_for_scan", message: "Robotarmen behöver hålla föremålet innan kameran kan skanna." };
    }
    const item = getAIObject(state.signatureState.currentObjectId);
    if (!item || !state.aiLab.installed) {
      return { type: "failure", category: "invalid_model", message: "En giltig modell måste vara installerad i kameran." };
    }
    animateRobotReaction("is-scanning", prefersReducedMotion() ? 40 : 420);
    await wait(delay);
    if (!isRunActive(runId)) return "cancelled";
    state.signatureState.lastPrediction = predictAIObject(item);
    if (state.signatureState.objectIndex === 0) comparePrediction(state.signatureState.lastPrediction);
    updateObjectiveStatus();
    showStatus(`Skanning klar. Modellen gissar ${formatAICategory(state.signatureState.lastPrediction.predictedLabel)}. En stark gissning kan fortfarande vara fel.`, "info");
    return { type: "scan", prediction: state.signatureState.lastPrediction };
  }

  return "unknown";
}

function updateTraceStatus(step, result) {
  const total = state.executionState.plan.length;
  const position = Math.min(state.executionState.pointer, total);
  let description = `${COMMANDS[step.commandId]?.shortLabel || "Instruktionen"} kördes.`;
  if (step.iteration) description += ` Varv ${step.iteration} av ${step.totalIterations}.`;
  if (result?.type === "condition") description = `${state.executionState.lastSensorResult}.`;
  if (result?.type === "scan") description = `Modellen gissade ${formatAICategory(result.prediction.predictedLabel)}.`;
  elements.tracePosition.textContent = `Steg ${position} av ${total}`;
  elements.traceDescription.textContent = description;
  renderTracePanel();
}

function renderTracePanel() {
  if (!elements.tracePanel) return;
  const trace = state.executionState.traceMode;
  elements.tracePanel.hidden = !trace;
  elements.traceStartButton.hidden = trace;
  if (!trace) return;
  const total = state.executionState.plan.length;
  elements.tracePosition.textContent = total ? `Steg ${Math.min(state.executionState.pointer, total)} av ${total}` : "Redo";
  elements.traceNextButton.disabled = state.executionState.running || Boolean(state.executionState.failure);
  elements.traceRunButton.disabled = state.executionState.running || Boolean(state.executionState.failure);
  elements.traceRewindButton.disabled = state.executionState.running || state.executionState.history.length === 0;
  elements.traceExitButton.disabled = state.executionState.running;
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
  if (level.signature) {
    return state.signatureState.sortedResults.length === getAIObjectsByGroup("sorting").length
      && samePosition(state.robot, level.goal)
      && !state.packageState.carrying
      && state.packageState.delivered;
  }
  return (
    samePosition(state.robot, level.goal) &&
    state.collectedItems.size === level.energy.length &&
    (!level.package || state.packageState.delivered)
  );
}

function finishFailedRun(category, message) {
  state.executionState.running = false;
  state.executionState.traceMode = true;
  state.executionState.failure = { category, message };
  clearBoardEffects();
  renderProgram();
  updateControls();
  showStatus(message, "warning");
  renderSignatureFeedback();
  renderTracePanel();
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
  comparePrediction("complete");
  const authoredCount = countAuthoredBlocks(state.programCommands);
  const mastery = evaluateMasteryCriteria(level, authoredCount);
  const stars = mastery.filter(Boolean).length;

  state.bestStars[level.id] = Math.max(state.bestStars[level.id] || 0, stars);
  if (!level.signature) state.unlockedLevel = Math.max(state.unlockedLevel, Math.min(11, level.id + 1));
  if (level.signature) state.aiLab.completed = true;
  saveProgress();
  renderProgram();
  updateControls();
  showStatus(level.signature ? "Alla tre föremål sorterades och roboten står i den säkra zonen." : "Uppdrag klart! Roboten hittade rätt.", "success");
  animateRobotClass("is-celebrating");

  window.setTimeout(() => {
    if (!state.completionShown || state.currentScreen !== "game") return;
    showCompletionDialog(stars, mastery);
  }, prefersReducedMotion() ? 20 : 450);
}

function calculateStars(commandCount, targetCount) {
  if (commandCount <= targetCount) return 3;
  if (commandCount <= targetCount + 2) return 2;
  return 1;
}

function evaluateMasteryCriteria(level, authoredCount = countAuthoredBlocks(state.programCommands)) {
  const metrics = state.executionState.metrics;
  const hasType = (type) => state.programCommands.some((command) => getCommandType(command) === type);
  const complete = true;
  switch (level.id) {
    case 4:
      return [complete, state.collectedItems.size === level.energy.length, authoredCount <= level.targetCommands];
    case 5:
      return [complete, metrics.sensorsUsed > 0, authoredCount <= level.targetCommands];
    case 6:
      return [complete, metrics.sensorsUsed > 0, metrics.criticalErrors === 0 && state.collectedItems.size === level.energy.length];
    case 7:
      return [complete, metrics.repeatUsed && hasType("repeat"), authoredCount <= level.targetCommands];
    case 8:
      return [complete, metrics.invalidArmActions === 0, authoredCount <= level.targetCommands];
    case 9:
      return [complete, metrics.conditionsUsed > 0 && hasType("if"), metrics.trueBranches + metrics.falseBranches > 0];
    case 10:
      return [complete, metrics.trueBranches > 0 && metrics.falseBranches > 0, authoredCount <= level.targetCommands];
    case 11:
      return [complete, metrics.conditionsUsed > 0 && hasType("if"), metrics.invalidArmActions === 0];
    case 12:
      return [complete, metrics.programErrors === 0, metrics.aiConditionalUsed && hasType("ifAI") && authoredCount <= level.targetCommands];
    default:
      return [complete, metrics.criticalErrors === 0, authoredCount <= level.targetCommands];
  }
}

function cancelExecution() {
  state.executionState.runId += 1;
  state.executionState.running = false;
  state.executionState.traceMode = false;
  state.executionState.plan = [];
  state.executionState.pointer = 0;
  state.executionState.history = [];
  state.executionState.failure = null;
  state.executionState.activeCommandIndex = -1;
  state.executionState.activeNestedIndex = -1;
  state.executionState.activeBranch = "";
  state.executionState.activeBranchIndex = -1;
  state.executionState.repeatIteration = 0;
  state.executionState.repeatTotal = 0;
  state.executionState.lastSensorResult = null;
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
  visual.classList.remove("is-bumping", "is-arm-active", "is-delivering", "is-scanning");
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
  if (commandId === "if" || commandId === "ifAI") {
    return {
      type: commandId,
      sensor: commandId === "ifAI" ? "modelPredictsMetal" : getCurrentLevel().conditionSensor || "obstacleAhead",
      thenCommands: [],
      elseCommands: [],
    };
  }
  return { type: commandId };
}

function getCommandType(command) {
  return typeof command === "string" ? command : command?.type;
}

function countAuthoredBlocks(commands) {
  return commands.reduce((total, command) => {
    const type = getCommandType(command);
    if (type === "repeat") return total + 1 + countAuthoredBlocks(command.commands || []);
    if (type === "if" || type === "ifAI") {
      return total + 1 + countAuthoredBlocks(command.thenCommands || []) + countAuthoredBlocks(command.elseCommands || []);
    }
    return total + 1;
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
    if (commandId !== "repeat" && commandId !== "if" && commandId !== "ifAI") {
      steps.push({
        kind: "action",
        commandId,
        topIndex,
        nestedIndex: -1,
        branch: "",
        branchIndex: -1,
        iteration: 0,
        totalIterations: 0,
        originalCommandType: commandId,
      });
      continue;
    }
    if (commandId === "if" || commandId === "ifAI") {
      const thenCommands = command.thenCommands || [];
      const elseCommands = command.elseCommands || [];
      if (!thenCommands.length || !elseCommands.length) {
        return { ok: false, message: "Om-blocket behöver minst en instruktion i både DÅ och ANNARS." };
      }
      steps.push({
        kind: "condition",
        commandId,
        sensor: command.sensor || (commandId === "ifAI" ? "modelPredictsMetal" : "obstacleAhead"),
        topIndex,
        nestedIndex: -1,
        branch: "",
        branchIndex: -1,
        iteration: 0,
        totalIterations: 0,
        originalCommandType: commandId,
        thenSteps: compileBranchSteps(thenCommands, topIndex, "then"),
        elseSteps: compileBranchSteps(elseCommands, topIndex, "else"),
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
          kind: "action",
          commandId: getCommandType(nestedCommand),
          topIndex,
          nestedIndex,
          branch: "",
          branchIndex: -1,
          iteration,
          totalIterations: repeatCount,
          originalCommandType: "repeat",
        });
      });
    }
  }
  return { ok: true, steps };
}

function compileBranchSteps(commands, topIndex, branch) {
  return commands.map((command, branchIndex) => ({
    kind: "action",
    commandId: getCommandType(command),
    topIndex,
    nestedIndex: -1,
    branch,
    branchIndex,
    iteration: 0,
    totalIterations: 0,
    originalCommandType: "if",
  }));
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
  if (!level.package) return { type: "failure", category: "pickup_no_package", message: "Här finns inget paket att hämta." };
  if (state.packageState.carrying) {
    return { type: "failure", category: "arm_already_carrying", message: "Robotarmen håller redan ett paket." };
  }
  if (state.packageState.collected || state.packageState.delivered) {
    return { type: "failure", category: "package_already_collected", message: "Paketet är redan hämtat." };
  }
  const target = getForwardCell();
  if (!target || !isPackageAt(target.x, target.y)) {
    return { type: "failure", category: "pickup_wrong_position", message: "Roboten står inte bredvid paketet ännu." };
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
  if (!level.delivery && !level.stations) return { type: "failure", category: "drop_no_station", message: "Här finns ingen leveransplats." };
  if (!state.packageState.carrying) {
    return { type: "failure", category: "drop_without_carrying", message: "Robotarmen är tom. Hämta paketet först." };
  }
  if (level.signature && !state.signatureState.lastPrediction) {
    return { type: "failure", category: "missing_scan", message: "Kameran behöver skanna föremålet först." };
  }
  const target = getForwardCell();
  const deliveryTarget = level.signature
    ? level.stations[state.signatureState.lastPrediction.predictedLabel]
    : level.delivery;
  if (!target || !samePosition(target, deliveryTarget)) {
    return { type: "failure", category: "drop_wrong_station", message: level.signature ? "Programmet körde till fel station för modellens gissning." : "Leveransplatsen måste vara framför roboten." };
  }
  animateArm("is-delivering", delay);
  await wait(delay);
  if (!isRunActive(runId)) return "cancelled";
  state.packageState.carrying = false;
  state.packageState.delivered = true;
  state.packageState.position = { ...deliveryTarget };
  if (level.signature) {
    const item = getAIObject(state.signatureState.currentObjectId);
    const prediction = state.signatureState.lastPrediction;
    const result = {
      objectId: item.id,
      predictedLabel: prediction.predictedLabel,
      trueCategory: item.trueCategory,
      correct: prediction.predictedLabel === item.trueCategory,
      confidenceBand: prediction.confidenceBand,
      neighbors: prediction.neighbors,
    };
    state.signatureState.sortedResults.push(result);
    state.signatureState.cycleDelivered = true;
    state.signatureState.pendingModelError = !result.correct;
  }
  renderBoard();
  updateObjectiveStatus();
  if (level.signature && state.signatureState.pendingModelError) {
    renderSignatureFeedback();
    return { type: "model-error", message: "Programmet gjorde det du skrev, men modellen gissade fel material." };
  }
  showStatus(level.signature ? "Föremålet lades vid stationen som programmet valde." : "Paketet är levererat.", "success");
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
  if (!demoState.unlockAll && !state.bestStars["8"]) {
    showStatus("Klara Robotarmen först.", "warning");
    return;
  }
  saveProgress();
  showScreen("ai-lab");
}

function renderAILab() {
  const stageLabels = {
    training: "1 Träna · 2 Prova · 3 Använd",
    testing: "1 Träna · 2 Prova · 3 Använd",
    sorting: "1 Träna · 2 Prova · 3 Använd",
    complete: "Träna · Prova · Använd klart",
  };
  elements.aiStageProgress.textContent = stageLabels[state.aiLab.stage] || stageLabels.training;
  elements.aiCameraStatus.textContent = state.aiLab.completed && state.aiLab.installed
    ? "Kamera installerad · Uppdrag klart"
    : state.aiLab.installed
      ? "Kamera installerad"
      : state.aiLab.trained
        ? "AI-kameran är tränad"
        : "AI-kameran är otränad";

  const intro = state.aiLab.hasSeenIntro ? "" : renderAILabIntroduction();
  if (state.aiLab.training) {
    renderAILabContent(`${intro}${renderAITrainingProgress()}`);
    return;
  }
  if (state.aiLab.stage === "testing") {
    renderAILabContent(`${intro}${renderAITestStage()}`);
    return;
  }
  if (state.aiLab.stage === "sorting") {
    renderAILabContent(`${intro}${renderAISortingStage()}`);
    return;
  }
  if (state.aiLab.stage === "complete") {
    renderAILabContent(`${intro}${renderAICompleteStage()}`);
    return;
  }
  renderAILabContent(`${intro}${renderAITrainingStage()}`);
}

function renderAILabContent(content) {
  elements.aiLabContent.innerHTML = content;
  restoreAILabStatus();
}

function restoreAILabStatus() {
  const testCount = getAIObjectsByGroup("testing").length;
  if (state.aiLab.training) {
    showAIStatus(state.aiLab.trainingStep || "AI-kameran tränas…", "info");
    return;
  }
  if (state.aiLab.stage === "complete") {
    showAIStatus("AI-labbet är klart. Modellen och programmet klarade Sorteringslinjen.", "success");
    return;
  }
  if (state.aiLab.stage === "sorting") {
    showAIStatus("Modellen är installerad. Öppna Sorteringslinjen för att använda den.", "success");
    return;
  }
  if (state.aiLab.stage === "testing") {
    if (state.aiLab.testResults.length === testCount && state.aiLab.testIndex >= testCount) {
      const score = state.aiLab.testResults.filter((result) => result.correct).length;
      showAIStatus(`Alla fyra tester är klara. Modellen fick ${score} av 4 rätt.`, score >= 3 ? "success" : "warning");
    } else if (state.aiLab.scanRunning) {
      showAIStatus("AI-kameran undersöker föremålet…", "info");
    } else if (state.aiLab.testRevealed && state.aiLab.currentPrediction) {
      showAIStatus(state.aiLab.currentPrediction.correct ? "Modellen gissade rätt. Gå vidare när du är redo." : "Modellen gissade fel. Gå vidare när du är redo.", state.aiLab.currentPrediction.correct ? "success" : "warning");
    } else if (state.aiLab.testScanned && state.aiLab.currentPrediction) {
      showAIStatus(`Modellen gissar ${formatAICategoryTitle(state.aiLab.currentPrediction.predictedLabel)}. ${state.aiLab.currentPrediction.confidenceBand}.`, "info");
    } else {
      showAIStatus(`Test ${state.aiLab.testIndex + 1} av ${testCount}. Skanna föremålet när du är redo.`, "info");
    }
    return;
  }
  if (state.aiLab.modelOutdated) {
    showAIStatus("Träningskorten har ändrats. Träna och installera modellen igen innan Sorteringslinjen kan använda den.", "warning");
    return;
  }
  const selectedCount = Object.keys(state.aiLab.labels).length;
  if (state.aiLab.installed) {
    showAIStatus("Modellen är installerad. Ändra ett träningskort om du vill bygga en ny modell.", "info");
  } else if (state.aiLab.trained) {
    showAIStatus("Modellen är tränad. Ändra ett träningskort om du vill bygga en ny modell.", "info");
  } else if (selectedCount === 0) {
    showAIStatus("Märk det första föremålet som metall eller plast.", "info");
  } else if (selectedCount < state.aiLab.trainingDeckIds.length) {
    showAIStatus(`${selectedCount} av ${state.aiLab.trainingDeckIds.length} föremål är märkta.`, "info");
  } else {
    showAIStatus("Alla föremål är märkta. Kontrollera dina svar innan du tränar.", "info");
  }
}

function renderAILabIntroduction() {
  return `
    <section class="ai-intro" aria-labelledby="ai-intro-title">
      <h2 id="ai-intro-title">Så tränar du modellen</h2>
      <p>Kameran registrerar synliga egenskaper. Du märker exempel som metall eller plast.</p>
      <p><strong>Program följer regler som du skriver. Modellen jämför med exempel och gör en gissning.</strong></p>
      <details>
        <summary>Hur fungerar det?</summary>
        <p>När du tränar sparas egenskaperna hos dina exempel. Ett nytt föremål jämförs med de mest lika exemplen. Modellen kan därför gissa fel.</p>
      </details>
      <button class="text-button ai-intro-dismiss" type="button" data-ai-action="dismiss-intro">Jag fattar</button>
    </section>
  `;
}

function renderAITrainingStage() {
  if (state.aiLab.trainingIndex >= state.aiLab.trainingDeckIds.length) return renderAITrainingReview();
  const item = getAIObject(state.aiLab.trainingDeckIds[state.aiLab.trainingIndex]);
  const assignedLabel = state.aiLab.labels[item.id];
  return `
    <section class="ai-panel ai-training-slide" aria-labelledby="ai-training-title">
      ${renderAIModelOutdatedNotice()}
      <div class="ai-training-slide-heading">
        <div><p class="card-kicker">Träna AI-kameran</p><h2 id="ai-training-title" tabindex="-1">${item.name}</h2></div>
        <span class="ai-count">Objekt ${state.aiLab.trainingIndex + 1} av ${state.aiLab.trainingDeckIds.length}</span>
      </div>
      <div class="ai-training-object">
        ${renderAIObjectVisual(item, { size: "training", decorative: true })}
        <p>Vad är föremålet gjort av?</p>
        <div class="ai-training-labels" aria-label="Märk ${item.name}">
          ${renderAITrainingLabelButton(item, "metal", assignedLabel)}
          ${renderAITrainingLabelButton(item, "plastic", assignedLabel)}
        </div>
        ${assignedLabel ? `<p class="ai-current-label" role="status">Ditt val: <strong>${formatAICategoryTitle(assignedLabel)}</strong></p>` : '<p class="ai-current-label">Välj metall eller plast.</p>'}
      </div>
      <div class="ai-training-navigation">
        <button class="secondary-button" type="button" data-ai-action="previous-object" ${state.aiLab.trainingIndex === 0 ? "disabled" : ""}>← Föregående</button>
        <button class="text-button" type="button" data-ai-action="new-deck">Nya träningsobjekt</button>
      </div>
    </section>`;
}

function renderAITrainingLabelButton(item, label, assignedLabel) {
  const selected = assignedLabel === label;
  return `<button class="ai-training-label-button" type="button" data-ai-label-id="${item.id}" data-label="${label}" aria-pressed="${selected}">${selected ? '<span aria-hidden="true">✓</span>' : ""}${formatAICategoryTitle(label)}</button>`;
}

function renderAITrainingReview() {
  const items = state.aiLab.trainingDeckIds.map(getAIObject);
  const counts = getAssignedLabelCounts();
  const validation = getAITrainingValidationMessage();
  return `
    <section class="ai-panel ai-training-review" aria-labelledby="ai-training-review-title">
      ${renderAIModelOutdatedNotice()}
      <div class="ai-panel-heading">
        <div><p class="card-kicker">Träna AI-kameran</p><h2 id="ai-training-review-title" tabindex="-1">Kontrollera dina märkningar</h2><p>AI-kameran kommer att lära sig av svaren du har valt.</p></div>
        <span class="ai-count">10 av 10 märkta</span>
      </div>
      <div class="ai-review-counts" aria-label="Sammanfattning"><span>${counts.metal} märkta som metall</span><span>${counts.plastic} märkta som plast</span></div>
      <div class="ai-review-grid">
        ${items.map((item, index) => renderAIReviewItem(item, index)).join("")}
      </div>
      ${validation ? `<p class="ai-training-validation" role="alert">${validation}</p>` : '<p class="ai-training-validation is-valid">Båda materialen har tillräckligt många exempel.</p>'}
      <div class="ai-review-actions">
        <button class="primary-button ai-train-action" type="button" data-ai-action="train">Träna AI-kameran</button>
        <button class="secondary-button" type="button" data-ai-action="new-deck">Nya träningsobjekt</button>
      </div>
    </section>`;
}

function renderAIReviewItem(item, index) {
  const label = state.aiLab.labels[item.id];
  return `<article class="ai-review-item">
    ${renderAIObjectVisual(item, { size: "summary", decorative: true })}
    <span><strong>${item.name}</strong><small>Märkt som ${formatAICategory(label)}</small></span>
    <button class="ai-item-action" type="button" data-ai-edit-index="${index}" aria-label="Ändra märkningen för ${item.name}">Ändra</button>
  </article>`;
}

function getAITrainingValidationMessage() {
  const labels = state.aiLab.trainingDeckIds.map((id) => state.aiLab.labels[id]).filter(Boolean);
  if (labels.length !== state.aiLab.trainingDeckIds.length) return "Märk alla tio föremål först.";
  const metalCount = labels.filter((label) => label === "metal").length;
  const plasticCount = labels.filter((label) => label === "plastic").length;
  if (!metalCount || !plasticCount) return "Modellen behöver exempel märkta som både metall och plast.";
  if (metalCount < 2 || plasticCount < 2) return "Märk minst två föremål i varje kategori.";
  return "";
}

function renderAIModelOutdatedNotice() {
  if (!state.aiLab.modelOutdated) return "";
  return `
    <section class="ai-model-outdated" role="status" aria-labelledby="ai-model-outdated-title">
      <h3 id="ai-model-outdated-title">Modellen behöver tränas igen</h3>
      <p>Träningskorten har ändrats. Träna och installera modellen igen innan Sorteringslinjen kan använda den.</p>
    </section>
  `;
}

function renderAITrainingProgress() {
  return `
    <section class="ai-panel ai-training-progress" aria-live="polite">
      <div class="ai-scanner" aria-hidden="true"></div>
      <h2>${state.aiLab.trainingStep || "Läser träningskort…"}</h2>
      <p class="ai-helper-text">Modellen byggs av de synliga egenskaperna i dina tio märkta exempel.</p>
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
          <p>Nu provar du modellen på föremål som inte fanns i träningen.</p>
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
        <p><strong>Modellen jämför nya saker med exempel som du har märkt.</strong></p>
        <button class="primary-button" type="button" data-ai-action="scan">Skanna föremålet</button>
      </div>`;
  }
  const revealed = state.aiLab.testRevealed;
  return `
    <section class="ai-prediction-panel" aria-labelledby="ai-prediction-title">
      <p class="card-kicker">Modellens gissning</p>
      <h3 id="ai-prediction-title" tabindex="-1">Modellen gissar: ${formatAICategoryTitle(prediction.predictedLabel)}</h3>
      <div class="ai-confidence"><span>Gissningens styrka</span><strong>${prediction.confidenceBand}</strong></div>
      <p class="ai-confidence-note">En stark gissning kan fortfarande vara fel.</p>
      <p class="ai-model-reason">${getPreRevealExplanation(prediction)}</p>
    </section>
    ${renderAINeighbors(prediction)}
    ${revealed ? renderAIFacit(item, prediction) : `<button class="primary-button" type="button" data-ai-action="reveal">Visa facit</button>`}
  `;
}

function renderAINeighbors(prediction) {
  return `
    <section class="ai-neighbors" aria-labelledby="ai-neighbors-title">
      <h3 id="ai-neighbors-title">Modellen jämförde mest med de här exemplen:</h3>
      <div class="ai-neighbor-grid">
        ${prediction.neighbors.map((neighbor) => {
          const item = getAIObject(neighbor.objectId);
          return `<article class="ai-neighbor-card">
            ${renderAIObjectVisual(item, { size: "neighbor", decorative: true })}
            <strong>${item.name}</strong>
            <span>Märkt som ${formatAICategory(neighbor.assignedLabel)}</span>
            <small>${neighbor.similarity}</small>
            ${renderAIPropertyChips(item)}
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
      <p class="ai-result-mark ${prediction.correct ? "is-correct" : "is-incorrect"}">${prediction.correct ? "Modellen gissade rätt." : "Modellen gissade fel."}</p>
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
    "Modellen behöver andra eller bättre märkta exempel.",
    "Modellen behöver andra eller bättre märkta exempel.",
    "Exemplen räcker inte för installation ännu.",
    "Modellen klarade gränsen för installation.",
    "Modellen gissade rätt på alla fyra testföremål.",
  ];
  const canInstall = score >= 3;
  return `<section class="ai-panel" aria-labelledby="ai-test-summary-title">
    <div class="ai-panel-heading"><div><p class="card-kicker">Test med nya föremål</p><h2 id="ai-test-summary-title" tabindex="-1">AI-testet</h2><p>${messages[score]}</p></div><span class="ai-count">${score} / 4 rätt</span></div>
    <div class="ai-test-grid">${results.map(renderAITestResult).join("")}</div>
    <aside class="ai-improvement"><strong>Så kan du förbättra modellen</strong><p>${getDatasetSuggestion(results)}</p></aside>
    <div class="ai-test-actions"><button class="secondary-button" type="button" data-ai-action="improve">Förbättra träningen</button><button class="primary-button" type="button" data-ai-action="install" ${canInstall ? "" : 'disabled title="Minst tre av fyra test behöver bli rätt"'}>Installera modellen</button></div>
  </section>`;
}

function renderAITestResult(result) {
  const item = getAIObject(result.objectId);
  return `<article class="ai-test-card ${result.correct ? "is-correct" : "is-incorrect"}">
    ${renderAIObjectVisual(item, { decorative: true })}<strong>${item.name}</strong>
    <div class="ai-test-result"><span>Modellen gissade: <strong>${formatAICategory(result.predictedLabel)}</strong></span><span>Rätt svar: <strong>${formatAICategory(item.trueCategory)}</strong></span><span>Gissning: <strong>${result.confidenceBand}</strong></span><span class="ai-result-mark ${result.correct ? "is-correct" : "is-incorrect"}">${result.correct ? "Rätt gissning" : "Fel gissning"}</span></div>
  </article>`;
}

function renderAIFeatures(item, open = false) {
  return `<div class="ai-features" aria-label="Det kameran registrerar"><strong>Det kameran ser</strong>${renderAIPropertyChips(item)}</div>`;
}

function getAIPropertyLabels(item) {
  const properties = [];
  if (item.features.shine >= 0.66) properties.push("blank");
  else if (item.features.shine <= 0.33) properties.push("matt");
  if (item.features.transparency >= 0.66) properties.push("genomskinlig");
  else if (item.features.transparency <= 0.33) properties.push("ogenomskinlig");
  if (item.features.roundness >= 0.66) properties.push("rund");
  else if (item.features.roundness <= 0.33) properties.push("kantig");
  if (item.features.roughness >= 0.66) properties.push("sträv");
  else if (item.features.roughness <= 0.22) properties.push("slät");
  return properties.slice(0, 3);
}

function renderAIPropertyChips(item) {
  return `<span class="property-chips">${getAIPropertyLabels(item).map((property) => `<span>${property}</span>`).join("")}</span>`;
}

function renderAISortingStage() {
  const missionUnlocked = demoState.unlockAll || Boolean(state.bestStars["11"] && state.aiLab.installed);
  return `<section class="ai-panel ai-installation-card" aria-labelledby="installation-title">
    <div class="camera-module-visual" aria-hidden="true"><span></span></div>
    <p class="card-kicker">3 · Använd</p>
    <h2 id="installation-title">Modellen är installerad</h2>
    <p>Roboten kan nu använda modellens gissningar i ett uppdrag. Modellen ändras bara när du tränar om den.</p>
    <div class="ai-concept-contrast"><p><strong>Program</strong> följer reglerna du skriver.</p><p><strong>Modell</strong> jämför med exempel och gör en gissning.</p></div>
    <p class="mission-requirement">${missionUnlocked ? "Sorteringslinjen är redo." : "Klara Paketvakten för att öppna Sorteringslinjen."}</p>
    <div class="ai-test-actions"><button class="secondary-button" type="button" data-ai-action="improve">Förbättra träningen</button><button class="primary-button" type="button" data-ai-action="mission" ${missionUnlocked ? "" : "disabled"}>Öppna Sorteringslinjen</button></div>
  </section>`;
}

function renderAICompleteStage() {
  return `
    <section class="ai-panel ai-complete-card">
      <div class="completion-robot" aria-hidden="true"></div>
      <p class="eyebrow">AI-labbet klart!</p>
      <h2>Programmet och modellen klarade Sorteringslinjen</h2>
      <p class="completion-message">Tre föremål sorterades rätt med reglerna du skrev och modellen du tränade.</p>
      <div class="learning-card">
        <span aria-hidden="true">💡</span>
        <p><strong>Det du lärde roboten förändrade spelet.</strong> Programmet startade arbetet, kameran samlade information, modellen gjorde en gissning och robotarmen utförde handlingen.</p>
      </div>
      <div class="ai-test-actions">
        <button class="secondary-button" type="button" data-ai-action="improve">Träna en ny modell</button>
        <button class="primary-button" type="button" data-ai-action="levels">Till uppdragskartan</button>
      </div>
    </section>
  `;
}

const AI_OBJECT_ARTWORK = {
  "metal-can": `<svg viewBox="0 0 180 130"><ellipse cx="90" cy="27" rx="34" ry="10"/><path d="M56 27v72c0 7 15 12 34 12s34-5 34-12V27"/><ellipse class="light" cx="90" cy="27" rx="34" ry="10"/><path class="detail" d="M61 43h58M61 55h58M61 83h58M61 95h58"/><path class="highlight" d="M70 34v61"/></svg>`,
  "metal-screw": `<svg viewBox="0 0 180 130"><g transform="rotate(-34 90 65)"><path d="M82 34h16l-2 66-6 13-6-13z"/><rect x="72" y="22" width="36" height="20" rx="5"/><path class="detail" d="M78 32h24M82 52l15 8M82 64l15 8M82 76l15 8M82 88l14 8"/></g></svg>`,
  "metal-spoon": `<svg viewBox="0 0 180 130"><ellipse cx="90" cy="34" rx="23" ry="28"/><path d="M85 57h10l5 61H80z"/><ellipse class="light" cx="86" cy="29" rx="10" ry="14"/><path class="highlight" d="M88 66v42"/></svg>`,
  "metal-key": `<svg viewBox="0 0 180 130"><circle cx="54" cy="58" r="26"/><circle class="cutout" cx="54" cy="58" r="12"/><path d="M76 51h70v16h-18v14h-15V67H98v11H84V67h-8z"/><path class="highlight" d="M83 55h55"/></svg>`,
  "metal-nut": `<svg viewBox="0 0 180 130"><path d="M55 30h70l25 35-25 35H55L30 65z"/><circle class="cutout" cx="90" cy="65" r="22"/><path class="detail" d="M55 39h65l19 26-18 26"/><path class="highlight" d="M54 35l-17 30"/></svg>`,
  "metal-whisk": `<svg viewBox="0 0 180 130"><rect x="82" y="75" width="16" height="47" rx="6"/><path class="wire" d="M90 80C24 48 48 10 90 70M90 80C156 48 132 10 90 70M90 78C59 38 73 9 90 69M90 78C121 38 107 9 90 69"/><path class="highlight" d="M87 84v30"/></svg>`,
  "metal-cup": `<svg viewBox="0 0 180 130"><path d="M47 27h72l-7 82H55z"/><ellipse class="light" cx="83" cy="27" rx="36" ry="9"/><path class="handle" d="M116 43c39-4 42 53-3 51"/><path class="highlight" d="M63 39l-4 55"/><path class="detail" d="M55 99h57"/></svg>`,
  "metal-wrench": `<svg viewBox="0 0 180 130"><path d="M49 15l19 19-9 18-18 9-19-19 6 29 21 10 20-9 57 46 18-18-55-48 6-22-10-21-29-6z"/><circle class="cutout" cx="133" cy="105" r="7"/><path class="highlight" d="M72 66l53 44"/></svg>`,
  "plastic-shampoo": `<svg viewBox="0 0 180 130"><path d="M65 31h50l10 16-5 68H60l-5-68z"/><rect class="cap" x="72" y="15" width="36" height="18" rx="4"/><path class="seam" d="M61 49c16 7 42 7 58 0M66 98h48"/><path class="highlight" d="M72 44c-7 17-7 39-4 52"/></svg>`,
  "plastic-lunchbox": `<svg viewBox="0 0 180 130"><rect x="31" y="39" width="118" height="67" rx="16"/><rect class="light" x="26" y="28" width="128" height="28" rx="12"/><path class="seam" d="M35 59h110"/><rect class="detail-fill" x="80" y="51" width="20" height="15" rx="4"/></svg>`,
  "plastic-block": `<svg viewBox="0 0 180 130"><rect x="34" y="42" width="112" height="68" rx="9"/><g class="studs"><ellipse cx="57" cy="42" rx="13" ry="7"/><ellipse cx="90" cy="42" rx="13" ry="7"/><ellipse cx="123" cy="42" rx="13" ry="7"/></g><path class="seam" d="M42 55h96M45 99h90"/><path class="highlight" d="M45 59v30"/></svg>`,
  "plastic-cup": `<svg viewBox="0 0 180 130"><path d="M48 27h84l-12 86H60z"/><ellipse class="light" cx="90" cy="27" rx="42" ry="9"/><path class="seam" d="M58 83h64"/><path class="highlight" d="M67 39l-5 52"/></svg>`,
  "plastic-detergent": `<svg viewBox="0 0 180 130"><path d="M65 34h49l13 18-5 65H55l-4-65z"/><path class="handle-cutout" d="M74 48h31v29H83V60h-9z"/><rect class="cap" x="87" y="16" width="30" height="18" rx="5"/><path class="seam" d="M59 91h59"/><path class="highlight" d="M65 86V53"/></svg>`,
  "plastic-funnel": `<svg viewBox="0 0 180 130"><ellipse cx="90" cy="27" rx="56" ry="15"/><path d="M35 27l43 56v35h24V83l43-56c-13 10-97 10-110 0z"/><ellipse class="light" cx="90" cy="27" rx="44" ry="9"/><path class="seam" d="M72 75h36"/><path class="highlight" d="M55 40l28 38"/></svg>`,
  "plastic-shovel": `<svg viewBox="0 0 180 130"><path d="M73 14h34v28H73z"/><rect class="cutout-stroke" x="82" y="21" width="16" height="12" rx="7"/><path d="M84 40h12v47H84zM59 83h62l-9 36H68z"/><path class="seam" d="M68 91h44"/><path class="highlight" d="M73 96h30"/></svg>`,
  "plastic-basket": `<svg viewBox="0 0 180 130"><path class="handle" d="M55 53c0-43 70-43 70 0"/><path d="M33 48h114l-12 65H45z"/><path class="slots" d="M55 61v38M73 61v38M90 61v38M107 61v38M125 61v38"/><path class="seam" d="M39 72h102M43 95h94"/></svg>`,
  "test-nail": `<svg viewBox="0 0 180 130"><g transform="rotate(35 90 65)"><path d="M84 30h12v77l-6 14-6-14z"/><rect x="69" y="19" width="42" height="15" rx="3"/><path class="highlight" d="M88 38v61"/></g></svg>`,
  "test-metal-tray": `<svg viewBox="0 0 180 130"><path d="M26 37h128l-14 70H40z"/><path class="light" d="M39 48h102l-10 47H49z"/><path class="detail" d="M43 55l9 35M61 51l5 42M82 50v44M102 50l-4 44M122 51l-8 41M140 55l-9 35"/><path class="highlight" d="M36 42h106"/></svg>`,
  "test-plastic-ruler": `<svg viewBox="0 0 180 130"><g transform="rotate(-18 90 65)"><rect x="18" y="48" width="144" height="34" rx="5"/><path class="ticks" d="M30 49v17M42 49v10M54 49v17M66 49v10M78 49v17M90 49v10M102 49v17M114 49v10M126 49v17M138 49v10M150 49v17"/><path class="highlight" d="M25 75h129"/></g></svg>`,
  "test-spray-bottle": `<svg viewBox="0 0 180 130"><path d="M67 46h45l12 18-5 55H58l-4-55z"/><path d="M76 29h36v20H76zM103 20h42v14h-27l-8 10"/><path class="trigger" d="M104 35l20 25h-17L92 39"/><path class="seam" d="M61 72h57"/><path class="highlight" d="M67 79v28"/></svg>`,
};

function renderAIObjectVisual(item, options = {}) {
  const visual = normalizeAIVisual(item?.visual);
  const size = options.size || "card";
  const className = options.className ? ` ${options.className}` : "";
  const accessibility = options.decorative
    ? ' aria-hidden="true"'
    : ` role="img" aria-label="${item.description}"`;
  const artwork = AI_OBJECT_ARTWORK[item?.id]?.replace("<svg ", '<svg class="ai-object-svg" aria-hidden="true" focusable="false" ');
  return `
    <span
      class="ai-object-visual ai-object-visual--${size} ai-material-${item?.trueCategory || "unknown"} ai-type-${visual.type} ai-variant-${visual.variant} ai-accent-${visual.accent} ai-detail-${visual.detail}${className}"
      style="--object-bg:${visual.background}"
      ${accessibility}
    >
      ${artwork || '<span class="ai-object-body"></span><span class="ai-object-detail ai-object-detail-primary"></span><span class="ai-object-detail ai-object-detail-secondary"></span>'}
    </span>
  `;
}

function getSelectedAIObjects(label) {
  return state.aiLab.trainingDeckIds.map(getAIObject).filter((item) => state.aiLab.labels[item.id] === label);
}

function labelAITrainingObject(id, label) {
  if (state.aiLab.training || !["metal", "plastic"].includes(label)) return;
  if (!state.aiLab.trainingDeckIds.includes(id)) return;
  const hadTrainedModel = state.aiLab.trained || Boolean(state.aiLab.trainingSignature);
  const hadInstalledModel = state.aiLab.installed;
  const changed = state.aiLab.labels[id] !== label;
  if (changed) {
    state.aiLab.labels[id] = label;
    invalidateAIModel({ hadModel: hadTrainedModel });
  }
  state.aiLab.trainingIndex = Math.min(state.aiLab.trainingDeckIds.length, state.aiLab.trainingIndex + 1);
  saveProgress();
  renderAILab();
  showAIStatus(
    changed && hadInstalledModel
      ? "Träningskorten har ändrats. Träna och installera modellen igen innan Sorteringslinjen kan använda den."
      : changed && hadTrainedModel
        ? "Träningsdatan har ändrats. Träna modellen igen."
        : state.aiLab.trainingIndex >= state.aiLab.trainingDeckIds.length
          ? "Alla tio föremål är märkta. Kontrollera dina svar."
          : `${getAIObject(id).name} märktes som ${formatAICategory(label)}.`,
    "info",
  );
  focusAIElement(state.aiLab.trainingIndex >= state.aiLab.trainingDeckIds.length ? "#ai-training-review-title" : "#ai-training-title");
}

function showPreviousAITrainingObject() {
  if (state.aiLab.training || state.aiLab.trainingIndex <= 0) return;
  state.aiLab.trainingIndex -= 1;
  saveProgress();
  renderAILab();
  focusAIElement("#ai-training-title");
}

function editAITrainingObject(index) {
  const cleanIndex = clampNumber(index, 0, state.aiLab.trainingDeckIds.length - 1, 0);
  state.aiLab.trainingIndex = cleanIndex;
  saveProgress();
  renderAILab();
  focusAIElement("#ai-training-title");
}

function requestNewAITrainingDeck() {
  const hasMeaningfulWork = Object.keys(state.aiLab.labels).length > 0 || state.aiLab.trained || state.aiLab.installed;
  if (!hasMeaningfulWork) {
    startNewAITrainingDeck();
    return;
  }
  openConfirmation({
    title: "Nya träningsobjekt?",
    message: "Dina märkningar och pågående test försvinner. Stjärnor och andra framsteg sparas.",
    confirmLabel: "Ja, byt objekt",
    action: startNewAITrainingDeck,
  });
}

function startNewAITrainingDeck() {
  const completed = state.aiLab.completed;
  const hadModel = state.aiLab.trained || state.aiLab.installed || Boolean(state.aiLab.trainingSignature);
  state.aiLab.trainingDeckIds = createAITrainingDeck();
  state.aiLab.trainingIndex = 0;
  state.aiLab.labels = {};
  state.aiLab.trainingSignature = "";
  invalidateAIModel({ hadModel, preserveCompleted: true });
  state.aiLab.completed = completed;
  saveProgress();
  renderAILab();
  showAIStatus("Du har fått tio nya träningsobjekt.", "info");
  focusAIElement("#ai-training-title");
}

function invalidateAIModel({ hadModel = state.aiLab.trained || state.aiLab.installed, preserveCompleted = false } = {}) {
  state.aiLab.runId += 1;
  state.aiLab.trained = false;
  state.aiLab.installed = false;
  state.aiLab.installedSignature = "";
  state.aiLab.modelOutdated = Boolean(hadModel);
  if (!preserveCompleted) state.aiLab.completed = false;
  state.aiLab.stage = "training";
  state.aiLab.testResults = [];
  resetCurrentAITest();
  state.signatureState = createSignatureState();
}

async function trainAIModel() {
  if (state.aiLab.training) return;
  const validation = getAITrainingValidationMessage();
  if (validation) {
    showAIStatus(validation, "warning");
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
  saveProgress();
  renderAILab();
  showAIStatus("Modellen är tränad. Prova hur den gissar på nya föremål.", "success");
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
  if (!examples.length) return { objectId: item.id, label: "metal", predictedLabel: "metal", confidence: 0, confidenceBand: "Osäker gissning", neighbors: [] };
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
  if (margin < 0.22 || supportingNeighbors < 2) return "Osäker gissning";
  if (margin >= 0.55 && supportingNeighbors === 3) return "Stark gissning";
  return "Ganska säker gissning";
}

function getAISimilarityDescriptor(distance) {
  if (distance <= 0.4) return "Mycket lik";
  if (distance <= 0.75) return "Ganska lik";
  return "Lite lik";
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
  saveProgress();
  renderAILab();
  showAIStatus(`Modellen gissar ${formatAICategoryTitle(state.aiLab.currentPrediction.predictedLabel)}. ${state.aiLab.currentPrediction.confidenceBand}. En stark gissning kan fortfarande vara fel.`, "info");
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
  showAIStatus(state.aiLab.currentPrediction.correct ? "Modellen gissade rätt." : "Modellen gissade fel.", state.aiLab.currentPrediction.correct ? "success" : "warning");
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
  const mixed = new Set(prediction.neighbors.map((neighbor) => neighbor.assignedLabel)).size > 1;
  return mixed
    ? `Exemplen pekade åt olika håll. De sammanlagda likheterna gjorde att modellen gissade ${formatAICategory(prediction.predictedLabel)}.`
    : `De närmaste exemplen var märkta som ${formatAICategory(prediction.predictedLabel)}. Därför gissade modellen ${formatAICategory(prediction.predictedLabel)}.`;
}

function getPostRevealFeedback(prediction) {
  const mislabelled = prediction.neighbors.filter((neighbor) => neighbor.assignedLabel !== neighbor.trueCategory);
  if (mislabelled.length > 1) return "Flera liknande träningskort hade fel märkning. Modellen byggdes av de märkningarna.";
  if (mislabelled.length === 1) return `Ett liknande träningskort var märkt som ${formatAICategoryTitle(mislabelled[0].assignedLabel)}. Modellen använder märkningen du gav, även när märkningen blir fel.`;
  const mixed = new Set(prediction.neighbors.map((neighbor) => neighbor.assignedLabel)).size > 1;
  if (prediction.confidenceBand === "Osäker gissning" || prediction.scoreMargin < 0.3) return "Det nya föremålet liknade exempel från båda kategorierna. Därför blev gissningen osäker.";
  if (mixed) return "Det nya föremålet liknade exempel från båda kategorierna. De starkaste likheterna avgjorde svaret.";
  const counts = getAssignedLabelCounts();
  const other = prediction.predictedLabel === "metal" ? "plastic" : "metal";
  if (counts[prediction.predictedLabel] >= counts[other] * 2) return `Modellen fick fler exempel märkta som ${formatAICategory(prediction.predictedLabel)}. Det kan göra att den oftare väljer den kategorin.`;
  if (hasLowAIVariety(prediction.predictedLabel)) return `Dina ${formatAICategory(prediction.predictedLabel)}exempel liknade varandra mycket. Ett mer annorlunda exempel kan hjälpa modellen med nya föremål.`;
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
  if (selected.some((item) => state.aiLab.labels[item.id] !== item.trueCategory)) return "Kontrollera märkningarna. Ett felmärkt kort kan styra modellen åt fel håll.";
  const counts = getAssignedLabelCounts();
  if (Math.max(counts.metal, counts.plastic) >= Math.min(counts.metal, counts.plastic) * 2) return "Prova en jämnare blandning av metallexempel och plastexempel.";
  if (hasLowAIVariety("metal") || hasLowAIVariety("plastic")) return "Byt ut ett mycket likt kort mot ett exempel som ser annorlunda ut.";
  if (results.filter((result) => result.confidenceBand === "Osäker gissning").length >= 2) return "Modellen gav flera osäkra gissningar. Mer varierade exempel kan göra skillnaden tydligare.";
  return "Din modell fungerade bra. Testa att byta ett exempel och se hur resultatet förändras.";
}

function returnToAITraining() {
  state.aiLab.runId += 1;
  state.aiLab.stage = "training";
  state.aiLab.training = false;
  state.aiLab.scanRunning = false;
  state.aiLab.trainingIndex = state.aiLab.trainingDeckIds.length;
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
  if (state.aiLab.testResults.filter((result) => result.correct).length < 3) {
    showAIStatus("Minst tre av fyra test behöver bli rätt innan modellen kan installeras.", "warning");
    return;
  }
  if (state.aiLab.trainingSignature !== createAITrainingSignature(state.aiLab.labels)) {
    showAIStatus("Träningsdatan har ändrats. Träna modellen igen.", "warning");
    return;
  }
  state.aiLab.installed = true;
  state.aiLab.installedSignature = state.aiLab.trainingSignature;
  state.aiLab.stage = "sorting";
  saveProgress();
  renderAILab();
  showAIStatus("Modellen är installerad. Roboten kan nu använda dess gissningar i ett uppdrag.", "success");
  if (state.returnToSignature && state.bestStars["11"]) {
    state.returnToSignature = false;
    openLevel(LEVELS.findIndex((level) => level.signature));
    showStatus("Programmet är bevarat. Kör uppdraget med den nya installerade modellen.", "success");
  }
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
  state.aiLab.scanRunning = false;
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

function showCompletionDialog(stars, mastery = evaluateMasteryCriteria(getCurrentLevel())) {
  const level = getCurrentLevel();
  const isFinalLevel = level.signature;
  elements.completionTitle.textContent = isFinalLevel
    ? "Sorteringslinjen klar!"
    : "Snyggt programmerat!";
  elements.completionStars.innerHTML = renderStarsHtml(stars);
  elements.completionStars.setAttribute(
    "aria-label",
    `${stars} ${stars === 1 ? "stjärna" : "stjärnor"} av 3`,
  );
  elements.completionMessage.textContent = isFinalLevel
    ? "Programmet följde dina regler och modellen gjorde gissningarna. Båda delarna behövde fungera."
    : level.id === 11
      ? state.aiLab.installed
        ? "Sorteringslinjen är upplåst. Din installerade modell kan nu användas i robotens program."
        : "Villkorskapitlet är klart. Träna och installera AI-kameran för att öppna Sorteringslinjen."
    : level.id === 8
      ? "Roboten reagerar och AI-labbet har öppnat parallellt."
    : level.id === 6
      ? "Robotlaboratoriet har öppnat! Nu väntar loopar och robotarmar."
      : level.successMessage ||
        `Du klarade ${level.title} med ${countAuthoredBlocks(state.programCommands)} instruktioner.`;
  elements.completionLearning.textContent = level.learning;
  elements.completionCriteria.innerHTML = level.mastery.map((criterion, index) => `<li class="${mastery[index] ? "is-earned" : ""}"><span aria-hidden="true">${mastery[index] ? "★" : "☆"}</span>${criterion}</li>`).join("");
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
  if (currentLevel.signature || (currentLevel.id === 11 && !isLevelUnlocked(LEVELS[11]))) {
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

let pendingConfirmationAction = null;

function openConfirmation({ title, message, confirmLabel, action }) {
  pendingConfirmationAction = action;
  elements.confirmTitle.textContent = title;
  elements.confirmMessage.textContent = message;
  elements.confirmResetButton.textContent = confirmLabel;
  if (!elements.confirmDialog.open) elements.confirmDialog.showModal();
}

function closeConfirmation() {
  pendingConfirmationAction = null;
  if (elements.confirmDialog.open) elements.confirmDialog.close();
}

function confirmPendingAction() {
  const action = pendingConfirmationAction;
  closeConfirmation();
  action?.();
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
  elements.developmentDemoButton.addEventListener("click", startDevelopmentDemo);
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
    if (action === "previous-object") showPreviousAITrainingObject();
    if (action === "new-deck") requestNewAITrainingDeck();
    if (action === "mission") openLevel(LEVELS.findIndex((level) => level.signature));
    if (action === "levels") showScreen("level");

    const labelButton = event.target.closest("[data-ai-label-id]");
    if (labelButton) labelAITrainingObject(labelButton.dataset.aiLabelId, labelButton.dataset.label);
    const editButton = event.target.closest("[data-ai-edit-index]");
    if (editButton) editAITrainingObject(editButton.dataset.aiEditIndex);
  });

  elements.commandPalette.addEventListener("click", (event) => {
    const commandButton = event.target.closest("[data-command]");
    if (commandButton) addCommand(commandButton.dataset.command);
  });
  elements.sensorTipDismiss.addEventListener("click", dismissSensorIntro);

  elements.programList.addEventListener("click", (event) => {
    const branchAddButton = event.target.closest("[data-branch-add]");
    if (branchAddButton) {
      const item = branchAddButton.closest("[data-command-index]");
      const branchSection = branchAddButton.closest("[data-branch]");
      if (item && branchSection) addBranchCommand(Number(item.dataset.commandIndex), branchSection.dataset.branch, branchAddButton.dataset.branchAdd);
      return;
    }
    const branchRemoveButton = event.target.closest(".remove-branch-command");
    if (branchRemoveButton) {
      const item = branchRemoveButton.closest("[data-command-index]");
      const branchSection = branchRemoveButton.closest("[data-branch]");
      const branchItem = branchRemoveButton.closest("[data-branch-index]");
      if (item && branchSection && branchItem) removeBranchCommand(Number(item.dataset.commandIndex), branchSection.dataset.branch, Number(branchItem.dataset.branchIndex));
      return;
    }
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
  elements.traceStartButton.addEventListener("click", startTraceMode);
  elements.traceNextButton.addEventListener("click", runNextTraceStep);
  elements.traceRunButton.addEventListener("click", runTraceToEnd);
  elements.traceRewindButton.addEventListener("click", rewindTrace);
  elements.traceExitButton.addEventListener("click", exitTraceMode);
  elements.hintButton.addEventListener("click", revealHint);
  elements.nextHintButton.addEventListener("click", revealHint);
  elements.hintCloseButton.addEventListener("click", () => { elements.hintPanel.hidden = true; });
  elements.masteryToggle.addEventListener("click", toggleMasteryCriteria);
  elements.predictionSkip.addEventListener("click", () => { state.prediction.skipped = true; renderPredictionPrompt(); });
  elements.predictionOptions.addEventListener("click", (event) => {
    const option = event.target.closest("[data-prediction]");
    if (option) choosePrediction(option.dataset.prediction);
  });
  elements.signatureFeedback.addEventListener("click", (event) => {
    const action = event.target.closest("[data-signature-action]")?.dataset.signatureAction;
    if (action === "improve") improveTrainingFromMission();
    if (action === "trace") {
      if (!state.executionState.traceMode) state.executionState.traceMode = true;
      renderTracePanel();
      elements.traceRewindButton.focus();
    }
    if (action === "continue") continueSignatureAttempt();
  });

  elements.retryLevelButton.addEventListener("click", retryCurrentLevel);
  elements.nextLevelButton.addEventListener("click", goToNextLevel);
  elements.completionLevelsButton.addEventListener("click", () => showScreen("level"));
  elements.completionDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    showScreen("level");
  });

  elements.resetProgressButton.addEventListener("click", () => openConfirmation({
    title: "Nollställa allt?",
    message: "Alla stjärnor och AI-labbets framsteg försvinner. Bara det första uppdraget är upplåst.",
    confirmLabel: "Ja, nollställ",
    action: resetAllProgress,
  }));
  elements.cancelResetButton.addEventListener("click", closeConfirmation);
  elements.confirmResetButton.addEventListener("click", confirmPendingAction);
  elements.confirmDialog.addEventListener("click", (event) => {
    if (event.target === elements.confirmDialog) closeConfirmation();
  });
  elements.confirmDialog.addEventListener("cancel", () => { pendingConfirmationAction = null; });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.executionState.running) {
      initializeLevel({ keepProgram: true });
      showStatus("Körningen stoppades. Programmet finns kvar.", "info");
    }
    if (event.key === "Escape" && state.currentScreen === "ai-lab" && state.aiLab.training) {
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
  document.body.classList.toggle("is-demo-mode", demoState.enabled);
  elements.demoNotice.hidden = !demoState.enabled;
  elements.screens.forEach((screen) => {
    screen.setAttribute("aria-hidden", String(screen !== elements.startScreen));
  });
  renderLevelSelection();
  if (demoState.requestedLevel) {
    openLevel(LEVELS.findIndex((level) => level.id === demoState.requestedLevel));
  } else if (demoState.requestedScreen === "ai-lab") {
    openAILab();
  }
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
  demoState,
});
