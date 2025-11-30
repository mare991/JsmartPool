# Smart Pool Monitoring - React Frontend

React frontend application for Smart Pool Monitoring System with Flask backend.

## Features

- Interactive temperature gauge visualization
- Real-time temperature monitoring
- pH level display
- Multiple pool type configurations
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- Flask backend running on `http://localhost:5000`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000)

Make sure your Flask backend is running on `http://localhost:5000` with the endpoint `/api/jsmartpoolData`.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Configuration

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production, update the URL to point to your deployed Flask backend.

## Backend Connection

This frontend connects to a Flask backend. See `FLASK_BACKEND_SETUP.md` for setup instructions.

### API Endpoint

The app sends temperature and pH data to:
- **Endpoint**: `/api/jsmartpoolData`
- **Method**: POST
- **Data**: `{ temperature: number, ph: number }`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Docker Deployment

See `docker-compose.yml` for Docker deployment configuration.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
