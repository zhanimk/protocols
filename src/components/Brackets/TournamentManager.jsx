import React, { useState, useMemo, useEffect } from "react";

// СИСТЕМALAR (Жолдарын тексеріп ал)
import Olympic32 from "../Systems/Olympic32";
import Olympic16 from "../Systems/Olympic16";
import Olympic8 from "../Systems/Olympic8";
import RoundRobin from "../Systems/RoundRobin";

// ЛОГИКА
import { getBracketSize, generateDraw } from "../Utils/DrawLogic";
import { exportToPDF } from "../Utils/PdfExport";

const TournamentManager = ({ participants = [], category, ageGroup }) => {
  // Локальді нәтижелер (Базасыз жұмыс істейді)
  const [results, setResults] = useState({});

  // Категория ауысқанда нәтижелерді тазалау (Шатаспау үшін)
  useEffect(() => {
    setResults({});
  }, [category]);

  // 1. ТОРДЫҢ ӨЛШЕМІН АНЫҚТАУ (8, 16, 32)
  const size = useMemo(
    () => getBracketSize(participants.length),
    [participants.length]
  );

  // 2. SMART DRAW (Клубтарды ажырату - Seeding)
  // Бұл жерде DrawLogic ішіндегі логика бойынша адамдар орындарына бөлінеді
  const seededParticipants = useMemo(() => {
    return generateDraw(participants, size);
  }, [participants, size]);

  // 3. PDF ЖҮКТЕУ ЛОГИКАСЫ
  const handleExport = () => {
    // Файл атын қауіпсіз форматқа келтіру
    const safeCategory = category
      ? category.replace(/[^a-z0-9а-яөүіңғқә]/gi, "_")
      : "Judo_Protocol";
    const fileName = `Protocol_${safeCategory}_2026.pdf`;

    // exportToPDF("аймақ ID", "файл аты", "жасырылатын класс")
    exportToPDF("print-area", fileName, "no-print");
  };

  // 4. ТОРДЫ ТАҢДАУ ЖӘНЕ КӨРСЕТУ
  const renderContent = () => {
    const props = {
      participants: seededParticipants, // Сұрыпталған тізімді береміз
      category,
      ageGroup,
      results,
      setResults,
    };

    if (participants.length === 0) {
      return (
        <div style={styles.emptyMsg}>
          Қатысушылар тізімі бос. Адамдарды тіркеңіз...
        </div>
      );
    }

    // ТЗ бойынша: 1-5 Круговая, 6-32+ Олимпийка
    if (participants.length <= 5) return <RoundRobin {...props} />;
    if (size === 8) return <Olympic8 {...props} />;
    if (size === 16) return <Olympic16 {...props} />;
    return <Olympic32 {...props} />;
  };

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", padding: "20px" }}>
      {/* 1. БАСҚАРУ ПАНЕЛІ (Тек экранда көрінеді, баспаға шықпайды) */}
      <div id="no-print" style={styles.controls}>
        <div>
          <h2 style={{ margin: 0, color: "#1a3353", fontSize: "18px" }}>
            🏆 ТУРНИР МЕНЕДЖЕРІ
          </h2>
          <small style={{ color: "#666" }}>
            Категория: <strong>{category}</strong>
          </small>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() =>
              window.confirm("Нәтижелерді тазалау?") && setResults({})
            }
            style={styles.btnReset}
          >
            🔄 ТАЗАЛАУ
          </button>
          <button onClick={handleExport} style={styles.btnPdf}>
            📄 PDF ЖҮКТЕУ (A4)
          </button>
        </div>
      </div>

      {/* 2. ТОРДЫ ШЫҒАРУ АЙМАҒЫ */}
      {/* renderContent() функциясы таңдалған сетканы (Olympic8, 16 немесе 32) қайтарады */}
      <div
        style={{ overflowX: "auto", display: "flex", justifyContent: "center" }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

const styles = {
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    background: "#fff",
    padding: "15px 25px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  printArea: {
    background: "#fff",
    padding: "40px",
    margin: "0 auto",
    width: "1200px", // A4 Landscape парапорциясы
    minHeight: "842px",
    boxSizing: "border-box",
    position: "relative",
    color: "#000",
  },
  header: {
    borderBottom: "4px solid #000",
    paddingBottom: "15px",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  categoryTitle: {
    fontSize: "36px",
    fontWeight: "900",
    margin: 0,
    color: "#d32f2f",
    letterSpacing: "-1px",
  },
  subInfo: {
    fontSize: "14px",
    marginTop: "5px",
    color: "#333",
    textTransform: "uppercase",
  },
  branding: {
    textAlign: "right",
  },
  protocolTag: {
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "5px",
  },
  countBadge: {
    background: "#000",
    color: "#fff",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "4px",
    display: "inline-block",
  },
  footer: {
    marginTop: "60px",
    paddingTop: "20px",
    borderTop: "2px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },
  signLine: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    fontSize: "15px",
    fontWeight: "bold",
  },
  line: {
    width: "200px",
    borderBottom: "1px solid #000",
    marginBottom: "4px",
  },
  emptyMsg: {
    textAlign: "center",
    padding: "100px",
    fontSize: "18px",
    color: "#999",
    border: "2px dashed #eee",
    borderRadius: "10px",
  },
  btnReset: {
    background: "#fff",
    color: "#ff4d4f",
    border: "1px solid #ff4d4f",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnPdf: {
    background: "#1890ff",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(24, 144, 255, 0.3)",
  },
};

export default TournamentManager;
