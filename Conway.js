//The gameboard
var boardVals;

//cps = cells per side
var cps = 16;
var cellSide = (window.innerWidth - 20) / cps
var cellMid = cellSide / 2;

var canvas;
var ctx;

var cellXCount;
var cellYCount;

var runVar;
var running = false;

//This is for converting between hex and binary
var binLookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function loadBoard()
{
    var param = getURLParameter("state");
    var binVal;
    var absPos;
    if(param != null)
    {
        //Split the hex string and convert to binary
        for(var i = 0; i < param.length; i++)
        {
            //console.log(i);
            if(binLookupTable.hasOwnProperty(param[i]))
            {
                binVal = binLookupTable[param[i]];
                absPos = i * 4;
                //console.log(absPos + " " + binVal);
                for(var j = 0; j < 4; j++)
                {
                    //console.log(j + ": " + (binVal[j] == '1'));
                    //console.log(Math.floor(absPos / cps) + " " + ((absPos % cps) + j));
                    boardVals[Math.floor(absPos/cps)][absPos%cps + j] = (binVal[j] == '1')
                }
                //console.log(i + "th set complete");
            }
            else
                break;
        }
        //Draw the entire board
        drawBoard();
    }
}

//Draw the entire board
function drawBoard()
{
    for(var i = 0; i < cps; i++)
    {
        for(var j = 0; j < cps; j++)
        {

            drawCell(i, j, boardVals[j][i]);
        }
    }
}



//Draw the lines to divide the canvas into squares
function initCanvas()
{
	canvas = document.getElementById("board");

	if(canvas.getContext) {
		ctx = canvas.getContext("2d");
		
		//Size the canvas to the screen
		ctx.canvas.width  = window.innerWidth - (window.innerWidth % cellSide);
		ctx.canvas.height = ctx.canvas.width;
		
		var width = canvas.width;
		var height = canvas.height;
		
		//Clear the canvas
		ctx.clearRect(0, 0, width, height);
		
		//Set the line color
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		
		ctx.beginPath();
		//Draw horizontal lines
		for(i = cellSide; i < height; i += cellSide)
		{
			ctx.moveTo(0, i);
			ctx.lineTo(width, i);
		}
		
		//Draw horizontal lines
		for(i = cellSide; i < width; i += cellSide)
		{
			ctx.moveTo(i, 0);
			ctx.lineTo(i, height);
		}
		ctx.stroke();
		ctx.closePath();
	}
	
	
	//Initialize the board to being empty
	cellXCount = cps; //canvas.width / cellSide;
	cellYCount = cps; //canvas.height / cellSide;
	boardVals = new Array(cellXCount);
	
	for(i = 0; i < cellXCount; i++)
	{
		boardVals[i] = new Array(cellYCount);

		for(j = 0; j < cellYCount; j++)
		{
			boardVals[i][j] = 0;
		}	
	}	
	
	//Load the board state
	loadBoard();
}

function reset()
{
	var canvas = document.getElementById("board");

	if(canvas.getContext) {
		var ctx = canvas.getContext("2d");

		var width = canvas.width;
		var height = canvas.height;
		
		//Clear the canvas
		ctx.clearRect(0, 0, width, height);
		
		ctx.beginPath();
		//Draw horizontal lines
		for(i = cellSide; i < height; i += cellSide)
		{
			ctx.moveTo(0, i);
			ctx.lineTo(width, i);
		}
		
		//Draw vertical lines
		for(i = cellSide; i < width; i += cellSide)
		{
			ctx.moveTo(i, 0);
			ctx.lineTo(i, height);
		}
		ctx.stroke();
		ctx.closePath();
		
		//Reset the board
		for(i = 0; i < cellXCount; i++)
		{
			for(j = 0; j < cellYCount; j++)
			{
				boardVals[i][j] = 0;
			}	
		}
	}
}

function countNeighbors(x, y)
{
/*alert(
	boardVals[(y > 0) ? (y - 1) : (cellYCount - 1)][(x > 0) ? (x - 1) : (cellXCount - 1)]+ "" +
	boardVals[(y > 0) ? (y - 1) : (cellYCount - 1)][x] + "" +
	boardVals[(y > 0) ? y - 1 : cellYCount - 1][(x + 1 == cellXCount) ? 0 : x + 1] + "" +
	"\n" + boardVals[y][(x > 0) ? x - 1 : cellXCount - 1] +  "" +
	boardVals[y][x] + 	 "" +
	boardVals[y][(x + 1 == cellXCount) ? 0 : x + 1] + "" +
	"\n" + boardVals[(y + 1 == cellYCount) ? 0 : y + 1][(x > 0) ? x - 1 : cellXCount - 1] + "" +
	boardVals[(y + 1 == cellYCount) ? 0 : y + 1][x] + "" +
	boardVals[(y + 1 == cellYCount) ? 0 : y + 1][(x + 1 == cellXCount) ? 0 : x + 1]);*/

	//Middle row
	var sum = boardVals[y][x];
	sum += boardVals[y][(x > 0) ? x - 1 : cellXCount - 1];
	sum += boardVals[y][(x + 1 == cellXCount) ? 0 : x + 1];
	//Top row
	sum += boardVals[(y > 0) ? y - 1 : cellYCount - 1][(x > 0) ? x - 1 : cellXCount - 1];
	sum += boardVals[(y > 0) ? y - 1 : cellYCount - 1][x];
	sum += boardVals[(y > 0) ? y - 1 : cellYCount - 1][(x + 1 == cellXCount) ? 0 : x + 1];
	//Bottom row
	sum += boardVals[(y + 1 == cellYCount) ? 0 : y + 1][(x > 0) ? x - 1 : cellXCount - 1];
	sum += boardVals[(y + 1 == cellYCount) ? 0 : y + 1][x];
	sum += boardVals[(y + 1 == cellYCount) ? 0 : y + 1][(x + 1 == cellXCount) ? 0 : x + 1];

	return sum;
}



function flipCell(cellX, cellY)
{
	drawCell(cellX, cellY, !boardVals[cellY][cellX]);
}

//Y is used first when accessing a cell this is because I use Row then column to access cells in a 2D array.
function drawCell(cellX, cellY, stat)
{
    /*if(stat){
    console.log("Drawing " + cellX + " " + cellY);
        console.log(stat + " == " + boardVals[cellX][cellY] + " == " + boardVals[cellY][cellX]);
    }*/
    
	//Accounting for the width of the edges and the weirdness at the very edges of the field
	var edgeAddX = (cellX == 0) ? 0 : 1;
	var edgeAddY = (cellY == 0) ? 0 : 1;
	var edgeSubX = (cellX == (cellXCount - 1)) ? 0 : 2;
	var edgeSubY = (cellY == (cellYCount - 1)) ? 0 : 2;

	
	boardVals[cellY][cellX] = stat;
	if(stat)
	{
		//console.log(cellX + " " + cellY + ": " + stat);
		//ctx.strokeStyle = "black";
		ctx.fillRect(cellX * cellSide + edgeAddX, cellY * cellSide + edgeAddY, cellSide - edgeSubX + !edgeAddX, cellSide - edgeSubY  + !edgeAddY);
	}
	else
	{
		//console.write(cellX + " " + cellY + ": " + stat);
		//ctx.strokeStyle = "white";
		ctx.clearRect(cellX * cellSide + edgeAddX, cellY * cellSide + edgeAddY, cellSide - edgeSubX + !edgeAddX, cellSide - edgeSubY + !edgeAddY);
	}
}

//Take a single step in execution
function step()
{
	var numAround = new Array(cellYCount)
	
	//Loop through and build the count array
	for(i = 0; i < cellYCount; i++)
	{
		numAround[i] = new Array(cellXCount);
		for(j = 0; j < cellXCount; j++)
		{
			numAround[i][j] = countNeighbors(j, i);
			//console.log(j + " " + i + ": " + numAround[i][j])
		}
	}
	
	//Use the count array to determine the new states for each cell
	for(i = 0; i < cellYCount; i++)
	{
		for(j = 0; j < cellXCount; j++)
		{

			//If 3, the cell is alive
			if(numAround[i][j] == 3)
			{
				//console.log(j + " " + i + " = " + numAround[i][j]);
				drawCell(j, i, 1);
			}
			//If four, the cell stays the same
			else if(numAround[i][j] == 4);
			//Otherwise, the cell is dead
			else
			{
				drawCell(j, i, 0);
			}
		
		}
	}
}

function runSwitch()
{
	if(!running)
	{
	    document.getElementById("startStop").childNodes[0].nodeValue = "Stop";
		running = true;
		runVar = setInterval(function(){step()}, 250);
		
	}
	
	else
	{
	    document.getElementById("startStop").childNodes[0].nodeValue = "Start";
		running = false;
		clearInterval(runVar);
	}
}

function stop()
{
	clearInterval(runVar);
}

function handleEvent(e){
//alert("Handling event");
//console.log("Handling event");
//This is boilerplate code to determine where the user clicked (I may use it in the future)
var evt = e ? e:window.event;
/*var clickX=0, clickY=0;

if ((evt.clientX || evt.clientY) &&
document.body &&
document.body.scrollLeft!=null) {
clickX = evt.clientX + document.body.scrollLeft;
clickY = evt.clientY + document.body.scrollTop;
}
if ((evt.clientX || evt.clientY) &&
document.compatMode=='CSS1Compat' && 
document.documentElement && 
document.documentElement.scrollLeft!=null) {
clickX = evt.clientX + document.documentElement.scrollLeft;
clickY = evt.clientY + document.documentElement.scrollTop;
}
if (evt.pageX || evt.pageY) {
clickX = evt.pageX;
clickY = evt.pageY;
}
*/

/*alert (evt.type.toUpperCase() + ' mouse event:'
+'\n pageX = ' + clickX
+'\n pageY = ' + clickY 
+'\n clientX = ' + evt.clientX
+'\n clientY = '  + evt.clientY 
+'\n screenX = ' + evt.screenX 
+'\n screenY = ' + evt.screenY
+'\n canvasY = ' + canvas.offsetTop
+'\n canvasX = ' + canvas.offsetLeft
)
return false;*/

var posX = evt.clientX - canvas.offsetLeft;
var posY = evt.clientY - canvas.offsetTop;

//Determine which cell the user clicked in
var cellX = Math.floor(posX / cellSide);
var cellY = Math.floor(posY / cellSide);	

//alert(cellX + " " + cellY);

//Turn the cell on or off;
flipCell(cellX, cellY);
//countNeighbors(cellX, cellY)
//alert(countNeighbors(cellX, cellY));
}

