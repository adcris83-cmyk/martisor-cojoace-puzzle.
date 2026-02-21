// Definim nivelurile jocului
const LEVELS = [
  {
    id: 1,
    name: "Început de primăvară",
    initialStack: ["A", "B", "C"],
    targetCojoace: 2,
    maxMoves: 10
  },
  {
    id: 2,
    name: "Vânt de martie",
    initialStack: ["B", "C", "A", "D"],
    targetCojoace: 3,
    maxMoves: 14
  },
  {
    id: 3,
    name: "Ninsoare târzie",
    initialStack: ["C", "B", "A", "D", "B"],
    targetCojoace: 4,
    maxMoves: 18
  },
  {
    id: 4,
    name: "Sărbătoare în sat",
    initialStack: ["D", "C", "B", "A", "B", "A"],
    targetCojoace: 6,
    maxMoves: 24
  }
  // poți adăuga mai multe niveluri
];

let currentLevelIndex = 0;
let stack = [];
let cojoace = 0;
let moves = 0;

const stackEl = document.getElementById("stack");
const levelDisplay = document.getElementById("level-display");
const cojoaceDisplay = document.getElementById("cojoace-display");
const movesDisplay = document.getElementById("moves-display");
const logEl = document.getElementById("log");

const btnMoveTop = document.getElementById("btn-move-top");
const btnResetLevel = document.getElementById("btn-reset-level");

function log(message) {
  const div = document.createElement("div");
  div.className = "log-entry";
  div.textContent = message;
  logEl.prepend(div);
}

function renderStack() {
  stackEl.innerHTML = "";
  stack.forEach((type, index) => {
    const li = document.createElement("li");
    li.className = "stack-item";
    li.dataset.type = type;
    li.textContent = `Segment ${type}`;
    // elementul de sus este ultimul din array (vârful stivei)
    if (index === stack.length - 1) {
      li.classList.add("top");
      li.textContent += " (sus)";
    }
    stackEl.appendChild(li);
  });
}

function updateHUD() {
  const level = LEVELS[currentLevelIndex];
  levelDisplay.textContent = `${level.id} – ${level.name}`;
  cojoaceDisplay.textContent = `${cojoace}/${level.targetCojoace}`;
  movesDisplay.textContent = `${moves}/${level.maxMoves}`;
}

function loadLevel(index) {
  const level = LEVELS[index];
  stack = [...level.initialStack]; // copiem
  cojoace = 0;
  moves = 0;
  log(`--- Nivel ${level.id}: ${level.name} ---`);
  renderStack();
  updateHUD();
}

function checkLevelComplete() {
  const level = LEVELS[currentLevelIndex];
  if (cojoace >= level.targetCojoace) {
    log(`✔ Ai terminat nivelul ${level.id} cu succes!`);
    currentLevelIndex++;
    if (currentLevelIndex >= LEVELS.length) {
      alert("🎉 Ai terminat toate nivelurile! 9 cojoace și mai multe!");
      currentLevelIndex = LEVELS.length - 1;
      return;
    }
    loadLevel(currentLevelIndex);
  } else if (moves >= level.maxMoves) {
    log(`✖ Ai epuizat mutările la nivelul ${level.id}. Încearcă din nou.`);
  }
}

function moveTopSegment() {
  const level = LEVELS[currentLevelIndex];
  if (moves >= level.maxMoves) {
    log("Nu mai ai mutări la acest nivel. Resetează sau treci mai departe (dacă e complet).");
    return;
  }

  if (stack.length === 0) {
    log("Nu mai sunt segmente de mutat.");
    return;
  }

  const top = stack.pop(); // vârful stivei
  moves++;

  // Regulă de joc:
  // - Segmentele A și B dau cojoace.
  // - C și D se întorc jos, dar pot schimba dinamica stivei.
  if (top === "A" || top === "B") {
    cojoace++;
    log(`Ai mutat segmentul ${top} și ai colectat un cojoc! Total: ${cojoace}`);
  } else {
    // îl punem jos, dar putem adăuga o mică „penalizare” logică
    stack.unshift(top);
    log(`Segmentul ${top} nu a dat cojoc. A fost pus la baza stivei.`);
  }

  renderStack();
  updateHUD();
  checkLevelComplete();
}

btnMoveTop.addEventListener("click", moveTopSegment);

btnResetLevel.addEventListener("click", () => {
  loadLevel(currentLevelIndex);
  log("Nivel resetat.");
});

// Pornim jocul
loadLevel(currentLevelIndex);
