import p5 from "p5";
import React from "react";
import Sketch from "react-p5";

//https://codesandbox.io/s/9ixi4

var allBlocks = [];
var width = 0;
var height = 0;
var currColor = 0;
const gridSize = 8;
var diameter;


var hue = 0;
var saturation = 0;
var value = 0;
var gameBoard = [];
var currBlock;
var firstGame = true;
var cnv;

function getRandomInt(max) {
	return Math.floor(Math.random() * (max));
}



//Makes a new block for the user and stores the previous block into memory 
function makeNewBlock(p5) {
	//return () => {
		// generates a random color
		hue = getRandomInt(255);
		saturation = getRandomInt(255);
		value = getRandomInt(255);

		currColor = generateRandomColor(p5);
		p5.fill(currColor)

		//generates a random starting position for the block
		let startingXPos = diameter * Math.round(getRandomInt(gridSize - 4));
		let yPos = 0;

		currBlock = {}
		var coordArr = [];



		width = Math.round(getRandomInt(2)) + 1;
		height = Math.round(getRandomInt(3)) + 1;
		
		

		//generates a block by randomly choosing the amount of rectangles it will have
		for (let j = 0; j < height; j++) {
			let xPos = startingXPos;
			for (let i = 0; i < width; i++) {

				var singeBlock = {};
				singeBlock["xPos"] = xPos;
				singeBlock["yPos"] = yPos;

				p5.rect(xPos, yPos, diameter, diameter)
				xPos += diameter;

				coordArr.push(singeBlock);
			}
			yPos += diameter;
		}
		currBlock['blocks'] = coordArr;
		currBlock['color'] = currColor;
	//}
}

function gameBoardUpdater(p5) {
	
		// checks if our current block is going to stack on any previous blocks
		let b = currBlock.blocks
		for (let z = 0; z < b.length; z++) {
			let y = Math.round(b[z].yPos / diameter) - 1
			let x = Math.round(b[z].xPos / diameter)

			if (y == gridSize - 1 || gameBoard[y + 1][x]) {

				for (let j = 0; j < b.length; j++) {
					let y2 = Math.round(b[j].yPos / diameter) - 1
					let x2 = Math.round(b[j].xPos / diameter)

					if (y2 == gridSize - 1) {
						y--;
					}
					if (x2 == gridSize - 1) {
						x--;
					}
					gameBoard[y2][x2] = true;

				}

				for (let i = 0; i < currBlock.length; i++) {
					p5.rect(currBlock[i].xPos, currBlock[i].yPos + diameter, diameter, diameter)
				}

				allBlocks.push(currBlock)
				let blocks = currBlock.blocks
				makeNewBlock(p5);
				break
			}
		}

}





// used in the draw function to continously draw the game board
function drawGameBoard(p5) {

	p5.stroke(5);
	p5.fill('gray')
	let y = 0;
	for (var i = 0; i < gridSize; i++) {
		let x = 0;
		for (var j = 0; j < gridSize; j++) {
			p5.square(x, y, diameter);
			x += diameter;
		}
		y += diameter;
	}
}

function drawAllBlocks(p5) {
	for (let i = 0; i < allBlocks.length; i++) {
		let blockItr = allBlocks[i];

		let coords = blockItr.blocks

		p5.fill(blockItr.color)
		for (let j = 0; j < coords.length; j++) {
			if (firstGame) {
				p5.rect(coords[j].xPos, coords[j].yPos - diameter, diameter, diameter)
			} else {
				p5.rect(coords[j].xPos, coords[j].yPos, diameter, diameter)
			}

		}
	}
}

//function to generate the 2d array representation of the gameboard
function generateGameboard() {
	gameBoard = new Array(gridSize);
	for (var i = 0; i < gameBoard.length; i++) {
		gameBoard[i] = [];
	}
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			gameBoard[i][j] = false;
		}
		console.log(i)
	}
	return gameBoard;
}

// prints out a string representation of the 2d array gameboard
function gameBoardToString(gameBoard) {
	for (var i = 0; i < gameBoard.length; i++) {
		for (var j = 0; j < gameBoard.length; j++) {
			console.log(gameBoard[i][j] + " ");
		}
		console.log("\n");
	}
}

// shifts the current block along the x-axis depending on user input
function shiftCurrBlock(p5, shiftX) {

	let blockStartX = currBlock.blocks[0].xPos / diameter
	let blockEndX = currBlock.blocks[currBlock.blocks.length - 1].xPos / diameter
	let bottomY = currBlock.blocks[currBlock.blocks.length - 1].yPos / diameter

	if (((blockStartX != 0 && shiftX == -1) ||  
		(blockEndX != gridSize - 1  && shiftX == 1)) &&
		(!gameBoard[bottomY][blockEndX + 1]) &&
		(!gameBoard[bottomY][blockStartX - 1]))
		 {

		drawGameBoard(p5);
		p5.frameRate(5)
		let blocks = currBlock.blocks

		for (var i = 0; i < blocks.length; i++) {

			blocks[i].xPos += diameter * shiftX
			p5.rect(blocks[i].xPos, blocks[i].yPos, diameter, diameter)


		}
	}
}

function generateRandomColor(p5) {
	let h = Math.ceil(Math.random() * 255)
	let v = Math.ceil(Math.random() * 255)
	let s = Math.ceil(Math.random() * 255)
	return p5.color(h, s, v)
}


function startNewGame(p5) {
	for (let j = 0; j < gridSize - 1; j++) {
		if (gameBoard[0][j]) {
			currBlock = {};
			allBlocks = [];
			firstGame = false;
			for (let i = 0; i < gridSize - 1; i++) {
				for (let z = 0; z < gridSize - 1; z++) {
					gameBoard[i][z] = false
				}
			}
			drawGameBoard(p5)
			makeNewBlock(p5)
			console.log(allBlocks)
			console.log(gameBoard)

		}
	}
}


export default (props) => {



	

	const setup = (p5, canvasParentRef) => {
		cnv = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
		
	

		gameBoard = generateGameboard();
		hue = getRandomInt(255);
		saturation = getRandomInt(255);
		value = getRandomInt(255);
		currColor = generateRandomColor(p5)
		diameter = Math.min(p5.windowWidth, p5.windowHeight) / gridSize;

       
		console.log(allBlocks)
		console.log(gameBoard)

		drawGameBoard(p5);
		makeNewBlock(p5);
	

	}
	

	const draw = (p5) => {


		startNewGame(p5);

        p5.keyPressed = (event) => {
			if (p5.keyCode == 39) {
				shiftCurrBlock(p5, 1)
			} else if (p5.keyCode == 37) {
				shiftCurrBlock(p5, -1)
			}
        };


		p5.frameRate(1)
		drawGameBoard(p5);

		//creates the block the player is currently controlling and continuosly shifts it down
		let blocks = currBlock.blocks
		p5.fill(currColor);
		for (let i = 0; i < blocks.length; i++) {
			p5.rect(blocks[i].xPos, blocks[i].yPos, diameter, diameter)
			blocks[i].yPos += diameter
		}

		drawAllBlocks(p5);
		gameBoardUpdater(p5);

	}
	return <Sketch setup={setup} draw={draw} />;
};