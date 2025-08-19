import React, { useState, useEffect } from "react";
import { FiSearch, FiBookmark, FiShare2, FiMenu, FiSettings, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export default function ReadingBible() {
  const [search, setSearch] = useState("");
  const [book, setBook] = useState("MAT");
  const [chapter, setChapter] = useState(1);
  const [version, setVersion] = useState("06125adad2d5898a-01"); // Default to NIV
  const [openSettings, setOpenSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [verses, setVerses] = useState([]);
  const [parallelVersion, setParallelVersion] = useState(null);
  const [parallelVerses, setParallelVerses] = useState([]);
  const [showParallel, setShowParallel] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Text settings state
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [showFootnotes, setShowFootnotes] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [theme, setTheme] = useState("light");
  const [lineHeight, setLineHeight] = useState("normal");

  const versions = [
    {
      id: "de4e12af7f28f599-01",
      name: "New King James Version",
      displayName: "New KING JAMES NKJV",
      abbreviation: "NKJV",
      language: "en"
    },
    {
      id: "06125adad2d5898a-01",
      name: "New International Version",
      displayName: "NEW INTERNATIONAL VERSION - NIV",
      abbreviation: "NIV",
      language: "en"
    },
    {
      id: "TBSI",
      name: "Tamil Older Version Bible",
      displayName: "TAMIL BIBLE - TBSI",
      abbreviation: "TBSI",
      language: "ta"
    },
    {
      id: "TAMBL98",
      name: "பரிசுத்த பைபிள்",
      displayName: "TAMIL BIBLE - TAMBL98",
      abbreviation: "TAMBL98",
      language: "ta"
    },
    {
      id: "TAMOVR",
      name: "பரிசுத்த வேதாகமம் O.V.",
      displayName: "TAMIL BIBLE - TAMOVR",
      abbreviation: "TAMOVR",
      language: "ta"
    }
  ];

  const API_KEY = "2641dfc33a1910ef977df34e39c2fac0";
  const BASE_URL = "https://api.scripture.api.bible/v1/bibles";
  const BOLLS_URL = "https://bolls.life/api";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (!version) return;
        
        setLoading(true);
        setError(null);

        if (['TBSI', 'TAMBL98', 'TAMOVR'].includes(version)) {
          const response = await fetch(`/api/bolls/get-books/${version}/`);
          if (!response.ok) throw new Error("Failed to fetch Tamil books");
          const data = await response.json();
          
          const formattedBooks = data.map(book => ({
            id: book.bookid,
            name: book.name,
            abbreviation: book.abbreviation
          }));
          
          setBooks(formattedBooks);
        } else {
          const response = await fetch(`/api/bible/${version}/books`, {
            headers: { "api-key": API_KEY },
          });
          if (!response.ok) throw new Error("Failed to fetch books");
          const data = await response.json();
          setBooks(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [version]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!book || !version) return;
      
      try {
        if (['TBSI', 'TAMBL98', 'TAMOVR'].includes(version)) {
          const maxChapters = getMaxChapters(book);
          setChapters(Array.from({ length: maxChapters }, (_, i) => i + 1));
        } else {
          const response = await fetch(`/api/bible/${version}/books/${book}/chapters`, {
            headers: { "api-key": API_KEY },
          });
          if (!response.ok) throw new Error("Failed to fetch chapters");
          const data = await response.json();
          setChapters(Array.from({ length: data.data.length }, (_, i) => i + 1));
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };

    fetchChapters();
  }, [book, version]);

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        if (!book || !chapter || !version) return;
        
        setLoading(true);
        setError(null);

        if (['TBSI', 'TAMBL98', 'TAMOVR'].includes(version)) {
          const response = await fetch(`/api/bolls/get-text/${version}/${book}/${chapter}/`);
          if (!response.ok) throw new Error("Failed to fetch Tamil verses");
          const data = await response.json();
          
          const formattedVerses = data.map(verse => ({
            id: verse.verse,
            text: verse.text
          }));
          
          setVerses(formattedVerses);
        } else {
          const response = await fetch(
            `/api/bible/${version}/passages/${book}.${chapter}?content-type=text&include-notes=false&include-titles=true`,
            { headers: { "api-key": API_KEY } }
          );
          if (!response.ok) throw new Error("Failed to fetch verses");
          const data = await response.json();
          setVerses([{ id: 1, text: data.data.content }]);
        }

        setAudioAvailable(!['TBSI', 'TAMBL98', 'TAMOVR'].includes(version));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [book, chapter, version]);

  useEffect(() => {
    const fetchParallelVerses = async () => {
      if (!showParallel || !parallelVersion || !book || !chapter) return;
      
      try {
        setLoading(true);
        
        if (['TBSI', 'TAMBL98', 'TAMOVR'].includes(parallelVersion)) {
          const response = await fetch(`/api/bolls/get-text/${parallelVersion}/${book}/${chapter}/`);
          if (!response.ok) throw new Error("Failed to fetch parallel Tamil verses");
          const data = await response.json();
          
          const formattedVerses = data.map(verse => ({
            id: verse.verse,
            text: verse.text
          }));
          
          setParallelVerses(formattedVerses);
        } else {
          const response = await fetch(
            `/api/bible/${parallelVersion}/passages/${book}.${chapter}?content-type=text&include-notes=false&include-titles=true`,
            { headers: { "api-key": API_KEY } }
          );
          if (!response.ok) throw new Error("Failed to fetch parallel verses");
          const data = await response.json();
          setParallelVerses([{ id: 1, text: data.data.content }]);
        }
      } catch (err) {
        console.error("Error fetching parallel verses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParallelVerses();
  }, [showParallel, parallelVersion, book, chapter]);

  const getMaxChapters = (bookId) => {
    const chapterCounts = {
      MAT: 28, MRK: 16, LUK: 24, JHN: 21, ACT: 28, ROM: 16,
      '1CO': 16, '2CO': 13, GAL: 6, EPH: 6, PHP: 4, COL: 4,
      '1TH': 5, '2TH': 3, '1TI': 6, '2TI': 4, TIT: 3, PHM: 1,
      HEB: 13, JAS: 5, '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1,
      '3JN': 1, JUD: 1, REV: 22
    };
    return chapterCounts[bookId] || 1;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  const handleBookChange = (e) => {
    const selectedBookId = e.target.value;
    const selectedBookName = books.find(b => b.id === selectedBookId)?.name;
    setSelectedBook({ id: selectedBookId, name: selectedBookName });
    setShowChapterModal(true);
  };

  const selectChapter = (chapterNum) => {
    setBook(selectedBook.id);
    setChapter(chapterNum);
    setShowChapterModal(false);
  };

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
    setShowParallel(false);
  };

  const toggleParallelView = () => {
    if (!showParallel) {
      const currentVersion = versions.find(v => v.id === version);
      const alternateVersion = versions.find(v => v.id !== version);
      if (alternateVersion) {
        setParallelVersion(alternateVersion.id);
      }
    }
    setShowParallel(!showParallel);
  };

  const playAudio = () => {
    console.log("Playing audio for", book, chapter);
  };

  const navigateChapter = (direction) => {
    if (direction === 'prev' && chapter > 1) {
      setChapter(chapter - 1);
    } else if (direction === 'next') {
      setChapter(chapter + 1);
    }
  };

  const renderBibleContent = (versesToRender, versionId) => {
    const versionName = versions.find(v => v.id === versionId)?.displayName || "";
    
    return (
      <div className={`${showParallel ? "w-full md:w-1/2 px-2" : "w-full px-4"}`}>
        {showParallel && (
          <h3 className="text-center text-md font-bold mb-4">{versionName}</h3>
        )}
        <div className="space-y-4">
          {versesToRender.map((verse) => (
            <p key={verse.id} className="leading-relaxed">
              {showNumbers && verse.id && (
                <sup className="text-gray-500 text-xs mr-1">{verse.id}</sup>
              )}
              {verse.text}
            </p>
          ))}
        </div>
      </div>
    );
  };

  const getTextSettingsStyles = () => {
    let styles = {};
    
    // Font size
    if (fontSize === "small") styles.fontSize = "0.875rem";
    else if (fontSize === "medium") styles.fontSize = "1rem";
    else if (fontSize === "large") styles.fontSize = "1.25rem";
    
    // Font family
    if (fontFamily === "Serif") styles.fontFamily = "serif";
    else styles.fontFamily = "sans-serif";
    
    // Line height
    if (lineHeight === "compact") styles.lineHeight = "1.4";
    else if (lineHeight === "normal") styles.lineHeight = "1.6";
    else if (lineHeight === "spacious") styles.lineHeight = "1.8";
    
    return styles;
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-4/5 h-full p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">YouVersion</h1>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">Bible</a>
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">Plans</a>
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">Videos</a>
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded text-blue-600">Get the app</a>
            </nav>
          </div>
        </div>
      )}

      {/* Text Settings Modal */}
      {openSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">Text Settings</h3>
              <button 
                onClick={() => setOpenSettings(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-3">FONT SIZE</h4>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setFontSize("small")}
                  className={`px-4 py-2 rounded ${fontSize === "small" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Aa
                </button>
                <button
                  onClick={() => setFontSize("medium")}
                  className={`px-4 py-2 rounded ${fontSize === "medium" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  AA
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-4 py-2 rounded ${fontSize === "large" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  AAA
                </button>
              </div>
              
              <h4 className="text-xs font-semibold text-gray-500 mb-3">FONT FAMILY</h4>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setFontFamily("Inter")}
                  className={`flex-1 px-4 py-2 rounded ${fontFamily === "Inter" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Sans-serif
                </button>
                <button
                  onClick={() => setFontFamily("Serif")}
                  className={`flex-1 px-4 py-2 rounded ml-2 ${fontFamily === "Serif" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Serif
                </button>
              </div>
              
              <h4 className="text-xs font-semibold text-gray-500 mb-3">LINE HEIGHT</h4>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setLineHeight("compact")}
                  className={`px-4 py-2 rounded ${lineHeight === "compact" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setLineHeight("normal")}
                  className={`px-4 py-2 rounded ${lineHeight === "normal" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setLineHeight("spacious")}
                  className={`px-4 py-2 rounded ${lineHeight === "spacious" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Spacious
                </button>
              </div>
              
              <h4 className="text-xs font-semibold text-gray-500 mb-3">THEME</h4>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded ${theme === "light" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("sepia")}
                  className={`px-4 py-2 rounded ${theme === "sepia" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Sepia
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded ${theme === "dark" ? "bg-black text-white" : "bg-gray-100"}`}
                >
                  Dark
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFootnotes}
                    onChange={() => setShowFootnotes(!showFootnotes)}
                    className="rounded"
                  />
                  Show Footnotes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={() => setShowNumbers(!showNumbers)}
                    className="rounded"
                  />
                  Show Verse Numbers
                </label>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setOpenSettings(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`w-full border-b ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white"} sticky top-0 z-40`}>
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu className="text-lg" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">YouVersion</h1>
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a href="#" className="hover:text-blue-600">Bible</a>
            <a href="#" className="hover:text-blue-600">Plans</a>
            <a href="#" className="hover:text-blue-600">Videos</a>
          </nav>

          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Bible, devotionals, videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>

          <a href="#" className="hidden md:block text-sm font-medium text-blue-600 hover:text-blue-800">
            Get the app
          </a>
        </div>

        {/* Mobile Search - Only shown on mobile */}
        <div className="md:hidden px-4 py-2">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Bible..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go
            </button>
          </form>
        </div>

        <div className={`flex items-center justify-between px-4 py-3 border-t md:gap-6 md:px-6 overflow-x-auto ${theme === "dark" ? "border-gray-700" : ""}`}>
          <div className="flex items-center gap-2 min-w-max">
            <select
              value={book}
              onChange={handleBookChange}
              className={`bg-transparent outline-none px-2 py-1 font-medium text-sm md:text-base ${theme === "dark" ? "text-white" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <option>Loading books...</option>
              ) : (
                books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))
              )}
            </select>

            <span className="font-medium">Chapter {chapter}</span>
          </div>

          <div className="flex items-center gap-2 min-w-max">
            <select
              value={version}
              onChange={handleVersionChange}
              className={`bg-transparent outline-none px-2 py-1 font-medium text-sm md:text-base ${theme === "dark" ? "text-white" : ""}`}
              disabled={loading}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.displayName}
                </option>
              ))}
            </select>

            <button 
              onClick={toggleParallelView}
              className={`flex items-center gap-1 text-sm md:text-base font-medium ${showParallel ? 'text-blue-600' : theme === "dark" ? 'text-gray-300 hover:text-white' : 'hover:text-blue-600'}`}
            >
              <span className="hidden md:inline">📑</span> Parallel
            </button>

            <button 
              onClick={playAudio}
              disabled={!audioAvailable}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${audioAvailable ? theme === "dark" ? 'hover:bg-gray-700' : 'hover:bg-gray-100' : 'opacity-50'}`}
            >
              🔊
            </button>

            <button
              onClick={() => setOpenSettings(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-100 font-medium"
            >
              AA
            </button>
          </div>
        </div>

        {showParallel && (
          <div className={`flex items-center justify-center gap-4 px-4 py-3 border-t ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"} md:gap-6 md:px-6`}>
            <span className="text-sm font-medium">Parallel Version:</span>
            <select
              value={parallelVersion || ""}
              onChange={(e) => setParallelVersion(e.target.value)}
              className={`bg-transparent outline-none px-2 py-1 font-medium text-sm md:text-base ${theme === "dark" ? "text-white" : ""}`}
            >
              {versions
                .filter(v => v.id !== version)
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.displayName}
                  </option>
                ))}
            </select>
          </div>
        )}
      </header>

      {showChapterModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">Select Chapter - {selectedBook.name}</h3>
              <button 
                onClick={() => setShowChapterModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 p-4">
              {chapters.map((chapterNum) => (
                <button
                  key={chapterNum}
                  onClick={() => selectChapter(chapterNum)}
                  className={`p-3 rounded-lg font-medium text-center transition-colors ${
                    chapterNum === chapter 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                >
                  {chapterNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1">
        {/* Chapter Navigation Arrows */}
        <button 
          onClick={() => navigateChapter('prev')}
          disabled={chapter <= 1 || loading}
          className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 z-30"
        >
          <FiChevronLeft className="text-xl" />
        </button>

        <button 
          onClick={() => navigateChapter('next')}
          disabled={loading}
          className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 z-30"
        >
          <FiChevronRight className="text-xl" />
        </button>

        {/* Mobile Chapter Navigation - Fixed at bottom */}
        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center gap-4 z-30">
          <button 
            onClick={() => navigateChapter('prev')}
            disabled={chapter <= 1 || loading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <FiChevronLeft className="text-xl" />
          </button>

          <button 
            onClick={() => navigateChapter('next')}
            disabled={loading}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>

        <main
          className={`w-full max-w-6xl mx-auto px-4 py-6 md:px-6 pb-20 md:pb-6 ${
            fontFamily === "Serif" ? "font-serif" : "font-sans"
          }`}
          style={getTextSettingsStyles()}
        >
          {loading ? (
            <div className="text-center py-8">Loading Bible content...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <h2 className="text-center text-lg font-bold uppercase">
                {books.find(b => b.id === book)?.name || book} {chapter}
              </h2>
              
              <div className="flex flex-col md:flex-row mt-6">
                {renderBibleContent(verses, version)}
                
                {showParallel && parallelVersion && (
                  <>
                    <div className="border-l my-4 md:my-0 md:mx-4 md:border-l-2"></div>
                    {renderBibleContent(parallelVerses, parallelVersion)}
                  </>
                )}
              </div>

              {showFootnotes && (
                <div className="mt-8 border-t pt-4 text-sm text-gray-500">
                  <h4 className="font-medium mb-2">Footnotes</h4>
                  <p>1: Example footnote explaining something about the text.</p>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <FiBookmark /> Bookmark
                </button>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <FiShare2 /> Share
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}