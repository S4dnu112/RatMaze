// ─── Info Panel ───────────────────────────────────────────────────────────────
function updateInfo() {
    const h = nodes[currentNode].h;
    const gExpression = buildGScoreExpression();
    const gTotal = gExpression.total;
    currentNodeDisplay.innerText = currentNode;
    gScoreDisplay.innerText = gExpression.text;
    hScoreDisplay.innerText = h;
    fScoreDisplay.innerText = gTotal + h;
}

function buildGScoreExpression() {
    const currentPath = buildCurrentPath();
    if (currentPath.length < 2) {
        return { text: "0", total: 0 };
    }

    const weights = [];
    for (let i = 0; i < currentPath.length - 1; i++) {
        const from = currentPath[i];
        const to = currentPath[i + 1];
        const edgeWeight = getEdgeWeight(from, to);
        if (edgeWeight !== null) weights.push(edgeWeight);
    }

    const total = weights.reduce((sum, value) => sum + value, 0);
    if (weights.length === 0) {
        return { text: "0", total: 0 };
    }

    return { text: `${weights.join(" + ")} = ${total}`, total };
}

function buildCurrentPath() {
    const stack = [];
    const indexByNode = new Map();

    for (const nodeId of path) {
        if (indexByNode.has(nodeId)) {
            const idx = indexByNode.get(nodeId);
            for (let i = stack.length - 1; i > idx; i--) {
                indexByNode.delete(stack[i]);
                stack.pop();
            }
        } else {
            indexByNode.set(nodeId, stack.length);
            stack.push(nodeId);
        }
    }

    return stack;
}

function getEdgeWeight(from, to) {
    const neighbors = graph[from] || [];
    for (const { neighbor, weight } of neighbors) {
        if (neighbor === to) return weight;
    }
    return null;
}
