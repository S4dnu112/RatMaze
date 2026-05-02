// ─── Image Loading ────────────────────────────────────────────────────────────
let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 7) drawGraph();
}
if (imgMazeOutline.complete) checkImagesLoaded(); else imgMazeOutline.onload = checkImagesLoaded;
if (imgJerryRight.complete) checkImagesLoaded(); else imgJerryRight.onload = checkImagesLoaded;
if (imgJerryLeft.complete) checkImagesLoaded(); else imgJerryLeft.onload = checkImagesLoaded;
if (imgTom.complete) checkImagesLoaded(); else imgTom.onload = checkImagesLoaded;
if (imgHeuristic.complete) checkImagesLoaded(); else imgHeuristic.onload = checkImagesLoaded;
if (imgPath.complete) checkImagesLoaded(); else imgPath.onload = checkImagesLoaded;
if (imgEnd.complete) checkImagesLoaded(); else imgEnd.onload = checkImagesLoaded;

// ─── Reset ────────────────────────────────────────────────────────────────────
function reset() {
    stopAstarAnimation();
    currentNode = START_NODE;
    path = [START_NODE];
    gScore = 0;
    astarPath = [];
    astarCost = null;
    astarVisited = [];
    jerryFacing = "right";
    drawGraph();
}

// ─── Event Listeners ─────────────────────────────────────────────────────────-
viewToggle.addEventListener("change", (e) => {
    isRatView = e.target.checked;
    drawGraph();
});

heuristicToggle.addEventListener("change", drawGraph);

btnRunAstar.addEventListener("click", runAstar);
btnReset.addEventListener("click", reset);

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

// ─── Initial Draw ─────────────────────────────────────────────────────────────
drawGraph();
