import path from "path";
import { promises as fs } from 'fs';
import { __dirname } from "../path.configuration.js";

export function generateLayerIdentifier() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureDirectoryExists(directory) {
    await fs.mkdir(directory, { recursive: true });
}

export async function saveLayerFiles(layerFile, styleFile, visibility) {
    try {
        let layerDestination;
        let styleDestination;

        if (layerFile) {
            layerDestination = path.join(__dirname, 'resources', visibility, 'geojsons', layerFile.originalname);

            await ensureDirectoryExists(path.dirname(layerDestination));

            await fs.writeFile(layerDestination, layerFile.buffer);
        }

        if (styleFile) {
            styleDestination = path.join(__dirname, 'resources', visibility, 'geojsons', styleFile.originalname);

            await ensureDirectoryExists(path.dirname(styleDestination));

            await fs.writeFile(styleDestination, styleFile.buffer);
        }
    } catch (error) {
        return false;
    }

    return true;
}

export async function updateLayerFiles(layerFile, styleFile, visibility) {
    try {

        const layerDestination = path.join(__dirname, 'resources', visibility, 'geojsons', layerFile.originalname);

        await ensureDirectoryExists(path.dirname(layerDestination));

        await fs.writeFile(layerDestination, layerFile.buffer);

        const styleDestination = path.join(__dirname, 'resources', visibility, 'geojsons', styleFile.originalname);

        await ensureDirectoryExists(path.dirname(styleDestination));

        await fs.writeFile(styleDestination, styleFile.buffer);
    } catch (error) {
        return false;
    }

    return true;
}

export async function deleteLayerFiles(identifier, visibility) {
    try {
        const layerDestination = path.join(__dirname, 'resources', visibility, 'geojsons', `${identifier}_layer.geojson`);
        const styleDestination = path.join(__dirname, 'resources', visibility, 'geojsons', `${identifier}_styles.json`);

        await fs.unlink(layerDestination);
        await fs.unlink(styleDestination);
    } catch (error) {
        return false;
    }

    return true;
}