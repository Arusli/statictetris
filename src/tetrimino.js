export default class Tetrimino {
    constructor(grid){
        this.grid = grid;
        this.name = 'terminino object';
        this.lTetrimino = [this.grid.r16c7, this.grid.r16c8, this.grid.r16c9, this.grid.r17c9]; 
        this.jTetrimino = [this.grid.r16c7, this.grid.r16c8, this.grid.r16c9, this.grid.r17c7];
        this.sqTetrimino = [this.grid.r16c8, this.grid.r16c9, this.grid.r17c8, this.grid.r17c9]; //square shape
        this.iTetrimino = [this.grid.r16c7, this.grid.r16c8, this.grid.r16c9, this.grid.r16c10];
        this.tTetrimino = [this.grid.r16c7, this.grid.r16c8, this.grid.r16c9, this.grid.r17c8];
        this.z1Tetrimino = [this.grid.r16c8, this.grid.r16c9, this.grid.r17c7, this.grid.r17c8];
        this.sTetrimino = [this.grid.r16c7, this.grid.r16c8, this.grid.r17c8, this.grid.r17c9];
        this.arrayOfTetriminos = [this.lTetrimino, this.jTetrimino, this.sqTetrimino, this.iTetrimino, this.tTetrimino, this.z1Tetrimino, this.sTetrimino];
        this.arrayOfShapeOrientations = ['l1', 'j1', 'sq1', 'i1', 't1', 'z1', 's1'];
        this.shapeOrientation;
        this.deletedrow = 0;
    }

     //getArrayOfActiveSquares()
    get actives() {
        let array = [];
        const arrayLikeObject = document.getElementsByClassName('active');
        let i;
        for (i=0;i<arrayLikeObject.length;i++) {
            array.push(arrayLikeObject[i]);
        }
        return array;
    }

     //generateTetriminos()
    generate() {
        const num = Math.floor(Math.random() * Math.floor(7)); //generates random number from zero to max, excluding max
        const tetrimino = this.arrayOfTetriminos[num]; 
        this.shapeOrientation = this.arrayOfShapeOrientations[num];
        tetrimino.forEach(e => e.className = 'active');
        
        // console.log(shapeOrientation);
    }

    highlightRow() {
        function isOccupied(elem, index, arr) { //callback function for .every
            return elem.className !== 'blank';
        }
        let k;
        for (k=0;k<this.grid.maxRows;k++) {
            if (this.grid.ArrayOfVisibleRows[k].every(isOccupied) && this.isDownBlocked) {
                console.log('this.isDownBlocked', this.isDownBlocked);
                this.grid.ArrayOfVisibleRows[k].forEach(e => {
                    e.style.backgroundColor = '#ff6ec7'
                })
            }
        }
    }
    

    lower() {

        const array = this.actives //must set to an array so that it can remember the positions of the active array even after class is set to blank.
        let i;
        for(i=0;i<array.length;i++) {
            array[i].setAttribute('class','blank');
        }

        for(i=0;i<array.length;i++) {
            let newRowNum = array[i].row - 1;
            document.getElementById(`r${newRowNum}c${array[i].column}`).setAttribute('class','active');   //adjustClassesDown()
        }       

        this.highlightRow();

    }

    moveUp() {
        const array = this.actives
        let i;
        for(i=0;i<array.length;i++) {
            array[i].setAttribute('class','blank');
        }
        for(i=0;i<array.length;i++) {
            let newRowNum = array[i].row + 1;
            document.getElementById(`r${newRowNum}c${array[i].column}`).setAttribute('class','active');   //adjustClassesUp()
        }
    }

    moveLeft() {
            const array = this.actives;
            let i;
            for(i=0;i<array.length;i++) {
                array[i].setAttribute('class','blank');
            }
            for(i=0;i<array.length;i++) {
                let newColumnNum = array[i].column - 1;
                document.getElementById(`r${array[i].row}c${newColumnNum}`).setAttribute('class','active');   //adjustClasses
            }  
    }

    moveRight() {
            const array = this.actives;
            let i;
            for(i=0;i<array.length;i++) {
                array[i].setAttribute('class','blank');
            }
            for(i=0;i<array.length;i++) {
                let newColumnNum = array[i].column + 1;
                document.getElementById(`r${array[i].row}c${newColumnNum}`).setAttribute('class','active');  //adjustClasses
            }
        }

    //pathBlocked()
    get isDownBlocked() {
        const path = this.actives.map((e) => document.getElementById(`${e.idbelow}`))
        // console.log(path);
        let j;
        for (j=0;j<this.actives.length;j++) {
            if (path[j].className === 'static' || path[j].row < this.grid.floor) {
                return true;
                break;
            }
        }
        return false;
    }


    get isRightBlocked() {
        const path = this.actives.map((e) => document.getElementById(`${e.idright}`))
        let j;
        for (j=0;j<this.actives.length;j++) {
            if (path[j].className === 'static' || path[j].column > this.grid.rightedge) {
                return true;
                break;
            }
        }
        return false;
    }

    //ALSO GET AN ERROR HERE BECAUSE THERE ARE NO COLUMNSS LEFTWARDS THAT HAVE THE ID OF ID LEFT! NEED TO CREATE MORE INVISIBLE COLUMNS - done
    get isLeftBlocked() {
        const path = this.actives.map((e) => document.getElementById(`${e.idleft}`))
        // console.log(path);
        let j;
        for (j=0;j<this.actives.length;j++) {
            if (path[j].className === 'static' || path[j].column < this.grid.leftedge) {
                return true;
                break;
            }
        }
        return false;
    }


  
    makeStatic() {
        this.actives.forEach( element => element.setAttribute('class', 'static'))
    }

    
    slam() {
        let i;
        for (i=0; i<15; i++) {
            if (!this.isDownBlocked) {
                this.lower();
            } else {
                break;
            }
        }
    }

    getStatics() {
        let statics = document.getElementsByClassName('static');
        let array = [];
        let i;
        for (i=0;i<statics.length;i++) {
            array.push(statics[i])
        }
        return array;
    }
    
    
    staticReassign(aboveSquare) { //takes an element. as long as elements go from bottom up should nto overwrite itself.
        aboveSquare.className = 'blank';
        this.grid[aboveSquare.idbelow].className = 'static';
    }
    
    
    //Finds all statics above the deleted row, then move them down
    downShiftStatics() {
        console.log('deleted row: ', this.deletedrow);
        this.getStatics().forEach( e => {
            if (e.row > this.deletedrow) {
                this.staticReassign(e);
            }
        })
    }

    clearRow(index) {
        this.removeHighlight();
        this.deletedrow = this.grid.ArrayOfVisibleRows[index][0].row;
        this.grid.ArrayOfVisibleRows[index].forEach( e => {
            e.className = 'blank';
        })
    }
    
    
    
    checkRowState() {
        let rowsCleared = 0;
    
        function isFilled(elem, index, arr) { //callback function for .every
            return elem.className === 'static';
        }
    
        let i;
        for (i=0;i<this.grid.maxRows;i++) {
            if (this.grid.ArrayOfVisibleRows[i].every(isFilled)) {
                this.clearRow(i);
                this.downShiftStatics();
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
    
    removeHighlight() {
        let j;
        let array = [];
        this.grid.divArray.forEach( e => {
            if (e.style.backgroundColor = 'lime') {
                array.push(e)
            }
        })
        for (j=0;j<array.length;j++) {
            array[j].style.backgroundColor = '';
        }
    }


    //isTopBound



        //NOTES: RIGHT NOW GAME CURRENTLY DOESNT KNWO IF SOMETHING IS RIGHT ROTATE BOUND SPEIFICIALLY. ONLY KNOWS THAT IT CANNOT ROTATE IN GENERAL, SOMEWHERE.
        //IS IT POSSIBLE TO (WITH AN EXCEPTION FOR I TETRO) TO SIMPLY, WHEN ROTATE IS CALLED, IF SHAPE IS RIGHT BLOCKED, SHIFT IT RIGHT BEFORE ROTATING. (YES).
        //CORRECTION NO! RIGHT BLOCKED IS NOT HTE SAME AS ROTATE BLOCKED. RIGHT BLOCKED MEANS THERE IS NO SPACE TO THE RIGHT. RIGHT ROTATE BLOCKED MEANS...
        //EVEN IF THERE IS NO SPACE RIGHT, IF THE ROTATION DOESNT OCCUPY TEH SPACE TO THE RIGHT, ROTATION IS FINE!
        //SHOULD A DOWNWARDLY ROTATEBLOCKED SHAPE BE ALLOWED TO UPSHIFT AND ROTATE? (MAYBE)

    //Rotate
    rotate() {
        const _this = this;  // for referencing the Termino object inside of the inner functions.

        //I BELIEVE A STUCK FUNCTION WILL STOP MANY OF THESE WEIRD ERASURES.
        //THE ERASURES COME FROM THE HYPOTHETICAL POSITION BEING OKAY DESPITE IN A REAL WORLD SENSE IT SEEMS WRONG BECAUSE THE TETRO
        //COULD NOT ACTUALLY PASS THROUGH THE STATIC GRID, BUT ITS NOT ACTUALLY LITERALLY ROTATING
        //THEN THE PIECE SLIDES LEFT OR RIGHT, ERASING THE STATIC GRID, AND THEN IS REASSIGNED TO THE NEW HYPOTHETICLA POSITION
        //BUT THE GRID WAS DAMAGED DURING HTE SLIDE BEFORE THE ROTATION.
        //YOU COULD ROTATE FIRST THEN SLIDE BUT THAT WOULD ALSO ERASE.
        //WE NEED A STUCK FUNCTION THAT PREEMPTS THESE STRANGE MOVES.
        //what defines STUCK? 
        //STUCK = IF THERE IS A PIECE INBETWEN WHERE IT STARTS AND WHERE IT ROTATES TO.
        //DO I NEED A TRACKER FOR THIS?


        //if the natural rotation is blocked, the handleRotate() tests a hypothetical left(or right) shift and rotate. 
        //this function is part of the hypothetical left and rotate, acting as a failsafe that the shift left doesnt move through another static piece.
        //also this function should serve to block strange visual shifts that may be logically sound, but appear awkward.
        function isStuck(activeArray, iddirection) { 
            let testArray = [];
            activeArray.forEach(e => {
                testArray.push(_this.grid[e[iddirection]]);
            })
            console.log(testArray);
            
            let sideContactPoints = 0; //logic might be a little iffy on this one
            activeArray.forEach( e => {
                if ((_this.grid[e.idleft].className === 'static' || _this.grid[e.idright].className === 'static')) {
                    sideContactPoints += 1
                }
            })
            console.log('side contact points:', sideContactPoints)
            
            let multifaceContactPoints = 0;
            let staticArray = _this.getStatics();
            console.log(staticArray);
            staticArray.forEach( e => {
                if (
                   (_this.grid[e.idleft].className === 'active' && _this.grid[e.idbelow].className === 'active') 
                || (_this.grid[e.idleft].className === 'active' && _this.grid[e.idabove].className === 'active') 
                || (_this.grid[e.idright].className === 'active' && _this.grid[e.idleft].className === 'active') 
                || (_this.grid[e.idright].className === 'active' && _this.grid[e.idbelow].className === 'active') 
                || (_this.grid[e.idright].className === 'active' && _this.grid[e.idabove].className === 'active') 
                ){
                    multifaceContactPoints += 1;
                }

            })

            let i;
            for (i=0;i<testArray.length;i++) {
                if (testArray[i].className === 'static') {
                    return true;
                }
            }

            if (sideContactPoints >= 1 && iddirection === 'idabove') {
                return true;
            }

            if (multifaceContactPoints >= 1) {
                return true;
            }

            return false;
        }


        function isRotateBlocked(array) { //takes an array of elements which represent the hypothetical rotated position
           let j;
           for (j=0;j<array.length;j++) {
               if (array[j].className === 'static' || array[j].column < _this.grid.leftedge || array[j].column > _this.grid.rightedge || array[j].row < _this.grid.floor) {
                   return true;
               }
           }
            return false;
        }


        function handleRotationV2(activeArray, nextArray, nextShape) {
            if (isRotateBlocked(nextArray()) === true) {
                //test hypotheticals;
                //rotate if possible (aka move then reassign, to a position we know will have no blockage)
                if (testLeftHypothetical(activeArray(), nextArray())) {
                    _this.moveLeft();
                    console.log('moved left')
                    reassign(activeArray(), nextArray());
                    console.log('reassigned')
                    _this.shapeOrientation = nextShape;
                
                } else if (testRightHypothetical(activeArray(), nextArray())) {
                    _this.moveRight();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                    console.log('moved right')
                } else if (testUpHypothetical(activeArray(), nextArray())) {
                    _this.moveUp();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                    console.log('moved up')
                } else {
                    console.log('blocked: cannot rotate');
                    return;
                }
            } else if (!isRotateBlocked(nextArray())) {
                reassign(activeArray(), nextArray());
                _this.shapeOrientation = nextShape;
            }
        }

        function handleITetroRotation(activeArray, nextArray, nextShape) {
            if (isRotateBlocked(nextArray()) === true) {
                //test hypotheticals;
                //rotate if possible (aka move then reassign, to a position we know will have no blockage)
                if (testLeftHypothetical(activeArray(), nextArray())) {
                    _this.moveLeft();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                } else if (testDoubleLeftHypothetical(activeArray(), nextArray())) {
                    _this.moveLeft();
                    _this.moveLeft();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                } else if (testRightHypothetical(activeArray(), nextArray())) {
                    _this.moveRight();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                } else if (testUpHypothetical(activeArray(), nextArray())) {
                    _this.moveUp();
                    reassign(activeArray(), nextArray());
                    _this.shapeOrientation = nextShape;
                } else {
                    console.log('SHAPE I TETRO IS BLOCKED');
                    return;
                }
            } else if (!isRotateBlocked(nextArray())) {
                reassign(activeArray(), nextArray());
                _this.shapeOrientation = nextShape;
            }
        }

        function testLeftHypothetical(activeArray, nextArray) {
            let testArray = [];
            nextArray.forEach(e => {
                testArray.push(_this.grid[e.idleft]);
            })
            console.log(testArray);
            if (isRotateBlocked(testArray)) {
                return false;
            } else if (isStuck(activeArray, 'idleft')) {
                return false;
            } else {
                return true;
            }
        }

        function testDoubleLeftHypothetical(activeArray, nextArray) {
            let testArray = [];
            nextArray.forEach(e => {
                testArray.push(_this.grid[_this.grid[e.idleft].idleft]);
            })
            console.log(testArray);
            if (isRotateBlocked(testArray)) {
                return false;
            } else if (isStuck(activeArray, 'idleft')) {
                return false;
            } else {
                return true;
            }
        }

        function testRightHypothetical(activeArray, nextArray) {
            let testArray = []
            nextArray.forEach(e => {
                testArray.push(_this.grid[e.idright]);
            })
            console.log(testArray);
            if (isRotateBlocked(testArray)) {
                return false;
            } else if (isStuck(activeArray, 'idright')) {
                return false;
            } else {
                return true;
            }
        }

        function testUpHypothetical(activeArray, nextArray) {
            let testArray = []
            nextArray.forEach(e => {
                testArray.push(_this.grid[e.idabove]);
            })
            console.log(testArray);
            if (isRotateBlocked(testArray)) {
                return false;
            } else if (isStuck(activeArray, 'idabove')) {
                return false;
            } else {
                return true;
            }
        }


        function reassign(currentArr, newArr) {
            currentArr.forEach( e => {
                e.className = 'blank'; 
            })
            newArr.forEach(e => {
                e.className = 'active';
            })
        }

        function getActives() {
            let array = [];
            const arrayLikeObject = document.getElementsByClassName('active');
            let i;
            for (i=0;i<arrayLikeObject.length;i++) {
                array.push(arrayLikeObject[i]);
            }
            return array;
        }


        //PREVIOUS ROTATION HANDLER FUNCTION
        // function handleRotation(activeArray, nextArray, nextShape) {

        //    if (isLeftRotateBlocked(activeArray(), nextArray())) {
        //         _this.moveRight();
        //         reassign(activeArray(), nextArray());
        //         _this.shapeOrientation = nextShape; 
        //     } else if (isRightRotateBlocked(activeArray(), nextArray())) {
        //         _this.moveLeft();
        //         reassign(activeArray(), nextArray());
        //         _this.shapeOrientation = nextShape; 
        //     } else if (isDownRotateBlocked(activeArray(), nextArray())) {
        //         _this.moveUp();
        //         reassign(activeArray(), nextArray());
        //         _this.shapeOrientation = nextShape; 
        //     } else {
        //         reassign(activeArray(), nextArray());
        //         _this.shapeOrientation = nextShape; 
        //     } 
        // }
 

        //BIG IF

        if (_this.shapeOrientation === 'z1') {
            function makeNewArray() {
                let newPositionArray = []; //these are ids not objects. MAKE THEM OBJECTS BELOW SO THEY CAN EASILY FIT INTO HANDLEROTATION()
                newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column + 1}`]) 
                newPositionArray.push(_this.grid[`r${_this.actives[1].row + 2}c${_this.actives[1].column}`]) 
                newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column + 1}`]) 
                newPositionArray.push(_this.grid[_this.actives[3].id]);
                return newPositionArray;
         }
    
         handleRotationV2(getActives, makeNewArray, 'z2');
       
    } else if (_this.shapeOrientation === 'z2') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[1].column - 1}`]) 
            newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column - 1}`]) 
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 2}c${_this.actives[3].column}`]) 
            return newPositionArray;
        }

        handleRotationV2(getActives, makeNewArray, 'z1');
    } else if (_this.shapeOrientation === 't1') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row - 1}c${_this.actives[0].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[_this.actives[3].id]);
            return newPositionArray;
        }
            
        handleRotationV2(getActives, makeNewArray, 't2');
    } else if (_this.shapeOrientation === 't2') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[_this.actives[0].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column - 1}`]); 
            return newPositionArray;
        }
        
        handleRotationV2(getActives, makeNewArray, 't3');
    } else if (_this.shapeOrientation === 't3') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[_this.actives[0].id]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row + 1}c${_this.actives[3].column - 1}`]); 
            return newPositionArray;
        }


        handleRotationV2(getActives, makeNewArray, 't4');
    } else if (_this.shapeOrientation === 't4') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[3].column + 1}`]); 
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[_this.actives[3].id]);
            return newPositionArray;
        }
   
        handleRotationV2(getActives, makeNewArray, 't1');
    } else if (_this.shapeOrientation === 'i1') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row - 1}c${_this.actives[0].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row + 1}c${_this.actives[2].column - 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row + 2}c${_this.actives[3].column - 2}`]);
            return newPositionArray;
        }

        handleITetroRotation(getActives, makeNewArray, 'i2');
    } else if (_this.shapeOrientation === 'i2') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column - 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column + 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 2}c${_this.actives[3].column + 2}`]);
            return newPositionArray;
        }
       
        handleITetroRotation(getActives, makeNewArray, 'i1');
    } else if (_this.shapeOrientation === 's1') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 2}c${_this.actives[0].column}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row + 1}c${_this.actives[1].column - 1}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column - 1}`]);
            return newPositionArray;
        }
        
        handleRotationV2(getActives, makeNewArray, 's2');
    } else if (_this.shapeOrientation === 's2') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column + 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row - 1}c${_this.actives[1].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 2}c${_this.actives[3].column}`]);
            return newPositionArray;
        }
        handleRotationV2(getActives, makeNewArray, 's1');
    } else if (_this.shapeOrientation === 'l1') {
       
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column - 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 2}c${_this.actives[3].column}`]);
            return newPositionArray;
        }

        //I GET AN ERROR CHECKING THIS PROPERTY WHEN THE PIECE IS AT THE WALL BECAUSE THERE ARE NO IDS 
        //TO MATCH COLUMNS THAT DONT EXIST AKA EXTEND PAST THE WALL
        //NEED TO ADD COLUMNS!

        handleRotationV2(getActives, makeNewArray, 'l2');
           
    } else if (_this.shapeOrientation === 'l2') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column - 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row}c${_this.actives[1].column - 2}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column + 1}`]);
            return newPositionArray;
        }

        handleRotationV2(getActives, makeNewArray, 'l3');
        
    } else if (_this.shapeOrientation === 'l3') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 2}c${_this.actives[0].column}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row + 1}c${_this.actives[1].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column - 1}`]);
            return newPositionArray;
        }

         handleRotationV2(getActives, makeNewArray, 'l4');

    } else if (_this.shapeOrientation === 'l4') {

        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column - 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row}c${_this.actives[2].column + 2}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column + 1}`]);
            return newPositionArray;
        }

        handleRotationV2(getActives, makeNewArray, 'l1');

    } else if (_this.shapeOrientation === 'j1') {
        
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column - 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row}c${_this.actives[3].column + 2}`]);
            return newPositionArray;
        }

        handleRotationV2(getActives, makeNewArray, 'j2');
    } else if (_this.shapeOrientation === 'j2') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 1}c${_this.actives[0].column - 1}`]);
            newPositionArray.push(_this.grid[_this.actives[1].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[2].row - 1}c${_this.actives[2].column + 1}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 2}c${_this.actives[3].column}`]);
            return newPositionArray;
        }
        handleRotationV2(getActives, makeNewArray, 'j3');
    } else if (_this.shapeOrientation === 'j3') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row}c${_this.actives[0].column - 2}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row + 1}c${_this.actives[1].column + 1}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column - 1}`]);
            return newPositionArray;
        }
        handleRotationV2(getActives, makeNewArray, 'j4');
    } else if (_this.shapeOrientation === 'j4') {
        function makeNewArray() {
            let newPositionArray = [];
            newPositionArray.push(_this.grid[`r${_this.actives[0].row + 2}c${_this.actives[0].column}`]);
            newPositionArray.push(_this.grid[`r${_this.actives[1].row + 1}c${_this.actives[1].column - 1}`]);
            newPositionArray.push(_this.grid[_this.actives[2].id]);
            newPositionArray.push(_this.grid[`r${_this.actives[3].row - 1}c${_this.actives[3].column + 1}`]);
            return newPositionArray;
        }
        handleRotationV2(getActives, makeNewArray, 'j1');
    } //end else if
} //end rotate()  
} //end of class