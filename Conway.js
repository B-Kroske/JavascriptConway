
//The gameboard
var boardVals;

var cellSide = 20;
var cellMid = cellSide / 2;

var canvas;
var ctx;

//Draw the lines to divide the canvas into squares
function initCanvas()
{
	canvas = document.getElementById("board");
	
	if(canvas.getContext) {
		ctx = canvas.getContext("2d");
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
		
		var cellXCount = canvas.width / cellSide;
		var cellYCount = canvas.height / cellSide;
		boardVals = new Array(cellXCount);
		
		for(i = 0; i < cellXCount; i++)
		{
			boardVals[i] = new Array(cellYCount);

			for(j = 0; j < cellYCount; j++)
			{
				boardVals[i][j] = 0;
			}	
		}
		
		alert(boardVals[0][7]);
	}
	
	
}

function clearCanvas()
{
	var canvas = document.getElementById("board");
	
	if(canvas.getContext) {
		var ctx = canvas.getContext("2d");
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
		
		//Draw vertical lines
		for(i = cellSide; i < width; i += cellSide)
		{
			ctx.moveTo(i, 0);
			ctx.lineTo(i, height);
		}
		ctx.stroke();
		ctx.closePath();
	}
}

function handleEvent(e){

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
	
	
	
	boardVals[cellX][cellY] = (boardVals[cellX][cellY] == 0) ? 1 : 0;
	if(boardVals[cellX][cellY])
	{
		//ctx.strokeStyle = "black";
		ctx.fillRect(cellX * cellSide + 1, cellY * cellSide + 1, cellSide - 2, cellSide - 2);
	}
	else
	{
		//ctx.strokeStyle = "white";
		ctx.clearRect(cellX * cellSide + 1, cellY * cellSide + 1, cellSide - 2, cellSide - 2);
	}
	/*alert("cellX = " + Math.floor(cellX) +
		  "\ncellY = " + Math.floor(cellY) + 
		  "\nValue = " + boardVals[cellX][cellY]);
	*/
	/*alert (evt.type.toUpperCase() + ' mouse event:'
	+'\n canvasX = ' + posX
	+'\n canvasY = ' + posY 
	+'\n clientX = ' + evt.clientX
	+'\n clientY = '  + evt.clientY 
	+'\n canvasY = ' + canvas.offsetTop
	+'\n canvasX = ' + canvas.offsetLeft
	)*/
}