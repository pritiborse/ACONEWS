import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './App.css';
import 'tailwindcss/tailwind.css';
import '@fontsource/poppins';
import '@fontsource/comfortaa';
import Typed from 'typed.js';

const availableCategories = ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

function App() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const typedRef = useRef(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint;
      if (searchQuery) {
        endpoint = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&page=${page}&apikey=b838c5a8348b6c68af324a15388c3ff0`;
      } else {
        endpoint = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&page=${page}&apikey=b838c5a8348b6c68af324a15388c3ff0`;
      }
      const response = await axios.get(endpoint);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching news', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, category]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: ["Built for you!", "Built for everyone!"],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 1000,
        loop: true
      });
      return () => {
        typed.destroy(); // Clean up typed instance on component unmount
      };
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSearchQuery(''); // Clear search when changing category
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const getPaginationRange = () => {
    const totalPages = 10;
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pages.push(i);
      } else if (i === page - 3 || i === page + 3) {
        pages.push('...');
      }
    }

    return pages;
  };

  const paginationRange = getPaginationRange();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, options);

    const cards = document.querySelectorAll('.news-card');
    cards.forEach((card) => {
      observer.current.observe(card);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [articles]);

  return (
    <div className="App bg-white min-h-screen flex flex-col font-poppins">
      {/* Navbar */}
      <nav className="w-full flex items-center bg-blue-700 p-4 shadow-lg mb-8">
        <h1 className="text-3xl text-white font-comfortaa flex-shrink-0">aconews</h1>

        <div className="flex-grow flex items-center justify-end ml-auto space-x-2 nav-menu">
          <div className="relative w-64 search-container">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 rounded-lg border border-gray-300 w-full"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-500 search-icon" />
          </div>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="p-2 rounded-lg border border-gray-300"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <button className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100">
            Login
          </button>

          <button className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Welcome Text */}
      <div className="welcome-text">
        <h2 className="text-2xl text-gray-800 font-semibold">
          <span className='font2'>Welcome to</span> <span className="font">aconews.</span>
        </h2>
        <p className="typewriter-text"> 
          <span ref={typedRef} className="dynamic-text"></span>
        </p>
        <h2 className="text-2xl text-gray-800 font-semibold">
          <span className='font2'>Designed By Priti Borse (Future Acowaler😉🚀)</span>
        </h2>
      </div>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center">
            <p className="text-xl text-gray-500">Loading news...</p>
          </div>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <article
              key={index}
              className="news-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </article>
          ))
        ) : (
          <div className="col-span-3 text-center">
            <p className="text-xl text-gray-500">No articles found.</p>
          </div>
        )}
      </main>

      {/* Pagination */}
      <footer className="pagination-container text-center mt-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-300"
        >
          Previous
        </button>

        {paginationRange.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={index} className="px-4 py-2 text-gray-600">
              {pageNumber}
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-lg ${
                pageNumber === page ? 'bg-blue-700 text-white' : 'bg-white text-blue-700'
              } hover:bg-gray-100`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          onClick={handleNextPage}
          disabled={page >= 10} // Assuming total pages are 10
          className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-300"
        >
          Next
        </button>
      </footer>
    </div>
  );
}

export default App;
