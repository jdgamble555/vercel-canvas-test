import { type RequestHandler } from "@sveltejs/kit";
import { createCanvas, type SKRSContext2D } from '@napi-rs/canvas';

export const GET = (async ({ url }) => {

    const title = url.searchParams.get('title') || 'Some text here';
    const username = url.searchParams.get('username') || 'elonmusk';

    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');

    // Set the style for the title
    ctx.font = "bold 108px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";

    const maxWidth: number = 800; // Max width of the text block
    const lineHeight: number = 135; // Line height
    const x: number = canvas.width / 2;
    const y: number = 180; // Initial y position

    wrapText(ctx, title, x, y, maxWidth, lineHeight);


    ctx.fillStyle = '#0369a1';
    //ctx.fillRect(0, 0, canvas.width, 40);

    const borderWidth = 40; // Width of the border
    ctx.fillRect(0, 0, borderWidth, canvas.height); // Left border
    //ctx.fillRect(canvas.width - borderWidth, 0, borderWidth, canvas.height); // Right border

    ctx.font = "bold 40px Arial";

    const customText1 = "</>";
    const customText2 = " Code.Build";

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

