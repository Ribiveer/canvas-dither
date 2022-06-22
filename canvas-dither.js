/*
---------------- Dithered Canvas Background script, originally from https://ribiveer.com/ ----------------
Copyright (c) 2022 Ribiveer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

{
	let col1 = {r:0,g:0,b:0};
	let col2 = {r:255, g:255, b:255};

	let bayerMatrix = [
		00,32,08,40,02,34,10,42,
		48,16,56,24,50,18,58,26,
		12,44,04,36,14,46,06,38,
		60,28,52,20,62,30,54,22,
		03,35,11,43,01,33,09,41,
		51,19,59,27,49,17,57,25,
		15,47,07,39,13,45,05,37,
		63,31,55,23,61,29,53,21
	];

	let c = document.getElementById("dithered-background");
	let ctx = c.getContext('2d');

	let backgroundData = [];
	backgroundData.height = 0;

	function updateBackground()
	{
		c.width = window.innerWidth;
		if(backgroundData.height != window.innerHeight)
		{
			c.height = window.innerHeight;
			backgroundData = ctx.createImageData(8, c.height);
			for(let y = 0; y < c.height; y++)
			{
				let heightPercentage = y / c.height * 63;
				for(let x = 0; x < backgroundData.width; x++)
				{
					let threshold = bayerMatrix[y%8*8+x%8];
					let letThrough = heightPercentage < threshold;
					let pixelIndex = (y * backgroundData.width + x) * 4;
					backgroundData.data[pixelIndex+0] = letThrough?col1.r:col2.r;
					backgroundData.data[pixelIndex+1] = letThrough?col1.g:col2.g;
					backgroundData.data[pixelIndex+2] = letThrough?col1.b:col2.b;
					backgroundData.data[pixelIndex+3] = 255;
				}
			}
		}
		for(let i = 0; i < c.width / backgroundData.width; i++)
			ctx.putImageData(backgroundData, i*backgroundData.width, 0);
	}

	updateBackground();
	window.addEventListener('resize', updateBackground, true);
}