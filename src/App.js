import React, { useState } from 'react';

function App() {
  // State to hold inputs and scenarios
  const [coresPerServer, setCoresPerServer] = useState('');
  const [numServers, setNumServers] = useState('');
  const [desktopType, setDesktopType] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [numDesktops, setNumDesktops] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [memoryReservation, setMemoryReservation] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [totalStorageRequired, setTotalStorageRequired] = useState(0);
  const [maxAllowableStorage, setMaxAllowableStorage] = useState(0);

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

    // Add the scenario to the scenarios list with all three calculations
    const newScenario = {
      type: desktopType,
      minStorageTB,
      halfUtilizationTB,
      maxStorageTB,
    };

    setScenarios([...scenarios, newScenario]);
    setTotalStorageRequired(totalStorageRequired + maxStorageTB); // Use maxStorageTB for total required storage tally
    setMaxAllowableStorage(maxStorage); // Updated based on 100GB per core calculation
    clearInputs();
  };

  // Function to clear inputs after adding a scenario
  const clearInputs = () => {
    setDesktopType('');
    setImageSize('');
    setNumDesktops('');
    setMemorySize('');
    setMemoryReservation(false);
  };

  // Function to reset the calculator to its initial state
  const resetCalculator = () => {
    setCoresPerServer('');
    setNumServers('');
    setDesktopType('');
    setImageSize('');
    setNumDesktops('');
    setMemorySize('');
    setMemoryReservation(false);
    setScenarios([]);
    setTotalStorageRequired(0);
    setMaxAllowableStorage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Storage Calculator for Desktops</h1>
      <input
        type="number"
        placeholder="Cores per server"
        value={coresPerServer}
        onChange={(e) => setCoresPerServer(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="number"
        placeholder="Number of servers"
        value={numServers}
        onChange={(e) => setNumServers(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <select
        value={desktopType}
        onChange={(e) => setDesktopType(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      >
        <option value="">Select Desktop Type</option>
        <option value="persistent">Persistent</option>
        <option value="instant">Instant Clones</option>
      </select>
      <input
        type="number"
        placeholder="Image Size (GB)"
        value={imageSize}
        onChange={(e) => setImageSize(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="number"
        placeholder="Number of Desktops"
        value={numDesktops}
        onChange={(e) => setNumDesktops(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="number"
        placeholder="Memory Assigned per Desktop (GB)"
        value={memorySize}
        onChange={(e) => setMemorySize(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <label style={{ display: 'block', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={memoryReservation}
          onChange={(e) => setMemoryReservation(e.target.checked)}
        />
        Memory Reservation Set
      </label>
      <button onClick={calculateScenarioStorage} style={{ marginTop: '10px', marginRight: '10px' }}>
        Add Scenario
      </button>
      <button onClick={resetCalculator} style={{ marginTop: '10px' }}>
        Reset Calculator
      </button>

      {/* Display all added scenarios */}
      <h2>Added Scenarios</h2>
      {scenarios.map((scenario, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <p>
            Scenario {index + 1} - {scenario.type}:
          </p>
          <p>Minimum Recommended Storage: {scenario.minStorageTB.toFixed(2)} TB</p>
          <p>50% Utilization Storage: {scenario.halfUtilizationTB.toFixed(2)} TB</p>
          <p>Maximum Recommended Storage: {scenario.maxStorageTB.toFixed(2)} TB</p>
        </div>
      ))}

      {/* Display final results */}
      <div style={{ marginTop: '20px' }}>
        <h2>Final Calculation Results for All Scenarios</h2>
        <p>Total Storage Required: {totalStorageRequired.toFixed(2)} TB</p>
        <p>Max Allowable Storage: {maxAllowableStorage.toFixed(2)} TB</p>
        <p>
          Sufficient Storage Overall?{' '}
          {totalStorageRequired <= maxAllowableStorage ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
}

export default App;
