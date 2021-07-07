const canvasSize = 400;

const minRadius = 10;
const rejectAttempts = 30;

const sampleSize = minRadius / Math.sqrt(2);

const gridSize = Math.floor(canvasSize / sampleSize);

var grid = [];
var activeList = [];

var canvasCtx;

class Vector2D {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
}

function randomVector2D() {
    var res = new Vector2D(0, 0);

    res.x = Math.cos(Math.random() * Math.PI * 2);
    res.y = Math.sin(Math.random() * Math.PI * 2);

    return res;
}

function distVector2D(v1, v2) {
    return Math.sqrt(Math.abs(Math.pow(v1.x - v2.x, 2) + Math.pow((v1.y - v2.y), 2)));
}

function random(min, max) {
    return Math.random() * (max - min) + min;
  }

function draw() {
    if(activeList.length > 0) {
        var randId = Math.floor(random(0, activeList.length));
        var sample = activeList[randId];

        var found = false;

        for(var i = 0; i < rejectAttempts; ++i) {
            var newSample = randomVector2D();
            var radius = random(minRadius, 2 * minRadius);
            newSample.x = sample.x + newSample.x * radius;
            newSample.y = sample.y + newSample.y * radius;

            var row = Math.floor(newSample.x / sampleSize);
            var col = Math.floor(newSample.y / sampleSize);

            if(grid[row + col * gridSize])
                continue;

            if(newSample.x < 0 || newSample.x > canvasSize
               || newSample.y < 0 || newSample.y > canvasSize) {
                continue;
            }
                
            var pass = true;

            for(var x = -1; x <= 1; ++x) {
                for(var y = -1; y <= 1; ++y) {
                    var idX = row + x;
                    var idY = col + y;

                    var near = grid[idX + idY * gridSize];

                    if(near) {
                        var d = distVector2D(newSample, near);
                        if(d < minRadius)
                           pass = false;
                    }

                }
            }

            if(pass) {
                found = true;

                grid[row + col * gridSize] = newSample;
                activeList.push(newSample)

                break;
            }
        }
        
        if(!found)
            activeList.splice(randId, 1);
    }

    canvasCtx.fillStyle = 'black';
    canvasCtx.fillRect(0, 0, canvasSize, canvasSize);

    for(var i = 0; i < gridSize * gridSize; ++i) {
        if(!grid[i])
            continue;

        canvasCtx.fillStyle = 'white';
        canvasCtx.fillRect(grid[i].x, grid[i].y, sampleSize, sampleSize);
    }

    for(var i = 0; i < activeList.length; ++i) {
        if(activeList[i].x < 0)
            console.log("more");

        canvasCtx.fillStyle = 'orange';
        canvasCtx.fillRect(activeList[i].x, activeList[i].y, sampleSize, sampleSize);
    }
}

function setup() {
    for(var i = 0; i < gridSize * gridSize; ++i)
        grid[i] = undefined;

    const randomX = random(0, canvasSize);
    const randomY = random(0, canvasSize);

    grid[0] = new Vector2D(randomX, randomY);
    activeList.push(grid[0]);


    var canvas = document.getElementById('mainCanvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    canvasCtx = canvas.getContext('2d');

    window.setInterval(draw, 16);
}