// import { Composite, Svg, Common, Vertices, Bodies, Body } from "./node_modules/matter-js/build/matter.js";

// const { World } = require("matter-js");

// const { Constraint } = require("matter-js");

// import Matter from "matter-js";

const World = Matter.World;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Svg = Matter.Svg;
const Common = Matter.Common;
const Vertices = Matter.Vertices;
const Bodies = Matter.Bodies;
const Body = Matter.Body;


async function get_monotile_body(x, y, options) {

    const rawSvg = await fetch('./img/einstein_path.svg')
        .then(res => res.text());

    const parsedSvg = (new DOMParser()).parseFromString(rawSvg, 'image/svg+xml');
    const svgPath = Array.prototype.slice.call(parsedSvg.querySelectorAll('path'));
    const vertexSet = svgPath.map(path => Svg.pathToVertices(path));

    const scaledVertexSet = vertexSet.map(v => Vertices.scale(v, 0.3, 0.3));

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
    // monotile.angle = 30;


    if (options.flip) {
        Body.scale(monotile, -1, 1)
    }
    console.log(monotile);
    return monotile
    // Body.scale(), -1, 1)
}


const GAME_WIDTH = 700
const GAME_HEIGHT = 1000


const engine = Matter.Engine.create({
    gravity: { x: 0, y: 1 }
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
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

const world = engine.world;


const monotile1 = await get_monotile_body(200, 80, {
    color: 'green'
})



const monotile2 = await get_monotile_body(250, 80, {
    color: 'blue'
    // flip: true
})




Body.setAngle(monotile1, Math.PI / 2);
// monotile1.friction = 1;
// Body.setStatic(monotile1, true);
Body.setAngle(monotile2, Math.PI / 2);

const comp = Composite.create({
    bodies: [monotile1, monotile2]
});
const chainedComp = Matter.Composites.chain(comp, 0, 0, 0, 0, { stiffness: 1 });
chainedComp.constraints.forEach(c => c.render.visible = false);

const constraint = Constraint.create({
    bodyA: monotile1,
    bodyB: monotile2,
    stiffness: 1,
    // length: 0
})
// Body.setStatic(monotile2, true);

// Body.setParts(monotile1, [monotile2]);

// const comp = Body.create({
//     parts: [monotile1, monotile2]
// })

// monotile2.angle = 30;
World.add(world, chainedComp);;
// World.add(world, [monotile1, monotile2, constraint]);
// World.add(world, monotile2);

// World.add(world, Body.create({
//     parts: [monotile1, monotile2]
// }))

// const compoundBody = Body.create({
//     parts: [monotile1, monotile2]
// });



// Composite.create({
//     bodies: [monotile1, monotile2]
// })

// World.add(world, [monotile1, monotile2, constraint]);

// Composite.add(world, [Body.create({parts: [monotile1, monotile2]}), constraint]);

// const compoundBody = Body.create({
//     parts: [monotile1, monotile2]
// })

// Composite.add(world, compoundBody);

// for (let i = 0; i < 10; i++) {
//     const body = await get_monotile_body(400, 80, {
//         color: i % 5 == 0 ? 'blue' : 'green',
//         flip: i % 5 == 0 ? true : false
//     });
//     console.log(body);
//     World.add(world, body);
//     // Composite.add(world, body)
// }



function wall(x, y, width, height) {
    return Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
            fillStyle: '#868e96'
        }
    })

}

Matter.World.add(engine.world, wall(GAME_WIDTH / 2, GAME_HEIGHT - 10, GAME_WIDTH, 10))
// wall(280, 0, 560, 20),
// wall(280, 800, 560, 20),
// wall(560, 400, 20, 800)
// )