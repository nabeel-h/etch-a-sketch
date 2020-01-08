
createSketchSquares(64);

const squaresPerSideBtn = document.querySelector("#squaresPerSideBtn");
squaresPerSideBtn.addEventListener('click', createSketchSquaresFromUserInput);

const resetCanvasBtn = document.querySelector("#resetCanvasBtn");
resetCanvasBtn.addEventListener('click', createSketchSquaresFromUserInput);

const colorPicker = document.querySelector("#colorOptionsSelect");
colorPicker.addEventListener("change", updateSquareColors);


function createSketchSquaresFromUserInput() {
    const squaresPerSideUserInput = document.querySelector("#squaresPerSideInput");
    let userSquareValue = Number(squaresPerSideUserInput.value);
    if (userSquareValue > 0) {
        createSketchSquares(userSquareValue);
    } else {
        console.log("User input field empty, defaulting to 64.");
        createSketchSquares(64);
        squaresPerSideUserInput.value = "64";
    };
};



function createSketchSquares(squaresPerSide) {
    const squaresPerSideInput = document.querySelector("#squaresPerSideInput");
    squaresPerSideInput.value = squaresPerSide;
    if (squaresPerSide > 300) {
        squaresPerSide = 300;
        squaresPerSideInput.value = squaresPerSide;
    };
    clearSketchSquares();    
    const sketchContainer = document.querySelector("#sketch");

    // offset height if needed for border adjustment
    const borderWidthOffset = getComputedStyle(sketchContainer).getPropertyValue('border-left-width').split('px')[0] * 2;
    const sketchHeight = sketchContainer.offsetHeight - borderWidthOffset;
    const sketchWidth = sketchContainer.offsetWidth - borderWidthOffset; 

    console.log(sketchHeight, sketchWidth);

    let squareHeight = ((sketchHeight / squaresPerSide * 100) / 100);
    let squareWidth = ((sketchWidth / squaresPerSide * 100) / 100);
    // adjust squareHeight by width/height ratio so we have
    // perfect squares instead of rectangles
    // we know width of 960 will never change but height can vary
    let widthHeightRatio = (squareWidth/squareHeight);                   
    squareHeight = ((squareHeight * widthHeightRatio * 100) / 100);

    let totalColumns = squaresPerSide;
    //let totalRows = Math.round(sketchHeight / squareHeight);
    let totalRows = squaresPerSide;

    console.log(`Total Rows: ${totalRows} Total Columns: ${totalColumns}`);
    // adjust height of sketch container so all squares fit perfectly.
    const newSketchHeight = ((totalRows * squareHeight) * 100 / 100);
    console.log(`Old height: ${sketchHeight} New Height: ${newSketchHeight}`);
    sketchContainer.style.height = newSketchHeight+"px";

    console.log(`Creating ${squaresPerSide} per side, w/ each square @ HxW: ${squareHeight} x ${squareWidth}`)
    
    for (let i = 0; i < totalColumns; i++) {
        sketchColumn = document.createElement("div");
        sketchColumn.classList.add("sketchColumn");
        for (let j = 0; j < totalRows; j++) {
            sketchSquare = document.createElement("div");
            sketchSquare.style.height = squareHeight+"px";
            sketchSquare.style.width = squareWidth+"px";
            sketchSquare.classList.add("sketchSquare");

            sketchColumn.append(sketchSquare);
        };
        sketchContainer.append(sketchColumn);
    };

    updateSquareColors();
};

function updateSquareColors() {
    // for all div in class sketchSquare. Update their color function.
    const colorPicker = document.querySelector("#colorOptionsSelect");
    let sketchSquares = document.querySelectorAll(".sketchSquare");
    
    let colorFunction = "";
    console.log(colorPicker.value);
    switch(colorPicker.value) {
        case "red":
        case "":
            colorFunction = changeColorRed;
            break;
        case "random":
            colorFunction = changeColorRandom;
            break;
        case "sketch":
            colorFunction = changeColorIntensity;        
            break;
    };

    sketchSquares.forEach(sketchSquare => {
        sketchSquare.onmouseover = colorFunction;
    });
};

function clearSketchSquares() {
    const sketchContainer = document.querySelector("#sketch");
    while (sketchContainer.firstChild) {
        sketchContainer.removeChild(sketchContainer.firstChild);
    };
};

function changeColorRed(event) {
    if (event.shiftKey) {
        return;
    };
    if (event.target.style.backgroundColor) {
        return;
    };
    event.target.style.backgroundColor = "red";
};

function changeColorRandom(event) {
    if (event.shiftKey) {
        return;
    };
    if (event.target.style.backgroundColor) {
        return;
    };
    event.target.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
};

function changeColorIntensity(event) {
    //console.log(event);
    if (event.shiftKey) {
        return;
    };
    //console.log(event.target.className);
    //console.log(event.relatedTarget.className);
    if (event.target.className === "sketchSquare") {
        event.target.style.backgroundColor = updateOpacity(event.target.style.backgroundColor);
    };
    // if (event.relatedTarget.className === "sketchSquare") {
    //     event.relatedTarget.style.backgroundColor = updateOpacity(event.relatedTarget.style.backgroundColor);
    // };
};


function updateOpacity(rgbaString) {
    if (rgbaString=="") {
        return "rgba(0, 0, 0, 0.1)";
    };
    if (rgbaString[3] === "(") {
        return rgbaString;
    };
    console.log(rgbaString);
    let opacity = Number(rgbaString.split("rgba(0, 0, 0,")[1].split(")")[0]);
    
    console.log(`old opacity: ${opacity}`);
    opacity=opacity + 0.1;
    opacity = Math.round(opacity*10)/10;
    console.log(`new opacity: ${opacity}`);
    return "rgba(0, 0, 0, "+opacity+")";
};
