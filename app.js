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


        document.body.append(clonedTile)
        const currentStyle = getComputedStyle(dragged);
        const width = parseInt(currentStyle["width"].split("px")[0]);
        const height = parseInt(currentStyle["height"].split("px")[0]);

        event.dataTransfer.setDragImage(clonedTile, width / 2, height / 2);
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
        elem.style.setProperty('rotate', `${currentRot + 60}deg`)
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
    console.log(width, height)
    dragged.style.setProperty('left', `${evt.x - width / 2}px`)
    dragged.style.setProperty('top', `${evt.y - height / 2}px`)
}