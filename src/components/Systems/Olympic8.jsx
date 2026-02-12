import React, { useMemo } from "react";

import { generateDraw } from "../Utils/DrawLogic";

const Olympic8 = ({ participants = [], category, ageGroup }) => {
  const size = 8;

  const seededSlots = useMemo(
    () => generateDraw(participants, size),

    [participants]
  );

  const participantsCount = participants.filter(
    (p) => p && (p.name || p.id)
  ).length;

  // ГЕОМЕТРИЯ - А4 Landscape-ке сыйғызу үшін масштабталған

  const CANVAS_W = 1050;

  const CANVAS_H = 550; // SVG биіктігін азайттық, астына орын қалдыру үшін

  const BOX_W = 200;

  const BOX_H = 50;

  const START_X = 40;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    let r1 = [];

    for (let i = 0; i < 4; i++) {
      r1.push({
        id: `r1-${i}`,

        num: matchNum++,

        x: START_X,

        y: 30 + i * 90,

        p1: seededSlots[i * 2],

        p2: seededSlots[i * 2 + 1],

        pool: String.fromCharCode(65 + i),
      });
    }

    let r2 = [];

    for (let i = 0; i < 2; i++) {
      r2.push({
        id: `r2-${i}`,

        num: matchNum++,

        x: START_X + 300,

        y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
      });
    }

    const r3 = [
      {
        id: "r3-0",

        num: matchNum++,

        x: START_X + 600,

        y: (r2[0].y + r2[1].y) / 2,
      },
    ];

    return [r1, r2, r3];
  }, [seededSlots]);

  const ModernBox = ({ x, y, p1, p2, num, pool }) => (
    <g>
      {pool && (
        <text
          x={x - 15}
          y={y + 25}
          fontSize="14"
          fontWeight="1000"
          fill="#000"
          transform={`rotate(-90, ${x - 15}, ${y + 25})`}
        >
          {pool}
        </text>
      )}

      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        fill="none"
        stroke="#000"
        strokeWidth="2.5"
      />

      <line
        x1={x}
        y1={y + BOX_H / 2}
        x2={x + BOX_W}
        y2={y + BOX_H / 2}
        stroke="#000"
        strokeWidth="1.5"
      />

      <text x={x + 5} y={y + 18} fontSize="11" fontWeight="1000">
        {p1?.name?.toUpperCase() || ""}
      </text>

      <text x={x + 5} y={y + 42} fontSize="11" fontWeight="1000">
        {p2?.name?.toUpperCase() || ""}
      </text>

      <circle cx={x + BOX_W + 12} cy={y + BOX_H / 2} r="10" fill="#000" />

      <text
        x={x + BOX_W + 12}
        y={y + BOX_H / 2 + 4}
        textAnchor="middle"
        fontSize="10"
        fill="#fff"
        fontWeight="1000"
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

        padding: "8mm 12mm",

        margin: "0 auto",

        fontFamily: "'Arial Black', sans-serif",

        boxSizing: "border-box",

        display: "flex",

        flexDirection: "column",

        overflow: "hidden",
      }}
    >
      {/* --- HEADER (КРУГОВАЯДАҒЫДАЙ) --- */}

      <div
        style={{
          borderBottom: "6px solid #000",

          paddingBottom: "6px",

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

                marginTop: "2px",
              }}
            >
              РЕСМИ ТОР ХАТТАМАСЫ 2026
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
              {category} КГ ({ageGroup})
            </div>

            <div
              style={{ fontSize: "11px", fontWeight: "1000", marginTop: "2px" }}
            >
              ҚАТЫСУШЫ САНЫ: {participantsCount}
            </div>
          </div>
        </div>
      </div>

      {/* --- ТОР (BRACKETS) --- */}

      <div style={{ flexGrow: 1, minHeight: 0 }}>
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
                      d={`M ${m.x + BOX_W + 22} ${m.y + BOX_H / 2} H ${
                        next.x - 30
                      } V ${next.y + (mIdx % 2 === 0 ? 12 : 38)} H ${next.x}`}
                      stroke="#000"
                      fill="none"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* ЖҰБАНЫШ ЖӘНЕ НӘТИЖЕЛЕР - ОҢ ЖАҚ ТӨМЕНГЕ ЖИНАҚТАЛҒАН */}

          <g transform="translate(0, 420)">
            <text
              x={START_X}
              y={-10}
              fontSize="16"
              fontWeight="1000"
              textDecoration="underline"
            >
              ЖҰБАНЫШ ЖӘНЕ ҚОЛА
            </text>

            {[
              { label: "ЖҰБАНЫШ 1", x: START_X, y: 10 },

              { label: "ЖҰБАНЫШ 2", x: START_X, y: 80 },

              { label: "ҚОЛА ҮШІН 1", x: START_X + 250, y: 10 },

              { label: "ҚОЛА ҮШІН 2", x: START_X + 250, y: 80 },
            ].map((m) => (
              <g key={m.label}>
                <rect
                  x={m.x}
                  y={m.y}
                  width={180}
                  height={45}
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                />

                <line
                  x1={m.x}
                  y1={m.y + 22.5}
                  x2={m.x + 180}
                  y2={m.y + 22.5}
                  stroke="#000"
                  strokeWidth="1"
                />

                <text x={m.x} y={m.y - 4} fontSize="10" fontWeight="1000">
                  {m.label}
                </text>
              </g>
            ))}
          </g>

          <g transform="translate(640, 400)">
            <rect
              x="0"
              y="0"
              width="300"
              height="130"
              fill="none"
              stroke="#000"
              strokeWidth="4"
            />

            <text
              x="150"
              y="25"
              textAnchor="middle"
              fontSize="16"
              fontWeight="1000"
            >
              ЖАРЫС НӘТИЖЕЛЕРІ
            </text>

            {[1, 2, 3, 3].map((pos, i) => (
              <g key={i} transform={`translate(15, ${45 + i * 20})`}>
                <text x="0" y="10" fontSize="12" fontWeight="1000">
                  {pos}-ОРЫН: ____________________
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* --- FOOTER (SIGNATURES) --- */}

      <div
        style={{
          marginTop: "auto",

          borderTop: "4px solid #000",

          paddingTop: "8px",

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",
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

export default Olympic8;
