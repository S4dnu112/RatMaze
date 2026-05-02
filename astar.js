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

const ASTAR_STEP_DELAY = 450;

function clearAstarTimer() {
    // Stop any pending animation timer.
    if (astarAnimationTimer !== null) {
        clearTimeout(astarAnimationTimer);
        astarAnimationTimer = null;
    }
}

function syncAstarButton() {
    // Keep the run button label/state in sync with the animation state.
    btnRunAstar.disabled = false;

    if (astarStatus === "running") {
        btnRunAstar.textContent = "Pause A* Search";
    } else if (astarStatus === "paused") {
        btnRunAstar.textContent = "Resume A* Search";
    } else {
        btnRunAstar.textContent = "Run A* Search";
    }
}

function stopAstarAnimation() {
    // Reset animation state and clear session.
    clearAstarTimer();
    astarSession = null;
    astarStatus = "idle";
    syncAstarButton();
}

function pauseAstarAnimation() {
    // Pause animation without losing session state.
    if (astarStatus !== "running") return;

    clearAstarTimer();
    astarStatus = "paused";
    syncAstarButton();
    drawGraph();
}

function resumeAstarAnimation() {
    // Resume stepping from the current session state.
    if (astarStatus !== "paused" || !astarSession) return;

    astarStatus = "running";
    syncAstarButton();
    drawGraph();
    stepThroughSearch();
}

function createAstarSession(start, goal) {
    // Initialize a new A* search session.
    const openSet = new PriorityQueue();
    openSet.enqueue(start, nodes[start].h);

    const gScores = {}; // g(n): best-known cost from start to node.
    for (const nodeId in nodes) gScores[nodeId] = Infinity;
    gScores[start] = 0;

    return {
        start,
        goal,
        openSet,
        cameFrom: {},
        gScores,
        visitedOrder: [],
        closedSet: new Set(),
        stepCount: 0,
    };
}

function stepAstarSession(session) {
    // Perform a single expansion step of A*.
    while (!session.openSet.isEmpty()) {
        const current = session.openSet.dequeue();

        if (session.closedSet.has(current)) continue;

        session.closedSet.add(current); // Closed set: nodes already expanded.
        session.visitedOrder.push(current);
        session.stepCount += 1;

        const comparisons = []; // Used to render per-step metrics.
        let bestNeighbor = null;
        let bestScore = Infinity;

        // GOAL
        if (current === session.goal) {
            const pathResult = reconstructPath(session.cameFrom, current);
            return {
                status: "goal",
                current,
                path: pathResult,
                cost: session.gScores[current],
                visited: session.visitedOrder.slice(),
                comparisons,
                bestNeighbor,
                step: session.stepCount,
            };
        }

        const pathToCurrent = reconstructPath(session.cameFrom, current);
        const forwardSet = new Set(pathToCurrent); // Avoid backtracking in comparison list.

        // Evaluate each neighbor: f(n) = g(n) + h(n).
        for (const { neighbor, weight } of graph[current]) {
            const tentativeG = session.gScores[current] + weight;
            const hScore = nodes[neighbor].h;
            const fScore = tentativeG + hScore;
            if (tentativeG < session.gScores[neighbor]) {
                if (!forwardSet.has(neighbor)) {
                    // Show full edge-weight expression for forward candidates only.
                    const gText = buildWeightExpression(pathToCurrent, weight);
                    comparisons.push({ neighbor, g: tentativeG, gText, h: hScore, f: fScore, weight });
                    if (fScore < bestScore) {
                        bestScore = fScore;
                        bestNeighbor = neighbor;
                    }
                }
                session.cameFrom[neighbor] = current; // Parent pointer for path rebuild.
                session.gScores[neighbor] = tentativeG;
                session.openSet.enqueue(neighbor, tentativeG + nodes[neighbor].h);
            }
        }

        return {
            status: "expanded",
            current,
            path: reconstructPath(session.cameFrom, current),
            cost: session.gScores[current],
            visited: session.visitedOrder.slice(),
            comparisons,
            bestNeighbor,
            step: session.stepCount,
        };
    }

    return {
        status: "exhausted",
        current: null,
        path: [],
        cost: null,
        visited: session.visitedOrder.slice(),
        comparisons: [],
        bestNeighbor: null,
        step: session.stepCount,
    };
}

function aStar(start, goal) {
    // Full run without animation (used when needed).
    const session = createAstarSession(start, goal);
    let stepResult = stepAstarSession(session);

    while (stepResult.status === "expanded") {
        stepResult = stepAstarSession(session);
    }

    if (stepResult.status === "goal") {
        return {
            path: stepResult.path,
            cost: stepResult.cost,
            visited: stepResult.visited,
            cameFrom: session.cameFrom,
        };
    }

    return {
        path: [],
        cost: null,
        visited: session.visitedOrder.slice(),
        cameFrom: session.cameFrom,
    };
}

function reconstructPath(cameFrom, current) {
    // Follow parents backward to the start node.
    const p = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        p.push(current);
    }
    return p.reverse();
}

function getEdgeWeightFromGraph(from, to) {
    // Look up the weight between two connected nodes.
    const neighbors = graph[from] || [];
    for (const { neighbor, weight } of neighbors) {
        if (neighbor === to) return weight;
    }
    return null;
}

function buildWeightExpression(pathArr, extraWeight) {
    // Expand g(n) into individual edge weights for display.
    const weights = [];
    for (let i = 0; i < pathArr.length - 1; i++) {
        const w = getEdgeWeightFromGraph(pathArr[i], pathArr[i + 1]);
        if (w !== null) weights.push(w);
    }
    if (typeof extraWeight === "number") weights.push(extraWeight);
    if (weights.length === 0) return "0";
    return weights.join(" + ");
}

function finalizeAstarRun(stepResult, reachedGoal) {
    // Apply final path/visited state and reset animation state.
    clearAstarTimer();

    if (reachedGoal) {
        astarPath = stepResult.path;
        astarCost = stepResult.cost;
        path = stepResult.path.slice();
        currentNode = GOAL_NODE;
        gScore = stepResult.cost ?? 0;
        jerryFacing = "right";
    }

    astarVisited = stepResult.visited;
    astarBestEdge = null;
    astarSession = null;
    astarStatus = "idle";
    syncAstarButton();
    drawGraph();
}

function stepThroughSearch() {
    // Drive the animation loop and update UI state.
    if (astarStatus !== "running" || !astarSession) return;

    const stepResult = stepAstarSession(astarSession);
    astarVisited = stepResult.visited;

    if (stepResult.comparisons && stepResult.comparisons.length > 0) {
        // Record the comparison set and best edge for visualization.
        astarComparisonHistory.push({
            step: stepResult.step,
            current: stepResult.current,
            candidates: stepResult.comparisons,
            bestNeighbor: stepResult.bestNeighbor,
        });
        astarBestEdge = stepResult.bestNeighbor
            ? { from: stepResult.current, to: stepResult.bestNeighbor }
            : null;
    } else {
        astarBestEdge = null;
    }

    if (stepResult.current !== null) {
        path = stepResult.path;
        currentNode = stepResult.current;
        gScore = stepResult.cost ?? 0;
        if (path.length > 1) {
            const previousNode = path[path.length - 2];
            jerryFacing = nodes[previousNode].pos[0] <= nodes[currentNode].pos[0] ? "right" : "left";
        } else {
            jerryFacing = "right";
        }
        drawGraph();
    }

    if (stepResult.status === "goal") {
        finalizeAstarRun(stepResult, true);
        return;
    }

    if (stepResult.status === "exhausted") {
        finalizeAstarRun(stepResult, false);
        return;
    }

    astarAnimationTimer = setTimeout(stepThroughSearch, astarAnimationSpeed);
}

function runAstar() {
    // Toggle run/pause/resume for the animated search.
    if (astarStatus === "running") {
        pauseAstarAnimation();
        return;
    }

    if (astarStatus === "paused") {
        resumeAstarAnimation();
        return;
    }

    stopAstarAnimation();

    astarSession = createAstarSession(START_NODE, GOAL_NODE);
    astarPath = [];
    astarCost = null;
    astarVisited = [];
    astarComparisonHistory = [];
    astarBestEdge = null;
    currentNode = START_NODE;
    path = [START_NODE];
    gScore = 0;
    astarStatus = "running";
    syncAstarButton();
    drawGraph();
    stepThroughSearch();
}
