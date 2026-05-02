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
    if (astarAnimationTimer !== null) {
        clearTimeout(astarAnimationTimer);
        astarAnimationTimer = null;
    }
}

function syncAstarButton() {
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
    clearAstarTimer();
    astarSession = null;
    astarStatus = "idle";
    syncAstarButton();
}

function pauseAstarAnimation() {
    if (astarStatus !== "running") return;

    clearAstarTimer();
    astarStatus = "paused";
    syncAstarButton();
    drawGraph();
}

function resumeAstarAnimation() {
    if (astarStatus !== "paused" || !astarSession) return;

    astarStatus = "running";
    syncAstarButton();
    drawGraph();
    stepThroughSearch();
}

function createAstarSession(start, goal) {
    const openSet = new PriorityQueue();
    openSet.enqueue(start, nodes[start].h);

    const gScores = {};
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
    };
}

function stepAstarSession(session) {
    while (!session.openSet.isEmpty()) {
        const current = session.openSet.dequeue();

        if (session.closedSet.has(current)) continue;

        session.closedSet.add(current);
        session.visitedOrder.push(current);

        if (current === session.goal) {
            const pathResult = reconstructPath(session.cameFrom, current);
            return {
                status: "goal",
                current,
                path: pathResult,
                cost: session.gScores[current],
                visited: session.visitedOrder.slice(),
            };
        }

        for (const { neighbor, weight } of graph[current]) {
            const tentativeG = session.gScores[current] + weight;
            if (tentativeG < session.gScores[neighbor]) {
                session.cameFrom[neighbor] = current;
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
        };
    }

    return {
        status: "exhausted",
        current: null,
        path: [],
        cost: null,
        visited: session.visitedOrder.slice(),
    };
}

function aStar(start, goal) {
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
    const p = [current];
    while (cameFrom[current]) {
        current = cameFrom[current];
        p.push(current);
    }
    return p.reverse();
}

function finalizeAstarRun(stepResult, reachedGoal) {
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
    astarSession = null;
    astarStatus = "idle";
    syncAstarButton();
    drawGraph();
}

function stepThroughSearch() {
    if (astarStatus !== "running" || !astarSession) return;

    const stepResult = stepAstarSession(astarSession);
    astarVisited = stepResult.visited;

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
    currentNode = START_NODE;
    path = [START_NODE];
    gScore = 0;
    astarStatus = "running";
    syncAstarButton();
    drawGraph();
    stepThroughSearch();
}
