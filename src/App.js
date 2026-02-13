import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import TournamentManager from "./components/Brackets/TournamentManager";
import "./styles.css";
import { exportMultiPDF } from "./components/Utils/PdfExport";

const App = () => {
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "competitors"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  const categories = [...new Set(list.map((p) => p.weightCat))].filter(Boolean).sort();

  useEffect(() => {
    if (activeTab > categories.length - 1) {
      setActiveTab(0);
    }
  }, [activeTab, categories.length]);

  const activeParticipants =
    categories.length > 0
      ? list.filter((p) => p.weightCat === categories[activeTab])
      : [];

  const handleDownloadAll = async () => {
    if (categories.length === 0) return alert("Деректер жоқ!");

    if (window.confirm(`Барлығы ${categories.length} категорияны жүктейсіз бе?`)) {
      const elements = categories.map((cat) => ({
        id: `hidden-print-${cat}`,
      }));
      await exportMultiPDF(elements, "All_Protocols_2026.pdf");
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
      <header className="header-card">
        <div className="header-brand">
          <div className="live-tag">
            <span className="pulse-dot"></span> LIVE
          </div>
          <h1>ASTANA JUDO LEAGUE</h1>
          <p>Official Tournament Management System 2026</p>
        </div>

        <div className="header-actions">
          <button
            className={`btn-glass ${showRegistration ? "active" : ""}`}
            onClick={() => setShowRegistration(!showRegistration)}
          >
            {showRegistration ? "✖ Жасыру" : "👥 Тіркеу & Тізім"}
          </button>

          <button className="btn-glow" onClick={handleDownloadAll}>
            📑 PDF ЖҮКТЕУ
          </button>
        </div>
      </header>

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
              <h3>Жаңа қатысушы қосу</h3>
              <ParticipantForm db={db} />
            </div>
            <div>
              <h3>Тізім ({list.length})</h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ParticipantList participants={list} db={db} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.tabsContainer}>
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveTab(index)}
              style={{
                ...styles.tabBtn,
                background: activeTab === index ? "#0055a4" : "#e0e0e0",
                color: activeTab === index ? "#fff" : "#333",
                borderBottom: activeTab === index ? "4px solid #003366" : "none",
              }}
            >
              {cat}
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "11px",
                  background:
                    activeTab === index ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
                  padding: "2px 6px",
                  borderRadius: "10px",
                }}
              >
                {list.filter((p) => p.weightCat === cat).length}
              </span>
            </button>
          ))
        ) : (
          <div style={{ padding: "10px", color: "#666" }}>
            Салмақ категориялары әлі жоқ. Қатысушыларды тіркеңіз.
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        {categories.length > 0 ? (
          <TournamentManager
            key={categories[activeTab]}
            participants={activeParticipants}
            category={categories[activeTab]}
          />
        ) : (
          <div style={styles.emptyState}>
            <h3>Турнир әлі басталмады</h3>
            <p>Жоғарыдағы "Қатысушылар & Тіркеу" батырмасын басып, адамдарды қосыңыз.</p>
          </div>
        )}
      </div>

      <div style={styles.hiddenPrintArea}>
        {categories.map((cat) => {
          const pList = list.filter((p) => p.weightCat === cat);
          return (
            <div key={cat} id={`hidden-print-${cat}`}>
              <TournamentManager participants={pList} category={cat} isPrintMode={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  registrationArea: {
    background: "#fff",
    padding: "20px",
    borderBottom: "1px solid #ddd",
    boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.05)",
  },
  tabsContainer: {
    padding: "0 20px",
    background: "#fff",
    display: "flex",
    gap: "5px",
    overflowX: "auto",
    borderBottom: "1px solid #ccc",
    paddingTop: "15px",
  },
  tabBtn: {
    padding: "12px 25px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s",
    minWidth: "120px",
  },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    color: "#888",
    background: "#fff",
    borderRadius: "10px",
    border: "2px dashed #ddd",
  },
  hiddenPrintArea: {
    position: "absolute",
    left: "-10000px",
    top: 0,
    width: "1400px",
  },
};

export default App;
