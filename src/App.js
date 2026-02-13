import React, { useState, useEffect, useMemo } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import TournamentManager from "./components/Brackets/TournamentManager";
import { exportMultiPDF } from "./components/Utils/PdfExport";
import "./styles.css";

const App = () => {
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);

  // --- FIREBASE-ТЕН ЖҮКТЕУ ---
  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, "competitors"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // --- КАТЕГОРИЯЛАРДЫ АНЫҚТАУ ЖӘНЕ СҰРЫПТАУ ---
  // App.js ішіндегі сұрыптау бөлімі:
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(list.map((p) => p.weightCat))].filter(
      Boolean
    );

    return uniqueCats.sort((a, b) => {
      // Жылын бөліп алу (мысалы 2011)
      const yearA = parseInt(a.match(/\d{4}/)?.[0] || 0);
      const yearB = parseInt(b.match(/\d{4}/)?.[0] || 0);

      if (yearA !== yearB) return yearA - yearB;

      // Салмағын бөліп алу (мысалы 38)
      const weightA = parseInt(a.match(/\d+/)?.[0] || 0);
      const weightB = parseInt(b.match(/\d+/)?.[0] || 0);
      return weightA - weightB;
    });
  }, [list]);

  const activeCategoryName = categories[activeTab] || "";

  // Активті категориядағы адамдар
  const activeParticipants = list.filter(
    (p) => p.weightCat === activeCategoryName
  );

  // --- PDF ЖҮКТЕУ ---
  const handleDownloadAll = () => {
    if (categories.length === 0) return alert("Деректер жоқ!");
    if (
      window.confirm(`Барлығы ${categories.length} категорияны жүктейсіз бе?`)
    ) {
      const elements = categories.map((cat) => ({ id: `hidden-print-${cat}` }));
      exportMultiPDF(elements, "All_Protocols_2026.pdf");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header className="header-card">
        <div className="header-brand">
          <div className="live-tag">
            <span className="pulse-dot"></span> LIVE
          </div>
          <h1>ASTANA JUDO LEAGUE</h1>
          <p>Tournament System 2026</p>
        </div>
        <div className="header-actions">
          <button
            className={`btn-glass ${showRegistration ? "active" : ""}`}
            onClick={() => setShowRegistration(!showRegistration)}
          >
            {showRegistration ? "✖ Жасыру" : "👥 Тіркеу & Тізім"}
          </button>
          <button className="btn-glow" onClick={handleDownloadAll}>
            📑 БАРЛЫҚ PDF
          </button>
        </div>
      </header>

      {/* ТІРКЕУ БӨЛІМІ */}
      {showRegistration && (
        <div style={styles.registrationArea}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "20px",
            }}
          >
            <div>
              <h3>Жаңа қатысушы</h3>
              <ParticipantForm db={db} />
            </div>
            <div>
              <h3>Жалпы Тізім ({list.length})</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ParticipantList participants={list} db={db} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS (ВКЛАДКАЛАР) */}
      <div style={styles.tabsContainer}>
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveTab(index)}
              style={{
                ...styles.tabBtn,
                background: activeTab === index ? "#0055a4" : "#fff",
                color: activeTab === index ? "#fff" : "#333",
                borderBottom:
                  activeTab === index ? "3px solid #002244" : "1px solid #ddd",
              }}
            >
              {cat}
              <span style={styles.badge}>
                {list.filter((p) => p.weightCat === cat).length}
              </span>
            </button>
          ))
        ) : (
          <div style={{ padding: "20px", color: "#666" }}>
            Категориялар әлі құрылмады...
          </div>
        )}
      </div>

      {/* MAIN CONTENT (СЕТКА) */}
      <div style={{ padding: "20px" }}>
        {categories.length > 0 ? (
          // Key-ді өзгерту арқылы компонентті толық жаңартамыз
          <TournamentManager
            key={activeCategoryName}
            participants={activeParticipants}
            category={activeCategoryName}
            // Егер саған жас тобын бөлек беру керек болса, string-тен бөліп алуға болады
            ageGroup={activeCategoryName.split(" -")[0] || ""}
          />
        ) : (
          <div style={styles.emptyState}>
            <h3>Күтуде...</h3>
            <p>Қатысушыларды тіркеңіз, жүйе автоматты түрде тор құрады.</p>
          </div>
        )}
      </div>

      {/* ЖАСЫРЫН БАСПА АЙМАҒЫ */}
      <div style={styles.hiddenPrintArea}>
        {categories.map((cat) => (
          <div key={cat} id={`hidden-print-${cat}`}>
            <TournamentManager
              participants={list.filter((p) => p.weightCat === cat)}
              category={cat}
              ageGroup={cat.split(" -")[0]}
              isPrintMode={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  registrationArea: {
    background: "#fff",
    padding: "20px",
    borderBottom: "1px solid #ddd",
  },
  tabsContainer: {
    padding: "10px 20px",
    background: "#f9f9f9",
    display: "flex",
    gap: "5px",
    overflowX: "auto",
    borderBottom: "1px solid #ccc",
  },
  tabBtn: {
    padding: "10px 20px",
    border: "1px solid #eee",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "5px 5px 0 0",
    minWidth: "140px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    fontSize: "11px",
    background: "rgba(0,0,0,0.1)",
    padding: "2px 6px",
    borderRadius: "10px",
    marginLeft: "8px",
  },
  emptyState: { textAlign: "center", padding: "50px", color: "#888" },
  hiddenPrintArea: {
    position: "absolute",
    left: "-10000px",
    top: 0,
    width: "1200px",
  },
};

export default App;
