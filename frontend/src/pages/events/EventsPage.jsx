import React, { useState, useMemo } from "react";

import EventCard from "../../components/events/EventCard";
import "../../styles/eventsPage.css";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "React Summit 2025",
    category: "Tech",
    club: "Dev Club",
    date: "2025-04-10",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    description:
      "Deep dive into React 19 features, concurrent rendering and server components.",
    attendees: 320,
    location: "Main Auditorium",
  },
  {
    id: 2,
    title: "UI/UX Design Bootcamp",
    category: "Design",
    club: "Design Society",
    date: "2025-04-08",
    status: "live",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    description:
      "Hands-on workshop covering Figma, design systems, and user research.",
    attendees: 180,
    location: "Design Lab",
  },
  {
    id: 3,
    title: "Hackathon: Build for Good",
    category: "Hackathon",
    club: "Coding Club",
    date: "2025-03-28",
    status: "past",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    description:
      "48-hour hackathon focused on social impact and sustainability.",
    attendees: 500,
    location: "Innovation Hub",
  },
  {
    id: 4,
    title: "Photography Walk",
    category: "Arts",
    club: "Photography Club",
    date: "2025-04-15",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80",
    description:
      "Capture the beauty of the campus with your lens. All skill levels welcome.",
    attendees: 60,
    location: "Campus Garden",
  },
  {
    id: 5,
    title: "AI & Machine Learning Talk",
    category: "Tech",
    club: "AI Society",
    date: "2025-04-08",
    status: "live",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
    description:
      "Industry leaders discuss the future of AI, LLMs, and responsible tech.",
    attendees: 410,
    location: "Lecture Hall B",
  },
  {
    id: 6,
    title: "Open Mic Night",
    category: "Arts",
    club: "Cultural Club",
    date: "2025-03-20",
    status: "past",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    description:
      "A night of poetry, stand-up, and live music by student artists.",
    attendees: 230,
    location: "Amphitheatre",
  },
  {
    id: 7,
    title: "Startup Pitch Competition",
    category: "Business",
    club: "Entrepreneurship Cell",
    date: "2025-04-20",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1559523161-0fc0d8b814b4?w=400&q=80",
    description: "Pitch your idea to real investors and win seed funding.",
    attendees: 290,
    location: "Conference Hall",
  },
  {
    id: 8,
    title: "Yoga & Wellness Session",
    category: "Sports",
    club: "Wellness Club",
    date: "2025-04-09",
    status: "live",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    description:
      "Guided morning yoga and mindfulness session for stress relief.",
    attendees: 75,
    location: "Sports Ground",
  },
  {
    id: 9,
    title: "Cybersecurity Workshop",
    category: "Tech",
    club: "Cyber Club",
    date: "2025-03-15",
    status: "past",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
    description:
      "Learn ethical hacking, CTF challenges, and network security fundamentals.",
    attendees: 145,
    location: "Computer Lab",
  },
];

const CATEGORIES = [
  "All Categories",
  "Tech",
  "Design",
  "Hackathon",
  "Arts",
  "Business",
  "Sports",
];
const CLUBS = [
  "All Clubs",
  "Dev Club",
  "Design Society",
  "Coding Club",
  "Photography Club",
  "AI Society",
  "Cultural Club",
  "Entrepreneurship Cell",
  "Wellness Club",
  "Cyber Club",
];
const DATE_FILTERS = ["Any Time", "Today", "This Week", "This Month"];
const SORT_OPTIONS = ["Latest First", "Oldest First", "Most Popular"];
const TABS = ["All", "Live", "Upcoming", "Past"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [category, setCategory] = useState("All Categories");
  const [club, setClub] = useState("All Clubs");
  const [dateFilter, setDateFilter] = useState("Any Time");
  const [sortOption, setSortOption] = useState("Latest First");

  const filteredEvents = useMemo(() => {
    let events = [...MOCK_EVENTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.club.toLowerCase().includes(q),
      );
    }

    if (activeTab !== "All") {
      events = events.filter((e) => e.status === activeTab.toLowerCase());
    }

    if (category !== "All Categories") {
      events = events.filter((e) => e.category === category);
    }

    if (club !== "All Clubs") {
      events = events.filter((e) => e.club === club);
    }

    if (sortOption === "Latest First") {
      events.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "Oldest First") {
      events.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "Most Popular") {
      events.sort((a, b) => b.attendees - a.attendees);
    }

    return events;
  }, [search, activeTab, category, club, dateFilter, sortOption]);

  const liveCount = MOCK_EVENTS.filter((e) => e.status === "live").length;

  return (
    <div className="ep-root">
      <div className="ep-bg-orbs">
        <div className="ep-orb ep-orb-1" />
        <div className="ep-orb ep-orb-2" />
        <div className="ep-orb ep-orb-3" />
      </div>

      <main className="ep-main">
        {/* HEADER */}
        <section className="ep-header">
          <div className="ep-header-badge">
            <span className="ep-live-dot" />
            {liveCount} Events Live Now
          </div>
          <h1 className="ep-title">
            Explore <span className="ep-gradient-text">Events</span>
          </h1>
          <p className="ep-subtitle">
            Discover workshops, hackathons, talks, and cultural experiences
            happening around you.
          </p>
        </section>

        {/* SEARCH */}
        <div className="ep-search-wrap">
          <div className="ep-search-box">
            <svg
              className="ep-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="ep-search-input"
              type="text"
              placeholder="Search events, clubs, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ep-search-clear" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="ep-filters-wrap">
          <div className="ep-filters">
            <div className="ep-filter-group">
              <label className="ep-filter-label">Category</label>
              <select
                className="ep-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="ep-filter-group">
              <label className="ep-filter-label">Date</label>
              <select
                className="ep-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {DATE_FILTERS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="ep-filter-group">
              <label className="ep-filter-label">Club</label>
              <select
                className="ep-select"
                value={club}
                onChange={(e) => setClub(e.target.value)}
              >
                {CLUBS.map((cl) => (
                  <option key={cl} value={cl}>
                    {cl}
                  </option>
                ))}
              </select>
            </div>

            <div className="ep-filter-group">
              <label className="ep-filter-label">Sort By</label>
              <select
                className="ep-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="ep-reset-btn"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setClub("All Clubs");
                setDateFilter("Any Time");
                setSortOption("Latest First");
                setActiveTab("All");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="ep-tabs-wrap">
          <div className="ep-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`ep-tab ${activeTab === tab ? "ep-tab-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Live" && <span className="ep-tab-live-dot" />}
                {tab}
                <span className="ep-tab-count">
                  {tab === "All"
                    ? MOCK_EVENTS.length
                    : MOCK_EVENTS.filter((e) => e.status === tab.toLowerCase())
                        .length}
                </span>
              </button>
            ))}
          </div>
          <p className="ep-results-info">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* GRID */}
        {filteredEvents.length > 0 ? (
          <div className="ep-grid">
            {filteredEvents.map((event) => (
              <div className="ep-card-wrap" key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="ep-empty">
            <div className="ep-empty-icon">🔍</div>
            <h3 className="ep-empty-title">No events found</h3>
            <p className="ep-empty-sub">
              Try adjusting your search or filters to discover more events.
            </p>
            <button
              className="ep-empty-btn"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setClub("All Clubs");
                setDateFilter("Any Time");
                setActiveTab("All");
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
