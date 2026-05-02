// ─── Edge Membership Helpers ─────────────────────────────────────────────────-
function edgeIsInPath(pathArr, a, b) {
    for (let i = 0; i < pathArr.length - 1; i++) {
        const pa = pathArr[i], pb = pathArr[i + 1];
        if ((a === pa && b === pb) || (a === pb && b === pa)) return true;
    }
    return false;
}

function edgeIsBestComparison(a, b) {
    if (!astarBestEdge) return false;
    return (astarBestEdge.from === a && astarBestEdge.to === b)
        || (astarBestEdge.from === b && astarBestEdge.to === a);
}

// ─── Drawing Helpers ─────────────────────────────────────────────────────────-
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

// ─── Main Draw ───────────────────────────────────────────────────────────────-
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(0, CANVAS_MARGIN_TOP);

    if (isRatView) {
        // Draw maze background
        ctx.drawImage(imgMazeOutline, 50, -25, 900, 850);

        // Heuristic overlay on top of the maze background
        if (heuristicToggle.checked) {
            const scale = 0.85;
            const overlayW = 900 * scale;
            const overlayH = 850 * scale;
            const overlayX = 70 + (900 - overlayW) / 2;
            const overlayY = -25 + (850 - overlayH) / 2;
            ctx.drawImage(imgHeuristic, overlayX, overlayY, overlayW, overlayH);
        }

        // Overlay A* path and manual path as corridor highlights
        for (const [a, b, weight, via] of edges) {
            const pts = edgePoints(a, b, via);
            if (edgeIsBestComparison(a, b)) {
                drawPolyline(pts, "rgba(34,197,94,0.85)", 16, true);
            } else if (edgeIsInPath(astarPath, a, b)) {
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
            const inBest = edgeIsBestComparison(a, b);

            let color = "#475569", w = 2, glow = false;
            if (inManual) { color = "#f59e0b"; w = 4; }
            if (inAstar) { color = "#06b6d4"; w = 5; glow = true; }
            if (inBest) { color = "#22c55e"; w = 6; glow = true; }

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
