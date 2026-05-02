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
    drawGraph();
}
