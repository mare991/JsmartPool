import { useState, useEffect } from 'react';
import AirGauge from './AirGauge';
import api from './services/api';

function App() {
  const [temp, setTemp] = useState(28);
  const [phLevel, setPhLevel] = useState(6.89);
  const [selectedPoolType, setSelectedPoolType] = useState('recreational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data from Flask backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/api/jsmartpoolData');
        
        // Update state if data is available
        if (response.temperature !== null && response.temperature !== undefined) {
          setTemp(response.temperature);
        }
        if (response.ph !== null && response.ph !== undefined) {
          setPhLevel(response.ph);
        }
        
        // If backend has null values, initialize with current frontend defaults
        if (response.temperature === null || response.ph === null) {
          await api.post('/api/jsmartpoolData', {
            temperature: temp,
            ph: phLevel
          });
          console.log('Initialized backend with default values');
        }
        
        console.log('Data fetched from backend:', response);
      } catch (err) {
        console.error('Error fetching data from backend:', err);
        setError('Failed to connect to backend. Make sure Flask server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePoolTypeChange = (poolType) => {
    setSelectedPoolType(poolType);
    // Optionally send update to backend:
    // api.post('/api/update-pool-type', { poolType });
  };

  const handleTempChange = async (newTemp) => {
    setTemp(newTemp);
    
    // Send temperature and pH data to Flask backend
    try {
      await api.post('/api/jsmartpoolData', {
        temperature: newTemp,
        ph: phLevel
      });
      console.log('Data sent to backend:', { temperature: newTemp, ph: phLevel });
    } catch (err) {
      console.error('Error sending data to backend:', err);
      setError('Failed to send data to backend');
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      <AirGauge 
        temp={temp} 
        phLevel={phLevel}
        selectedPoolType={selectedPoolType}
        onPoolTypeChange={handlePoolTypeChange}
        onTempChange={handleTempChange}
      />
    </div>
  );
}

export default App;
