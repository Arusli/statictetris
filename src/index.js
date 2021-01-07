//Useful methods
//document.createElement
//document.getElementById('parent').appendChild(childelement)


//Grid Style: 
// - Reassigns divs in the grid to create the illusion of one falling tetrimino.
// - create a function on an interval that fills a certain starting set of blocks, 
// - reassigning their properties (color. position, status). and moves these every interval.


import Grid from '/src/grid.js';
import Tetrimino from '/src/tetrimino.js';
const grid = new Grid;


//Grid Vars
// const board = document.getElementById('board');
// let ArrayOfVisibleRows = [];
// let grid.divArray = [];
// let rowcount = 1; //initial row value
// let columncount = 1; //initial column value
// let maxRows = 19; //safe to adjust
// let maxColumns = 16;
// const tile = 30; //determines grid unit size
// const rightedge = 13;
// const leftedge = 4;
// const floor = 2;
// let bottom = 0;
// let left = 0;

//GLOBAL VARS
const score = document.getElementById('score');
const newGameButton = document.getElementById('new-game');
const prompt = document.getElementById('restart');
const bonusScreen = document.getElementById('bonus');

let points = 0;
let speedTracker = 0;
let speed = 500;
let timer;




//EVENT LISTENERS
document.addEventListener('keydown', leftEventHandler);
document.addEventListener('keydown', rightEventHandler);
document.addEventListener('keydown', downEventHandler);
document.addEventListener('keydown', rotateEventHandler);
document.addEventListener('keyup', slamEventHandler);
newGameButton.addEventListener('click', restart);



//INITIALIZE BOARD
grid.createGrid();
grid.assignNamesToAllDivs();
grid.hideBottomRow();
grid.hideTopTwoRows();
grid.hideOuterColumns();

updateScore();
updateSpeed();
//row 16 is the visible top, row 2 is the visible bottom.
console.log(grid.ArrayOfVisibleRows);
console.log(grid);
console.log('banana', grid.banana);
console.log('WEBPACK W TEST')


//INTIALIZE SHAPES
// const lTetrimino = [r16c7, r16c8, r16c9, r17c9]; 
// const jTetrimino = [r16c7, r16c8, r16c9, r17c7];
// const sqTetrimino = [r16c8, r16c9, r17c8, r17c9]; //square shape
// const iTetrimino = [r16c7, r16c8, r16c9, r16c10];
// const tTetrimino = [r16c7, r16c8, r16c9, r17c8];
// const z1Tetrimino = [r16c8, r16c9, r17c7, r17c8];
// const sTetrimino = [r16c7, r16c8, r17c8, r17c9];
// const arrayOfTetriminos = [lTetrimino, jTetrimino, sqTetrimino, iTetrimino, tTetrimino, z1Tetrimino, sTetrimino];
// const arrayOfShapeOrientations = ['l1', 'j1', 'sq1', 'i1', 't1', 'z1', 's1'];
// const z2Tetrimino = [r16c8, r17c8, r17c9, r16c9]; //testing only


//CREATE TETRIMINO ClASS (VERY LARGE CLASS/OBJECT. CAN WE DO SOMETHING ABOUT THIS?)




//START

let Mino = new Tetrimino(grid);
Mino.generate();
run();






//GLOBAL FUNCTIONS

function run() { 
    timer = setTimeout(fall, speed);
}

function fall() {
    if (!Mino.isDownBlocked) {
        Mino.lower();
        run()
    } else {
        Mino.makeStatic(); //freeze block in place
        checkRowState(); //delete filled rows, downshifts static pieces
        if (isGameOver()){
            promptRestart();
        } else {
            Mino.generate();
            run();
        }
    }   
}

function promptRestart() {
    prompt.style.display = 'flex';
    let h3 = document.getElementById('endscore');
    h3.innerHTML = `Your score is ${points}.`
}

function restart() {
    grid.divArray.forEach( e => {
        e.className = 'blank';
    })
    prompt.style.display = 'none';
    points = 0;
    speedTracker = 0;
    speed = 500;
    updateScore();
    updateSpeed();
    Mino.generate();
    run();
}


function updateSpeed() {
    if (speed > 160 && speedTracker%5 === 0) {
        speed = 500 - ((speedTracker/5) * 20);
    } else {
        return;
    }
}

function updateScore() {
    score.innerHTML = `Score: ${points}`;
    console.log(speedTracker, speed);
}



// function getStatics() {
//     let statics = document.getElementsByClassName('static');
//     let array = [];
//     let i;
//     for (i=0;i<statics.length;i++) {
//         array.push(statics[i])
//     }
//     return array;
// }


// function staticReassign(aboveSquare) { //takes an element. as long as elements go from bottom up should nto overwrite itself.
//     aboveSquare.className = 'blank';
//     grid[aboveSquare.idbelow].className = 'static';
// }


// //Finds all statics above the deleted row, then move them down
// function downShiftStatics() {
//     console.log('deleted row: ', deletedrow);
//     getStatics().forEach( e => {
//         if (e.row > deletedrow) {
//             staticReassign(e);
//         }
//     })
// }


// function clearRow(index) {
//     removeHighlight();
//     deletedrow = grid.ArrayOfVisibleRows[index][0].row;
//     grid.ArrayOfVisibleRows[index].forEach( e => {
//         e.className = 'blank';
//     })
// }



function checkRowState() {
    let rowsCleared = 0;

    function isFilled(elem, index, arr) { //callback function for .every
        return elem.className === 'static';
    }

    let i;
    for (i=0;i<grid.maxRows;i++) {
        if (grid.ArrayOfVisibleRows[i].every(isFilled)) {
            Mino.clearRow(i);
            Mino.downShiftStatics();
            speedTracker += 1;
            rowsCleared += 1; //for calculating score bonuses
            i -= 1; //accounts for multiple rows clearing 'at once.'
           
        }
    }

    if (rowsCleared === 1) {
        points += 1;
        updateScore();
        updateSpeed();
        bonusScreen.innerHTML = '<div>+1</div>';
        bonusScreen.style.display = 'flex';
        setTimeout( ()=> {
            bonusScreen.style.display = 'none';
        }, 1300)
    }
    if (rowsCleared === 2) {
        points += 4 ;//includes bonus
        updateScore();
        updateSpeed();
        bonusScreen.innerHTML = '<div>+4!</div>';
        bonusScreen.style.display = 'flex';
        setTimeout( ()=> {
            bonusScreen.style.display = 'none';
        }, 1300)
    }
    if (rowsCleared === 3) {
        points += 8 ;//includes bonus
        updateScore();
        bonusScreen.innerHTML = '<div>+8!</div>';
        bonusScreen.style.display = 'flex';
        setTimeout( ()=> {
            bonusScreen.style.display = 'none';
        }, 1300)
    }
    if (rowsCleared === 4) {
        points += 14 ;//includes bonus
        updateScore();
        updateSpeed();
        bonusScreen.innerHTML = '<div>TETRIS!</div><div>+14!</div>';
        bonusScreen.style.display = 'flex';
        setTimeout( ()=> {
            bonusScreen.style.display = 'none';
        }, 1300)
    }
}

// function removeHighlight() {
//     let j;
//     let array = [];
//     grid.divArray.forEach( e => {
//         if (e.style.backgroundColor = 'lime') {
//             array.push(e)
//         }
//     })
//     for (j=0;j<array.length;j++) {
//         array[j].style.backgroundColor = '';
//     }
// }

function isGameOver() {
    let i;
    for (i=0;i<grid.ArrayOfVisibleRows[14].length;i++) {
        if (grid.ArrayOfVisibleRows[16][i].className === 'static') {
            console.log('GAME OVER');
            return true;
            break;
        }
    }
    return false;
}

// function createRow() {
//     let i;
//     for (i=0; i<maxColumns; i++) {
//         //lets us keep increasing the array index for each iteration of createRow()
//         let indexAdjuster = (rowcount - 1) * maxColumns; //
//         let index = i + indexAdjuster;

//         divArray.push(document.createElement('DIV'))
//         divArray[index].setAttribute('class','blank')
//         board.appendChild(divArray[index]); //adds div to board div
//         divArray[index].style.bottom = `${bottom}px`; //positioning
//         divArray[index].style.left = `${left}px`; //positioning
//         left += tile;
//         divArray[index].column = columncount; 
//         columncount +=1;
//         divArray[index].row = rowcount; 
//         divArray[index].idabove = `r${divArray[index].row + 1}c${divArray[index].column}`
//         divArray[index].idbelow = `r${divArray[index].row - 1}c${divArray[index].column}`
//         divArray[index].idright = `r${divArray[index].row}c${divArray[index].column + 1}`
//         divArray[index].idleft = `r${divArray[index].row}c${divArray[index].column - 1}`
//         divArray[index].setAttribute('id', `r${divArray[index].row}c${divArray[index].column}`) //sets id with row1column2 format for simpler manipulation
//     }
// }


// //NOTE: we need to add 2 or 3 hidden rows at the top to allow the new shapes to generate 'off-screen'
// function createGrid() {
//     let k; //using k, since we used i on inside loop (createRow)
//     for (k=0;k<maxRows;k++) {
//         let array = []
//         createRow(); //fills in the entire row, adjusting all necessary variables within this inner function.

//         divArray.forEach( e => { //adds array to the Row Array.
//             if ( e.row === rowcount && e.column >= grid.leftedge && e.column <= grid.rightedge ) {
//                 array.push(e);
//             }
//         });
//         ArrayOfVisibleRows.push(array); //populates ArrayOfVisibleRows

//         left = 0; //Now that the row is created, we reset and adjust variables for next row:
//         bottom += tile;
//         rowcount += 1;
//         columncount = 1;
//     }
// }

// function hideBottomRow() {
//     const bottomRow = [];
//     let i;
//     for (i=0;i<divArray.length;i++) {
//         if (divArray[i].row < grid.floor) {
//             bottomRow.push(divArray[i]);
//         }
//     }
//     bottomRow.forEach(e => {
//         e.style.visibility = 'hidden';
//     })
// }


// function hideTopTwoRows() {
//     const topRows = [];

//     let i;
//     for (i=0;i<divArray.length;i++) {
//         if (divArray[i].row > 17) {
//             topRows.push(divArray[i]);
//         }
//     }
//     topRows.forEach(e => e.style.visibility = 'hidden');
// }

// function hideOuterColumns() {
//     const oustideColumns = [];
//     let i;
//     for (i=0;i<divArray.length;i++) {
//         if (divArray[i].column < grid.leftedge || divArray[i].column > grid.rightedge) {
//             oustideColumns.push(divArray[i]);
//         }
//     }
//     oustideColumns.forEach(e => e.style.visibility = 'hidden');
   
// }

// //ASSIGNS EACH ELEMENT TO A VARIABLE THAT IS THE SAME AS THE ELEMENT ID
// function assignNamesToAllDivs() {
//     divArray.forEach( e => {
//         window[`e.id`] = e;
//     })
// }

////







//EVENT HANDLERS
function leftEventHandler(e) {
    if (e.keyCode == 37 && !Mino.isLeftBlocked) {
        Mino.moveLeft();
    }
}

function rightEventHandler(e) {
    if (e.keyCode == 39 && !Mino.isRightBlocked) {
        Mino.moveRight();
    }
}

function downEventHandler(e) {
    if (e.keyCode == 40 && !Mino.isDownBlocked) {
        Mino.lower();
    }
}

function rotateEventHandler(e) {
    if (e.keyCode == 38) {
        Mino.rotate();
    }
}

function slamEventHandler(e) {
    if (e.keyCode == 32) {
        Mino.slam();
    }
}























//TESTING SECTIONS


// function testStatic() {
//     grid.divArray.forEach(e => {
//         if (e.column >= grid.leftedge && e.row >= grid.floor && e.row < 4 && e.column < 12) {
//             e.className = 'static';
//         }
//     })
// }


//OPERATE ONCE
// Mino.generate();
// Mino.lower();
// console.log(Mino.actives);
// Mino.actives.forEach( e => console.log(e.tracker));
// console.log(Mino.actives.sort((a,b) => a.tracker - b.tracker))



// OPERATE FALL
// testStatic();
// Mino.generate();
// setInterval(fall, 350);


//increasing speed



//NOTES
//FUNCTION FOR GRABBING ARRAY OF ACTIVE SQUARES
// the reason i am making an identical array is so that there is an array with value types, not reference
// creates an identical array, but of value types (not reference)
// technically array is not an array, its only array-like, so i cannot use .map on it.


// function getArrayOfActiveSquares() {
//     let array = [];
//     const arrayLikeObject = document.getElementsByClassName('active');
//     let i;
//     for (i=0;i<arrayLikeObject.length;i++) {
//         array.push(arrayLikeObject[i]);
//     }
//     return array;
// }


// function generateZ1Tetrimino() {
//     z1Tetrimino.forEach( e => {e.className = 'active'});
//     // assignTracker(z1Tetrimino);
//     shapeOrientation = 'z1';
// }

// function generateZ2Tetrimino() {
//     z2Tetrimino.forEach( e => {e.className = 'active'});
//     // assignTracker(z2Tetrimino);
//     shapeOrientation = 'z2';
// }

// function generateTTetrimino() {
//     tTetrimino.forEach( e => {e.className = 'active'});
//     shapeOrientation = 't1';
// }

// function generateITetrimino() {
//     iTetrimino.forEach( e => {e.className = 'active'});
//     shapeOrientation = 'i1';
// }

// function generateSTetrimino() {
//     sTetrimino.forEach( e => {e.className = 'active'});
//     shapeOrientation = 's1';
// }

// function generateLTetrimino() {
//     lTetrimino.forEach( e => {e.className = 'active'});
//     shapeOrientation = 'l1';
// }

// function generateJTetrimino() {
//     jTetrimino.forEach( e => {e.className = 'active'});
//     shapeOrientation = 'j1';
// }


// console.log(getStatics());

// function testLeftTest(nextArray) {
//     let testArray = []
//     nextArray.forEach(e => {
//         testArray.push(window[e.idleft]);
//     })
//     console.log(testArray);
// }

// generateTTetrimino();
// generateLTetrimino();
// Mino.rotate();
// testStatic();
// testLeftTest(lTetrimino);
// generateITetrimino();
// generateJTetrimino();

//why does ROTATE BACK FAIL?

//STATIC Z1
// generateZ1Tetrimino();
// Mino.lower();
// Mino.moveRight();
// Mino.moveLeft();
// Mino.moveLeft();
// Mino.moveRight();
// Mino.moveRight();
// Mino.moveRight();
// Mino.lower();

// Mino.rotate();
// Mino.rotate(); 
// console.log('actives alphabetically', Mino.actives);
// console.log('current orientation', shapeOrientation)
// Mino.actives.forEach( e => console.log(e.tracker));
// console.log('sorted by ascending trackers', Mino.actives.sort((a,b) => a.tracker - b.tracker));

//STATIC Z2
// generateZ2Tetrimino();
// Mino.rotate();
// Mino.rotate();
// Mino.rotate();
// Mino.rotate();
// console.log('actives alphabetically', Mino.actives);
// console.log('current orientation', shapeOrientation)
// Mino.actives.forEach( e => console.log(e.tracker));
// console.log('sorted by ascending trackers', Mino.actives.sort((a,b) => a.tracker - b.tracker));

// FALLING Z2
// generateZ2Tetrimino();
// setInterval(fallingZ, 1000);


//STATIC T Tetrimino - WORKS
// generateTTetrimino();
// console.log('orientation', shapeOrientation)



// Mino.rotate(); //t2
// console.log('orientation', shapeOrientation)
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //t3
// console.log('orientation', shapeOrientation)
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //t4
// console.log('orientation', shapeOrientation)
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //t1
// console.log('orientation', shapeOrientation)
// console.log('actives alphabetically', Mino.actives);

//FALLING T1 - WORKS
// generateTTetrimino();
// setInterval(fallingT, 1000);


// STATIC I Tetrimino - WORKS
// generateITetrimino();
// console.log('orientation', shapeOrientation)
// Mino.rotate();
// console.log('orientation', shapeOrientation)
// Mino.rotate();
// console.log('orientation', shapeOrientation)

// FALLING I1 - WORKS
// generateITetrimino();
// setInterval(fallingI, 1000);



// STATIC S Tetrimino - Works
// generateSTetrimino();
// console.log('orientation', shapeOrientation)
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// Mino.rotate();
// console.log('orientation', shapeOrientation);

// FALLING S1 - Works
// generateSTetrimino();
// setInterval(fallingS, 1000);

// STATIC L Tetrimino - WORKS
// generateLTetrimino(); 
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //l2
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //l3
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate(); //l4
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate();  //l1
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);


// FALLING L1 - Works
// generateLTetrimino();
// setInterval(fallingL, 1000);

//STATIC J - WORKS
// generateJTetrimino();
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);
// Mino.rotate();
// console.log('orientation', shapeOrientation);
// console.log('actives alphabetically', Mino.actives);

// FALLING J1 - WORKS
// generateJTetrimino();
// setInterval(fallingJ, 1000);






//TEST SHAPES

// function fallingZ() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     Mino.makeStatic(); //freeze block in place
//     generateZ2Tetrimino();
//     }
// }

// function fallingT() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     console.log('blocked?', Mino.isDownBlocked);
//     Mino.makeStatic(); //freeze block in place
//     generateTTetrimino();
//     }
// }

// function fallingI() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     console.log('blocked?', Mino.isDownBlocked);
//     Mino.makeStatic(); //freeze block in place
//     generateITetrimino();
//     }
// }

// function fallingS() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     console.log('blocked?', Mino.isDownBlocked);
//     Mino.makeStatic(); //freeze block in place
//     generateSTetrimino();
//     }
// }

// function fallingL() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     console.log('blocked?', Mino.isDownBlocked);
//     Mino.makeStatic(); //freeze block in place
//     generateLTetrimino();
//     }
// }


// function fallingJ() {
//     if (!Mino.isDownBlocked) {
//         Mino.rotate();
//         Mino.lower();
//     } else {
//     console.log('blocked?', Mino.isDownBlocked);
//     Mino.makeStatic(); //freeze block in place
//     generateJTetrimino();
//     }
// }






// OLD ROTATE CODE
// function isDownRotateBlocked(currentArray, nextArray) {
        //     let j;
        //     const currentRowMin = Math.min(...currentArray.map( e => e.row));
        //     const nextRowMin = Math.min(...nextArray.map( e => e.row));
        //     console.log(currentRowMin);
        //     console.log(nextRowMin);
        //     for (j=0;j<currentArray.length;j++) {
        //         if ((currentRowMin > nextRowMin && nextArray[j].className === 'static') || (currentRowMin > nextRowMin && nextArray[j].row < grid.floor)) {
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }

        // //i need to sort out/find the highest column number for each array.
        // function isRightRotateBlocked(currentArray, nextArray) {
        //     let j;
        //     const currentColumnMax = Math.max(...currentArray.map( e => e.column));
        //     const nextColumnMax = Math.max(...nextArray.map( e => e.column));
        //     console.log(currentColumnMax);
        //     console.log(nextColumnMax);
        //     for (j=0;j<currentArray.length;j++) {
        //         if ((currentColumnMax < nextColumnMax && nextArray[j].className === 'static') || (currentColumnMax < nextColumnMax && nextArray[j].column > grid.rightedge)) {
        //             console.log('right rotate blocked');
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }

        // function isLeftRotateBlocked(currentArray, nextArray) {
        //     let j;
        //     const currentColumnMin = Math.min(...currentArray.map( e => e.column));
        //     const nextColumnMin = Math.min(...nextArray.map( e => e.column));
        //     console.log(currentColumnMin);
        //     console.log(nextColumnMin);
        //     for (j=0;j<currentArray.length;j++) {
        //         if ((currentColumnMin > nextColumnMin && nextArray[j].className === 'static') || (currentColumnMin > nextColumnMin && nextArray[j].column < leftedge)) {
        //             console.log('left rotate blocked');
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }

        // function isStuck(currentArray, nextArray) {
        //     for (i=0;i<nextArray.length;i++)
        //     if (isLeftRotateBlocked(currentArray, nextArray) && ( window[`r${nextArray[i].row}c${nextArray[i].column + 1}`].className === 'static' || window[`r${nextArray[i].row - 1}c${nextArray[i].column + 1}`].className === 'static' )){
        //         return true;
        //         break;
        //     }
        // }

    //For Some reason Could NOT get this to work
    //     function isRightRotateBlockedOneSpace(currentArray, nextArray) {
    //         let j;
    //         const currentColumnMax = Math.max(...currentArray.map( e => e.column));
    //         const nextColumnMax = Math.max(...nextArray.map( e => e.column));
    //         console.log(currentColumnMax);
    //         console.log(nextColumnMax);
    //         for (j=0;j<currentArray.length;j++) {
    //             if ((nextColumnMax > currentColumnMax && nextArray[3].className === 'static' && nextArray[2].className !== 'static') || (nextColumnMax > currentColumnMax && nextArray[2].column === grid.rightedge)) {
    //                 console.log('right rotate blocked one space');
    //                 return true;
    //                 break;
    //             }
    //         }
    //         return false;
    // }

        // function isITetroRightBlockedTwo(currentArray, nextArray) {
        //     let j;
        //     const currentColumnMax = Math.max(...currentArray.map( e => e.column));
        //     const nextColumnMax = Math.max(...nextArray.map( e => e.column));
        //     console.log(currentColumnMax);
        //     console.log(nextColumnMax);
        //     for (j=0;j<currentArray.length;j++) {
        //         if (nextArray[2].className === 'static' || nextArray[2].column > grid.rightedge) {
        //             console.log('right blocked two spaces');
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }

        // function isITetroRightBlockedOne(currentArray, nextArray) {
        //     let j;
        //     const currentColumnMax = Math.max(...currentArray.map( e => e.column));
        //     const nextColumnMax = Math.max(...nextArray.map( e => e.column));
        //     console.log(currentColumnMax);
        //     console.log(nextColumnMax);
        //     for (j=0;j<currentArray.length;j++) {
        //         if (nextArray[3].className === 'static' || nextArray[3].column > grid.rightedge) {
        //             console.log('right blocked one space');
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }

        // function isITetroLeftBlocked(currentArray, nextArray) {
        //     let j;
        //     const currentColumnMin = Math.min(...currentArray.map( e => e.column));
        //     const nextColumnMin = Math.min(...nextArray.map( e => e.column));
        //     console.log(currentColumnMin);
        //     console.log(nextColumnMin);
        //     for (j=0;j<currentArray.length;j++) {
        //         if ((nextArray[0].className === 'static') || (currentColumnMin > nextColumnMin && nextArray[0].column < leftedge)) {
        //             return true;
        //             break;
        //         }
        //     }
        //     return false;
        // }




// TESTING CODE, WORKS
// const newdiv = document.createElement('DIV');
// const newdiv2 = document.createElement('DIV');
// newdiv.setAttribute('class', 'blank');
// newdiv2.setAttribute('class', 'blank');
// board.appendChild(newdiv);
// board.appendChild(newdiv2);

// let xpos = 15;
// let ypos = 30;

// newdiv.xpos = xpos;
// newdiv.ypos = ypos;

// newdiv2.xpos = 20;
// newdiv2.ypos = 40;

// newdiv2.style.bottom = '40px';

// console.log(newdiv.xpos, newdiv.ypos);
// console.log(newdiv2.xpos, newdiv2.ypos);
// console.log(Object.getOwnPropertyNames(newdiv));
// newdiv.style.backgroundColor = 'black';
// console.log(newdiv.style); //QUESTION!!! where is this property hidden? cannot view it in console without directly logging it.
//






// Error: this code overwrites the cssproperties prototype

// class Template {
//     constructor(xpos, ypos) {
//         this.xpos = xpos;
//         this.ypos = ypos;
//     }
// }

// Object.setPrototypeOf(newdiv, new Template(xpos, ypos))
//





//class extension that i did
//seems pointless now
//
// class Template {
//     constructor() {
//         this.color = 'blue';
//         this.height = 40;
//         this.width = 40;
//     }
// }

// class Square extends Template {
//     constructor(xpos, ypos) {
//         super(); //enables use of this, some reason
//         this.xpos = xpos;
//         this.ypos = ypos;
//     }
// };

// let sq = new Square(0, 5);
// let te = new Template();

// // console.log(te.color);
// console.log(sq);
// console.log(sq.height);
// console.log(sq.color);
// sq.color = 'black';
// console.log(sq.color);
// console.log(te.color);

