import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiBookmark,
  FiShare2,
  FiMenu,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

export default function ReadingBible() {
  // Already declared above, do not redeclare footerRef and arrowFixed
  const [arrowFixedMobile, setArrowFixedMobile] = useState(true);
  const footerRef = useRef(null);
  const [arrowFixed, setArrowFixed] = useState(true);
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
      language: "en",
    },
    {
      id: "06125adad2d5898a-01",
      name: "New International Version",
      displayName: "NEW INTERNATIONAL VERSION - NIV",
      abbreviation: "NIV",
      language: "en",
    },
    {
      id: "TBSI",
      name: "Tamil Older Version Bible",
      displayName: "TAMIL BIBLE - TBSI",
      abbreviation: "TBSI",
      language: "ta",
    },
    {
      id: "TAMBL98",
      name: "பரிசுத்த பைபிள்",
      displayName: "TAMIL BIBLE - TAMBL98",
      abbreviation: "TAMBL98",
      language: "ta",
    },
    {
      id: "TAMOVR",
      name: "பரிசுத்த வேதாகமம் O.V.",
      displayName: "TAMIL BIBLE - TAMOVR",
      abbreviation: "TAMOVR",
      language: "ta",
    },
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

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          const response = await fetch(`/api/bolls/get-books/${version}/`);
          if (!response.ok) throw new Error("Failed to fetch Tamil books");
          const data = await response.json();

          const formattedBooks = data.map((book) => ({
            id: book.bookid,
            name: book.name,
            abbreviation: book.abbreviation,
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
        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          const maxChapters = getMaxChapters(book);
          setChapters(Array.from({ length: maxChapters }, (_, i) => i + 1));
        } else {
          const response = await fetch(
            `/api/bible/${version}/books/${book}/chapters`,
            {
              headers: { "api-key": API_KEY },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch chapters");
          const data = await response.json();
          setChapters(
            Array.from({ length: data.data.length }, (_, i) => i + 1)
          );
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

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          const response = await fetch(
            `/api/bolls/get-text/${version}/${book}/${chapter}/`
          );
          if (!response.ok) throw new Error("Failed to fetch Tamil verses");
          const data = await response.json();

          const formattedVerses = data.map((verse) => ({
            id: verse.verse,
            text: verse.text,
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

        setAudioAvailable(!["TBSI", "TAMBL98", "TAMOVR"].includes(version));
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

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(parallelVersion)) {
          const response = await fetch(
            `/api/bolls/get-text/${parallelVersion}/${book}/${chapter}/`
          );
          if (!response.ok)
            throw new Error("Failed to fetch parallel Tamil verses");
          const data = await response.json();

          const formattedVerses = data.map((verse) => ({
            id: verse.verse,
            text: verse.text,
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
      MAT: 28,
      MRK: 16,
      LUK: 24,
      JHN: 21,
      ACT: 28,
      ROM: 16,
      "1CO": 16,
      "2CO": 13,
      GAL: 6,
      EPH: 6,
      PHP: 4,
      COL: 4,
      "1TH": 5,
      "2TH": 3,
      "1TI": 6,
      "2TI": 4,
      TIT: 3,
      PHM: 1,
      HEB: 13,
      JAS: 5,
      "1PE": 5,
      "2PE": 3,
      "1JN": 5,
      "2JN": 1,
      "3JN": 1,
      JUD: 1,
      REV: 22,
    };
    return chapterCounts[bookId] || 1;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  const handleBookChange = (e) => {
    const selectedBookId = e.target.value;
    const selectedBookName = books.find((b) => b.id === selectedBookId)?.name;
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
      const currentVersion = versions.find((v) => v.id === version);
      const alternateVersion = versions.find((v) => v.id !== version);
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
    if (direction === "prev" && chapter > 1) {
      setChapter(chapter - 1);
    } else if (direction === "next") {
      setChapter(chapter + 1);
    }
  };

  const renderBibleContent = (versesToRender, versionId) => {
    const versionName =
      versions.find((v) => v.id === versionId)?.displayName || "";

    return (
      <div
        className={`${showParallel ? "w-full md:w-1/2 px-2" : "w-full px-4"}`}
      >
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

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("bible-footer");
      if (!footer) {
        setArrowFixed(true);
        setArrowFixedMobile(true);
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      // Desktop: If the footer is visible in the viewport, set arrows to absolute above footer
      if (window.innerWidth >= 768) {
        if (footerRect.top < window.innerHeight - 80) {
          setArrowFixed(false);
        } else {
          setArrowFixed(true);
        }
      }
      // Mobile: If the footer is visible, set arrows to absolute above footer
      if (window.innerWidth < 768) {
        if (footerRect.top < window.innerHeight - 80) {
          setArrowFixedMobile(false);
        } else {
          setArrowFixedMobile(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white"
          : "bg-gradient-to-br from-white via-blue-100 to-blue-300 text-gray-900"
      }`}
    >
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
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">
                Bible
              </a>
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">
                Plans
              </a>
              <a href="#" className="py-2 px-2 hover:bg-gray-100 rounded">
                Videos
              </a>
              <a
                href="#"
                className="py-2 px-2 hover:bg-gray-100 rounded text-blue-600"
              >
                Get the app
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Text Settings Modal */}
      {openSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-gray-900 dark:via-slate-800 dark:to-black rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 p-6 pb-4">
              <h3 className="text-xl font-extrabold bg-gradient-to-r from-gray-700 via-slate-500 to-gray-300 bg-clip-text text-transparent">
                Text Settings
              </h3>
              <button
                onClick={() => setOpenSettings(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-slate-700 shadow"
              >
                <FiX className="text-xl text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                FONT SIZE
              </h4>
              <div className="flex justify-between mb-6 gap-2">
                <button
                  onClick={() => setFontSize("small")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "small"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Aa
                </button>
                <button
                  onClick={() => setFontSize("medium")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "medium"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  AA
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "large"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  AAA
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                FONT FAMILY
              </h4>
              <div className="flex justify-between mb-6 gap-2">
                <button
                  onClick={() => setFontFamily("Inter")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold shadow transition ${
                    fontFamily === "Inter"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Sans-serif
                </button>
                <button
                  onClick={() => setFontFamily("Serif")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold shadow transition ml-2 ${
                    fontFamily === "Serif"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Serif
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                LINE HEIGHT
              </h4>
              <div className="flex justify-between mb-6 gap-2">
                <button
                  onClick={() => setLineHeight("compact")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    lineHeight === "compact"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setLineHeight("normal")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    lineHeight === "normal"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setLineHeight("spacious")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    lineHeight === "spacious"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Spacious
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                THEME
              </h4>
              <div className="flex justify-between mb-6 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    theme === "light"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("sepia")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    theme === "sepia"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Sepia
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
                    theme === "dark"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  Dark
                </button>
              </div>

              <div className="space-y-4 text-base">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showFootnotes}
                    onChange={() => setShowFootnotes(!showFootnotes)}
                    className="rounded accent-slate-700 w-5 h-5"
                  />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Show Footnotes
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={() => setShowNumbers(!showNumbers)}
                    className="rounded accent-slate-700 w-5 h-5"
                  />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Show Verse Numbers
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-gray-700 p-6 flex justify-end">
              <button
                onClick={() => setOpenSettings(false)}
                className="px-6 py-2 bg-gradient-to-r from-gray-700 via-slate-500 to-gray-300 text-white rounded-lg font-bold shadow hover:scale-105 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className={`w-full sticky top-0 z-40 shadow-lg ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-900 via-blue-900 to-black border-b border-gray-800"
            : "bg-gradient-to-r from-white via-blue-200 to-blue-400 border-b border-blue-200"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-full hover:bg-blue-100 bg-white shadow"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu className="text-lg" />
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-400 to-blue-200 bg-clip-text text-transparent">
              YouVersion Bible
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-base font-semibold">
            <a href="#" className="hover:text-blue-700 transition">
              Bible
            </a>
            <a href="#" className="hover:text-blue-700 transition">
              Plans
            </a>
            <a href="#" className="hover:text-blue-700 transition">
              Videos
            </a>
          </nav>

          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search Bible, devotionals, videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-24 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white shadow"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-md text-base font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>

          <a
            href="#"
            className="hidden md:block text-base font-semibold text-blue-700 hover:text-blue-900 transition"
          >
            Get the app
          </a>
        </div>

        {/* Mobile Search - Only shown on mobile */}
        <div className="md:hidden px-4 py-2">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search Bible..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white shadow"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-md text-base font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go
            </button>
          </form>
        </div>

        <div
          className={`flex items-center justify-between px-4 py-3 border-t md:gap-8 md:px-8 overflow-x-auto ${
            theme === "dark" ? "border-gray-700" : "border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2 min-w-max">
            <select
              value={book}
              onChange={handleBookChange}
              className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg ${
                theme === "dark" ? "text-gray-900" : "text-blue-900"
              }`}
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

            <span className="font-semibold text-base">Chapter {chapter}</span>
          </div>

          <div className="flex items-center gap-2 min-w-max">
            <select
              value={version}
              onChange={handleVersionChange}
              className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg ${
                theme === "dark" ? "text-gray-900" : "text-blue-900"
              }`}
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
              className={`flex items-center gap-1 text-base font-semibold px-3 py-2 rounded-lg shadow ${
                showParallel
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-800 text-blue-300 hover:bg-blue-900"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              } transition`}
            >
              <span className="hidden md:inline">📑</span> Parallel
            </button>

            <button
              onClick={playAudio}
              disabled={!audioAvailable}
              className={`w-10 h-10 flex items-center justify-center rounded-full border shadow ${
                audioAvailable
                  ? theme === "dark"
                    ? "bg-blue-900 hover:bg-blue-800 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                  : "opacity-50 bg-gray-200 text-gray-400"
              }`}
            >
              🔊
            </button>

            <button
              onClick={() => setOpenSettings(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full border shadow bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-lg"
            >
              AA
            </button>
          </div>
        </div>

        {showParallel && (
          <div
            className={`flex items-center justify-center gap-4 px-4 py-3 border-t ${
              theme === "dark"
                ? "bg-blue-900 border-gray-700"
                : "bg-blue-100 border-blue-200"
            } md:gap-8 md:px-8`}
          >
            <span className="text-base font-semibold">Parallel Version:</span>
            <select
              value={parallelVersion || ""}
              onChange={(e) => setParallelVersion(e.target.value)}
              className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg ${
                theme === "dark" ? "text-gray-900" : "text-blue-900"
              }`}
            >
              {versions
                .filter((v) => v.id !== version)
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
              <h3 className="text-lg font-bold">
                Select Chapter - {selectedBook.name}
              </h3>
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
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-blue-100 hover:text-blue-600"
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
        {/* Chapter Navigation Arrows - Desktop */}
        <button
          onClick={() => navigateChapter("prev")}
          disabled={chapter <= 1 || loading}
          className={`hidden md:flex ${
            arrowFixed ? "fixed" : "absolute"
          } left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-br from-black via-blue-900 to-blue-500 hover:from-blue-900 hover:via-blue-700 hover:to-blue-400 transition disabled:opacity-40 z-40`}
          style={!arrowFixed ? { top: "auto", bottom: "120px" } : {}}
        >
          <FiChevronLeft className="text-4xl text-blue-500 drop-shadow" />
        </button>

        <button
          onClick={() => navigateChapter("next")}
          disabled={loading}
          className={`hidden md:flex ${
            arrowFixed ? "fixed" : "absolute"
          } right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-br from-black via-blue-900 to-blue-500 hover:from-blue-900 hover:via-blue-700 hover:to-blue-400 transition disabled:opacity-40 z-40`}
          style={!arrowFixed ? { top: "auto", bottom: "120px" } : {}}
        >
          <FiChevronRight className="text-4xl text-blue-500 drop-shadow" />
        </button>

        {/* Mobile Chapter Navigation - Fixed or absolute above footer, same color */}
        <div
          className={`md:hidden ${
            arrowFixedMobile ? "fixed" : "absolute"
          } bottom-4 left-0 right-0 flex justify-center gap-4 z-40 pointer-events-none`}
          style={!arrowFixedMobile ? { top: "auto", bottom: "120px" } : {}}
        >
          <button
            onClick={() => navigateChapter("prev")}
            disabled={chapter <= 1 || loading}
            className="pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-br from-black via-blue-900 to-blue-500 hover:from-blue-900 hover:via-blue-700 hover:to-blue-400 transition disabled:opacity-40"
          >
            <FiChevronLeft className="text-3xl text-blue-500 drop-shadow" />
          </button>

          <button
            onClick={() => navigateChapter("next")}
            disabled={loading}
            className="pointer-events-auto w-14 h-14 flex items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-br from-black via-blue-900 to-blue-500 hover:from-blue-900 hover:via-blue-700 hover:to-blue-400 transition disabled:opacity-40"
          >
            <FiChevronRight className="text-3xl text-blue-500 drop-shadow" />
          </button>
        </div>

        <main
          className={`w-full max-w-4xl mx-auto px-2 py-6 md:px-0 pb-20 md:pb-6 ${
            fontFamily === "Serif" ? "font-serif" : "font-sans"
          }`}
          style={getTextSettingsStyles()}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 animate-pulse mb-4"></div>
              <span className="text-xl font-semibold text-blue-600">
                Loading Bible content...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-semibold">
              {error}
            </div>
          ) : (
            <>
              <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-6 md:p-10 mb-8 border border-blue-100 dark:border-gray-800">
                <h2 className="text-center text-2xl md:text-3xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-700 via-blue-400 to-blue-200 bg-clip-text text-transparent mb-4">
                  {books.find((b) => b.id === book)?.name || book}{" "}
                  <span className="text-blue-500">{chapter}</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-8 mt-6">
                  {renderBibleContent(verses, version)}
                  {showParallel && parallelVersion && (
                    <>
                      <div className="border-l my-4 md:my-0 md:mx-4 md:border-l-2 border-blue-200 dark:border-gray-700"></div>
                      {renderBibleContent(parallelVerses, parallelVersion)}
                    </>
                  )}
                </div>

                {showFootnotes && (
                  <div className="mt-8 border-t pt-4 text-sm text-blue-700 dark:text-blue-200">
                    <h4 className="font-bold mb-2">Footnotes</h4>
                    <p>
                      1: Example footnote explaining something about the text.
                    </p>
                  </div>
                )}

                <div
                  className="mt-8 flex justify-between items-center"
                  id="bible-footer"
                  ref={footerRef}
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white font-semibold shadow hover:scale-105 transition">
                    <FiBookmark /> Bookmark
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white font-semibold shadow hover:scale-105 transition">
                    <FiShare2 /> Share
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
