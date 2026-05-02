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

function stopAstarAnimation() {
    if (astarAnimationTimer !== null) {
        clearTimeout(astarAnimationTimer);
        astarAnimationTimer = null;
    }
    isAstarAnimating = false;
    btnRunAstar.disabled = false;
    btnRunAstar.textContent = "Run A* Search";
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

function runAstar() {
    stopAstarAnimation();

    const session = createAstarSession(START_NODE, GOAL_NODE);

    astarPath = [];
    astarCost = null;
    astarVisited = [];
    currentNode = START_NODE;
    path = [START_NODE];
    gScore = 0;
    drawGraph();

    isAstarAnimating = true;
    btnRunAstar.disabled = true;
    btnRunAstar.textContent = "Running...";

    const stepThroughSearch = () => {
        if (!isAstarAnimating) return;

        const stepResult = stepAstarSession(session);
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
            astarPath = stepResult.path;
            astarCost = stepResult.cost;
            astarVisited = stepResult.visited;
            path = stepResult.path.slice();
            currentNode = GOAL_NODE;
            gScore = stepResult.cost ?? 0;
            jerryFacing = "right";
            stopAstarAnimation();
            drawGraph();
            return;
        }

        if (stepResult.status === "exhausted") {
            astarVisited = stepResult.visited;
            stopAstarAnimation();
            drawGraph();
            return;
        }

        astarAnimationTimer = setTimeout(stepThroughSearch, ASTAR_STEP_DELAY);
    };

    stepThroughSearch();
}
