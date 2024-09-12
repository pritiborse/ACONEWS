const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const NEWS_API_KEY = process.env.NEWS_API_KEY;  
const BASE_URL = 'https://gnews.io/api/v4/top-headlines';

// Available categories
const availableCategories = ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

app.get('/news', async (req, res) => {
  try {
    const { page = 1, search = '', category = 'general' } = req.query;
    
    // Check if the provided category is valid
    if (!availableCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Available categories are: ${availableCategories.join(', ')}` });
    }

    // Construct the URL with the correct parameters
    const url = `${BASE_URL}?category=${category}&lang=en&country=us&max=10&page=${page}&apikey=${NEWS_API_KEY}`;

    // Log the URL for debugging
    console.log('Fetching news from:', url);

    // Make the request to the News API
    const response = await axios.get(url);

    // Send the data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
