import React, { useState } from 'react';
import './index.css'; // Assuming the CSS is in this file

const StorageCalculator = () => {
    const [coresPerServer, setCoresPerServer] = useState('');
    const [numServers, setNumServers] = useState('');
    const [desktopType, setDesktopType] = useState('');
    const [imageSize, setImageSize] = useState('');
    const [numDesktops, setNumDesktops] = useState('');
    const [memorySize, setMemorySize] = useState('');
    const [memoryReservation, setMemoryReservation] = useState(false);
    const [result, setResult] = useState('');

    // Function to calculate storage for a single scenario
    const calculateScenarioStorage = () => {
        const totalCores = parseInt(coresPerServer) * parseInt(numServers);
        const maxStorage = totalCores * 0.1; // 0.1TB (100GB) per core restriction

        let minStorageTB = 0;
        let halfUtilizationTB = 0;
        let maxStorageTB = 0;

        // Convert memory size from GB to TB
        const memorySizeTB = parseFloat(memorySize) / 1024;

        // Calculate additional swap storage if no memory reservation is set
        let additionalSwapStorageTB = 0;
        if (!memoryReservation) {
            additionalSwapStorageTB = parseInt(numDesktops) * memorySizeTB; // Add swap file size equal to memory size for each VM
        }

        if (desktopType === 'persistent') {
            // Persistent desktops calculation
            const calculatedStorage = parseInt(numDesktops) * (parseFloat(imageSize) / 1024); // Convert GB to TB
            minStorageTB = halfUtilizationTB = maxStorageTB = calculatedStorage + additionalSwapStorageTB;
        } else if (desktopType === 'instant') {
            // Instant Clones calculation (non-persistent)
            const goldenImageSizeTB = parseFloat(imageSize) / 1024;
            const replicaDiskSizeTB = goldenImageSizeTB;

            // Minimum Recommended: Only the replicas with minimal VM data.
            minStorageTB = (2 * replicaDiskSizeTB) + additionalSwapStorageTB; // Only replicas, minimal VM growth.

            // 50% Utilization: VMs grow to 50% of the golden image size + 2 replicas.
            halfUtilizationTB = (parseInt(numDesktops) * (0.5 * goldenImageSizeTB)) + (2 * replicaDiskSizeTB) + additionalSwapStorageTB;

            // Maximum Recommended: VMs grow to full size of the golden image + 2 replicas.
            maxStorageTB = (parseInt(numDesktops) * goldenImageSizeTB) + (2 * replicaDiskSizeTB) + additionalSwapStorageTB;
        }

        const resultMessage = `
            Min Storage: ${minStorageTB.toFixed(2)} TB,
            50% Utilization: ${halfUtilizationTB.toFixed(2)} TB,
            Max Storage: ${maxStorageTB.toFixed(2)} TB
        `;

        setResult(resultMessage);
    };

    return (
        <div className="calculator">
            <h2>Storage Calculator for Desktops</h2>
            <form>
                <div className="form-group">
                    <label>Number of Servers:</label>
                    <input
                        type="number"
                        value={numServers}
                        onChange={(e) => setNumServers(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Cores per Server:</label>
                    <input
                        type="number"
                        value={coresPerServer}
                        onChange={(e) => setCoresPerServer(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Desktop Type:</label>
                    <select value={desktopType} onChange={(e) => setDesktopType(e.target.value)}>
                        <option value="">Select Desktop Type</option>
                        <option value="persistent">Persistent</option>
                        <option value="instant">Instant Clones</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Image Size (GB):</label>
                    <input
                        type="number"
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Number of Desktops:</label>
                    <input
                        type="number"
                        value={numDesktops}
                        onChange={(e) => setNumDesktops(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Memory Assigned per Desktop (GB):</label>
                    <input
                        type="number"
                        value={memorySize}
                        onChange={(e) => setMemorySize(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={memoryReservation}
                            onChange={(e) => setMemoryReservation(e.target.checked)}
                        />
                        Memory Reservation Set
                    </label>
                </div>

                <button type="button" className="calculate-btn" onClick={calculateScenarioStorage}>
                    Calculate
                </button>
            </form>

            {result && <div className="result">{result}</div>}
        </div>
    );
};

export default StorageCalculator;
