// const { Engine } = require("matter-js");

const World = Matter.World;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Svg = Matter.Svg;
const Common = Matter.Common;
const Vertices = Matter.Vertices;
const Bodies = Matter.Bodies;
const Body = Matter.Body;



// https://mathigon.org/polypad#tangram
async function get_monotile_body(x, y, options) {

    const rawSvg = await fetch(options?.url ?? './img/einstein.svg')
        .then(res => res.text());

    const parsedSvg = (new DOMParser()).parseFromString(rawSvg, 'image/svg+xml');
    const svgPath = Array.prototype.slice.call(parsedSvg.querySelectorAll('path'));
    const vertexSet = svgPath.map(path => Svg.pathToVertices(path, 50));

    const scaledVertexSet = vertexSet.map(v => Vertices.scale(v, 0.5, 0.5));

    console.log(options.color)
    const monotile = Bodies.fromVertices(x, y, scaledVertexSet, {
        render: {
            fillStyle: options.color,
            strokeStyle: options.color,
            lineWidth: 1
        }
    });

    monotile.friction = 1;
    monotile.restitution = 0;
    monotile.inertia = Infinity; // https://www.phind.com/search?cache=mxn73w77rx4qwljazuaaew3u
    monotile.inverseInertia = 0;

    if (options.isStatic) {

        Body.setStatic(monotile, options.isStatic);
    }



    if (options.flip) {
        Body.scale(monotile, -1, 1)
    }
    // console.log(monotile);
    return monotile
}


const GAME_WIDTH = Math.min(700, window.innerWidth);
const GAME_HEIGHT = window.innerHeight - 80;


const engine = Matter.Engine.create({
    gravity: { x: 0, y: 0.1 }
});
const render = Matter.Render.create({
    element: document.querySelector('#game-screen'),
    engine: engine,
    options: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        background: '#f8f9fa',
        wireframes: false
    }
})
Matter.Render.run(render);


const world = engine.world;



// https://stackoverflow.com/a/1484514
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


const wall = await get_monotile_body(GAME_WIDTH-300, GAME_HEIGHT-30, {
    url: './img/wall.svg',
    isStatic: true,
    color: getRandomColor()
})

World.add(world, wall);

let currentlyFallingTile = null;

document.querySelector('body').addEventListener('keydown', (e) => {
    e.preventDefault();
    console.log(e.key)
    if (e.key === 'ArrowLeft') {
        Body.setPosition(currentlyFallingTile, { x: currentlyFallingTile.position.x - 5, y: currentlyFallingTile.position.y })
    } else if (e.key == 'ArrowRight') {
        console.log("Blah")
        Body.setPosition(currentlyFallingTile, { x: currentlyFallingTile.position.x + 5, y: currentlyFallingTile.position.y })
    } else if (e.key == 'ArrowUp') {
        console.log(currentlyFallingTile)
        Body.setAngle(currentlyFallingTile, currentlyFallingTile.angle + Math.PI/6)
    } else if (e.key == 'ArrowDown') {
        Body.setAngle(currentlyFallingTile, currentlyFallingTile.angle - Math.PI/6)
    } else if (e.key === 'f') {
        Body.scale(currentlyFallingTile, -1, 1)
    }
})


function generateAndRandomAddTile() {

    get_monotile_body(GAME_WIDTH/2, 0, {
        color: getRandomColor(),
        flip: Math.random() < 0.8 ? false : true
    }).then(tile => {
        currentlyFallingTile = tile;
        console.log(tile);
        return tile
    }).then(tile => World.add(world, tile));

    setTimeout(() => {
        generateAndRandomAddTile()
    }, 12000)
}

generateAndRandomAddTile();

setInterval(() => {
    Matter.Engine.update(engine, 1000 / 60);
}, 1000 / 60)
