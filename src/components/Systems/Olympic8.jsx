import React, { useMemo } from "react";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic8 = ({ participants = [], category, ageGroup }) => {
  const size = 8;

  // 1. Жеребьевка (Клубтарды ажырату + Орындарға бөлу)
  const seededSlots = useMemo(
    () => generateDraw(participants, size),
    [participants]
  );

  const participantsCount = participants.filter(
    (p) => p && (p.name || p.id)
  ).length;

  // ГЕОМЕТРИЯ
  const CANVAS_W = 1100;
  const CANVAS_H = 600;
  const BOX_W = 180;
  const BOX_H = 40; // Биіктігі 40px (Аты + Клубы сыю үшін)
  const START_X = 20;
  const GAP_Y = 110;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    // --- 1-АЙНАЛЫМ (1/4 Final) ---
    let r1 = [];
    for (let i = 0; i < 4; i++) {
      let currentPool = "";
      if (i === 0) currentPool = "A";
      else if (i === 1) currentPool = "B";
      else if (i === 2) currentPool = "C";
      else currentPool = "D";

      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x: START_X,
        y: 40 + i * GAP_Y,
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        pool: currentPool,
      });
    }

    // --- 2-АЙНАЛЫМ (1/2 Final) ---
    let r2 = [];
    for (let i = 0; i < 2; i++) {
      r2.push({
        id: `r2-${i}`,
        num: matchNum++,
        x: START_X + 250,
        y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
      });
    }

    // --- 3-АЙНАЛЫМ (Final) ---
    const r3 = [
      {
        id: "r3-0",
        num: matchNum++,
        x: START_X + 500,
        y: (r2[0].y + r2[1].y) / 2,
      },
    ];

    return [r1, r2, r3];
  }, [seededSlots]);

  // --- КОМПОНЕНТ: MODERN BOX (Клуб қосылды, BYE алынды) ---
  const ModernBox = ({ x, y, p1, p2, num, pool }) => (
    <g>
      {/* Пул аты */}
      {pool && (
        <text
          x={x - 15}
          y={y + 55}
          fontSize="24"
          fontWeight="1000"
          fill="#ccc"
          opacity="0.5"
        >
          {pool}
        </text>
      )}

      {/* Рамка */}
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
      <line
        x1={x}
        y1={y + BOX_H / 2}
        x2={x + BOX_W}
        y2={y + BOX_H / 2}
        stroke="#000"
        strokeWidth="1"
      />

      {/* --- СПОРТШЫ 1 --- */}
      {
        p1 ? (
          <>
            {/* Аты */}
            <text x={x + 5} y={y + 11} fontSize="9" fontWeight="1000">
              {p1.name.toUpperCase().slice(0, 20)}
            </text>
            {/* Клубы (Кішірек және сұрлау) */}
            <text
              x={x + 5}
              y={y + 18}
              fontSize="7"
              fontWeight="bold"
              fill="#555"
            >
              {p1.club ? p1.club.toUpperCase().slice(0, 20) : ""}
            </text>
          </>
        ) : null /* Егер жоқ болса, бос қалдырамыз */
      }

      {/* --- СПОРТШЫ 2 --- */}
      {
        p2 ? (
          <>
            {/* Аты */}
            <text x={x + 5} y={y + 31} fontSize="9" fontWeight="1000">
              {p2.name.toUpperCase().slice(0, 20)}
            </text>
            {/* Клубы */}
            <text
              x={x + 5}
              y={y + 38}
              fontSize="7"
              fontWeight="bold"
              fill="#555"
            >
              {p2.club ? p2.club.toUpperCase().slice(0, 20) : ""}
            </text>
          </>
        ) : null /* Егер жоқ болса, бос қалдырамыз (BYE жазылмайды) */
      }

      {/* Нөмір шеңбері */}
      <circle cx={x + BOX_W + 10} cy={y + BOX_H / 2} r="8" fill="#000" />
      <text
        x={x + BOX_W + 10}
        y={y + BOX_H / 2 + 3}
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontWeight="bold"
      >
        {num}
      </text>
    </g>
  );

  return (
    <div
      id="print-area"
      style={{
        background: "#fff",
        color: "#000",
        width: "297mm",
        height: "210mm",
        padding: "5mm 10mm",
        margin: "0 auto",
        fontFamily: "'Arial Black', sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          borderBottom: "4px solid #000",
          paddingBottom: "4px",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "1000", margin: 0 }}>
            JUDOSHY BALAQAI LIGASY
          </h1>
          <div style={{ fontSize: "10px", fontWeight: "1000" }}>
            РЕСМИ ТОР ХАТТАМАСЫ (8 ҚАТЫСУШЫ)
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{ fontSize: "20px", fontWeight: "1000", color: "#d32f2f" }}
          >
            {category} КГ {ageGroup ? `(${ageGroup})` : ""}
          </div>
          <div style={{ fontSize: "10px", fontWeight: "1000" }}>
            ҚАТЫСУШЫ САНЫ: {participantsCount}
          </div>
        </div>
      </div>

      {/* ТОР (SVG) */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          {mainBrackets.map((round, rIdx) =>
            round.map((m, mIdx) => {
              const next = mainBrackets[rIdx + 1]
                ? mainBrackets[rIdx + 1][Math.floor(mIdx / 2)]
                : null;
              return (
                <g key={m.id}>
                  <ModernBox
                    x={m.x}
                    y={m.y}
                    p1={m.p1}
                    p2={m.p2}
                    num={m.num}
                    pool={rIdx === 0 ? m.pool : null}
                  />
                  {next && (
                    <path
                      d={`M ${m.x + BOX_W + 18} ${m.y + BOX_H / 2} 
                          H ${next.x - 20} 
                          V ${next.y + (mIdx % 2 === 0 ? 10 : 30)} 
                          H ${next.x}`}
                      stroke="#000"
                      fill="none"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* ЖҰБАНЫШ (REPECHAGE) */}
          <g transform="translate(0, 480)">
            <line
              x1="0"
              y1="-20"
              x2="1050"
              y2="-20"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x={START_X}
              y={0}
              fontSize="14"
              fontWeight="1000"
              textDecoration="underline"
            >
              ЖҰБАНЫШ (REPECHAGE)
            </text>

            {[
              { label: "ЖҰБАНЫШ 1 (A vs B)", x: START_X, y: 20 },
              { label: "ЖҰБАНЫШ 2 (C vs D)", x: START_X, y: 75 },
              { label: "ҚОЛА ҮШІН 1", x: START_X + 220, y: 20 },
              { label: "ҚОЛА ҮШІН 2", x: START_X + 220, y: 75 },
            ].map((m) => (
              <g key={m.label}>
                <text x={m.x} y={m.y - 5} fontSize="9" fontWeight="1000">
                  {m.label}
                </text>
                <rect
                  x={m.x}
                  y={m.y}
                  width={180}
                  height={40}
                  fill="none"
                  stroke="#000"
                  strokeWidth="1.5"
                />
                <line
                  x1={m.x}
                  y1={m.y + 20}
                  x2={m.x + 180}
                  y2={m.y + 20}
                  stroke="#000"
                  strokeWidth="1"
                />
              </g>
            ))}

            <g transform="translate(680, -20)">
              <rect
                x="0"
                y="0"
                width="280"
                height="130"
                fill="none"
                stroke="#000"
                strokeWidth="3"
              />
              <text
                x="140"
                y="25"
                textAnchor="middle"
                fontSize="14"
                fontWeight="1000"
              >
                ЖАРЫС НӘТИЖЕЛЕРІ
              </text>
              {[1, 2, 3, 3].map((pos, i) => (
                <text
                  key={i}
                  x="15"
                  y={50 + i * 20}
                  fontSize="11"
                  fontWeight="1000"
                >
                  {pos}-ОРЫН: ____________________
                </text>
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "3px solid #000",
          paddingTop: "5px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: "1000" }}>
          БАС ТӨРЕШІ: __________________________
        </div>
        <div style={{ fontSize: "14px", fontWeight: "1000" }}>
          БАС ХАТШЫ: __________________________
        </div>
      </div>
    </div>
  );
};

export default Olympic8;
