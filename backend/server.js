const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const axios = require('axios');
const NodeCache = require('node-cache');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cache setup
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour
  maxKeys: 100 
});

// NASA API service
class APODService {
  constructor() {
    this.nasaApiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    this.baseURL = 'https://api.nasa.gov/planetary/apod';
  }

  async makeNASARequest(params) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          ...params,
          api_key: this.nasaApiKey
        }
      });
      return response.data;
    } catch (error) {
      // Log full axios error for debugging (status, headers, body)
      console.error('Error making request to NASA API:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })

      // Provide a more descriptive error to the client
      const nasaMsg = error.response?.data?.error_message || error.response?.data || error.message
      const err = new Error(`NASA API error: ${typeof nasaMsg === 'string' ? nasaMsg : JSON.stringify(nasaMsg)}`)
      // attach original status (e.g., 429) so route handlers can forward it
      err.status = error.response?.status || 500
      throw err;
    }
  }

  async getTodaysAPOD() {
    const cacheKey = 'apod_today';
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('CACHE HIT', cacheKey);
      return cached;
    }

    console.log('CACHE MISS', cacheKey);
    const data = await this.makeNASARequest();
    cache.set(cacheKey, data);
    console.log('CACHE SET', cacheKey);
    return data;
  }

  async getAPODByDate(date) {
    const cacheKey = `apod_${date}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('CACHE HIT', cacheKey);
      return cached;
    }

    console.log('CACHE MISS', cacheKey);
    const data = await this.makeNASARequest({ date });
    cache.set(cacheKey, data);
    console.log('CACHE SET', cacheKey);
    return data;
  }

  async getAPODRange(start_date, end_date) {
    // Validate dates to avoid passing invalid values to the NASA API
    const cacheKey = `apod_range_${start_date}_${end_date}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('CACHE HIT', cacheKey);
      return cached;
    }

    // Basic validation: ensure dates are present and valid, and start <= end
    if (!start_date || !end_date) {
      throw new Error('start_date and end_date are required');
    }
    const s = new Date(start_date)
    const e = new Date(end_date)
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      throw new Error('Invalid start_date or end_date format; expected YYYY-MM-DD');
    }
    if (s > e) {
      throw new Error('start_date must be before or equal to end_date');
    }

    console.log('CACHE MISS', cacheKey);
    const data = await this.makeNASARequest({ start_date, end_date });
    cache.set(cacheKey, data);
    console.log('CACHE SET', cacheKey);
    return data;
  }
}

// Initialize APOD service
const apodService = new APODService();

// Helper to classify validation errors so we can return 400 instead of 500
function isValidationError(err) {
  if (!err || !err.message) return false;
  const msg = err.message.toLowerCase();
  return msg.includes('invalid') || msg.includes('required') || msg.includes('must be before') || msg.includes('count');
}

// Routes
app.get('/api/apod/today', async (req, res) => {
  try {
    const data = await apodService.getTodaysAPOD();
    res.json(data);
  } catch (error) {
    // Forward NASA rate limit status when possible
    if (error && error.status === 429) {
      return res.status(429).json({ error: error.message });
    }
    if (isValidationError(error)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/apod/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const data = await apodService.getAPODByDate(date);
    res.json(data);
  } catch (error) {
    if (error && error.status === 429) {
      return res.status(429).json({ error: error.message });
    }
    if (isValidationError(error)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/apod/range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const data = await apodService.getAPODRange(start_date, end_date);
    res.json(data);
  } catch (error) {
    if (error && error.status === 429) {
      return res.status(429).json({ error: error.message });
    }
    if (isValidationError(error)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/apod/random', async (req, res) => {
  try {
    const { count = 1 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const data = await apodService.getAPODRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    let apods = Array.isArray(data) ? data : [data];
    const shuffled = apods.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, parseInt(count));
    
    res.json(selected);
  } catch (error) {
    if (isValidationError(error)) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Admin: read-only cache inspection endpoint
// Enabled in non-production without token; in production require ADMIN_TOKEN header
app.get('/admin/cache', (req, res) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const adminToken = process.env.ADMIN_TOKEN;

  if (!isDev) {
    const supplied = req.get('x-admin-token') || req.query.admin_token;
    if (!adminToken || supplied !== adminToken) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  try {
    const keys = cache.keys();
    const items = keys.map((k) => {
      const ttl = cache.getTtl(k) || 0; // epoch ms or 0
      const ttlSeconds = ttl > 0 ? Math.max(0, Math.floor((ttl - Date.now()) / 1000)) : null;
      return { key: k, ttl_seconds: ttlSeconds };
    });
    res.json({ keys: items, count: keys.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`NASA APOD Backend running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});