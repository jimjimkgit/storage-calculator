// src/StorageCalculator.js
import React, { useState } from 'react';

function StorageCalculator() {
  // State variables to manage inputs and results
  const [coresPerServer, setCoresPerServer] = useState('');
  const [numServers, setNumServers] = useState('');
  const [desktopType, setDesktopType] = useState('');
  const [baseImageSizeGB, setBaseImageSizeGB] = useState('');
  const [numDesktops, setNumDesktops] = useState('');
  const [result, setResult] = useState(null);

  // Function to handle storage calculations
  const calculateStorage = () => {
    const totalCores = parseInt(coresPerServer) * parseInt(numServers);
    const maxAllowableStorage = totalCores * 1; // 1TB per core restriction

    let calculatedStorage = 0;

    // Calculate storage based on selected desktop type
    if (desktopType === 'persistent') {
      calculatedStorage = numDesktops * (baseImageSizeGB / 1024); // Convert GB to TB
    } else if (desktopType === 'instant') {
      const goldenImageSizeTB = baseImageSizeGB / 1024;
      const replicaDiskSizeTB = goldenImageSizeTB;
      calculatedStorage = numDesktops * goldenImageSizeTB + 2 * replicaDiskSizeTB; // Simplified calculation
    }

    // Set the result with max allowable and calculated storage
    setResult({
      maxAllowableStorage,
      calculatedStorage,
      sufficientStorage: calculatedStorage <= maxAllowableStorage,
    });
  };

  // Render form inputs and display results
  return (
    <div>
      <h1>Storage Calculator for Desktops</h1>
      <input
        type="number"
        placeholder="Cores per server"
        value={coresPerServer}
        onChange={(e) => setCoresPerServer(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of servers"
        value={numServers}
        onChange={(e) => setNumServers(e.target.value)}
      />
      <select value={desktopType} onChange={(e) => setDesktopType(e.target.value)}>
        <option value="">Select Desktop Type</option>
        <option value="persistent">Persistent</option>
        <option value="instant">Instant Clones</option>
      </select>
      <input
        type="number"
        placeholder="Base Image Size (GB)"
        value={baseImageSizeGB}
        onChange={(e) => setBaseImageSizeGB(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of Desktops"
        value={numDesktops}
        onChange={(e) => setNumDesktops(e.target.value)}
      />
      <button onClick={calculateStorage}>Calculate Storage</button>

      {result && (
        <div>
          <p>Max Allowable Storage: {result.maxAllowableStorage} TB</p>
          <p>Calculated Storage: {result.calculatedStorage} TB</p>
          <p>Sufficient Storage? {result.sufficientStorage ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

export default StorageCalculator;
