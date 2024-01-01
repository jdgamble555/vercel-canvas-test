import { type RequestHandler } from "@sveltejs/kit";
import { createCanvas, registerFont } from 'canvas';

//import arialFont from '@canvas-fonts/arial';

registerFont('./static/Arial.ttf', { family: "Arial " });

export const GET = (async () => {

    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Set the style for the title
    ctx.font = "72px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("Code.Build" + (Math.random() + 1).toString(36).substring(7), canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, canvas.width, 40);


    // Draw a black border around the canvas
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

    const buffer = canvas.toBuffer('image/png');

    return new Response(buffer, {
        headers: {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length.toString()
        }
    });

}) satisfies RequestHandler;