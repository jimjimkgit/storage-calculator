import React, { useState } from 'react';

function App() {
  // State to hold inputs and scenarios
  const [coresPerServer, setCoresPerServer] = useState('');
  const [numServers, setNumServers] = useState('');
  const [desktopType, setDesktopType] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [numDesktops, setNumDesktops] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [totalStorageRequired, setTotalStorageRequired] = useState(0);
  const [maxAllowableStorage, setMaxAllowableStorage] = useState(0);

  // Function to calculate storage for a single scenario
  const calculateScenarioStorage = () => {
    const totalCores = parseInt(coresPerServer) * parseInt(numServers);
    const maxStorage = totalCores; // 1TB per core restriction

    let calculatedStorage = 0;

    if (desktopType === 'persistent') {
      calculatedStorage = parseInt(numDesktops) * (parseFloat(imageSize) / 1024); // Convert GB to TB
    } else if (desktopType === 'instant') {
      const goldenImageSizeTB = parseFloat(imageSize) / 1024;
      const replicaDiskSizeTB = goldenImageSizeTB;
      calculatedStorage = parseInt(numDesktops) * goldenImageSizeTB + 2 * replicaDiskSizeTB;
    }

    // Add the scenario to the scenarios list
    const newScenario = {
      type: desktopType,
      calculatedStorage,
    };

    setScenarios([...scenarios, newScenario]);
    setTotalStorageRequired(totalStorageRequired + calculatedStorage);
    setMaxAllowableStorage(maxStorage);
    clearInputs();
  };

  // Function to clear inputs after adding a scenario
  const clearInputs = () => {
    setDesktopType('');
    setImageSize('');
    setNumDesktops('');
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
      <button onClick={calculateScenarioStorage} style={{ marginTop: '10px' }}>
        Add Scenario
      </button>

      {/* Display all added scenarios */}
      <h2>Added Scenarios</h2>
      {scenarios.map((scenario, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <p>Scenario {index + 1} - {scenario.type}:</p>
          <p>Calculated Storage: {scenario.calculatedStorage.toFixed(2)} TB</p>
        </div>
      ))}

      {/* Display final results */}
      <div style={{ marginTop: '20px' }}>
        <h2>Final Calculation Results for All Scenarios</h2>
        <p>Total Storage Required: {totalStorageRequired.toFixed(2)} TB</p>
        <p>Max Allowable Storage: {maxAllowableStorage} TB</p>
        <p>
          Sufficient Storage Overall?{' '}
          {totalStorageRequired <= maxAllowableStorage ? 'Yes' : 'No'}
        </p>
      </div>
    </div>
  );
}

export default App;
