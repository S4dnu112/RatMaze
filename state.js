// ─── Constants & State ────────────────────────────────────────────────────────
const START_NODE = "start_90";
const GOAL_NODE = "goal_0";
const NODE_RADIUS = 18;
const CANVAS_MARGIN_TOP = 40;

let currentNode = START_NODE;
let path = [START_NODE];
let gScore = 0;

let astarPath = [];
let astarCost = null;
let astarVisited = [];

let isRatView = true;
let jerryFacing = "right";

// ─── Canvas & Images ─────────────────────────────────────────────────────────
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const imgMazeOutline = document.getElementById("imgMazeOutline");
const imgJerryRight = document.getElementById("imgJerryRight");
const imgJerryLeft = document.getElementById("imgJerryLeft");
const imgTom = document.getElementById("imgTom");
const imgHeuristic = document.getElementById("imgHeuristic");
const imgPath = document.getElementById("imgPath");
const imgEnd = document.getElementById("imgEnd");

// ─── UI Elements (must be declared before any drawGraph call) ─────────────────
const btnUp = document.getElementById("btnUp");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnDown = document.getElementById("btnDown");
const btnRunAstar = document.getElementById("btnRunAstar");
const btnReset = document.getElementById("btnReset");
const currentNodeDisplay = document.getElementById("currentNodeDisplay");
const gScoreDisplay = document.getElementById("gScoreDisplay");
const hScoreDisplay = document.getElementById("hScoreDisplay");
const fScoreDisplay = document.getElementById("fScoreDisplay");
const viewToggle = document.getElementById("viewToggle");
const heuristicToggle = document.getElementById("heuristicToggle");
