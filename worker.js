const EARLY_STOP = false;
const MAX_STEPS = 30;
const MAX_ARROWS = 3;
let ARROW_TYPES = ["↑", "→", "↓", "←"];

let foundSolution = false;
let bestSolution;
let bestSteps = Infinity;
let endX = 0;
let endY = 0;


// worker.js
self.addEventListener('message', function(e) {
    foundSolution = false;
    bestSolution = null;
    bestSteps = Infinity;

    const data = e.data
    endX = data.endX;
    endY = data.endY;
    const result = bruteForceSolve(data.maze);

    // Send the result back to the main thread
    self.postMessage(result);
});

function bruteForceSolve(grid, robot, arrows) {
    // Simulated calculation
    // Replace this with your actual bruteForceSolve function
    return "Solution Found"; // Dummy result
}

function checkPathExists(maze) {
    let x = 0;
    let y = 0;
    let direction = '→';
    let steps = 0;
    
    while (true) {
        if (steps > MAX_STEPS) {
            return false;
        }

        if (x === endX && y === endY && steps < bestSteps) {
            bestSteps = steps;
            return true;
        }

        if (maze[y][x] === '↓' || maze[y][x] === '←' || maze[y][x] === '↑' || maze[y][x] === '→') {
            direction = maze[y][x];
        }

        if (direction === '→') {
            x++;
            if (x >= maze[0].length || maze[y][x] === '#') {
                x--;
                direction = '↓';
            }
        }

        else if (direction === '←') {
            x--;
            if (x < 0 || maze[y][x] === '#') {
                x++;
                direction = '↑';
            }
        }

        else if (direction === '↑') {
            y--;
            if (y < 0 || maze[y][x] === '#') {
                y++;
                direction = '→';
            }
        }

        else if (direction === '↓') {
            y++;
            if (y >= maze.length || maze[y][x] === '#') {
                y--;
                direction = '←';
            }
        }
        
        steps++;
    }
}

function arrowsRecursion(maze, k) {
    if (foundSolution && EARLY_STOP) return;

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (i == 0 && j == 0) continue;
            if (maze[i][j] === ".") {
                for (let arrow of ARROW_TYPES) {
                    if (foundSolution  && EARLY_STOP) return;
                    maze[i][j] = arrow;
                    if (k > 0) {
                        arrowsRecursion(maze, k - 1);
                    } else if (checkPathExists(maze)) {
                        //console.log("Nájdené riešenie!");
                        foundSolution = true;
                        bestSolution = maze.map(row => [...row]);
                    }
                    if (foundSolution && EARLY_STOP) return;
                    maze[i][j] = ".";
                }
            }
        }
    }
}

function bruteForceSolve(maze) {

    if (checkPathExists(maze)) {
        //console.log("Nájdené riešenie!");
        foundSolution = true;
        bestSolution = maze.map(row => [...row]);
    }

    for (let a = 0; a < MAX_ARROWS; a++) {
        if (foundSolution) break;
        arrowsRecursion(maze.map(row => [...row]), a);
    }

    if (!foundSolution) return "Neriešiteľné bludisko!";
    
    return bestSolution;
}