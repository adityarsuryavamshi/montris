// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('drop', (d) => {
//         console.log(d)
//         img.setAttribute("style", `left:${d.clientX}px;top:${d.clientY}px`)
//     })
// })



let dragged = null;


document.querySelectorAll('.monotile').forEach(tile => {
    tile.addEventListener('dragstart', function (event) {


        dragged = event.target;

        //https://stackoverflow.com/a/43663691
        let clonedTile = this.cloneNode(true);
        clonedTile.setAttribute("id", "drag-img")
        clonedTile.style.position = "absolute";
        clonedTile.style.top = "0px";
        clonedTile.style.left = "-10000px";

        // let innerImg = clonedTile.querySelector('img');

        console.log(event);

        // const pix = document.createElement('div');
        // pix.style.width = "10px";
        // pix.style.height = "10px";
        // pix.style.backgroundColor = "green";
        // pix.style.position = "absolute";
        // pix.style.top = `${event.clientY + 10}px`;
        // pix.style.left = `${event.clientX + 10}px`;
        // document.body.append(pix);



        document.body.append(clonedTile)
        const currentStyle = getComputedStyle(dragged);
        const width = parseInt(currentStyle["width"].split("px")[0]);
        const height = parseInt(currentStyle["height"].split("px")[0]);


        // console.log(pix);

        event.dataTransfer.setDragImage(clonedTile, height / 2, width / 2);
    })

    tile.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    tile.addEventListener('drop', (d) => {

        handleDropEvent(dragged, d)
    })
})


document.querySelector('body').addEventListener('keydown', (e) => {
    console.log(e);
    if (e.key === 'ArrowUp') {
        const elem = dragged.querySelector('img')
        const currentStyle = getComputedStyle(elem);
        let currentRot;
        if (currentStyle['rotate'] !== 'none') {
            currentRot = parseInt(currentStyle['rotate'].split("deg")[0]);
        } else {
            currentRot = 0;
        }
        elem.style.setProperty('rotate', `${currentRot + 30}deg`)
    }
})


document.querySelector('#dropzone').addEventListener('dragover', (d) => {
    d.preventDefault();
})

document.querySelector('#dropzone').addEventListener('drop', (d) => {
    console.log("Dropped on Dropzone", dragged)
    handleDropEvent(dragged, d)
})


function handleDropEvent(dragged, evt) {

    evt.preventDefault();

    document.querySelector('#drag-img').remove();


    const currentStyle = getComputedStyle(dragged);
    console.dir(dragged)

    const imgElem = dragged.querySelector('img');
    const imgStyle = getComputedStyle(imgElem);
    dragged.querySelector('img').style.setProperty('rotate', imgStyle['rotate']);
    // dragged
    const width = parseInt(currentStyle["width"].split("px")[0]);
    const height = parseInt(currentStyle["height"].split("px")[0]);
    console.log(width, height, imgStyle['rotate']);


    // Multiples of 90 -> 0 Rotation
    // Multiples of 60 -> 20 30 Rotation
    // Mutliples of 30 -> 35 15 Rotation
    

    const rotationAddition = {
        0: { left: 0, top: 0 },
        30: { left: 35, top: 15 },
        60: { left: 20, top: 30 },
        90: { left: 0, top: 0 },
        120: { left: 20, top: 30 },
        150: { left: 35, top: 15 },
        180: { left: 0, top: 0 },
        210: { left: 35, top: 15 },
        240: { left: 20, top: 30 },
        270: { left: 0, top: 0 },
        300: { left: 20, top: 60 },
        330: { left: 35, top: 15 },
        360: { left: 0, top: 0 }
    }

    let currentRot;
    if (imgStyle['rotate'] !== 'none') {
        currentRot = parseInt(imgStyle['rotate'].split("deg")[0]);
    } else {
        currentRot = 0;
    }

    currentRot = currentRot % 360;
    console.log(currentRot)
    console.log(rotationAddition[currentRot])
    console.log(rotationAddition[currentRot]['left'], rotationAddition[currentRot]['top'])

    dragged.style.setProperty('left', `${evt.clientX + rotationAddition[currentRot]['left'] - width / 2}px`)
    dragged.style.setProperty('top', `${evt.clientY + rotationAddition[currentRot]['top'] - height / 2}px`)
}