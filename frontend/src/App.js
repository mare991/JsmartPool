import { useState, useEffect } from 'react';
import api from './services/api';
import MonitorTab from './components/MonitorTab';
import AdvancedTab from './components/AdvancedTab';
import NavigationBar from './components/NavigationBar';
import JSmartPoolLogo from './JSmartPoolLogo';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('monitor');
  const [temp, setTemp] = useState(20.0); // Current temperature from Tmer
  const [phLevel, setPhLevel] = useState(23.0); // pH value from pHmer
  const [targetTemp, setTargetTemp] = useState(20.0); // Target temperature from Tzad
  const [animatedCurrentTemp, setAnimatedCurrentTemp] = useState(20.0); // Persist across tab switches
  const [orpValue, setOrpValue] = useState(2000); // ORP value from orp (default matches API)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from Flask backend every 2.5 seconds
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      
      try {
        const response = await api.get('/api/jsmartPoolData');
        
        // Map API response fields to state
        // Tmer = current temperature, Tzad = target temperature, pHmer = pH value, orp = ORP value
        if (response.Tmer !== null && response.Tmer !== undefined) {
          setTemp(response.Tmer); // Update the actual measured temp (Tmer) from API
          // Don't reset animatedCurrentTemp here - let animation follow Tmer smoothly
        }
        if (response.Tzad !== null && response.Tzad !== undefined) {
          setTargetTemp(response.Tzad);
        }
        if (response.pHmer !== null && response.pHmer !== undefined) {
          setPhLevel(response.pHmer);
        }
        if (response.orp !== null && response.orp !== undefined) {
          setOrpValue(Number(response.orp)); // Ensure it's a number
          console.log('ORP value updated:', response.orp);
        }
        
        console.log('=== Data fetched from backend ===');
        console.log('Full response:', response);
        console.log('Tmer (Current Temp):', response.Tmer);
        console.log('Tzad (Target Temp):', response.Tzad);
        console.log('pHmer (pH Level):', response.pHmer);
        console.log('orp (ORP Value):', response.orp);
        console.log('===================================');
      } catch (err) {
        console.error('Error fetching data from backend:', err);
        setError('Failed to connect to backend. Make sure Flask server is running.');
      }
    };

    // Fetch immediately on mount
    fetchData();
    setLoading(false);

    // Set up polling every 2.5 seconds
    const interval = setInterval(fetchData, 2500);
    
    return () => clearInterval(interval);
  }, []);

  const handleTempChange = async (newTemp) => {
    // Only update target temp immediately - current temp will animate
    setTargetTemp(newTemp);
    
    // Send target temperature update to Flask backend using jsmartPoolUpdate endpoint
    try {
      await api.post('/api/jsmartPoolUpdate', {
        Tzad: newTemp
      });
      console.log('Target temperature sent to backend:', newTemp);
    } catch (err) {
      console.error('Error sending data to backend:', err);
      setError('Failed to send data to backend');
    }
  };

  // Animate current temperature to smoothly follow Tmer (actual measured temp from API)
  // The displayed current temperature should reflect Tmer, animated smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCurrentTemp(prev => {
        const measuredTemp = temp; // Tmer from API - this is the actual current temperature we want to display
        
        const diff = measuredTemp - prev;
        const absDiff = Math.abs(diff);
        
        // If we're close enough (within 0.1 degrees), set to measured temp exactly
        if (absDiff < 0.1) {
          return measuredTemp;
        }
        
        // Step size for smooth animation
        const stepSize = 0.15;
        const newValue = prev + (diff > 0 ? stepSize : -stepSize);
        
        // Check if we've reached or passed the measured temp
        if ((diff > 0 && newValue >= measuredTemp) || (diff < 0 && newValue <= measuredTemp)) {
          return measuredTemp;
        }
        
        // Round to 1 decimal place
        return Math.round(newValue * 10) / 10;
      });
    }, 100); // Update every 100ms
    
    return () => clearInterval(interval);
  }, [temp]); // Only depend on temp (Tmer) - animate to follow the actual measured temperature

  return (
    <div className="App">
      <JSmartPoolLogo />
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'monitor' && (
        <MonitorTab 
          temp={temp}
          targetTemp={targetTemp}
          phLevel={phLevel}
          orpValue={orpValue}
          animatedCurrentTemp={animatedCurrentTemp}
          setAnimatedCurrentTemp={setAnimatedCurrentTemp}
          onTempChange={handleTempChange}
        />
      )}
      
      {activeTab === 'advanced' && (
        <AdvancedTab 
          temp={animatedCurrentTemp}
          phLevel={phLevel}
          orpValue={orpValue}
        />
      )}
    </div>
  );
}

export default App;
