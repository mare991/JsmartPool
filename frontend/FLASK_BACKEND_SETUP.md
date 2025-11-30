# Connecting Flask Backend to React Frontend

This guide explains how to connect your Flask backend to this React frontend.

## Setup Steps

### 1. Configure Flask Backend CORS

Your Flask backend needs to allow requests from the React frontend. Add CORS support to your Flask app:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows all origins. For production, specify allowed origins.

# Your endpoints here
@app.route('/api/endpoint1', methods=['GET'])
def endpoint1():
    return jsonify({'data': 'value'})

@app.route('/api/endpoint2', methods=['GET'])
def endpoint2():
    return jsonify({'data': 'value'})
```

Install flask-cors if you haven't:
```bash
pip install flask-cors
```

### 2. Configure API URL (Optional)

If your Flask server runs on a different port or host, create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000
```

Replace `5000` with your Flask server port if different.

### 3. Update App.js with Your Endpoints

Edit `src/App.js` and replace the example endpoints with your actual Flask endpoints:

```javascript
// Replace '/api/endpoint1' and '/api/endpoint2' with your actual endpoints
const response1 = await api.get('/api/endpoint1');
const response2 = await api.get('/api/endpoint2');
```

### 4. Start Both Servers

1. Start your Flask backend:
   ```bash
   python app.py
   # or
   flask run
   ```

2. Start the React frontend:
   ```bash
   npm start
   ```

The React app will run on `http://localhost:3000` and will proxy API requests to your Flask backend.

## Using the API Service

The API service is located in `src/services/api.js`. You can use it like this:

```javascript
import api from './services/api';

// GET request
const data = await api.get('/api/endpoint');

// POST request
const result = await api.post('/api/endpoint', { key: 'value' });

// PUT request
const updated = await api.put('/api/endpoint', { key: 'value' });

// DELETE request
await api.delete('/api/endpoint');
```

## Troubleshooting

- **CORS errors**: Make sure you've added `flask-cors` and enabled CORS in your Flask app
- **Connection refused**: Verify your Flask server is running and check the port number
- **404 errors**: Check that your endpoint paths match exactly (case-sensitive)


