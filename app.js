// const { Engine } = require("matter-js");

const World = Matter.World;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Svg = Matter.Svg;
const Common = Matter.Common;
const Vertices = Matter.Vertices;
const Bodies = Matter.Bodies;
const Body = Matter.Body;




async function get_monotile_body(x, y, options) {

    const rawSvg = await fetch(options?.url ?? './img/einstein.svg')
        .then(res => res.text());

    const parsedSvg = (new DOMParser()).parseFromString(rawSvg, 'image/svg+xml');
    const svgPath = Array.prototype.slice.call(parsedSvg.querySelectorAll('path'));
    const vertexSet = svgPath.map(path => Svg.pathToVertices(path));

    const scaledVertexSet = vertexSet.map(v => Vertices.scale(v, 0.5, 0.5));

    // console.log(options.color)
    const monotile = Bodies.fromVertices(x, y, scaledVertexSet, {
        render: {
            fillStyle: options.color,
            strokeStyle: options.color,
            lineWidth: 1
        }
    });

    monotile.friction = 1;
    monotile.restitution = 0.5;
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


const GAME_WIDTH = 700
const GAME_HEIGHT = 1000


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


// const tiles = []
// for (let i = 0; i < 15; i++) {
//     const tile = await get_monotile_body((94 * i), GAME_HEIGHT, { isStatic: true, color: getRandomColor() });
//     Body.setAngle(tile, Math.PI / 2);
//     tiles.push(tile)
// }

// // console.log(tiles);

// const wallComp = Composite.create({
//     bodies: tiles
// });

// const chainedWallComp = Matter.Composites.chain(wallComp, 0, 0, 0, 0, { stiffness: 1 });
// chainedWallComp.constraints.map(c => c.render.visible = false);
const wall = await get_monotile_body(0, GAME_HEIGHT, {
    url: './img/wall.svg',
    isStatic: true,
    color: getRandomColor()
})

World.add(world, wall);


// console.log(monotile1);


const monotile1 = await get_monotile_body(250, 80, {
    color: 'green',
    flip: true,
    // isStatic: true
})

// const detector = Matter.Detector.create({
//     bodies: [...tiles, monotile1]
// })

World.add(world, monotile1);

let currentlyFallingTile = null;

document.querySelector('body').addEventListener('keydown', (e) => {
    e.preventDefault();
    console.log(e.key)
    if (e.key === 'ArrowLeft') {

        Body.setPosition(currentlyFallingTile, { x: currentlyFallingTile.position.x - 10, y: currentlyFallingTile.position.y })
        // console.log(currentlyFallingTile);
    } else if (e.key == 'ArrowRight') {
        console.log("Blah")
        Body.setPosition(currentlyFallingTile, { x: currentlyFallingTile.position.x + 10, y: currentlyFallingTile.position.y })
    } else if (e.key == 'ArrowUp') {
        console.log(currentlyFallingTile)
        Body.setAngle(currentlyFallingTile, currentlyFallingTile.angle + 0.1)
    } else if (e.key == 'ArrowDown') {
        Body.setAngle(currentlyFallingTile, currentlyFallingTile.angle - 0.1)
    } else if (e.key === 'f') {
        Body.scale(currentlyFallingTile, -1, 1)
    }
})


// const mouse = Matter.Mouse.create(document.querySelector('#game-screen'));
// mouse.pixelRatio = window.devicePixelRatio;
// const mouseConstraint = Matter.MouseConstraint.create(engine, {
//     mouse: mouse
// })

// console.log(mouse);
// World.add(world, mouseConstraint);

function generateAndRandomAddTile(e) {


    get_monotile_body(e.clientX, e.clientY, {
        url: Common.choose(['./img/meta_tile_1.svg', './img/meta_tile_2.svg', './img/meta_tile_3.svg', './img/einstein.svg']),
        color: getRandomColor(),
        flip: Math.random() < 0.8 ? false : true
    }).then(tile => {
        Body.setAngle(tile, Math.random() * Math.PI * 2)
        // const previousBodies = detector.bodies;
        // Matter.Detector.clear(detector)
        // Matter.Detector.setBodies(detector, [...previousBodies, tile])
        currentlyFallingTile = tile;
        return tile
    }).then(tile => World.add(world, tile));

    setTimeout(() => {
        generateAndRandomAddTile(e)
    }, 12000)

}

document.querySelector('canvas').addEventListener('click', (e) => {
    generateAndRandomAddTile(e);
})


setInterval(() => {
    Matter.Engine.update(engine, 1000 / 60);

    // Matter.Collision.create(monotile1, tiles[7]);
    // console.log(Matter.Detector.collisions(detector));
    // console.log(Matter.Collision.collides(monotile1, tiles[4]));
    // console.log(chainedWallComp);
    // console.log(Matter.Collision.collides(monotile1, chainedWallComp));

    // const collisionRecords = []
    // console.log(tiles);
    // for (let i = 0; i < 15; i++) {
    //     collisionRecords.push(Matter.Collision.collides(monotile1, tiles[i]))
    // }
    // console.log(collisionRecords);
    // // const collided = collisionRecords.filter(c => c.collided);
    // // console.log(collided);

    // console.log()
}, 1000 / 60)


// const monotile2 = await get_monotile_body(256, 80, {
//     color: 'blue'
// })

// Body.setAngle(monotile1, Math.PI / 2);
// Body.setAngle(monotile2, Math.PI / 2);

// const comp = Composite.create({
//     bodies: [monotile1, monotile2]
// });
// const chainedComp = Matter.Composites.chain(comp, 0, 0, 0, 0, { stiffness: 1 });
// chainedComp.constraints.forEach(c => c.render.visible = false);

// World.add(world, chainedComp);;

// function wall(x, y, width, height) {
//     return Matter.Bodies.rectangle(x, y, width, height, {
//         isStatic: true,
//         render: {
//             fillStyle: '#868e96'
//         }
//     })

// }

// Matter.World.add(engine.world, wall(GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 10))
