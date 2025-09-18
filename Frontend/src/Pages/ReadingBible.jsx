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
  FiPlay,
  FiPause,
  FiVolume2,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import logo from "../assets/Logo/newlogo.png";
import AppStoreImg from "../assets/Logo/app-store.png";
import GooglePlayImg from "../assets/Logo/play-store.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
export default function ReadingBible() {
  // State declarations
  const [arrowFixedMobile, setArrowFixedMobile] = useState(true);
  const footerRef = useRef(null);
  const [arrowFixed, setArrowFixed] = useState(true);
  const [search, setSearch] = useState("");
  const [book, setBook] = useState("MAT");
  const [chapter, setChapter] = useState(1);
  const [version, setVersion] = useState("06125adad2d5898a-01");
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
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchType, setSearchType] = useState("books"); // "books" or "verses"
  const [verseSearchResults, setVerseSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [footerNotes, setFooterNotes] = useState([]);
  const [showFooterNotes, setShowFooterNotes] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [highlightPalettePosition, setHighlightPalettePosition] = useState({
    top: 0,
    left: 0,
  });
  const [showHighlightPalette, setShowHighlightPalette] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent);
    };

    setIsMobile(checkMobile());
  }, []);

  const handleGetAppClick = () => {
    setShowModal(true);
  };

  const handleOSSelection = (os) => {
    setShowModal(false);
    if (os === "android") {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player";
    } else if (os === "ios") {
      window.location.href = "https://apps.apple.com/app/id6618135650";
    }
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem("bible-footer-notes");
    if (savedNotes) {
      setFooterNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save footer notes to localStorage
  useEffect(() => {
    localStorage.setItem("bible-footer-notes", JSON.stringify(footerNotes));
  }, [footerNotes]);

  // Add new footer note
  const addFooterNote = () => {
    if (!newNoteText.trim()) return;

    const note = {
      id: Date.now(),
      text: newNoteText.trim(),
      book,
      chapter,
      verse: null, // Can be expanded to specific verses later
      version,
      timestamp: new Date().toISOString(),
    };

    setFooterNotes([...footerNotes, note]);
    setNewNoteText("");
    setShowAddNote(false);
  };

  // Update existing footer note
  const updateFooterNote = () => {
    if (!newNoteText.trim() || !editingNote) return;

    setFooterNotes(
      footerNotes.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              text: newNoteText.trim(),
              timestamp: new Date().toISOString(),
            }
          : note
      )
    );

    setEditingNote(null);
    setNewNoteText("");
  };

  // Delete footer note
  const deleteFooterNote = (noteId) => {
    setFooterNotes(footerNotes.filter((note) => note.id !== noteId));
  };

  // Start editing a note
  const startEditingNote = (note) => {
    setEditingNote(note);
    setNewNoteText(note.text);
    setShowAddNote(true);
  };

  // Cancel editing/adding
  const cancelNoteEdit = () => {
    setEditingNote(null);
    setNewNoteText("");
    setShowAddNote(false);
  };

  // Get notes for current chapter
  const getCurrentChapterNotes = () => {
    return footerNotes.filter(
      (note) =>
        note.book === book &&
        note.chapter === chapter &&
        note.version === version
    );
  };

  // Bookmark state
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Text settings state
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [showFootnotes, setShowFootnotes] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [theme, setTheme] = useState("light");
  const [lineHeight, setLineHeight] = useState("normal");

  // TTS State
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsVoices, setTtsVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [ttsRate, setTtsRate] = useState(1);
  const [ttsPitch, setTtsPitch] = useState(1);
  const [ttsVolume, setTtsVolume] = useState(1);
  const [highlightedVerse, setHighlightedVerse] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [isSelectingText, setIsSelectingText] = useState(false);
  const [selectionRange, setSelectionRange] = useState(null);
  const [currentVerseForHighlight, setCurrentVerseForHighlight] =
    useState(null);

  useEffect(() => {
    const savedHighlights = localStorage.getItem("bible-highlights");
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, []);

  // Save highlights to localStorage
  useEffect(() => {
    const savedHighlights = localStorage.getItem("bible-highlights");
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    }
  }, []);
  const addPartialHighlight = (verseId, color) => {
    if (
      !selectionRange ||
      !currentVerseForHighlight ||
      currentVerseForHighlight !== verseId
    )
      return;

    const selectedText = selectionRange.toString();
    const verseKey = `${book}-${chapter}-${verseId}-${version}`;

    // Create a unique ID for this highlight
    const highlightId = `${verseKey}-${Date.now()}`;

    // Add the highlight
    const newHighlight = {
      id: highlightId,
      key: verseKey,
      book,
      chapter,
      verse: verseId,
      version,
      color: color || highlightColor,
      text: selectedText,
      timestamp: new Date().toISOString(),
      isPartial: true,
    };

    setHighlights([...highlights, newHighlight]);

    // Clear selection and close palette
    window.getSelection().removeAllRanges();
    setIsSelectingText(false);
    setSelectionRange(null);
    setCurrentVerseForHighlight(null);
    setShowHighlightPalette(false);
  };

  // Add this function near the other helper functions
  const isTamilUI = () => {
    return ["TBSI", "TAMBL98", "TAMOVR"].includes(version);
  };

  // Tamil translations object
  const tamilTranslations = {
    go: "செல்",
    chapter: "அதிகாரம்",
    searchBooks: "புத்தகம் மூலம் தேடவும்...",
    searchVerses: "வசனங்கள் மூலம் தேடவும்...",
    parallel: "இணைநோக்கு",
    viewBookmarks: "புத்தகக்குறியை காண்க",
    book: "புத்தகம்",
    verse: "வசனம்",
    footnotes: "அடிக்குறிப்புகள்",
    footnoteExample:
      "உரையைப் பற்றி ஏதாவது ஒன்றை விளக்கும் எடுத்துக்காட்டு அடிக்குறிப்பு.",
    readAloud: "சத்தமாக வாசி",
    settings: "அமைப்புகள்",
    bookmark: "புத்தகக்குறி",
    bookmarked: "புத்தகக்குறியிடப்பட்டது",
    share: "பகிர்",
    notes: "குறிப்புகள்",
    addNote: "குறிப்பை சேர்",
    updateNote: "குறிப்பை புதுப்பி",
    cancel: "ரத்து",
    noNotes: "இந்த அதிகாரத்திற்கு இன்னும் குறிப்புகள் இல்லை",
    addFirstNote: "முதல் குறிப்பை சேர்",
    noBookmarks: "இன்னும் புத்தகக்குறிகள் இல்லை",
    selectChapter: "அதிகாரத்தை தேர்ந்தெடு",
    close: "மூடு",
    textSettings: "உரை அமைப்புகள்",
    fontSize: "எழுத்து அளவு",
    fontFamily: "எழுத்துரு",
    lineHeight: "வரி உயரம்",
    theme: "தீம்",
    highlightColor: "எடுப்பான நிறம்",
    showFootnotes: "அடிக்குறிப்புகளை காட்டு",
    showVerseNumbers: "வசன எண்களை காட்டு",
    ttsSettings: "உரை-பேச்சு அமைப்புகள்",
    // voice: "குரல்",
    // speed: "வேகம்",
    // pitch: "சுருதி",
    // volume: "ஒலி",
    stopReading: "வாசிப்பை நிறுத்து",
    done: "முடிந்தது",
    compact: "கச்சிதமான",
    normal: "சாதாரண",
    spacious: "விசாலமான",
    light: "வெளிர்",
    sepia: "செபியா",
    dark: "இருண்ட",
    bookmarksModal: "புத்தகக்குறிகள் குறிப்பு",
    textToSpeechSettings: "உரை-பேச்சு அமைப்புகள்",
    sans: "சான்ஸ்",
    serif: "செரிஃப்",
    dyslexic: "டிஸ்லெக்சிக்",
    legible: "வாசிக்கக்கூடிய",
    highlightSelection: "தேர்ந்தெடுத்ததை வண்ணம்",
    ttsNotAvailable: "தமிழ் பதிப்புகளுக்கு உரை-பேச்சு கிடைக்கவில்லை.",
    ttsVoice: "குரல்",
    ttsSpeed: "வேகம்",
    ttsPitch: "சுருதி",
    ttsVolume: "ஒலி",
    ttsParallelVersion: "இணைநோக்கு பதிப்பு :",
    noBooksFound: "புத்தகங்கள் எதுவும் கிடைக்கவில்லை",
    noVersesFound: "வசனங்கள் எதுவும் கிடைக்கவில்லை",
    loadingBooks: "புத்தகங்கள் ஏற்றப்படுகின்றன...",
    loadingContent: "பைபிள் உள்ளடக்கம் ஏற்றுகிறது...",
  };
  // Save highlights to localStorage
  useEffect(() => {
    localStorage.setItem("bible-highlights", JSON.stringify(highlights));
  }, [highlights]);

  const handleTextSelection = (verseId, event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      setIsSelectingText(true);
      setCurrentVerseForHighlight(verseId);
      setSelectionRange(selection.getRangeAt(0));

      // Always position the palette at the center of the viewport
      setHighlightPalettePosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });

      setShowHighlightPalette(true);
    } else {
      setIsSelectingText(false);
      setCurrentVerseForHighlight(null);
      setSelectionRange(null);
      setShowHighlightPalette(false);
    }
  };

  // Function to remove a highlight
  const removeHighlight = (highlightId) => {
    setHighlights(highlights.filter((h) => h.id !== highlightId));
  };

  // Get all highlights for a specific verse
  const getVerseHighlights = (verseId) => {
    const verseKey = `${book}-${chapter}-${verseId}-${version}`;
    return highlights.filter((h) => h.key === verseKey);
  };

  const renderHighlightedText = (verse) => {
    const verseHighlights = getVerseHighlights(verse.id);
    let text = verse.text;

    if (verseHighlights.length === 0) {
      return text;
    }

    // Sort highlights by their position in the text for proper rendering
    const sortedHighlights = [...verseHighlights].sort((a, b) => {
      return text.indexOf(a.text) - text.indexOf(b.text);
    });

    let result = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight) => {
      const startIndex = text.indexOf(highlight.text, lastIndex);

      if (startIndex === -1) {
        // Highlight text not found (might be due to text changes)
        return;
      }

      // Add text before the highlight
      if (startIndex > lastIndex) {
        result.push(text.substring(lastIndex, startIndex));
      }

      // Add the highlighted text with inline styles
      const colorStyle =
        highlightColors[highlight.color] || highlightColors.yellow;
      result.push(
        <span
          key={highlight.id}
          className="relative group mx-0.5 rounded px-1"
          style={{
            backgroundColor:
              theme === "dark" ? colorStyle.darkBg : colorStyle.bg,
            color: theme === "dark" ? "#fff" : colorStyle.text,
          }}
        >
          {highlight.text}
          <button
            onClick={() => removeHighlight(highlight.id)}
            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-0.5 shadow border text-xs"
            style={{ zIndex: 10 }}
            title="Remove highlight"
          >
            <FiX className="w-3 h-3" />
          </button>
        </span>
      );

      lastIndex = startIndex + highlight.text.length;
    });

    // Add remaining text after the last highlight
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result;
  };

  const renderHighlightColorOptions = () => (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {Object.entries(highlightColors).map(([color, colorInfo]) => (
        <button
          key={color}
          onClick={() => setHighlightColor(color)}
          className={`p-3 rounded-lg font-semibold shadow transition ${
            highlightColor === color
              ? "ring-2 ring-gray-700 scale-105"
              : "hover:scale-105"
          }`}
          style={{ backgroundColor: colorInfo.bg }}
          title={color.charAt(0).toUpperCase() + color.slice(1)}
        >
          <div
            className="w-6 h-6 rounded-full mx-auto"
            style={{
              backgroundColor: colorInfo.bg,
              border: `2px solid ${
                theme === "dark" ? colorInfo.darkBg : "#00000020"
              }`,
            }}
          ></div>
        </button>
      ))}
    </div>
  );

  // Toggle highlight for a verse
  const toggleHighlight = (verseId) => {
    const verseKey = `${book}-${chapter}-${verseId}-${version}`;
    const isHighlighted = highlights.some((h) => h.key === verseKey);

    if (isHighlighted) {
      // Remove highlight
      setHighlights(highlights.filter((h) => h.key !== verseKey));
    } else {
      // Add highlight
      setHighlights([
        ...highlights,
        {
          key: verseKey,
          book,
          chapter,
          verse: verseId,
          version,
          color: highlightColor,
          timestamp: new Date().toISOString(),
          text: verses.find((v) => v.id === verseId)?.text || "",
        },
      ]);
    }
  };

  // Check if a verse is highlighted
  const isVerseHighlighted = (verseId) => {
    const verseKey = `${book}-${chapter}-${verseId}-${version}`;
    return highlights.some((h) => h.key === verseKey);
  };

  // Get highlight color for a verse
  const getVerseHighlightColor = (verseId) => {
    const verseKey = `${book}-${chapter}-${verseId}-${version}`;
    const highlight = highlights.find((h) => h.key === verseKey);
    return highlight ? highlight.color : null;
  };

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
      id: "TAMOVR",
      name: "பரிசுத்த வேதாகமம் O.V.",
      displayName: "TAMIL BIBLE - TAMOVR",
      abbreviation: "TAMOVR",
      language: "ta",
    },
  ];

  const API_KEY = "2641dfc33a1910ef977df34e39c2fac0";
  const BASE_URL = "/api/proxy/bible";
  const BOLLS_URL = "https://api.amusicbible.com/api/proxy/bolls";

  // Check if current version is Tamil
  const isTamilVersion = ["TBSI", "TAMBL98", "TAMOVR"].includes(version);

  // Initialize TTS
  useEffect(() => {
    const initTTS = () => {
      if ("speechSynthesis" in window) {
        const voices = speechSynthesis.getVoices();
        setTtsVoices(voices);

        const defaultVoice =
          voices.find((voice) => voice.lang.includes("en")) || voices[0];

        if (defaultVoice) {
          setSelectedVoice(defaultVoice);
        }

        speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = speechSynthesis.getVoices();
          setTtsVoices(updatedVoices);
        };
      }
    };

    initTTS();
  }, []);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bible-bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bible-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHighlightPalette) {
        const palette = document.querySelector(".highlight-palette");
        if (palette && !palette.contains(event.target)) {
          // Check if the click is on selected text
          const selection = window.getSelection();
          if (!selection.toString().trim()) {
            setShowHighlightPalette(false);
            setIsSelectingText(false);
            setCurrentVerseForHighlight(null);
            setSelectionRange(null);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHighlightPalette]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (!version) return;

        setLoading(true);
        setError(null);

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          const response = await fetch(`${BOLLS_URL}/get-books/${version}/`);
          if (!response.ok) throw new Error("Failed to fetch Tamil books");
          const data = await response.json();

          const formattedBooks = data.map((book) => ({
            id: book.bookid,
            name: book.name,
            abbreviation: book.abbreviation,
          }));

          setBooks(formattedBooks);
        } else {
          const response = await fetch(`${BASE_URL}/${version}/books`, {
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
            `${BASE_URL}/${version}/books/${book}/chapters`,
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
            `${BOLLS_URL}/get-text/${version}/${book}/${chapter}/`
          );
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Chapter not found in this version");
            }
            throw new Error("Failed to fetch Tamil verses");
          }
          const data = await response.json();

          // Tamil API returns verses in the correct format already
          const formattedVerses = data.map((verse) => ({
            id: verse.verse,
            text: verse.text,
          }));

          setVerses(formattedVerses);
        } else {
          const response = await fetch(
            `${BASE_URL}/${version}/passages/${book}.${chapter}?content-type=text&include-notes=false&include-titles=true`,
            { headers: { "api-key": API_KEY } }
          );
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Chapter not found in this version");
            }
            throw new Error("Failed to fetch verses");
          }
          const data = await response.json();

          // Parse the content to extract individual verses
          const verseContent = parseVersesFromContent(data.data.content);
          setVerses(verseContent);
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
            `${BOLLS_URL}/get-text/${parallelVersion}/${book}/${chapter}/`
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
            `${BASE_URL}/${parallelVersion}/passages/${book}.${chapter}?content-type=text&include-notes=false&include-titles=true`,
            { headers: { "api-key": API_KEY } }
          );
          if (!response.ok) throw new Error("Failed to fetch parallel verses");
          const data = await response.json();
          const verseContent = parseVersesFromContent(data.data.content);
          setParallelVerses(verseContent);
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

  const parseVersesFromContent = (content) => {
    // If content is already in verse format (like Tamil API), return as is
    if (Array.isArray(content)) {
      return content;
    }

    // For English Bible content - parse the HTML structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const verses = [];
    const verseElements = doc.querySelectorAll("span.v, .verse, [data-number]");

    verseElements.forEach((verseElement) => {
      const verseNumber =
        verseElement.getAttribute("data-number") ||
        verseElement.textContent.match(/\d+/)?.[0];

      if (verseNumber) {
        const verseId = parseInt(verseNumber);

        // Get the text content after the verse number
        let verseText = "";
        let nextNode = verseElement.nextSibling;

        while (
          nextNode &&
          (!nextNode.classList ||
            (!nextNode.classList.contains("v") &&
              !nextNode.hasAttribute("data-number")))
        ) {
          if (nextNode.textContent) {
            verseText += nextNode.textContent;
          }
          nextNode = nextNode.nextSibling;
        }

        // Clean up the text (remove extra spaces, etc.)
        verseText = verseText.trim().replace(/\s+/g, " ");

        verses.push({ id: verseId, text: verseText });
      }
    });

    // If no verses were found using the DOM method, try regex fallback
    if (verses.length === 0) {
      const verseRegex =
        /<span data-number="(\d+)" data-id="\d+" class="v">(\d+)<\/span>/g;
      let match;
      let lastIndex = 0;

      while ((match = verseRegex.exec(content)) !== null) {
        const verseNum = parseInt(match[1]);
        const verseStart = match.index + match[0].length;

        // Find the next verse or end of content
        let verseEnd = content.length;
        const nextVerseMatch = verseRegex.exec(content);
        if (nextVerseMatch) {
          verseEnd = nextVerseMatch.index;
          verseRegex.lastIndex = verseStart; // Reset for next iteration
        }

        const verseText = content
          .substring(verseStart, verseEnd)
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .trim();

        verses.push({ id: verseNum, text: verseText });
      }
    }

    // If still no verses found, return the entire content as a single verse
    if (verses.length === 0) {
      const cleanText = content.replace(/<[^>]*>/g, "").trim();
      return [{ id: 1, text: cleanText }];
    }

    return verses;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setShowSearchResults(false);
      return;
    }

    if (searchType === "books") {
      // Filter books based on search query
      const results = books.filter(
        (book) =>
          book.name.toLowerCase().includes(search.toLowerCase()) ||
          (book.abbreviation &&
            book.abbreviation.toLowerCase().includes(search.toLowerCase()))
      );

      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      // Search within verses
      try {
        setLoading(true);
        let searchResponse;

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          searchResponse = await fetch(
            `${BOLLS_URL}/search/${version}/${encodeURIComponent(search)}/`
          );
        } else {
          // Fix for English Bible API - use the correct endpoint format
          searchResponse = await fetch(
            `${BASE_URL}/${version}/search?query=${encodeURIComponent(search)}`,
            {
              headers: {
                "api-key": API_KEY,
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (!searchResponse.ok) {
          const errorData = await searchResponse.json().catch(() => ({}));
          throw new Error(
            `Search failed: ${searchResponse.status} ${searchResponse.statusText}`
          );
        }

        const data = await searchResponse.json();

        // Format search results based on API response
        let formattedResults = [];

        if (["TBSI", "TAMBL98", "TAMOVR"].includes(version)) {
          // Tamil Bible search results format
          formattedResults = data.map((item) => ({
            book: item.book,
            chapter: item.chapter,
            verse: item.verse,
            text: item.text,
          }));
        } else {
          // English Bible search results format - handle different response structures
          if (data.data && data.data.verses) {
            formattedResults = data.data.verses.map((verse) => ({
              book: verse.bookId,
              chapter: verse.chapterId,
              verse: verse.id || verse.verseId,
              text: verse.text || verse.content,
            }));
          } else if (Array.isArray(data)) {
            formattedResults = data.map((item) => ({
              book: item.bookId || item.book,
              chapter: item.chapterId || item.chapter,
              verse: item.verseId || item.verse,
              text: item.text || item.content,
            }));
          }
        }

        setVerseSearchResults(formattedResults);
        setShowSearchResults(true);
      } catch (err) {
        console.error("Search error:", err);
        setVerseSearchResults([]);
        setShowSearchResults(true);

        // Show error message to user
        setError(`Search failed: ${err.message}`);
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const highlightColors = {
    yellow: { bg: "#FFEB3B", darkBg: "#FBC02D", text: "#000" },
    blue: { bg: "#42A5F5", darkBg: "#1976D2", text: "#000" },
    green: { bg: "#66BB6A", darkBg: "#388E3C", text: "#000" },
    pink: { bg: "#F48FB1", darkBg: "#D81B60", text: "#000" },
    purple: { bg: "#BA68C8", darkBg: "#7B1FA2", text: "#000" },
    orange: { bg: "#FFB74D", darkBg: "#F57C00", text: "#000" },
  };

  const selectBookFromSearch = (book) => {
    setBook(book.id);
    setSelectedBook({ id: book.id, name: book.name });
    setShowChapterModal(true);
    setSearch("");
    setShowSearchResults(false);
  };

  const selectVerseFromSearch = (result) => {
    // Ensure book ID is in the correct format (uppercase 3-4 letters)
    const bookId =
      result.book.length <= 4 ? result.book.toUpperCase() : result.book;

    // Check if the book exists in our books list
    const bookExists = books.some((b) => b.id === bookId);

    if (bookExists) {
      setBook(bookId);
      setChapter(parseInt(result.chapter));
      setShowSearchResults(false);
      setSearch("");

      // Scroll to the verse after a short delay to allow content to load
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${result.verse}`);
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
          verseElement.classList.add("bg-yellow-300", "animate-pulse");
          setTimeout(() => {
            verseElement.classList.remove("bg-yellow-300", "animate-pulse");
          }, 3000);
        }
      }, 1000);
    } else {
      // If book doesn't exist, show error
      setError(`Book ${bookId} not found in current version`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleBookChange = (selectedBookId) => {
    setBook(selectedBookId);
    const selectedBookName = books.find((b) => b.id === selectedBookId)?.name;
    setSelectedBook({ id: selectedBookId, name: selectedBookName });
    setShowChapterModal(true);
  };

  const selectChapter = (chapterNum) => {
    setBook(selectedBook.id);
    setChapter(chapterNum);
    setShowChapterModal(false);
    stopTTS();
  };

  const handleVersionChange = (e) => {
    setVersion(e.target.value);
    setShowParallel(false);
    stopTTS();
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

  const navigateChapter = (direction) => {
    if (direction === "prev" && chapter > 1) {
      setChapter(chapter - 1);
    } else if (direction === "next") {
      setChapter(chapter + 1);
    }
    stopTTS();
  };

  // Bookmark Functions
  const toggleBookmark = () => {
    const currentBookmark = {
      book,
      chapter,
      version,
      bookName: books.find((b) => b.id === book)?.name || book,
      timestamp: new Date().toISOString(),
    };

    // Check if already bookmarked
    const isBookmarked = bookmarks.some(
      (b) => b.book === book && b.chapter === chapter && b.version === version
    );

    if (isBookmarked) {
      // Remove bookmark
      setBookmarks(
        bookmarks.filter(
          (b) =>
            !(b.book === book && b.chapter === chapter && b.version === version)
        )
      );
    } else {
      // Add bookmark
      setBookmarks([...bookmarks, currentBookmark]);
    }
  };

  const isCurrentBookmarked = () => {
    return bookmarks.some(
      (b) => b.book === book && b.chapter === chapter && b.version === version
    );
  };

  const goToBookmark = (bookmark) => {
    setBook(bookmark.book);
    setChapter(bookmark.chapter);
    setVersion(bookmark.version);
    setShowBookmarks(false);
    stopTTS();
  };

  const removeBookmark = (bookmarkToRemove, e) => {
    e.stopPropagation();
    setBookmarks(
      bookmarks.filter(
        (b) =>
          !(
            b.book === bookmarkToRemove.book &&
            b.chapter === bookmarkToRemove.chapter &&
            b.version === bookmarkToRemove.version
          )
      )
    );
  };

  // Share Functions
  const shareContent = () => {
    const bookName = books.find((b) => b.id === book)?.name || book;
    const versionName =
      versions.find((v) => v.id === version)?.displayName || version;
    const text = `${bookName} ${chapter} (${versionName})`;
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: "Bible Reading",
          text: `Check out this Bible passage: ${text}`,
          url: url,
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          copyToClipboard(`${text} - ${url}`);
        });
    } else {
      copyToClipboard(`${text} - ${url}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // TTS Functions
  const playTTS = () => {
    if (!verses.length || isTamilVersion) return;

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      setHighlightedVerse(null);
      return;
    }

    const fullText = verses.map((v) => v.text).join(". ");
    const utterance = new SpeechSynthesisUtterance(fullText);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;
    utterance.volume = ttsVolume;

    utterance.onstart = () => {
      setIsPlayingTTS(true);
    };

    utterance.onend = () => {
      setIsPlayingTTS(false);
      setHighlightedVerse(null);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsPlayingTTS(false);
      setHighlightedVerse(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopTTS = () => {
    window.speechSynthesis.cancel();
    setIsPlayingTTS(false);
    setHighlightedVerse(null);
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
            <div
              key={verse.id}
              id={`verse-${verse.id}`}
              className="relative group"
              onMouseUp={(e) => handleTextSelection(verse.id, e)}
            >
              <p
                className="leading-relaxed select-text"
                style={{
                  lineHeight:
                    lineHeight === "compact"
                      ? "1.4"
                      : lineHeight === "normal"
                      ? "1.6"
                      : "1.8",
                }}
              >
                {showNumbers && verse.id && (
                  <sup className="text-gray-500 text-xs mr-1">{verse.id}</sup>
                )}
                {renderHighlightedText(verse)}
              </p>

              {/* Full verse highlight button */}
              <button
                onClick={() => toggleHighlight(verse.id)}
                className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-white shadow border"
                title="Highlight entire verse"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Highlight Palette - Fixed positioning at center of viewport */}
        {showHighlightPalette && (
          <div
            className="fixed bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-50 flex items-center gap-2"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {isTamilUI()
                ? tamilTranslations.highlightSelection
                : "Highlight selection:"}
            </span>
            <div className="flex gap-1">
              {Object.entries(highlightColors).map(([color, colorInfo]) => (
                <button
                  key={color}
                  onClick={() =>
                    addPartialHighlight(currentVerseForHighlight, color)
                  }
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-800 transition-all"
                  style={{ backgroundColor: colorInfo.bg }}
                  title={`Highlight with ${color}`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                window.getSelection().removeAllRanges();
                setIsSelectingText(false);
                setSelectionRange(null);
                setCurrentVerseForHighlight(null);
                setShowHighlightPalette(false);
              }}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Add useEffect to handle scroll and resize events to reposition the palette

  const getTextSettingsStyles = () => {
    let styles = {};

    if (fontSize === "small") styles.fontSize = "0.875rem";
    else if (fontSize === "medium") styles.fontSize = "1rem";
    else if (fontSize === "large") styles.fontSize = "1.25rem";

    if (fontFamily === "Inter") styles.fontFamily = "'Inter', sans-serif";
    else if (fontFamily === "Serif") styles.fontFamily = "'Georgia', serif";
    else if (fontFamily === "OpenDyslexic")
      styles.fontFamily = "'OpenDyslexic', sans-serif";
    else if (fontFamily === "Atkinson")
      styles.fontFamily = "'Atkinson Hyperlegible', sans-serif";
    else if (fontFamily === "Roboto")
      styles.fontFamily = "'Roboto', sans-serif";

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
      if (window.innerWidth >= 768) {
        setArrowFixed(footerRect.top >= window.innerHeight - 80);
      }
      if (window.innerWidth < 768) {
        setArrowFixedMobile(footerRect.top >= window.innerHeight - 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderTTSSettings = () => (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {isTamilUI()
          ? tamilTranslations.textToSpeechSettings
          : "Text-to-Speech Settings"}
      </h3>

      {isTamilVersion ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>
            {isTamilUI()
              ? tamilTranslations.ttsNotAvailable
              : "Text-to-Speech is not available for Tamil versions."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {isTamilUI() ? tamilTranslations.ttsVoice : "Voice"}
            </label>
            <select
              value={selectedVoice ? selectedVoice.name : ""}
              onChange={(e) => {
                const voice = ttsVoices.find((v) => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {ttsVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {isTamilUI()
                ? `${tamilTranslations.ttsSpeed}: ${ttsRate.toFixed(1)}`
                : `Speed: ${ttsRate.toFixed(1)}`}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={ttsRate}
              onChange={(e) => setTtsRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {isTamilUI()
                ? `${tamilTranslations.ttsPitch}: ${ttsPitch.toFixed(1)}`
                : `Pitch: ${ttsPitch.toFixed(1)}`}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={ttsPitch}
              onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {isTamilUI()
                ? `${tamilTranslations.ttsVolume}: ${ttsVolume.toFixed(1)}`
                : `Volume: ${ttsVolume.toFixed(1)}`}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={ttsVolume}
              onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={playTTS}
              className={`px-4 py-2 rounded-md font-medium ${
                isPlayingTTS
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isPlayingTTS
                ? isTamilUI()
                  ? tamilTranslations.stopReading
                  : "Stop Reading"
                : isTamilUI()
                ? tamilTranslations.readAloud
                : "Read Aloud"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white"
          : theme === "sepia"
          ? "bg-amber-50 text-amber-900"
          : "bg-gradient-to-br from-white via-blue-100 to-blue-300 text-gray-900"
      }`}
    >
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-center">
              Choose your device
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleOSSelection("android")}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17.523 15.341a1 1 0 01-1.394.248 1 1 0 01-.248-1.394 1 1 0 011.394-.248 1 1 0 01.248 1.394zm-11.046 0a1 1 0 001.394.248 1 1 0 00.248-1.394 1 1 0 00-1.394-.248 1 1 0 00-.248 1.394zM6 10a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2zM3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7zm4-2a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H7z"
                  />
                </svg>
                Google Play Store
              </button>
              <button
                onClick={() => handleOSSelection("ios")}
                className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"
                  />
                </svg>
                Apple App Store
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
            >
              {isTamilUI() ? tamilTranslations.cancel : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">
                {isTamilUI() ? "புத்தகக்குறிகள்" : "Bookmarks"}
              </h3>
              <button
                onClick={() => setShowBookmarks(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <div className="p-4">
              {bookmarks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No bookmarks yet
                </p>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => (
                    <div
                      key={index}
                      onClick={() => goToBookmark(bookmark)}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">
                          {bookmark.bookName} {bookmark.chapter}
                        </div>
                        <div className="text-sm text-gray-500">
                          {
                            versions.find((v) => v.id === bookmark.version)
                              ?.displayName
                          }
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeBookmark(bookmark, e)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowBookmarks(false)}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                {isTamilUI() ? tamilTranslations.close : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text Settings Modal */}
      {openSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-gray-900 dark:via-slate-800 dark:to-black rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-gray-800">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 p-6 pb-4 sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-2xl">
              <h3 className="text-xl font-extrabold bg-gradient-to-r from-gray-700 via-slate-500 to-gray-300 bg-clip-text text-transparent">
                {isTamilUI() ? tamilTranslations.textSettings : "Text Settings"}
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
                {isTamilUI() ? tamilTranslations.fontSize : "FONT SIZE"}
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setFontSize("small")}
                  className={`px-2 py-3 md:px-4 md:py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "small"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Aa</span>
                </button>
                <button
                  onClick={() => setFontSize("medium")}
                  className={`px-2 py-3 md:px-4 md:py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "medium"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-base">AA</span>
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2 py-3 md:px-4 md:py-2 rounded-lg font-semibold shadow transition ${
                    fontSize === "large"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-lg">AAA</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                {isTamilUI() ? tamilTranslations.fontFamily : "FONT FAMILY"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setFontFamily("Inter")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    fontFamily === "Inter"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Sans</span>
                </button>
                <button
                  onClick={() => setFontFamily("Serif")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    fontFamily === "Serif"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm font-serif">Serif</span>
                </button>
                <button
                  onClick={() => setFontFamily("OpenDyslexic")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    fontFamily === "OpenDyslexic"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Dyslexic</span>
                </button>
                <button
                  onClick={() => setFontFamily("Atkinson")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    fontFamily === "Atkinson"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Legible</span>
                </button>
                <button
                  onClick={() => setFontFamily("Roboto")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    fontFamily === "Roboto"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Roboto</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                {isTamilUI() ? tamilTranslations.lineHeight : "LINE HEIGHT"}
              </h4>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setLineHeight("compact")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    lineHeight === "compact"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Compact</span>
                </button>
                <button
                  onClick={() => setLineHeight("normal")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    lineHeight === "normal"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Normal</span>
                </button>
                <button
                  onClick={() => setLineHeight("spacious")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    lineHeight === "spacious"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Spacious</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                {isTamilUI() ? tamilTranslations.theme : "THEME"}
              </h4>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    theme === "light"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("sepia")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    theme === "sepia"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Sepia</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-2 py-3 rounded-lg font-semibold shadow transition ${
                    theme === "dark"
                      ? "bg-slate-700 text-white scale-105"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">Dark</span>
                </button>
              </div>

              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 tracking-wide">
                {isTamilUI()
                  ? tamilTranslations.highlightColor
                  : "HIGHLIGHT COLOR"}
              </h4>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {["yellow", "blue", "green", "pink", "purple", "orange"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => setHighlightColor(color)}
                      className={`p-3 rounded-lg font-semibold shadow transition ${
                        highlightColor === color
                          ? "ring-2 ring-gray-700 scale-105"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: `var(--${color}-200)` }}
                    >
                      <div
                        className="w-6 h-6 rounded-full mx-auto"
                        style={{ backgroundColor: `var(--${color}-500)` }}
                      ></div>
                    </button>
                  )
                )}
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
                    {isTamilUI()
                      ? tamilTranslations.showFootnotes
                      : "Show Footnotes"}
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
                    {isTamilUI()
                      ? tamilTranslations.showVerseNumbers
                      : "Show Verse Numbers"}
                  </span>
                </label>
              </div>

              {renderTTSSettings()}
            </div>

            <div className="border-t border-slate-200 dark:border-gray-700 p-6 flex justify-end sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-2xl">
              <button
                onClick={() => setOpenSettings(false)}
                className="px-6 py-2 bg-gradient-to-r from-gray-700 via-slate-500 to-gray-300 text-white rounded-lg font-bold shadow hover:scale-105 transition"
              >
                {isTamilUI() ? tamilTranslations.done : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className={`w-full sticky top-0 z-40 shadow-lg ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-900 via-blue-900 to-black border-b border-gray-800"
            : theme === "sepia"
            ? "bg-amber-100 border-b border-amber-200"
            : "bg-gradient-to-r from-white via-blue-200 to-blue-400 border-b border-blue-200"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] bg-clip-text text-transparent">
              Reading aMusicBible
            </h1>
          </div>

          {/* Desktop Search - Fixed */}
          <div
            className="hidden md:block flex-1 max-w-xl mx-4 relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-blue-400" />
              </div>
              <input
                type="text"
                placeholder={
                  searchType === "books"
                    ? isTamilUI()
                      ? tamilTranslations.searchBooks
                      : "Search Bible books..."
                    : isTamilUI()
                    ? tamilTranslations.searchVerses
                    : "Search verses..."
                }
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (searchType === "books" && e.target.value.trim()) {
                    const results = books.filter(
                      (book) =>
                        book.name
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                        (book.abbreviation &&
                          book.abbreviation
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()))
                    );
                    setSearchResults(results);
                    setShowSearchResults(true);
                  } else {
                    setShowSearchResults(false);
                  }
                }}
                onFocus={() => {
                  if (
                    search.trim() &&
                    searchResults.length > 0 &&
                    searchType === "books"
                  ) {
                    setShowSearchResults(true);
                  }
                }}
                className="block w-full pl-10 pr-20 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white shadow"
              />
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 pr-4">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="books">
                    {isTamilUI() ? tamilTranslations.book : "Books"}
                  </option>
                  <option value="verses">
                    {isTamilUI() ? tamilTranslations.verse : "Verses"}
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
              >
                {isTamilUI() ? tamilTranslations.go : "Go"}
              </button>
            </form>

            {/* Mobile Search Results Dropdown */}
            {showSearchResults &&
              searchType === "books" &&
              searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectBookFromSearch(book)}
                    >
                      <div className="font-medium text-gray-900">
                        {book.name}
                      </div>
                      {book.abbreviation && (
                        <div className="text-sm text-gray-500">
                          {book.abbreviation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            {showSearchResults &&
              searchType === "books" &&
              searchResults.length === 0 &&
              search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <div className="text-gray-500">
                    {isTamilUI()
                      ? tamilTranslations.noBooksFound
                      : 'No books found matching "' + search + '"'}
                  </div>
                </div>
              )}

            {showSearchResults &&
              searchType === "verses" &&
              verseSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {verseSearchResults.map((result, index) => {
                    const bookName =
                      books.find((b) => b.id === result.book)?.name ||
                      result.book;
                    return (
                      <div
                        key={index}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => selectVerseFromSearch(result)}
                      >
                        <div className="font-medium text-gray-900">
                          {bookName} {result.chapter}:{result.verse}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {result.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            {showSearchResults &&
              searchType === "verses" &&
              verseSearchResults.length === 0 &&
              search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                  <div className="text-gray-500">
                    {isTamilUI()
                      ? tamilTranslations.noVersesFound
                      : 'No verses found matching "' + search + '"'}
                  </div>
                </div>
              )}
          </div>

          <div className="flex gap-3 items-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.faite.project.music_bible_music_player"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={GooglePlayImg}
                alt="Google Play"
                className="h-10 w-auto rounded  hover:scale-105 transition cursor-pointer"
              />
            </a>

            <a
              href="https://apps.apple.com/app/id6618135650"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={AppStoreImg}
                alt="App Store"
                className="h-10 w-auto rounded  hover:scale-105 transition cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 py-2 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <FiSearch className="text-blue-400" />
            </div>
            <input
              type="text"
              placeholder={
                searchType === "books"
                  ? isTamilUI()
                    ? tamilTranslations.searchBooks
                    : "Search Bible books..."
                  : isTamilUI()
                  ? tamilTranslations.searchVerses
                  : "Search verses..."
              }
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (searchType === "books" && e.target.value.trim()) {
                  const results = books.filter(
                    (book) =>
                      book.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      (book.abbreviation &&
                        book.abbreviation
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()))
                  );
                  setSearchResults(results);
                  setShowSearchResults(true);
                } else {
                  setShowSearchResults(false);
                }
              }}
              onFocus={() => {
                if (
                  search.trim() &&
                  searchResults.length > 0 &&
                  searchType === "books"
                ) {
                  setShowSearchResults(true);
                }
              }}
              className={`block w-full  pl-6 pr-32 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white shadow ${
                isTamilUI() ? "text-xs md:text-xl text-center" : "text-sm"
              }`}
            />
            <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="books">
                  {isTamilUI() ? tamilTranslations.book : "Books"}
                </option>
                <option value="verses">
                  {isTamilUI() ? tamilTranslations.verse : "Verses"}
                </option>
              </select>
            </div>
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white px-1 py-1 rounded-md text-sm font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isTamilUI() ? tamilTranslations.go : "Go"}
            </button>
          </form>

          {/* Mobile Search Results Dropdown */}
          {showSearchResults &&
            searchType === "books" &&
            searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => selectBookFromSearch(book)}
                  >
                    <div className="font-medium text-gray-900">{book.name}</div>
                    {book.abbreviation && (
                      <div className="text-sm text-gray-500">
                        {book.abbreviation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          {showSearchResults &&
            searchType === "books" &&
            searchResults.length === 0 &&
            search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                <div className="text-gray-500">
                  {isTamilUI()
                    ? tamilTranslations.noBooksFound
                    : 'No books found matching "' + search + '"'}
                </div>
              </div>
            )}

          {showSearchResults &&
            searchType === "verses" &&
            verseSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {verseSearchResults.map((result, index) => {
                  const bookName =
                    books.find((b) => b.id === result.book)?.name ||
                    result.book;
                  return (
                    <div
                      key={index}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectVerseFromSearch(result)}
                    >
                      <div className="font-medium text-gray-900">
                        {bookName} {result.chapter}:{result.verse}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {result.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          {showSearchResults &&
            searchType === "verses" &&
            verseSearchResults.length === 0 &&
            search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                <div className="text-gray-500">
                  {isTamilUI()
                    ? tamilTranslations.noVersesFound
                    : 'No verses found matching "' + search + '"'}
                </div>
              </div>
            )}
        </div>

        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 border-t md:gap-8 md:px-8 overflow-x-auto ${
            theme === "dark"
              ? "border-gray-700"
              : theme === "sepia"
              ? "border-amber-200"
              : "border-blue-200"
          }`}
        >
          {/* First row: Book selection and Chapter number */}
          <div className="flex items-center gap-2 min-w-max mb-2 md:mb-0">
            <select
              value={book}
              onChange={(e) => handleBookChange(e.target.value)}
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

            <span className="font-semibold text-base">
              {isTamilUI() ? tamilTranslations.chapter : "Chapter"} {chapter}
            </span>
          </div>

          {/* Desktop: Version selection and buttons on the right side */}
          <div className="hidden md:flex items-center gap-2 min-w-max">
            {/* Move parallel version select to left when parallel view is active */}
            {showParallel && (
              <div className="flex items-center justify-center gap-2 px-3 py-3 md:gap-8 md:px-8 scroll-hide overflow-x-auto">
                <span className="text-base font-semibold">
                  {isTamilUI()
                    ? tamilTranslations.ttsParallelVersion
                    : "Parallel Version:"}
                </span>
                <select
                  value={parallelVersion || ""}
                  onChange={(e) => setParallelVersion(e.target.value)}
                  className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg ${
                    theme === "dark" ? "text-gray-900" : "text-blue-900"
                  }`}
                  style={{ minWidth: "160px" }}
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

            <select
              value={version}
              onChange={handleVersionChange}
              className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg ${
                theme === "dark" ? "text-gray-900" : "text-blue-900"
              }`}
              disabled={loading}
              style={{ minWidth: "160px" }}
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
                  : theme === "sepia"
                  ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              } transition`}
            >
              <span className="hidden md:inline">📑</span>{" "}
              {isTamilUI() ? tamilTranslations.parallel : "Parallel"}
            </button>

            <button
              onClick={playTTS}
              disabled={isTamilVersion}
              className={`w-10 h-10 flex items-center justify-center rounded-full border shadow ${
                isPlayingTTS
                  ? "bg-red-500 text-white"
                  : isTamilVersion
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-gray-800 text-blue-300 hover:bg-blue-900"
                  : theme === "sepia"
                  ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              } transition`}
              title={
                isTamilVersion
                  ? isTamilUI()
                    ? "தமிழ் பதிப்புகளுக்கு TTS கிடைக்கவில்லை"
                    : "TTS not available for Tamil versions"
                  : isTamilUI()
                  ? tamilTranslations.readAloud
                  : "Read aloud"
              }
            >
              {isPlayingTTS ? <FiPause /> : <FiVolume2 />}
            </button>

            <button
              onClick={() => setOpenSettings(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full border shadow bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-lg"
            >
              AA
            </button>
          </div>

          {/* Mobile: Version selection and buttons in separate rows */}
          <div className="md:hidden w-full">
            {/* Parallel version selection for mobile view */}
            {showParallel && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold">
                  {isTamilUI()
                    ? tamilTranslations.ttsParallelVersion
                    : "Parallel Version:"}
                </span>
                <select
                  value={parallelVersion || ""}
                  onChange={(e) => setParallelVersion(e.target.value)}
                  className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg flex-1 ${
                    theme === "dark" ? "text-gray-900" : "text-blue-900"
                  }`}
                  style={{ minWidth: "120px" }}
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

            {/* Version selection row */}
            <div className="flex items-center gap-2 min-w-max mb-2">
              <select
                value={version}
                onChange={handleVersionChange}
                className={`bg-white shadow outline-none px-3 py-2 font-semibold text-base rounded-lg flex-1 ${
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
            </div>

            {/* Action buttons row - left aligned */}
            <div className="flex items-center gap-2 min-w-max justify-start">
              <button
                onClick={toggleParallelView}
                className={`flex items-center gap-1 text-base font-semibold px-3 py-2 rounded-lg shadow ${
                  showParallel
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-blue-300 hover:bg-blue-900"
                    : theme === "sepia"
                    ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } transition`}
              >
                <span className="hidden md:inline">📑</span>{" "}
                {isTamilUI() ? tamilTranslations.parallel : "Parallel"}
              </button>

              <button
                onClick={playTTS}
                disabled={isTamilVersion}
                className={`w-10 h-10 flex items-center justify-center rounded-full border shadow ${
                  isPlayingTTS
                    ? "bg-red-500 text-white"
                    : isTamilVersion
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-gray-800 text-blue-300 hover:bg-blue-900"
                    : theme === "sepia"
                    ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } transition`}
                title={
                  isTamilVersion
                    ? isTamilUI()
                      ? "தமிழ் பதிப்புகளுக்கு TTS கிடைக்கவில்லை"
                      : "TTS not available for Tamil versions"
                    : isTamilUI()
                    ? tamilTranslations.readAloud
                    : "Read aloud"
                }
              >
                {isPlayingTTS ? <FiPause /> : <FiVolume2 />}
              </button>

              <button
                onClick={() => setOpenSettings(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full border shadow bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-lg"
              >
                AA
              </button>
            </div>
          </div>
        </div>
      </header>

      {showChapterModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">
                {isTamilUI()
                  ? tamilTranslations.selectChapter
                  : "Select Chapter"}{" "}
                - {selectedBook.name}
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
            <div className="p-4 border-t">
              <button
                onClick={() => setShowChapterModal(false)}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                {isTamilUI() ? tamilTranslations.cancel : "Cancel"}
              </button>
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
          } left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] hover:from-[#00CCFF] hover:via-[#0979F0] hover:to-[#0979F0] transition disabled:opacity-40 z-40`}
          style={!arrowFixed ? { top: "auto", bottom: "120px" } : {}}
        >
          <FiChevronLeft className="text-4xl text-blue-500 drop-shadow" />
        </button>

        <button
          onClick={() => navigateChapter("next")}
          disabled={loading}
          className={`hidden md:flex ${
            arrowFixed ? "fixed" : "absolute"
          } right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 items-center justify-center rounded-full border-4 border-blue-500 shadow-xl bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] hover:from-[#00CCFF] hover:via-[#0979F0] hover:to-[#0979F0] transition disabled:opacity-40 z-40`}
          style={!arrowFixed ? { top: "auto", bottom: "120px" } : {}}
        >
          <FiChevronRight className="text-4xl text-blue-500 drop-shadow" />
        </button>

        {/* Mobile Chapter Navigation - Fixed to bottom corners */}
        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-between px-4 z-40 pointer-events-none">
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
            fontFamily === "Serif"
              ? "font-serif"
              : fontFamily === "OpenDyslexic"
              ? "font-opendyslexic"
              : fontFamily === "Atkinson"
              ? "font-atkinson"
              : fontFamily === "Roboto"
              ? "font-roboto"
              : "font-sans"
          }`}
          style={getTextSettingsStyles()}
        >
          {loading ? (
            <div
              className={`flex flex-col items-center justify-center py-16 ${
                isTamilUI() ? "text-center w-full" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 animate-pulse mb-4 mx-auto"></div>
              <span className="text-xl font-semibold text-blue-600 block mx-auto">
                {isTamilUI()
                  ? "பைபிள் உள்ளடக்கம் ஏற்றுகிறது..."
                  : "Loading Bible content..."}
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-semibold">
              {error}
            </div>
          ) : (
            <>
              <div
                className={`rounded-2xl shadow-xl p-6 md:p-10 mb-8 border ${
                  theme === "dark"
                    ? "bg-gray-900/80 border-gray-800"
                    : theme === "sepia"
                    ? "bg-amber-100/90 border-amber-200"
                    : "bg-white/80 border-blue-100"
                }`}
              >
                <h2 className="text-center text-2xl md:text-3xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-700 via-blue-400 to-blue-200 bg-clip-text text-transparent mb-4">
                  {books.find((b) => b.id === book)?.name || book}{" "}
                  <span className="text-blue-500">{chapter}</span>
                </h2>

                <div
                  className={`flex flex-col md:flex-row gap-8 mt-6 ${
                    isTamilVersion
                      ? "items-center justify-center text-center"
                      : ""
                  }`}
                >
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
                    <h4 className="font-bold mb-2">
                      {isTamilUI() ? tamilTranslations.footnotes : "Footnotes"}
                    </h4>
                    <p>
                      1:{" "}
                      {isTamilUI()
                        ? tamilTranslations.footnoteExample
                        : "Example footnote explaining something about the text."}
                    </p>
                  </div>
                )}

                <div
                  className="mt-8 flex flex-wrap justify-center gap-2 md:justify-between items-center"
                  id="bible-footer"
                  ref={footerRef}
                >
                  <button
                    onClick={() => setShowFooterNotes(true)}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white font-semibold shadow hover:scale-105 transition"
                  >
                    <FiEdit className="text-sm md:text-base" />
                    <span className="hidden xs:inline">
                      {isTamilUI() ? tamilTranslations.notes : "Notes"} (
                      {getCurrentChapterNotes().length})
                    </span>
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold shadow hover:scale-105 transition bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white ${
                      isCurrentBookmarked() ? "opacity-80" : ""
                    }`}
                  >
                    <FiBookmark className="text-sm md:text-base" />
                    <span className="hidden xs:inline">
                      {isCurrentBookmarked()
                        ? isTamilUI()
                          ? tamilTranslations.bookmarked
                          : "Bookmarked"
                        : isTamilUI()
                        ? tamilTranslations.bookmark
                        : "Bookmark"}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowBookmarks(true)}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white font-semibold shadow hover:scale-105 transition"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span className="hidden sm:inline">
                      {" "}
                      {isTamilUI()
                        ? tamilTranslations.viewBookmarks
                        : "View Bookmarks"}
                    </span>
                  </button>

                  <button
                    onClick={shareContent}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white font-semibold shadow hover:scale-105 transition"
                  >
                    <FiShare2 className="text-sm md:text-base" />
                    <span className="hidden xs:inline">
                      {isTamilUI() ? tamilTranslations.share : "Share"}
                    </span>
                  </button>
                </div>

                {showFooterNotes && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
                        <h3 className="text-lg font-bold">
                          {isTamilUI() ? "அதிகார குறிப்புகள்" : "Chapter Notes"}{" "}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowAddNote(true)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            title="Add new note"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                          <button
                            onClick={() => setShowFooterNotes(false)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      </div>

                      {/* Add/Edit Note Form */}
                      {showAddNote && (
                        <div className="p-4 border-b bg-gray-50">
                          <textarea
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder={
                              isTamilUI()
                                ? "உங்கள் குறிப்பை இங்கே தட்டச்சு செய்க..."
                                : "Type your note here..."
                            }
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={
                                editingNote ? updateFooterNote : addFooterNote
                              }
                              className="px-4 py-2 bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white rounded-lg hover:opacity-90"
                            >
                              {editingNote ? "Update" : "Add"} Note
                            </button>
                            <button
                              onClick={cancelNoteEdit}
                              className="px-4 py-2 bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white rounded-lg hover:opacity-90"
                            >
                              {isTamilUI()
                                ? tamilTranslations.cancel
                                : "Cancel"}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        {getCurrentChapterNotes().length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <FiEdit className="text-4xl mx-auto mb-4 text-gray-300" />
                            <p>
                              {isTamilUI()
                                ? tamilTranslations.noNotes
                                : "No notes yet for this chapter"}
                            </p>
                            <button
                              onClick={() => setShowAddNote(true)}
                              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] text-white rounded-lg hover:opacity-90"
                            >
                              {isTamilUI()
                                ? tamilTranslations.addFirstNote
                                : "Add First Note"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {getCurrentChapterNotes()
                              .sort(
                                (a, b) =>
                                  new Date(b.timestamp) - new Date(a.timestamp)
                              )
                              .map((note) => (
                                <div
                                  key={note.id}
                                  className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        note.timestamp
                                      ).toLocaleDateString()}{" "}
                                      at{" "}
                                      {new Date(
                                        note.timestamp
                                      ).toLocaleTimeString()}
                                    </span>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => startEditingNote(note)}
                                        className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                                        title="Edit note"
                                      >
                                        <FiEdit className="text-sm" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteFooterNote(note.id)
                                        }
                                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                                        title="Delete note"
                                      >
                                        <FiTrash2 className="text-sm" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-gray-800 whitespace-pre-wrap">
                                    {note.text}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t sticky bottom-0 bg-white">
                        <button
                          onClick={() => setShowFooterNotes(false)}
                          className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                        >
                          {isTamilUI() ? "மூடு" : "Close"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showBookmarks && (
                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto mx-4">
                      <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
                        <h3 className="text-lg font-bold">
                          {isTamilUI() ? "புத்தகக்குறிகள்" : "Bookmarks"}
                        </h3>
                        <button
                          onClick={() => setShowBookmarks(false)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <FiX className="text-lg" />
                        </button>
                      </div>
                      <div className="p-4">
                        {bookmarks.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">
                            {isTamilUI()
                              ? tamilTranslations.noBookmarks
                              : "No bookmarks yet"}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {bookmarks.map((bookmark, index) => (
                              <div
                                key={index}
                                onClick={() => goToBookmark(bookmark)}
                                className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {bookmark.bookName} {bookmark.chapter}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {
                                      versions.find(
                                        (v) => v.id === bookmark.version
                                      )?.displayName
                                    }
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => removeBookmark(bookmark, e)}
                                  className="p-1 text-red-500 hover:bg-red-100 rounded-full flex-shrink-0 ml-2"
                                >
                                  <FiX />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-4 border-t sticky bottom-0 bg-white">
                        <button
                          onClick={() => setShowBookmarks(false)}
                          className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                        >
                          {isTamilUI() ? "மூடு" : "Close"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap");

        @font-face {
          font-family: "OpenDyslexic";
          src: url("https://dyslexicfonts.com/fonts/OpenDyslexic-Regular.otf");
          font-style: normal;
          font-weight: normal;
        }

        .font-opendyslexic {
          font-family: "OpenDyslexic", sans-serif;
        }

        .font-atkinson {
          font-family: "Atkinson Hyperlegible", sans-serif;
        }

        .font-roboto {
          font-family: "Roboto", sans-serif;
        }
      `}</style>
    </div>
  );
}
