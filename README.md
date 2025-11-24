
# NASA APOD Explorer

A full-stack web application for exploring NASA's Astronomy Picture of the Day with Vue.js frontend and Node.js backend.

## Features

- View today's astronomy picture with detailed explanation
- Browse historical APODs using date picker (since 1995)
- Gallery view of recent astronomy pictures
- Video support with embedded players
- Responsive design for all devices
- Fast performance with smart caching

## Tech Stack

**Frontend:** Vue.js 3, Vue Router, Tailwind CSS, Axios
**Backend:** Node.js, Express, Caching, Rate Limiting
**API:** NASA APOD API

## Quick Start

### Prerequisites
- Node.js 16+
- NASA API Key (free from https://api.nasa.gov/)

### Installation

1. **Clone and setup:**
   ```bash
   git clone https://github.com/anuja262003/nasa-apod-explorer.git
   cd nasa-apod-explorer
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create .env file and add your NASA API key
   echo "NASA_API_KEY=your_actual_key_here" > .env
   echo "PORT=3001" >> .env
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ..
   npm install
   npm run serve
   ```

4. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

## API Endpoints

- `GET /api/apod/today` - Today's APOD
- `GET /api/apod/date/:date` - APOD for specific date
- `GET /api/apod/range?start_date=&end_date=` - APODs in date range
- `GET /api/apod/random?count=` - Random APODs
- `GET /health` - Health check

## Project Structure

```
nasa-apod-explorer/
├── backend/          # Node.js server with caching
├── src/             # Vue.js frontend
│   ├── components/  # Reusable components
│   ├── pages/       # Different views
│   ├── composables/ # Data fetching logic
│   └── services/    # API calls
├── public/          # Static files
└── package.json     # Dependencies
```

## Features

- **Smart Caching:** 1-hour cache with 100-item limit
- **Rate Limiting:** 100 requests per 15 minutes
- **Video Support:** YouTube, Vimeo, and direct video files
- **Error Handling:** Graceful error states and loading indicators
- **Mobile Friendly:** Responsive design for all screen sizes

## License

MIT License
