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
        updateMovementButtons();
        return;
    }

    const { neighbor, weight } = nextChoice;
    updateJerryFacing(currentNode, neighbor);
    currentNode = neighbor;
    path.push(currentNode);
    gScore += weight;

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
