"use strict";

// ----- Game data ------------------------------------------------------------

const COMMANDS = {
  forward: { label: "Framåt", symbol: "↑", shortLabel: "Framåt" },
  left: { label: "Sväng vänster", symbol: "↶", shortLabel: "Vänster" },
  right: { label: "Sväng höger", symbol: "↷", shortLabel: "Höger" },
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
  },
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
};

// ----- DOM references -------------------------------------------------------

const elements = {
  screens: [...document.querySelectorAll(".screen")],
  startScreen: document.querySelector("#start-screen"),
  levelScreen: document.querySelector("#level-screen"),
  gameScreen: document.querySelector("#game-screen"),
  brandButton: document.querySelector("#brand-button"),
  startButton: document.querySelector("#start-button"),
  learnHeaderButton: document.querySelector("#learn-header-button"),
  learnHeroButton: document.querySelector("#learn-hero-button"),
  backStartButton: document.querySelector("#back-start-button"),
  backLevelsButton: document.querySelector("#back-levels-button"),
  levelGrid: document.querySelector("#level-grid"),
  progressBadge: document.querySelector("#progress-badge"),
  resetProgressButton: document.querySelector("#reset-progress-button"),
  gameTitle: document.querySelector("#game-title"),
  missionNumber: document.querySelector("#mission-number"),
  missionText: document.querySelector("#mission-text"),
  objectiveStatus: document.querySelector("#objective-status"),
  levelProgressText: document.querySelector("#level-progress-text"),
  levelProgressFill: document.querySelector("#level-progress-fill"),
  directionLegend: document.querySelector("#direction-legend"),
  board: document.querySelector("#game-board"),
  energyLegend: document.querySelector("#energy-legend"),
  programList: document.querySelector("#program-list"),
  programListWrap: document.querySelector(".program-list-wrap"),
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
    state.unlockedLevel = clampNumber(saved.unlockedLevel, 1, LEVELS.length, 1);
    state.bestStars = sanitizeStars(saved.bestStars);
    state.hasSeenInfo = Boolean(saved.hasSeenInfo);
    state.sensorIntro = sanitizeSensorIntro(saved.sensorIntro);
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
}

function sanitizeStars(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value)
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

// ----- Navigation and screens ----------------------------------------------

function showScreen(screenName) {
  cancelExecution();
  closeCompletionDialog();
  state.currentScreen = screenName;
  elements.screens.forEach((screen) => {
    const isTarget = screen.id === `${screenName}-screen`;
    screen.classList.toggle("is-active", isTarget);
    screen.setAttribute("aria-hidden", String(!isTarget));
  });

  if (screenName === "level") renderLevelSelection();
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
  elements.levelGrid.replaceChildren(
    ...LEVELS.map((level, index) => {
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
          <span class="level-card-icon" aria-hidden="true">${renderLevelIcon(level.id, !isUnlocked)}</span>
        </span>
        <h2>${level.title}</h2>
        <p>${level.cardText}</p>
        <span class="level-stars" aria-hidden="true">${renderStarsHtml(stars)}</span>
        ${isUnlocked ? '<span class="level-card-action" aria-hidden="true">Öppna <i>→</i></span>' : ""}
      `;
      return card;
    }),
  );
}

function renderLevelIcon(levelId, isLocked = false) {
  const icons = {
    lock: '<path d="M12 18v-5a8 8 0 0 1 16 0v5"/><rect class="icon-accent" x="8" y="17" width="24" height="18" rx="5"/><path d="M20 24v5"/>',
    1: '<path class="icon-accent" d="M10 5c4 0 7 3 7 7v5c0 3-2 5-5 5s-5-2-5-5v-6c0-3 1-5 3-6Z"/><path class="icon-accent" d="M28 18c4 0 6 3 6 7v4c0 4-2 6-5 6s-5-2-5-5v-6c0-3 2-5 4-6Z"/><path d="M10 9h7M27 22h7"/>',
    2: '<path d="M8 29h12c8 0 12-4 12-12v-5"/><path class="icon-accent" d="m25 17 7-7 7 7"/>',
    3: '<path d="M14 14V9h12v5"/><rect class="icon-accent" x="5" y="13" width="30" height="21" rx="5"/><path d="M5 21h30M18 20v5h4v-5"/>',
    4: '<path class="icon-accent" d="M23 3 9 23h10l-2 14 14-21H21l2-13Z"/>',
    5: '<circle class="icon-accent" cx="10" cy="30" r="3"/><path d="M10 24a6 6 0 0 1 6 6M10 17a13 13 0 0 1 13 13M10 10a20 20 0 0 1 20 20"/>',
    6: '<path d="M9 36V5"/><path class="icon-accent" d="M10 7h23v17H10z"/><path d="M21.5 7v17M10 15.5h23"/>',
  };
  const icon = icons[isLocked ? "lock" : levelId] || icons.lock;
  return `<svg class="workshop-icon" viewBox="0 0 40 40" aria-hidden="true" focusable="false">${icon}</svg>`;
}

// ----- Level and board rendering -------------------------------------------

function initializeLevel({ keepProgram = false } = {}) {
  cancelExecution();
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  if (!keepProgram) state.programCommands = [];
  state.completionShown = false;
  state.executionState.activeCommandIndex = -1;

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
      const energyIndex = level.energy.findIndex((item) => item.x === x && item.y === y);
      const hasEnergy = energyIndex >= 0 && !state.collectedItems.has(energyIndex);

      cell.className = `grid-cell${isGoal ? " is-goal" : ""}`;
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", describeCell(x, y, { isGoal, isObstacle, hasEnergy }));
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
        energy.textContent = "";
        energy.setAttribute("aria-hidden", "true");
        cell.append(energy);
      }
      fragment.append(cell);
    }
  }

  const robot = document.createElement("div");
  robot.className = "robot-piece";
  robot.id = "robot-piece";
  robot.setAttribute("role", "img");
  robot.innerHTML = '<span class="robot-visual" aria-hidden="true"></span>';
  fragment.append(robot);
  elements.board.replaceChildren(fragment);
  updateRobotVisual();
}

function describeCell(x, y, contents) {
  const parts = [`Rad ${y + 1}, kolumn ${x + 1}`];
  if (contents.isGoal) parts.push("mål");
  if (contents.isObstacle) parts.push("hinder");
  if (contents.hasEnergy) parts.push("energicell");
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
}

function updateObjectiveStatus() {
  const level = getCurrentLevel();
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

function renderProgram() {
  elements.programList.replaceChildren(
    ...state.programCommands.map((commandId, index) => {
      const command = COMMANDS[commandId];
      const item = document.createElement("li");
      item.className = `program-step${
        state.executionState.activeCommandIndex === index ? " is-active" : ""
      }`;
      item.dataset.commandIndex = String(index);
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
    }),
  );

  const level = getCurrentLevel();
  const isEmpty = state.programCommands.length === 0;
  elements.emptyProgram.classList.toggle("is-hidden", !isEmpty);
  elements.programListWrap.classList.toggle("is-empty", isEmpty);
  elements.commandCount.textContent = `${state.programCommands.length} / ${level.maxCommands}`;
  elements.commandCount.classList.toggle(
    "is-full",
    state.programCommands.length >= level.maxCommands,
  );
  updateControls();
}

function addCommand(commandId) {
  const level = getCurrentLevel();
  if (state.executionState.running) return;
  if (!level.commands.includes(commandId)) return;
  if (state.programCommands.length >= level.maxCommands) {
    showStatus("Programmet är fullt. Ta bort en instruktion för att lägga till en ny.", "warning");
    return;
  }
  state.programCommands.push(commandId);
  renderProgram();
  elements.programList.lastElementChild?.classList.add("is-new");
  showStatus(`Instruktionen ${COMMANDS[commandId].label} lades till.`, "info");
  elements.programList.lastElementChild?.scrollIntoView({ block: "nearest" });
}

function removeCommand(index) {
  if (state.executionState.running || index < 0 || index >= state.programCommands.length) return;
  const [removed] = state.programCommands.splice(index, 1);
  renderProgram();
  showStatus(`${COMMANDS[removed].label} togs bort.`, "info");
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
  const full = state.programCommands.length >= level.maxCommands;
  elements.commandPalette.querySelectorAll("button").forEach((button) => {
    button.disabled = running || full;
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

  resetRobotForRun();
  state.executionState.running = true;
  state.executionState.runId += 1;
  const runId = state.executionState.runId;
  state.completionShown = false;
  updateControls();
  showStatus("Roboten följer programmet steg för steg…", "info");

  const commandDelay = prefersReducedMotion() ? 80 : 520;
  for (let index = 0; index < state.programCommands.length; index += 1) {
    if (!isRunActive(runId)) return;
    state.executionState.activeCommandIndex = index;
    renderProgram();
    await wait(prefersReducedMotion() ? 20 : 150);
    if (!isRunActive(runId)) return;

    const result = await executeCommand(state.programCommands[index], runId, commandDelay);
    if (!isRunActive(runId)) return;
    if (result === "collision") {
      finishFailedRun("Oj! Väggen var i vägen. Ändra programmet och testa igen.");
      return;
    }
    if (checkCompletion()) {
      finishSuccessfulRun();
      return;
    }
  }

  if (!isRunActive(runId)) return;
  finishFailedRun(
    state.collectedItems.size < getCurrentLevel().energy.length
      ? "Programmet tog slut. Kom ihåg att hämta all energi först!"
      : "Programmet tog slut före målet. Vad kan du lägga till?",
  );
}

function resetRobotForRun() {
  const level = getCurrentLevel();
  state.robot = { ...level.start };
  state.collectedItems = new Set();
  state.executionState.activeCommandIndex = -1;
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
  return outside || hasPosition(level.obstacles, x, y);
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
    samePosition(state.robot, level.goal) && state.collectedItems.size === level.energy.length
  );
}

function finishFailedRun(message) {
  state.executionState.running = false;
  state.executionState.activeCommandIndex = -1;
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
  clearBoardEffects();
  const level = getCurrentLevel();
  const stars = calculateStars(state.programCommands.length, level.targetCommands);

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
  visual.classList.remove("is-bumping");
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

// ----- Completion -----------------------------------------------------------

function showCompletionDialog(stars) {
  const level = getCurrentLevel();
  const isFinalLevel = level.id === LEVELS.length;
  elements.completionTitle.textContent = isFinalLevel
    ? "Robotverkstan är räddad!"
    : "Snyggt programmerat!";
  elements.completionStars.innerHTML = renderStarsHtml(stars);
  elements.completionStars.setAttribute(
    "aria-label",
    `${stars} ${stars === 1 ? "stjärna" : "stjärnor"} av 3`,
  );
  elements.completionMessage.textContent = isFinalLevel
    ? "Alla sex uppdrag är klara. Du har programmerat, testat och felsökt som en riktig robotbyggare!"
    : `Du klarade ${level.title} med ${state.programCommands.length} instruktioner.`;
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
  document.addEventListener(
    "pointerdown",
    () => document.documentElement.classList.add("is-pointer-input"),
    { passive: true },
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") document.documentElement.classList.remove("is-pointer-input");
  });

  elements.startButton.addEventListener("click", () => showScreen("level"));
  elements.brandButton.addEventListener("click", () => showScreen("start"));
  elements.backStartButton.addEventListener("click", () => showScreen("start"));
  elements.backLevelsButton.addEventListener("click", () => showScreen("level"));

  elements.learnHeaderButton.addEventListener("click", openLearnDialog);
  elements.learnHeroButton.addEventListener("click", openLearnDialog);
  elements.closeLearnButton.addEventListener("click", closeLearnDialog);
  elements.learnOkButton.addEventListener("click", closeLearnDialog);
  elements.learnDialog.addEventListener("click", (event) => {
    if (event.target === elements.learnDialog) closeLearnDialog();
  });

  elements.levelGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-level-index]");
    if (card) openLevel(Number(card.dataset.levelIndex));
  });

  elements.commandPalette.addEventListener("click", (event) => {
    const commandButton = event.target.closest("[data-command]");
    if (commandButton) addCommand(commandButton.dataset.command);
  });
  elements.sensorTipDismiss.addEventListener("click", dismissSensorIntro);

  elements.programList.addEventListener("click", (event) => {
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
  });
}

function initializeApp() {
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
  isBlocked,
  checkCompletion,
  cancelExecution,
});
