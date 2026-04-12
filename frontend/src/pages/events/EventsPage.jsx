import React, { useState, useMemo, useEffect } from "react";

import EventCard from "../../components/events/EventCard";
import "../../styles/eventsPage.css";

const CLUBS = [
  "All Clubs",
  "Robotics Club",
  "CSI",
  "IEEE",
  "PICTORIAL",
];

const DATE_FILTERS = ["Any Time", "Today", "This Week", "This Month"];
const SORT_OPTIONS = ["Latest First", "Oldest First"]; // ❌ removed Most Popular
const TABS = ["All", "Upcoming/Ongoing", "Past"]; // ❌ removed Live/Upcoming/Past

export default function EventsPage() {
  const API = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [category, setCategory] = useState("All Categories"); // untouched
  const [club, setClub] = useState("All Clubs");
  const [dateFilter, setDateFilter] = useState("Any Time");
  const [sortOption, setSortOption] = useState("Latest First");

  const [events, setEvents] = useState([]); // ✅ added

  useEffect(() => {
    const params = new URLSearchParams({
      search,
      clubName: club !== "All Clubs" ? club : "",
      dateFilter:
        dateFilter === "Today"
          ? "today"
          : dateFilter === "This Week"
            ? "week"
            : dateFilter === "This Month"
              ? "month"
              : "",
      sort: sortOption === "Oldest First" ? "oldest" : "latest",
    });

    fetch(`${API}/event/filter?${params}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setEvents(res.data);
      });
  }, [search, club, dateFilter, sortOption]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    const now = new Date();

    if (activeTab === "Upcoming/Ongoing") {
      filtered = filtered.filter((e) => new Date(e.date) >= now);
    }

    if (activeTab === "Past") {
      filtered = filtered.filter((e) => new Date(e.date) < now);
    }

    return filtered;
  }, [events, activeTab]);

  const liveCount = events.length; // ✅ adjusted

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
              placeholder="Search events..."
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
            {/* <div className="ep-filter-group">
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
            </div> */}

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
                {tab}
                <span className="ep-tab-count">
                  {tab === "All"
                    ? events.length
                    : tab === "Upcoming/Ongoing"
                      ? events.filter((e) => new Date(e.date) >= new Date()).length
                      : events.filter((e) => new Date(e.date) < new Date()).length}
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
                <EventCard id={event.id} title={event.name} />
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