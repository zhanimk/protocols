import React, { useEffect, useMemo, useState, useId } from "react";
import Olympic32 from "../Systems/Olympic32";
import Olympic16 from "../Systems/Olympic16";
import Olympic8 from "../Systems/Olympic8";
import RoundRobin from "../Systems/RoundRobin";
import { getBracketSize } from "../Utils/DrawLogic";
import { exportToPDF } from "../Utils/PdfExport";

const TournamentManager = ({ participants = [], category, isPrintMode = false }) => {
  const [results, setResults] = useState({});

  const rawId = useId();
  const instanceId = useMemo(() => rawId.replace(/[:]/g, ""), [rawId]);
  const printAreaId = `${instanceId}-print-area`;
  const controlsId = `${instanceId}-controls`;

  useEffect(() => {
    setResults({});
  }, [category, participants]);

  const size = getBracketSize(participants.length);

  const handleExport = async () => {
    const safeCategory = category ? category.replace(/\s+/g, "_") : "Judo_Protocol";
    const fileName = `Protocol_${safeCategory}_2026.pdf`;

    await exportToPDF(printAreaId, fileName, controlsId);
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
    <div style={{ background: "#eee", minHeight: isPrintMode ? "auto" : "100vh", padding: "20px" }}>
      {!isPrintMode && (
        <div
          id={controlsId}
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

            <button onClick={handleExport} style={styles.btnPdf}>
              📄 ЖҮКТЕУ (PDF)
            </button>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <div id={printAreaId} style={styles.printArea}>
          <div style={styles.header}>
            <div style={styles.infoBox}>
              <span style={styles.categoryTitle}>{category || "CATEGORY"}</span>
              <span style={styles.competitorsBadge}>ҚАТЫСУШЫ: {participants.length}</span>
            </div>
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
