import path from 'path';
import sharp from 'sharp';

const sizes = {
    mobile: {
        xs: 100,
        s: 250,
        m: 320,
        l: 480,
        xl: 640
    },
    desktop: {
        xs: 200,
        s: 400,
        m: 786,
        l: 1200,
        xl: 1920
    }
};

const storage = path.join(process.cwd(), "static", "images");

export async function processImage(buffer, filename) {
    try {

        const meta = await sharp(buffer).metadata();
        const orientation = meta.width >= meta.height ? 'landscape' : 'portrait';
        for (const [label, size] of Object.entries(sizes.mobile)) {
            const output = path.join(storage, `${filename}-mobile-${label}.webp`);
            const transformer = sharp(buffer).toFormat('webp', { quality: 100 });
            if (orientation === 'landscape') transformer.resize({ width: size })
            if (orientation === 'portrait') transformer.resize({ height: size })
            await transformer.toFile(output);
        }
        for (const [label, size] of Object.entries(sizes.desktop)) {
            const output = path.join(storage, `${filename}-desktop-${label}.webp`);
            const transformer = sharp(buffer).toFormat('webp', { quality: 100 });
            if (orientation === 'landscape') transformer.resize({ width: size })
            if (orientation === 'portrait') transformer.resize({ height: size })
            await transformer.toFile(output);
        }
        return true;
    } catch (error) {
        console.error("Error processing image:", error);
        return false;
    }
}

