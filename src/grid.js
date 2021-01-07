export default class Grid {

    constructor() {
        this.board = document.getElementById('board');
        
        this.ArrayOfVisibleRows = [];
        this.divArray = [];
        
        this.rowcount = 1; //initial row value
        this.columncount = 1; //initial column value
        this.maxRows = 19; //safe to adjust
        this.maxColumns = 16;
        this.tile = 30; //determines grid unit size
        this.rightedge = 13;
        this.leftedge = 4;
        this.floor = 2;
        this.bottom = 0;
        this.left = 0;
        
        // let points = 0;
        // let speedTracker = 0;
        // let speed = 500;
        // let timer;
        // let deletedrow = 0;
        // let shapeOrientation;
    }

    createRow() {
        let i;
        for (i=0; i<this.maxColumns; i++) {
            //lets us keep increasing the array index for each iteration of createRow()
            let indexAdjuster = (this.rowcount - 1) * this.maxColumns; //
            let index = i + indexAdjuster;
    
            this.divArray.push(document.createElement('DIV'))
            this.divArray[index].setAttribute('class','blank')
            this.board.appendChild(this.divArray[index]); //adds div to board div
            this.divArray[index].style.bottom = `${this.bottom}px`; //positioning
            this.divArray[index].style.left = `${this.left}px`; //positioning
            this.left += this.tile;
            this.divArray[index].column = this.columncount; 
            this.columncount +=1;
            this.divArray[index].row = this.rowcount; 
            this.divArray[index].idabove = `r${this.divArray[index].row + 1}c${this.divArray[index].column}`
            this.divArray[index].idbelow = `r${this.divArray[index].row - 1}c${this.divArray[index].column}`
            this.divArray[index].idright = `r${this.divArray[index].row}c${this.divArray[index].column + 1}`
            this.divArray[index].idleft = `r${this.divArray[index].row}c${this.divArray[index].column - 1}`
            this.divArray[index].setAttribute('id', `r${this.divArray[index].row}c${this.divArray[index].column}`) //sets id with row1column2 format for simpler manipulation
        }
    }
    
    
    //NOTE: we need to add 2 or 3 hidden rows at the top to allow the new shapes to generate 'off-screen'
    createGrid() {
        let k; //using k, since we used i on inside loop (createRow)
        for (k=0;k<this.maxRows;k++) {
            let array = []
            this.createRow(); //fills in the entire row, adjusting all necessary variables within this inner function.
    
            this.divArray.forEach( e => { //adds array to the Row Array.
                if ( e.row === this.rowcount && e.column >= this.leftedge && e.column <= this.rightedge ) {
                    array.push(e);
                }
            });
            this.ArrayOfVisibleRows.push(array); //populates ArrayOfVisibleRows
    
            this.left = 0; //Now that the row is created, we reset and adjust variables for next row:
          this.  bottom += this.tile;
            this.rowcount += 1;
            this.columncount = 1;
        }
    }
    
    hideBottomRow() {
        this.bottomRow = [];
        let i;
        for (i=0;i<this.divArray.length;i++) {
            if (this.divArray[i].row < this.floor) {
              this.  bottomRow.push(this.divArray[i]);
            }
        }
      this.bottomRow.forEach(e => {
            e.style.visibility = 'hidden';
        })
    }
    
    
    hideTopTwoRows() {
        const topRows = [];
    
        let i;
        for (i=0;i<this.divArray.length;i++) {
            if (this.divArray[i].row > 17) {
                topRows.push(this.divArray[i]);
            }
        }
        topRows.forEach(e => e.style.visibility = 'hidden');
    }
    
    hideOuterColumns() {
        const oustideColumns = [];
        let i;
        for (i=0;i<this.divArray.length;i++) {
            if (this.divArray[i].column < this.leftedge || this.divArray[i].column > this.rightedge) {
                oustideColumns.push(this.divArray[i]);
            }
        }
        oustideColumns.forEach(e => e.style.visibility = 'hidden');
       
    }
    
    //ASSIGNS EACH ELEMENT TO A VARIABLE THAT IS THE SAME AS THE ELEMENT ID
   assignNamesToAllDivs() {
        this.divArray.forEach( e => {
            this[e.id] = e;
        })
    }

}


// //INITIALIZE BOARD
// createGrid();
// assignNamesToAllDivs();
// hideBottomRow();
// hideTopTwoRows();
// hideOuterColumns();