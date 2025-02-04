import path from 'path';
import { __dirname } from '../path.configuration.js';

export const goView = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'resources', 'public', 'index.html'));
    } catch (error) {
        res.status(500).json({msg: "Error loading resource"});
    }
}

export const goLayerRegistration = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'resources', 'private', 'layer_registration.html'));
    } catch (error) {
        res.status(500).json({msg: "Error loading resource"});
    }
}