import React, { useState, useEffect } from "react";
// FIREBASE ИМПОРТТАРЫ
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// КОМПОНЕНТТЕР
import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import TournamentManager from "./components/Brackets/TournamentManager";

// PDF ЛОГИКАСЫ
import { exportMultiPDF } from "./components/Utils/PdfExport";

const App = () => {
  // --- 1. STATE (ДЕРЕКТЕР) ---
  const [list, setList] = useState([]); // Барлық қатысушылар
  const [activeTab, setActiveTab] = useState(0); // Қай салмақ ашық тұр (индекс)
  const [showRegistration, setShowRegistration] = useState(false); // Тіркеуді көрсету/жасыру

  // --- 2. FIREBASE-ТЕН ЖҮКТЕУ ---
  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, "competitors"),
      orderBy("createdAt", "desc")
    );

    // Real-time listener
    const unsub = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // --- 3. ДЕРЕКТЕРДІ ӨҢДЕУ ---
  // Уникалды категорияларды алып, сорттаймыз
  const categories = [...new Set(list.map((p) => p.weightCat))].sort();

  // Қазіргі таңдалып тұрған категорияның қатысушылары
  const activeParticipants =
    categories.length > 0
      ? list.filter((p) => p.weightCat === categories[activeTab])
      : [];

  // --- 4. БАРЛЫҚ ХАТТАМАЛАРДЫ ЖҮКТЕУ ---
  const handleDownloadAll = () => {
    if (categories.length === 0) return alert("Деректер жоқ!");

    if (
      window.confirm(`Барлығы ${categories.length} категорияны жүктейсіз бе?`)
    ) {
      // Жасырын div-тердің ID-лерін жинаймыз
      const elements = categories.map((cat) => ({
        id: `hidden-print-${cat}`,
      }));
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
      {/* --- HEADER (TOP BAR) --- */}
      <div style={styles.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h2 style={{ margin: 0, letterSpacing: "1px" }}>
            ASTANA JUDO LEAGUE
          </h2>
          <span
            style={{
              background: "#d32f2f",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            LIVE
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowRegistration(!showRegistration)}
            style={styles.secondaryBtn}
          >
            {showRegistration ? "Тіркеуді жасыру" : "👥 Қатысушылар & Тіркеу"}
          </button>

          <button onClick={handleDownloadAll} style={styles.downloadAllBtn}>
            📑 БАРЛЫҒЫН ЖҮКТЕУ (PDF)
          </button>
        </div>
      </div>

      {/* --- ТІРКЕУ БӨЛІМІ (Жасырын/Ашық) --- */}
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

      {/* --- TABS (КАТЕГОРИЯЛАР) --- */}
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
                borderBottom:
                  activeTab === index ? "4px solid #003366" : "none",
              }}
            >
              {cat}
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "11px",
                  background:
                    activeTab === index
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.1)",
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

      {/* --- MAIN CONTENT (АКТИВТІ СЕТКА) --- */}
      <div style={{ padding: "20px" }}>
        {categories.length > 0 ? (
          <TournamentManager
            key={categories[activeTab]} // Key өзгерсе, компонент жаңарады
            participants={activeParticipants}
            category={categories[activeTab]}
          />
        ) : (
          <div style={styles.emptyState}>
            <h3>Турнир әлі басталмады</h3>
            <p>
              Жоғарыдағы "Қатысушылар & Тіркеу" батырмасын басып, адамдарды
              қосыңыз.
            </p>
          </div>
        )}
      </div>

      {/* --- ЖАСЫРЫН АЙМАҚ (HIDDEN PRINT AREA) --- */}
      <div style={styles.hiddenPrintArea}>
        {categories.map((cat) => {
          // Әр категория үшін адамдарды сүзіп аламыз
          const pList = list.filter((p) => p.weightCat === cat);
          return (
            <div key={cat} id={`hidden-print-${cat}`}>
              <TournamentManager
                participants={pList}
                category={cat}
                isPrintMode={true} // Батырмаларды жасыру үшін
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- СТИЛЬДЕР (CSS-in-JS) ---
const styles = {
  topBar: {
    background: "#222",
    color: "#fff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  downloadAllBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "14px",
    textTransform: "uppercase",
  },
  secondaryBtn: {
    background: "#444",
    color: "#fff",
    border: "1px solid #666",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "13px",
  },
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
    width: "1400px", // Фикс ені, html2canvas дұрыс түсіру үшін
  },
};

export default App;
