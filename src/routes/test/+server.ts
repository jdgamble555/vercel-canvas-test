import { type RequestHandler } from "@sveltejs/kit";
import { createCanvas, type SKRSContext2D } from '@napi-rs/canvas';

export const GET = (async ({ url }) => {

    const title = url.searchParams.get('title') || 'Building a Scalable Follower Feed with Firestore';
    const username = url.searchParams.get('username') || 'elonmusk';

    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');

    // Set the style for the title
    ctx.font = "bold 132px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    // default 2 lines
    const maxWidth = 800; // Max width of the text block
    const lineHeight = 135; // Line height
    const x = canvas.width / 2 + 36;
    let y = 264; // Initial y position

    const lines = numLines(ctx, title, maxWidth);

    //console.log(lines)

    if (lines === 1) {
        ctx.font = "bold 150px Arial";
        y = 360;
    } else if (lines === 3) {
        ctx.font = "bold 108px Arial";
        y = 216;
    } else if (lines > 4) {
        ctx.font = "bold 84 Arial";
        y = 184;
    }

    wrapText(ctx, title, x, y, maxWidth, lineHeight);

    ctx.fillStyle = '#0369a1';
    const borderWidth = 40; // Width of the border
    ctx.fillRect(0, 0, borderWidth, canvas.height); // Left border

    ctx.font = "bold 40px Arial";
    const customText1 = "</>  ";
    const customText2 = "Code.Build";

    // Measure the width of each part of the text
    const customText1Width = ctx.measureText(customText1).width;
    const customText2Width = ctx.measureText(customText2).width;

    // Define the border width or padding from the right edge
    const paddingRight = 120; // Adjust this value as needed

    // Calculate the total width of both text segments and the center position for the combined text
    const totalWidth = customText1Width + customText2Width;
    const centerOfText = canvas.width - paddingRight - totalWidth / 2;

    // Calculate the starting X positions for each part of the text
    const textX1 = centerOfText - customText2Width / 2;
    const textX2 = centerOfText + customText1Width / 2;
    const textY = canvas.height - 40; // Position from bottom

    // Draw the first part (</>) in black
    ctx.fillStyle = "#000000"; // Black color for '</>'
    ctx.fillText(customText1, textX1, textY);

    // Draw the second part (Code.Build) in blue
    ctx.fillStyle = "#0369a1"; // Original color for 'Code.Build'
    ctx.fillText(customText2, textX2, textY);


    const customText3 = "@" + username;
    ctx.font = "bold 40px Arial"; // Font style for custom text
    ctx.fillStyle = "black"; // Text color
    const textX3 = 250; // Position from right
    const textY3 = canvas.height - 40; // Position from bottom
    ctx.fillText(customText3, textX3, textY3);

    const buffer = canvas.toBuffer('image/png');

    return new Response(buffer, {
        headers: {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length.toString()
        }
    });

}) satisfies RequestHandler;


function wrapText(context: SKRSContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words: string[] = text.split(' ');
    let line: string = '';

    for (const word of words) {
        const testLine: string = line + word + ' ';
        const metrics: TextMetrics = context.measureText(testLine);
        const testWidth: number = metrics.width;

        if (testWidth > maxWidth && line !== '') {
            context.fillText(line, x, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y); // Draw the last line
}

function numLines(context: SKRSContext2D, text: string, maxWidth: number): number {
    const words: string[] = text.split(' ');
    let line: string = '';
    let lineCount: number = 1;

    for (const word of words) {
        const testLine: string = line + word + ' ';
        const metrics: TextMetrics = context.measureText(testLine);
        const testWidth: number = metrics.width;

        if (testWidth > maxWidth && line !== '') {
            line = word + ' ';
            lineCount++;
        } else {
            line = testLine;
        }
    }
    return lineCount;
}


