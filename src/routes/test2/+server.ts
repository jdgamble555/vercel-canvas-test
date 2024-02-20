import { type RequestHandler } from "@sveltejs/kit";
import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';

import NotoSans from '$lib/NotoSans-Regular.ttf';

const svgImage = `
<svg
	style="height: auto; width: 100%;"
	viewBox="0 0 1600 900"
	width="1600"
	height="900"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	version="1.1"
>
	<defs>
		<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="#f97316" />
			<stop offset="100%" stop-color="#fde047" />
		</linearGradient>
	</defs>
	<rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" />
	<path
		d="M0 669L229 665L457 618L686 661L914 620L1143 673L1371 686L1600 697L1600 901L1371 901L1143 901L914 901L686 901L457 901L229 901L0 901Z"
		fill="#fde047"
	/>
	<path
		d="M0 693L229 677L457 726L686 725L914 712L1143 664L1371 691L1600 702L1600 901L1371 901L1143 901L914 901L686 901L457 901L229 901L0 901Z"
		fill="#ffc62f"
	/>
	<path
		d="M0 729L229 731L457 785L686 732L914 730L1143 722L1371 768L1600 719L1600 901L1371 901L1143 901L914 901L686 901L457 901L229 901L0 901Z"
		fill="#ffac1d"
	/>
	<path
		d="M0 796L229 786L457 774L686 799L914 774L1143 780L1371 810L1600 796L1600 901L1371 901L1143 901L914 901L686 901L457 901L229 901L0 901Z"
		fill="#fd9014"
	/>
	<rect
		x="495"
		y="335"
		width="600"
		height="200"
		fill="#0369a1"
		stroke="white"
		stroke-width="4"
		rx="30"
		ry="30"
	/>
	<text
		x="50%"
		y="54%"
		dominant-baseline="middle"
		text-anchor="middle"
		font-family="Noto Sans"
		font-size="150"
		fill="white">Follow</text>		
</svg>
`;

// 1200 x 675 - 16x9
// 1200 x 1200 - 1x1 - google feature image
// 1200 x 900 - 4x3

export const GET = (async () => {

	/* @ts-expect-error - Buffer */
	const fontData = Buffer.from(NotoSans);

	GlobalFonts.register(fontData, 'Noto Sans');

	// DejaVu Sans - works on Vercel

	console.info(GlobalFonts.families);

	const canvas = createCanvas(1200, 675);
	const ctx = canvas.getContext('2d');

	const encoder = new TextEncoder();
	const svgBuffer = encoder.encode(svgImage);

	const _svg = await loadImage(svgBuffer);

	ctx.drawImage(_svg, 0, 0);


	const buffer = canvas.toBuffer('image/png');

	return new Response(buffer, {
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': buffer.length.toString()
		}
	});

}) satisfies RequestHandler;


