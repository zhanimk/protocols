// src/components/Brackets/TournamentManager.jsx

import React, { useState, useEffect } from "react";
// jsPDF пен html2canvas енді мұнда керек емес!

// ИМПОРТТАР (Жолдарын тексер)
import Olympic32 from "../Systems/Olympic32";
import Olympic16 from "../Systems/Olympic16";
import Olympic8 from "../Systems/Olympic8";
import RoundRobin from "../Systems/RoundRobin";
import { getBracketSize } from "../Utils/DrawLogic";
import { exportToPDF } from "../Utils/PdfExport"; // <--- ЖАҢА ИМПОРТ

const TournamentManager = ({ participants = [], category }) => {
  const [results, setResults] = useState({});

  useEffect(() => {
    setResults({});
  }, [category, participants]);

  const size = getBracketSize(participants.length);

  // PDF ЖҮКТЕУ (Енді бір-ақ жол!)
  const handleExport = () => {
    // Файл атын дайындау (бос орындарды _-ға ауыстыру)
    const safeCategory = category
      ? category.replace(/\s+/g, "_")
      : "Judo_Protocol";
    const fileName = `Protocol_${safeCategory}_2026.pdf`;

    // Жаңа функцияны шақырамыз
    exportToPDF("print-area", fileName, "no-print");
  };

  const renderContent = () => {
    const props = { participants, category, results, setResults };

    if (participants.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: 50, fontSize: 18 }}>
          Қатысушыларды енгізіңіз...
        </div>
      );
    }
    if (participants.length <= 5) return <RoundRobin {...props} />;
    if (size === 8) return <Olympic8 {...props} />;
    if (size === 16) return <Olympic16 {...props} />;
    return <Olympic32 {...props} />;
  };

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: "20px" }}>
      {/* БАСҚАРУ ПАНЕЛІ */}
      <div
        id="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          background: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: 0, color: "#333" }}>Турнир Менеджері</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              if (window.confirm("Барлық нәтижелерді өшіресіз бе?")) {
                setResults({});
              }
            }}
            style={styles.btnReset}
          >
            🔄 ТАЗАЛАУ
          </button>

          {/* Жаңа функцияны шақыру */}
          <button onClick={handleExport} style={styles.btnPdf}>
            📄 ЖҮКТЕУ (PDF)
          </button>
        </div>
      </div>

      {/* БАСПА АЙМАҒЫ */}
      <div style={{ overflowX: "auto" }}>
        <div id="print-area" style={styles.printArea}>
          <div style={styles.header}>
            <div style={styles.infoBox}>
              <span style={styles.categoryTitle}>
                {category || "САЛМАҚ ДӘРЕЖЕСІ"}
              </span>
              <span style={styles.competitorsBadge}>
                {participants.length} ҚАТЫСУШЫ
              </span>
            </div>
            <div style={styles.protocolTag}>РЕСМИ ХАТТАМА 2026</div>
          </div>

          <div className="bracket-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  printArea: {
    background: "#fff",
    padding: "20px 30px",
    margin: "0 auto",
    width: "1350px",
    minHeight: "900px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  header: {
    borderBottom: "3px solid #000",
    paddingBottom: "10px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoBox: { display: "flex", alignItems: "center", gap: "20px" },
  categoryTitle: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#d32f2f",
    textTransform: "uppercase",
  },
  competitorsBadge: {
    background: "#000",
    color: "#fff",
    padding: "5px 12px",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "4px",
  },
  protocolTag: { fontSize: "14px", fontWeight: "bold", color: "#555" },
  btnReset: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnPdf: {
    background: "#0055a4",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default TournamentManager;
