'use strict';

// @author Giacomo F.M.
// @since 2021-05-26

const pixel_dimension = 8;
var canvas, grid_x_dimension, grid_y_dimension, grid = [];

function reset() {
	canvas = document.getElementById('grid');
	canvas.addEventListener('click', event => mouseClickEvent(event));
	canvas.addEventListener('dblclick', event => mouseDblClickEvent(event));
	canvas.width = document.getElementById('body').clientWidth;
	canvas.height = document.getElementById('body').clientHeight;

	grid_x_dimension = canvas.width / pixel_dimension;
	grid_y_dimension = canvas.height / pixel_dimension;

console.log(`Canvas X: ${canvas.width}, Canvas Y: ${canvas.height}`);
console.log(`Grid X: ${grid_x_dimension}, Grid Y: ${grid_y_dimension}`);

	for (let y = 0; y < grid_y_dimension; y++) {
		grid[y] = [];
		for (let x = 0; x < grid_x_dimension; x++) {
			grid[y][x] = 0;
		}
	}
}

function draw() {
	if (canvas.getContext) {
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = '#eee';
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x]) {
					ctx.fillRect(x * pixel_dimension, y * pixel_dimension, pixel_dimension, pixel_dimension);
				} else {
					ctx.clearRect(x * pixel_dimension, y * pixel_dimension, pixel_dimension, pixel_dimension);
				}
			}
		}
	}
}

function calc() {

	function countLivelyLeftRightNeighbours(gridY, x) {
		let n = 0;
		if (x - 1 > -1)
			n += gridY[x - 1];
		if (x + 1 < gridY.length)
			n += gridY[x + 1];
		return n;
	}

	function countLivelyNeighbours(x, y) {
		let n = 0;

		if (y - 1 > -1) { // upstairs neighbors
			n += countLivelyLeftRightNeighbours(grid[y - 1], x);
			n += grid[y - 1][x];
		}

		n += countLivelyLeftRightNeighbours(grid[y], x); // neighbors

		if (y + 1 < grid.length) { // downstairs neighbors
			n += countLivelyLeftRightNeighbours(grid[y + 1], x);
			n += grid[y + 1][x];
		}

		return n;
	}

	function copy(src) {
		let tmp = [];
		for (let y = 0; y < src.length; y++) {
			tmp[y] = [];
			for (let x = 0; x < src[y].length; x++) {
				tmp[y][x] = src[y][x];
			}
		}
		return tmp;
	}

	let tmp = copy(grid);
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {

			let ln = countLivelyNeighbours(x, y);

			if (grid[y][x]) {

				if (ln < 2) // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
					tmp[y][x] = 0;

				// 2. Any live cell with two or three live neighbours lives on to the next generation.

				if (ln > 3) // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
					tmp[y][x] = 0;

			} else {

				if (ln == 3) // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					tmp[y][x] = 1;
			}
		}
	}
	grid = tmp;

}

/* play */

setTimeout(function () {
	reset();

	grid[10][1] = 1;
	grid[10][4] = 1;

	grid[11][5] = 1;

	grid[12][1] = 1;
	grid[12][5] = 1;

	grid[13][2] = 1;
	grid[13][3] = 1;
	grid[13][4] = 1;
	grid[13][5] = 1;

	drawFlower();

	setInterval(function(){
		draw();
		calc();
	}, 100);

}, 500);

// */

// ~ EXTRA
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function random() {
	for (var i = document.getElementById('rndNum').value; i >= 0; i--) {
		grid[getRandomInt(grid.length)][getRandomInt(grid[grid.length - 1].length)] = 1;
	}
}

function mouseClickEvent(event) {
	grid[Math.floor(event.y / pixel_dimension)][Math.floor(event.x / pixel_dimension)] = 1;
}

function mouseDblClickEvent(event) {
	let cy = Math.floor(event.y / pixel_dimension);
	let cx = Math.floor(event.x / pixel_dimension);
	grid[cy][cx - 1] = 1;
	grid[cy][cx + 1] = 1;
}

function drawFlower() {
	let fY = Math.floor(grid_y_dimension / 2);
	let fX = Math.floor(grid_x_dimension / 2);
	grid[fY][fX + 1] = 1;
	grid[fY + 1][fX] = 1;
	grid[fY + 1][fX + 2] = 1;
	grid[fY + 2][fX] = 1;
	grid[fY + 2][fX + 2] = 1;
	grid[fY + 3][fX + 1] = 1;
}
