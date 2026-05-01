const nodes = {
    // --- Col 0 (x=45) ---
    "n100_0_0": { h: 100, pos: [180, 120] },
    "n100_0_1": { h: 100, pos: [180, 220] },
    "n85_0_3": { h: 85, pos: [180, 320] },
    "n75_0_4": { h: 75, pos: [180, 430] },
    "n100_0_7": { h: 100, pos: [180, 715] },

    // --- Col 1 (x=165) ---
    "n100_1_0": { h: 100, pos: [485, 90] },
    "n100_1_1": { h: 100, pos: [255, 90] },
    "n60_1_2": { h: 60, pos: [250, 300] },
    "n70_1_5": { h: 70, pos: [350, 540] }, // Big 70
    "n85_1_6": { h: 85, pos: [250, 635] },
    "start_90": { h: 90, pos: [250, 715] },

    // --- Col 2 (x=270) ---
    "n100_2_0": { h: 100, pos: [335, 180] },
    "n25_mid": { h: 25, pos: [425, 155] },
    "n45_2_2": { h: 45, pos: [415, 225] },
    "n50_2_3": { h: 50, pos: [485, 300] },
    "n75_2_5": { h: 75, pos: [475, 540] },
    "n80_2_6": { h: 80, pos: [475, 635] },
    "n75_2_7": { h: 75, pos: [355, 715] },

    // --- Col 3 (x=405) ---
    "n40_3_2": { h: 40, pos: [555, 225] },
    "n30_3_3": { h: 30, pos: [555, 350] },
    "n70_3_5": { h: 70, pos: [555, 525] },
    "n66_3_6": { h: 66, pos: [555, 600] },
    "n67_3_7": { h: 67, pos: [555, 655] }, // Dead end
    "n70_3_7b": { h: 70, pos: [475, 715] },

    // --- Col 4 (x=525) ---
    "n10_mid": { h: 10, pos: [555, 110] },
    "n7_4_1": { h: 7, pos: [640, 160] },
    "n6_4_2": { h: 6, pos: [640, 210] },
    "n80_4_4": { h: 80, pos: [640, 430] },
    "n75_4_5": { h: 75, pos: [640, 525] },
    "n68_4_6": { h: 68, pos: [640, 655] },
    "n69_4_7": { h: 69, pos: [640, 715] },

    // --- Col 5 (x=610) ---
    "goal_0": { h: 0, pos: [745, 40] },
    "n1_5_1": { h: 1, pos: [735, 120] },
    "n3_5_2": { h: 3, pos: [735, 210] },
    "n10_5_3": { h: 10, pos: [735, 390] },
    "n50_5_3b": { h: 50, pos: [735, 460] },
    "n45_5_4": { h: 45, pos: [735, 520] },
    "n50_5_5": { h: 50, pos: [735, 600] },
    "n65_5_7": { h: 65, pos: [735, 715] },

    // --- Col 6 (x=740) ---
    "n3_6_0": { h: 3, pos: [825, 90] },
    "n20_6_3": { h: 20, pos: [825, 390] },
    "n30_6_4": { h: 30, pos: [825, 520] },
    "n55_6_5": { h: 55, pos: [825, 600] },
    "n60_6_7": { h: 60, pos: [825, 715] },
    "n20_6_4": { h: 20, pos: [825, 320]},
};

// ─── Edge Definitions ────────────────────────────────────────────────────────
// [from, to, weight, via]
// `via` is an array of [x,y] waypoints to create elbows. Empty `via` means a straight (or diagonal) line.
const edges = [
    // --- Top-left cluster ---y
    ["n100_0_0", "n100_0_1", 5, []],
    ["n100_0_1", "n60_1_2", 7, [[250, 220]]], // Elbow right then down
    ["n100_1_0", "n100_2_0", 10, [[335, 90]]],
    ["n100_1_1", "n100_2_0", 8, [[255, 180]]], // Elbow up then right
    ["n60_1_2", "n100_2_0", 10, []], // Diagonal up-right (straight diagonal is correct here)

    // --- Top-right cluster ---
    ["n10_mid", "n25_mid", 11, [[555, 155]]],
    ["n10_mid", "goal_0", 10, []], // Elbow right then up
    ["goal_0", "n1_5_1", 1, []], // Down then left
    ["n1_5_1", "n3_5_2", 2, []],
    ["n1_5_1", "n3_6_0", 2, []],
    ["n3_6_0", "n20_6_4", 10, []],

    // --- Mid-left cluster ---
    ["n60_1_2", "n50_2_3", 11, []], // Elbow right then down (ortho)
    ["n60_1_2", "n70_1_5", 16, [[250, 365], [350, 365]]], // Right, down, left to 70
    ["n85_0_3", "n75_0_4", 15, []],
    ["n75_0_4", "n100_0_7", 35, []],
    ["n75_0_4", "n70_1_5", 20, [[250, 430],[250, 540]]], // Elbow right then down

    // --- Center cluster ---
    ["n45_2_2", "n50_2_3", 5, [[485, 225]]],
    ["n40_3_2", "n50_2_3", 6, [[485, 225]]], // Elbow left then down (passing near 45)
    ["n50_2_3", "n30_3_3", 10, [[485, 385], [555, 385]]], // Down then right then up to 30
    ["n30_3_3", "n6_4_2", 8, [[640, 350]]], // Elbow right then up
    ["n6_4_2", "n3_5_2", 3, []], // Horizontal
    ["n6_4_2", "n7_4_1", 1, []], // Vertical

    // --- Mid-right cluster ---
    ["n3_5_2", "n10_5_3", 5, []],
    ["n10_5_3", "n20_6_3", 1, []],
    ["n20_6_3", "n30_6_4", 4, []], // Vertical
    ["n50_5_3b", "n45_5_4", 2, []],
    ["n45_5_4", "n30_6_4", 2, []], // Horizontal
    ["n45_5_4", "n50_5_5", 2, []],

    // --- Lower-center horizontal strip ---
    ["n70_1_5", "n75_2_5", 2, []],
    ["n70_3_5", "n75_4_5", 2, []],

    // --- Lower-right cluster ---
    ["n50_5_5", "n55_6_5", 2, []],
    ["n55_6_5", "n60_6_7", 3, []],
    ["n60_6_7", "n65_5_7", 1, []],

    // --- Lower-center complex ---
    ["n75_4_5", "n80_4_4", 2, []], // Up
    ["n70_3_5", "n66_3_6", 3, []], // Down
    ["n66_3_6", "n50_5_5", 8, []], // Horizontal right then up to 50
    ["n66_3_6", "n67_3_7", 2, []], // Down to 720, then right then up
    ["n67_3_7", "n68_4_6", 2, []], // Horizontal right
    ["n68_4_6", "n69_4_7", 1, []], // Vertical down
    ["n69_4_7", "n70_3_7b", 5, []], // Horizontal left
    ["n70_3_7b", "n75_2_7", 6, []], // Horizontal left

    // --- Bottom-left cluster ---
    ["n80_2_6", "n70_3_7b", 3, []],
    ["n80_2_6", "n75_2_5", 3, []],
    ["n80_2_6", "n85_1_6", 8, []], // Left
    ["n85_1_6", "start_90", 3, []], // Down
    ["start_90", "n100_0_7", 2, []], // Left
];

// ─── Graph Adjacency ─────────────────────────────────────────────────────────
const graph = {};
for (const node_id in nodes) {
    graph[node_id] = [];
}
for (const [a, b, weight] of edges) {
    graph[a].push({ neighbor: b, weight });
    graph[b].push({ neighbor: a, weight });
}

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

let isRatView = false;
let jerryFacing = "right";

// ─── Canvas & Images ─────────────────────────────────────────────────────────
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const imgMazeOutline = document.getElementById("imgMazeOutline");
const imgJerryRight = document.getElementById("imgJerryRight");
const imgJerryLeft = document.getElementById("imgJerryLeft");
const imgTom = document.getElementById("imgTom");
const imgPath = document.getElementById("imgPath");
const imgEnd = document.getElementById("imgEnd");

// ─── UI Elements (must be declared before any drawGraph call) ─────────────────
const btnUp = document.getElementById("btnUp");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnDown = document.getElementById("btnDown");
const btnRunAstar = document.getElementById("btnRunAstar");
const btnReset = document.getElementById("btnReset");
const statusLabel = document.getElementById("statusLabel");
const currentNodeDisplay = document.getElementById("currentNodeDisplay");
const gScoreDisplay = document.getElementById("gScoreDisplay");
const hScoreDisplay = document.getElementById("hScoreDisplay");
const fScoreDisplay = document.getElementById("fScoreDisplay");
const viewToggle = document.getElementById("viewToggle");

// ─── Event Listeners ──────────────────────────────────────────────────────────
viewToggle.addEventListener("change", (e) => {
    isRatView = e.target.checked;
    drawGraph();
});

btnReset.addEventListener("click", reset);
btnRunAstar.addEventListener("click", runAstar);

btnUp.addEventListener("click", () => move("up"));
btnLeft.addEventListener("click", () => move("left"));
btnRight.addEventListener("click", () => move("right"));
btnDown.addEventListener("click", () => move("down"));

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") moveWithKey("up");
    else if (e.key === "ArrowLeft") moveWithKey("left");
    else if (e.key === "ArrowRight") moveWithKey("right");
    else if (e.key === "ArrowDown") moveWithKey("down");
});

// ─── Image Loading ────────────────────────────────────────────────────────────
let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 6) drawGraph();
}
if (imgMazeOutline.complete) checkImagesLoaded(); else imgMazeOutline.onload = checkImagesLoaded;
if (imgJerryRight.complete) checkImagesLoaded(); else imgJerryRight.onload = checkImagesLoaded;
if (imgJerryLeft.complete) checkImagesLoaded(); else imgJerryLeft.onload = checkImagesLoaded;
if (imgTom.complete) checkImagesLoaded(); else imgTom.onload = checkImagesLoaded;
if (imgPath.complete) checkImagesLoaded(); else imgPath.onload = checkImagesLoaded;
if (imgEnd.complete) checkImagesLoaded(); else imgEnd.onload = checkImagesLoaded;

// ─── Reset ────────────────────────────────────────────────────────────────────
function reset() {
    currentNode = START_NODE;
    path = [START_NODE];
    gScore = 0;
    astarPath = [];
    astarCost = null;
    astarVisited = [];
    jerryFacing = "right";
    statusLabel.innerText = "Ready.";
    statusLabel.style.color = "";
    drawGraph();
}

// ─── Movement ─────────────────────────────────────────────────────────────────
function findNeighborInDirection(direction) {
    const [cx, cy] = nodes[currentNode].pos;
    let candidates = [];

    for (const { neighbor, weight } of graph[currentNode]) {
        const [nx, ny] = nodes[neighbor].pos;
        const dx = nx - cx;
        const dy = ny - cy;

        // Enforce dominant axis: the displacement must be primarily in the
        // requested direction so pressing UP doesn't pick a mostly-left node.
        let match = false;
        if (direction === "up" && dy < 0 && Math.abs(dy) >= Math.abs(dx)) match = true;
        else if (direction === "down" && dy > 0 && Math.abs(dy) >= Math.abs(dx)) match = true;
        else if (direction === "left" && dx < 0 && Math.abs(dx) >= Math.abs(dy)) match = true;
        else if (direction === "right" && dx > 0 && Math.abs(dx) >= Math.abs(dy)) match = true;

        if (match) {
            candidates.push({ score: Math.abs(dx) + Math.abs(dy), neighbor, weight });
        }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.score - b.score);
    return { neighbor: candidates[0].neighbor, weight: candidates[0].weight };
}

function moveWithKey(direction) {
    if (findNeighborInDirection(direction) !== null) move(direction);
}

function move(direction) {
    const nextChoice = findNeighborInDirection(direction);

    if (!nextChoice) {
        statusLabel.innerText = `No connected node ${direction}.`;
        statusLabel.style.color = "#fca5a5";
        updateMovementButtons();
        return;
    }

    const { neighbor, weight } = nextChoice;
    updateJerryFacing(currentNode, neighbor);
    currentNode = neighbor;
    path.push(currentNode);
    gScore += weight;

    if (currentNode === GOAL_NODE) {
        statusLabel.innerText = "Goal reached! 🧀";
        statusLabel.style.color = "#a7f3d0";
    } else {
        statusLabel.innerText = `Moved ${direction} · cost +${weight}`;
        statusLabel.style.color = "#a7f3d0";
    }

    drawGraph();
}

function updateJerryFacing(fromNode, toNode) {
    const [fx, fy] = nodes[fromNode].pos;
    const [tx, ty] = nodes[toNode].pos;
    const dx = tx - fx;

    if (dx > 0) jerryFacing = "right";
    else if (dx < 0) jerryFacing = "left";
}

function updateMovementButtons() {
    btnUp.disabled = findNeighborInDirection("up") === null;
    btnLeft.disabled = findNeighborInDirection("left") === null;
    btnRight.disabled = findNeighborInDirection("right") === null;
    btnDown.disabled = findNeighborInDirection("down") === null;
}

// ─── A* Algorithm ─────────────────────────────────────────────────────────────
class PriorityQueue {
    constructor() { this.elements = []; }
    enqueue(el, pri) {
        this.elements.push({ element: el, priority: pri });
        this.elements.sort((a, b) => a.priority - b.priority);
    }
    dequeue() { return this.elements.shift().element; }
    isEmpty() { return this.elements.length === 0; }
}

function aStar(start, goal) {
    const openSet = new PriorityQueue();
    openSet.enqueue(start, nodes[start].h);

    const cameFrom = {};
    const gScores = {};
    for (const n in nodes) gScores[n] = Infinity;
    gScores[start] = 0;

    const visitedOrder = [];
    const closedSet = new Set();

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        if (closedSet.has(current)) continue;
        closedSet.add(current);
        visitedOrder.push(current);

        if (current === goal) {
            return {
                path: reconstructPath(cameFrom, current),
                cost: gScores[goal],
                visited: visitedOrder,
            };
        }

        for (const { neighbor, weight } of graph[current]) {
            const tentativeG = gScores[current] + weight;
            if (tentativeG < gScores[neighbor]) {
                cameFrom[neighbor] = current;
                gScores[neighbor] = tentativeG;
                openSet.enqueue(neighbor, tentativeG + nodes[neighbor].h);
            }
        }
    }

    return { path: [], cost: null, visited: visitedOrder };
}

function reconstructPath(cameFrom, current) {
    const p = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        p.push(current);
    }
    return p.reverse();
}

function runAstar() {
    const result = aStar(START_NODE, GOAL_NODE);
    astarPath = result.path;
    astarCost = result.cost;
    astarVisited = result.visited;

    if (astarPath.length > 0) {
        statusLabel.innerText = `A* path found · cost: ${astarCost}`;
        statusLabel.style.color = "#a7f3d0";
    } else {
        statusLabel.innerText = "A* found no path.";
        statusLabel.style.color = "#fca5a5";
    }

    drawGraph();
}

// ─── Edge Membership Helpers ──────────────────────────────────────────────────
function edgeIsInPath(pathArr, a, b) {
    for (let i = 0; i < pathArr.length - 1; i++) {
        const pa = pathArr[i], pb = pathArr[i + 1];
        if ((a === pa && b === pb) || (a === pb && b === pa)) return true;
    }
    return false;
}

// ─── Drawing Helpers ──────────────────────────────────────────────────────────
function drawPolyline(points, color, width, glow = false) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = glow ? 15 : 0;
    ctx.shadowColor = color;

    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
}

function edgePoints(a, b, via) {
    const [x1, y1] = nodes[a].pos;
    const [x2, y2] = nodes[b].pos;
    let pts = [[x1, y1]];
    if (via && via.length > 0) {
        for (const p of via) {
            if (p && p.length === 2) {
                pts.push(p);
            }
        }
    }
    pts.push([x2, y2]);
    return pts;
}

// ─── Main Draw ────────────────────────────────────────────────────────────────
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(0, CANVAS_MARGIN_TOP);

    if (isRatView) {
        // Draw maze background
        ctx.drawImage(imgMazeOutline, 50, -25, 900, 850);

        // Overlay A* path and manual path as corridor highlights
        for (const [a, b, weight, via] of edges) {
            const pts = edgePoints(a, b, via);
            if (edgeIsInPath(astarPath, a, b)) {
                drawPolyline(pts, "rgba(255,235,59,0.75)", 15, true);
            } else if (edgeIsInPath(path, a, b)) {
                drawPolyline(pts, "rgba(255,152,0,0.75)", 10, true);
            }
        }

        const [gx, gy] = nodes[GOAL_NODE].pos;
        const [rx, ry] = nodes[currentNode].pos;

        if (currentNode === GOAL_NODE) {
            // Show end state image when Jerry meets Tom at the goal node.
            ctx.drawImage(imgEnd, gx - 50, gy - 50, 100, 100);
        } else {
            // Jerry sprite at current node
            const jerrySprite = jerryFacing === "left" ? imgJerryLeft : imgJerryRight;
            ctx.drawImage(jerrySprite, rx - 40, ry - 30, 80, 60);

            // Tom sprite at goal node
            ctx.drawImage(imgTom, gx - 45, gy - 45, 90, 90);
        }

    } else {
        // ── NODES VIEW ──

        // Draw maze background (faded)
        ctx.globalAlpha = 0.18;
        ctx.drawImage(imgMazeOutline, 50, -25, 900, 850);
        ctx.globalAlpha = 1.0;

        // Draw edges
        for (const [a, b, weight, via] of edges) {
            const pts = edgePoints(a, b, via);
            const inAstar = edgeIsInPath(astarPath, a, b);
            const inManual = edgeIsInPath(path, a, b);

            let color = "#475569", w = 2, glow = false;
            if (inManual) { color = "#f59e0b"; w = 4; }
            if (inAstar) { color = "#06b6d4"; w = 5; glow = true; }

            drawPolyline(pts, color, w, glow);

            // Weight label at midpoint of the full polyline
            const mid = Math.floor((pts.length - 1) / 2);
            const mx = (pts[mid][0] + pts[mid + 1][0]) / 2;
            const my = (pts[mid][1] + pts[mid + 1][1]) / 2;
            ctx.fillStyle = inAstar ? "#06b6d4" : (inManual ? "#f59e0b" : "#10b981");
            ctx.font = "bold 13px 'Outfit'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(weight.toString(), mx, my - 9);
        }

        // Draw nodes
        for (const node_id in nodes) {
            const { pos: [x, y], h } = nodes[node_id];

            let fill = "#ffffff";
            let outline = "#8b5cf6";
            let lw = 3;

            if (astarVisited.includes(node_id)) fill = "#ede9fe";
            if (astarPath.includes(node_id)) fill = "#cffafe";
            if (node_id === GOAL_NODE) fill = "#d1fae5";
            if (node_id === currentNode) { fill = "#fef08a"; outline = "#ef4444"; lw = 5; }
            if (node_id === START_NODE && node_id !== currentNode) outline = "#ef4444";

            ctx.beginPath();
            ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.lineWidth = lw;
            ctx.strokeStyle = outline;
            ctx.stroke();

            ctx.fillStyle = "#6d28d9";
            ctx.font = "bold 12px 'Outfit'";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(h.toString(), x, y);
        }

    }

    updateInfo();
    updateMovementButtons();

    ctx.restore();
}

// ─── Info Panel ───────────────────────────────────────────────────────────────
function updateInfo() {
    const h = nodes[currentNode].h;
    currentNodeDisplay.innerText = currentNode;
    gScoreDisplay.innerText = gScore;
    hScoreDisplay.innerText = h;
    fScoreDisplay.innerText = gScore + h;
}

// ─── Initial Draw ─────────────────────────────────────────────────────────────
drawGraph();
