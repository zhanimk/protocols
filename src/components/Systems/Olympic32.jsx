import React, { useMemo } from "react";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic32 = ({ participants = [], category, ageGroup }) => {
  const size = 32;

  // 1. Жеребьевка
  const seededSlots = useMemo(
    () => generateDraw(participants, size),
    [participants]
  );

  const participantsCount = participants.filter(
    (p) => p && (p.name || p.id)
  ).length;

  // ГЕОМЕТРИЯ - 32 адамға арналған (Өте тығыз)
  const CANVAS_W = 1250;
  const CANVAS_H = 850; // Биіктігі 32 жолға жететіндей
  const BOX_W = 150; // Бокс ені (ықшам)
  const BOX_H = 34; // Бокс биіктігі (38 -> 34 кішірейтілді)
  const START_X = 10;
  const GAP_Y = 18; // Жолдар арасы өте тығыз

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    // --- 1-АЙНАЛЫМ (1/16 Final) - 16 matches ---
    let r1 = [];
    for (let i = 0; i < 16; i++) {
      let currentPool = "";
      if (i < 4) currentPool = "A";
      else if (i < 8) currentPool = "B";
      else if (i < 12) currentPool = "C";
      else currentPool = "D";

      // Пул әрпін әр топтың ортасында көрсету
      const showPool = i % 4 === 1 ? currentPool : null;

      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x: START_X,
        y: 20 + i * (BOX_H + GAP_Y),
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        pool: showPool,
      });
    }

    // --- 2-АЙНАЛЫМ (1/8 Final) ---
    let r2 = [];
    for (let i = 0; i < 8; i++) {
      r2.push({
        id: `r2-${i}`,
        num: matchNum++,
        x: START_X + 190,
        y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
      });
    }

    // --- 3-АЙНАЛЫМ (1/4 Final) ---
    let r3 = [];
    for (let i = 0; i < 4; i++) {
      r3.push({
        id: `r3-${i}`,
        num: matchNum++,
        x: START_X + 380,
        y: (r2[i * 2].y + r2[i * 2 + 1].y) / 2,
      });
    }

    // --- 4-АЙНАЛЫМ (Semi Final) ---
    let r4 = [];
    for (let i = 0; i < 2; i++) {
      r4.push({
        id: `r4-${i}`,
        num: matchNum++,
        x: START_X + 570,
        y: (r3[i * 2].y + r3[i * 2 + 1].y) / 2,
      });
    }

    // --- 5-АЙНАЛЫМ (Final) ---
    const r5 = [
      {
        id: "r5-0",
        num: matchNum++,
        x: START_X + 760,
        y: (r4[0].y + r4[1].y) / 2,
      },
    ];

    return [r1, r2, r3, r4, r5];
  }, [seededSlots]);

  // --- MODERN BOX (32-ге арналған ықшам нұсқа) ---
  const ModernBox = ({ x, y, p1, p2, num, pool }) => (
    <g>
      {/* Пул аты */}
      {pool && (
        <text
          x={x - 12}
          y={y + 80}
          fontSize="40"
          fontWeight="1000"
          fill="#ccc"
          opacity="0.4"
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
        strokeWidth="1.2"
      />
      <line
        x1={x}
        y1={y + BOX_H / 2}
        x2={x + BOX_W}
        y2={y + BOX_H / 2}
        stroke="#000"
        strokeWidth="1"
      />

      {/* СПОРТШЫ 1 */}
      {p1 && (
        <>
          <text x={x + 4} y={y + 11} fontSize="8" fontWeight="1000">
            {p1.name.toUpperCase().slice(0, 18)}
          </text>
          <text x={x + 4} y={y + 16} fontSize="6" fontWeight="bold" fill="#555">
            {p1.club ? p1.club.toUpperCase().slice(0, 18) : ""}
          </text>
        </>
      )}

      {/* СПОРТШЫ 2 */}
      {p2 && (
        <>
          <text x={x + 4} y={y + 28} fontSize="8" fontWeight="1000">
            {p2.name.toUpperCase().slice(0, 18)}
          </text>
          <text x={x + 4} y={y + 33} fontSize="6" fontWeight="bold" fill="#555">
            {p2.club ? p2.club.toUpperCase().slice(0, 18) : ""}
          </text>
        </>
      )}

      {/* Нөмір */}
      <circle cx={x + BOX_W + 8} cy={y + BOX_H / 2} r="7" fill="#000" />
      <text
        x={x + BOX_W + 8}
        y={y + BOX_H / 2 + 3}
        textAnchor="middle"
        fontSize="8"
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
        width: "297mm",
        height: "210mm",
        padding: "5mm",
        margin: "0 auto",
        fontFamily: "'Arial Black', sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          borderBottom: "3px solid #000",
          paddingBottom: "4px",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "1000", margin: 0 }}>
            JUDOSHY BALAQAI LIGASY
          </h1>
          <div style={{ fontSize: "10px", fontWeight: "1000" }}>
            РЕСМИ ТОР ХАТТАМАСЫ (32 ҚАТЫСУШЫ)
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{ fontSize: "18px", fontWeight: "1000", color: "#d32f2f" }}
          >
            {category} ({ageGroup})
          </div>
          <div style={{ fontSize: "10px", fontWeight: "1000" }}>
            ҚАТЫСУШЫ САНЫ: {participantsCount}
          </div>
        </div>
      </div>

      <div style={{ flexGrow: 1 }}>
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
                      d={`M ${m.x + BOX_W + 15} ${m.y + BOX_H / 2} 
                          H ${next.x - 15} 
                          V ${next.y + (mIdx % 2 === 0 ? 8 : BOX_H - 8)} 
                          H ${next.x}`}
                      stroke="#000"
                      fill="none"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* === ОРНАЛАСУДЫ ӨЗГЕРТТІМ === */}

          {/* 1. НӘТИЖЕЛЕР БЛОГЫ (Жоғарғы Оң жақ - Top Right) */}
          <g transform="translate(930, 20)">
            <rect
              width="280"
              height="140"
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
              НӘТИЖЕЛЕР
            </text>
            {[1, 2, 3, 3].map((pos, i) => (
              <g key={i} transform={`translate(10, ${50 + i * 22})`}>
                <text fontSize="10" fontWeight="1000">
                  {pos}-ОРЫН:
                </text>
                <line
                  x1="50"
                  y1="0"
                  x2="260"
                  y2="0"
                  stroke="#000"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>

          {/* 2. ЖҰБАНЫШ ЖӘНЕ ҚОЛА (Төменгі Оң жақ - Bottom Right) */}
          <g transform="translate(600, 700)">
            {/* Бөлгіш сызық */}
            <line
              x1="-600"
              y1="-10"
              x2="650"
              y2="-10"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            <text
              x="0"
              y="5"
              fontSize="12"
              fontWeight="1000"
              textDecoration="underline"
              fill="#d32f2f"
            >
              ЖҰБАНЫШ БЕЛДЕСУЛЕРІ (REPECHAGE)
            </text>

            {/* 4 Блок */}
            {[
              { l: "ЖҰБАНЫШ A-B", x: 0, y: 15 },
              { l: "ЖҰБАНЫШ C-D", x: 0, y: 60 },
              { l: "ҚОЛА ҮШІН (1)", x: 220, y: 15 },
              { l: "ҚОЛА ҮШІН (2)", x: 220, y: 60 },
            ].map((r, i) => (
              <g key={i} transform={`translate(${r.x}, ${r.y})`}>
                <text x="0" y="-3" fontSize="8" fontWeight="bold">
                  {r.l}
                </text>
                <rect
                  width="180"
                  height="30"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="15"
                  x2="180"
                  y2="15"
                  stroke="#000"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div
        style={{
          marginTop: "auto",
          borderTop: "3px solid #000",
          paddingTop: "5px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "1000" }}>
          БАС ТӨРЕШІ: __________________________
        </div>
        <div style={{ fontSize: "12px", fontWeight: "1000" }}>
          БАС ХАТШЫ: __________________________
        </div>
      </div>
    </div>
  );
};

export default Olympic32;
