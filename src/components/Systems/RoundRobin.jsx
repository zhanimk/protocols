import React, { useMemo } from "react";
import { getRoundRobinFightOrder } from "../Utils/roundRobin";

const RoundRobin = ({ participants = [], category, ageGroup }) => {
  const fightOrder = useMemo(() => {
    return getRoundRobinFightOrder(participants.length);
  }, [participants.length]);

  return (
    <div
      style={{
        background: "#fff",
        color: "#000",
        width: "297mm",
        height: "210mm",
        padding: "10mm 15mm",
        margin: "0 auto",
        fontFamily: "'Arial Black', sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* --- HEADER (ТАҚЫРЫП) - Шрифт сәл кішірейтілді --- */}
      <div
        style={{
          borderBottom: "6px solid #000",
          paddingBottom: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "1000",
                margin: 0,
                lineHeight: "1",
              }}
            >
              JUDOSHY BALAQAI LIGASY
            </h1>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "1000",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Айналмалы жүйе хаттамасы 2026
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "1000",
                color: "#d32f2f",
                lineHeight: "1",
              }}
            >
              {category} КГ {ageGroup ? `(${ageGroup})` : ""}
            </div>
            <div
              style={{ fontSize: "11px", fontWeight: "1000", marginTop: "2px" }}
            >
              ҚАТЫСУШЫ САНЫ: {participants.length}
            </div>
          </div>
        </div>
      </div>

      {/* --- MATRIX TABLE --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "12px",
          border: "4px solid #000",
        }}
      >
        <thead>
          <tr style={{ background: "#000", color: "#fff" }}>
            <th
              style={{
                width: "35px",
                border: "1.5px solid #fff",
                padding: "6px",
                fontSize: "12px",
              }}
            >
              №
            </th>
            <th
              style={{
                border: "1.5px solid #fff",
                padding: "6px",
                textAlign: "left",
                fontSize: "12px",
              }}
            >
              АТЫ-ЖӨНІ / КЛУБЫ
            </th>
            {participants.map((_, i) => (
              <th
                key={i}
                style={{
                  border: "1.5px solid #fff",
                  width: "45px",
                  fontSize: "16px",
                }}
              >
                {i + 1}
              </th>
            ))}
            <th
              style={{
                width: "70px",
                border: "1.5px solid #fff",
                fontSize: "11px",
                background: "#333",
              }}
            >
              ЖЕҢІС
            </th>
            <th
              style={{
                width: "70px",
                border: "1.5px solid #fff",
                fontSize: "11px",
                background: "#333",
              }}
            >
              ҰПАЙ
            </th>
            <th
              style={{
                width: "80px",
                border: "1.5px solid #fff",
                fontSize: "11px",
                background: "#444",
              }}
            >
              ОРЫН
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, i) => (
            <tr key={i} style={{ height: "42px" }}>
              <td
                style={{
                  border: "3px solid #000",
                  textAlign: "center",
                  fontWeight: "1000",
                  fontSize: "18px",
                  background: "#eee",
                }}
              >
                {i + 1}
              </td>
              <td style={{ border: "3px solid #000", padding: "4px 8px" }}>
                <div style={{ fontWeight: "1000", fontSize: "14px" }}>
                  {p.name.toUpperCase()}
                </div>
                <div
                  style={{ fontWeight: "800", fontSize: "9px", color: "#444" }}
                >
                  {p.club || "КЛУБСЫЗ"}
                </div>
              </td>
              {participants.map((_, j) => (
                <td
                  key={j}
                  style={{
                    border: "3px solid #000",
                    background: i === j ? "#000" : "#fff",
                    textAlign: "center",
                  }}
                >
                  {i === j ? (
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: "1000",
                        fontSize: "20px",
                      }}
                    >
                      X
                    </span>
                  ) : (
                    ""
                  )}
                </td>
              ))}
              <td style={{ border: "3px solid #000" }}></td>
              <td style={{ border: "3px solid #000" }}></td>
              <td
                style={{ border: "3px solid #000", background: "#f9f9f9" }}
              ></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- FIGHTS GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          flexGrow: 1, // Ортасын толтыру үшін
        }}
      >
        {fightOrder.map((pair, idx) => (
          <div
            key={idx}
            style={{
              border: "3px solid #000",
              padding: "8px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "fit-content",
              maxHeight: "85px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "1000",
                borderBottom: "2px solid #000",
                marginBottom: "4px",
                width: "fit-content",
              }}
            >
              БЕЛДЕСУ №{idx + 1}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #000",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "1000",
                    fontSize: "11px",
                  }}
                >
                  {pair[0]}
                </div>
                <div style={{ fontWeight: "1000", fontSize: "11px" }}>
                  {participants[pair[0] - 1]?.name?.split(" ")[0]?.toUpperCase() || ""}
                </div>
              </div>
              <div
                style={{
                  width: "30px",
                  height: "18px",
                  border: "2px solid #000",
                }}
              ></div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #d32f2f",
                    color: "#d32f2f",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "1000",
                    fontSize: "11px",
                  }}
                >
                  {pair[1]}
                </div>
                <div style={{ fontWeight: "1000", fontSize: "11px" }}>
                  {participants[pair[1] - 1]?.name?.split(" ")[0]?.toUpperCase() || ""}
                </div>
              </div>
              <div
                style={{
                  width: "30px",
                  height: "18px",
                  border: "2px solid #000",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SIGNATURES --- */}
      <div
        style={{
          marginTop: "auto", // Бұл қолтаңбаларды парақтың ең астына итереді
          borderTop: "4px solid #000",
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "5px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "1000" }}>
          БАС ТӨРЕШІ: __________________________
        </div>
        <div style={{ fontSize: "16px", fontWeight: "1000" }}>
          БАС ХАТШЫ: __________________________
        </div>
      </div>
    </div>
  );
};

export default RoundRobin;
