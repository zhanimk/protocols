import React, { useMemo } from "react";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic16 = ({ participants = [], category, ageGroup }) => {
  const size = 16;

  const seededSlots = useMemo(
    () => generateDraw(participants, size),
    [participants]
  );
  const participantsCount = participants.filter(
    (p) => p && (p.name || p.id)
  ).length;

  // ГЕОМЕТРИЯ
  const CANVAS_W = 1150;
  const CANVAS_H = 750;
  const BOX_W = 170;
  const BOX_H = 38;
  const START_X = 20;
  const GAP_Y = 50;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    // --- 1-АЙНАЛЫМ ---
    let r1 = [];
    for (let i = 0; i < 8; i++) {
      let currentPool = "";
      if (i < 2) currentPool = "A";
      else if (i < 4) currentPool = "B";
      else if (i < 6) currentPool = "C";
      else currentPool = "D";

      const showPool = i % 2 === 0 ? currentPool : null;

      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x: START_X,
        y: 30 + i * (BOX_H + GAP_Y),
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        pool: showPool,
      });
    }

    // --- 2-АЙНАЛЫМ ---
    let r2 = [];
    for (let i = 0; i < 4; i++) {
      r2.push({
        id: `r2-${i}`,
        num: matchNum++,
        x: START_X + 220,
        y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
      });
    }

    // --- 3-АЙНАЛЫМ ---
    let r3 = [];
    for (let i = 0; i < 2; i++) {
      r3.push({
        id: `r3-${i}`,
        num: matchNum++,
        x: START_X + 440,
        y: (r2[i * 2].y + r2[i * 2 + 1].y) / 2,
      });
    }

    // --- ФИНАЛ ---
    const r4 = [
      {
        id: "r4-0",
        num: matchNum++,
        x: START_X + 660,
        y: (r3[0].y + r3[1].y) / 2,
      },
    ];

    return [r1, r2, r3, r4];
  }, [seededSlots]);

  const ModernBox = ({ x, y, p1, p2, num, pool }) => (
    <g>
      {pool && (
        <text
          x={x - 15}
          y={y + 80}
          fontSize="32"
          fontWeight="1000"
          fill="#ccc"
          opacity="0.4"
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
        strokeWidth="1.5"
      />
      <line
        x1={x}
        y1={y + BOX_H / 2}
        x2={x + BOX_W}
        y2={y + BOX_H / 2}
        stroke="#000"
        strokeWidth="1"
      />

      {p1 && (
        <>
          <text x={x + 5} y={y + 11} fontSize="9" fontWeight="1000">
            {p1.name.toUpperCase().slice(0, 20)}
          </text>
          <text x={x + 5} y={y + 17} fontSize="7" fontWeight="bold" fill="#555">
            {p1.club ? p1.club.toUpperCase().slice(0, 20) : ""}
          </text>
        </>
      )}
      {p2 && (
        <>
          <text x={x + 5} y={y + 30} fontSize="9" fontWeight="1000">
            {p2.name.toUpperCase().slice(0, 20)}
          </text>
          <text x={x + 5} y={y + 36} fontSize="7" fontWeight="bold" fill="#555">
            {p2.club ? p2.club.toUpperCase().slice(0, 20) : ""}
          </text>
        </>
      )}
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
        width: "297mm",
        height: "210mm",
        padding: "5mm 10mm",
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
            РЕСМИ ТОР ХАТТАМАСЫ (16 ҚАТЫСУШЫ)
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
                      d={`M ${m.x + BOX_W + 18} ${m.y + BOX_H / 2} H ${
                        next.x - 20
                      } V ${next.y + (mIdx % 2 === 0 ? 10 : 30)} H ${next.x}`}
                      stroke="#000"
                      fill="none"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* === ӨЗГЕРІС ОСЫ ЖЕРДЕ === */}

          {/* 1. НӘТИЖЕЛЕР БЛОГЫ (Жоғарғы Оң жақ) */}
          <g transform="translate(820, 50)">
            <rect
              width="300"
              height="150"
              fill="none"
              stroke="#000"
              strokeWidth="3"
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
              <g key={i} transform={`translate(15, ${55 + i * 25})`}>
                <text fontSize="12" fontWeight="1000">
                  {pos}-ОРЫН:
                </text>
                <line
                  x1="60"
                  y1="0"
                  x2="270"
                  y2="0"
                  stroke="#000"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>

          {/* 2. ЖҰБАНЫШ ЖӘНЕ ҚОЛА (Төменгі Оң жақ - Тройки) */}
          <g transform="translate(480, 580)">
            {/* Бөлгіш сызық (жоғарыдан бөлу үшін) */}
            <line
              x1="-480"
              y1="-20"
              x2="670"
              y2="-20"
              stroke="#000"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            <text
              x="0"
              y="-5"
              fontSize="14"
              fontWeight="1000"
              textDecoration="underline"
              fill="#d32f2f"
            >
              ЖҰБАНЫШ БЕЛДЕСУЛЕРІ (ҚОЛА ҮШІН)
            </text>

            {/* 1-ші қатар: Жұбаныш */}
            <g transform="translate(0, 10)">
              <text x="0" y="-3" fontSize="9" fontWeight="bold">
                Жұбаныш (A vs B)
              </text>
              <rect
                width="180"
                height="35"
                fill="none"
                stroke="#000"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="17.5"
                x2="180"
                y2="17.5"
                stroke="#000"
                strokeWidth="1"
              />
            </g>

            <g transform="translate(200, 10)">
              <text x="0" y="-3" fontSize="9" fontWeight="bold">
                Жұбаныш (C vs D)
              </text>
              <rect
                width="180"
                height="35"
                fill="none"
                stroke="#000"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="17.5"
                x2="180"
                y2="17.5"
                stroke="#000"
                strokeWidth="1"
              />
            </g>

            {/* 2-ші қатар: Қола үшін */}
            <g transform="translate(0, 60)">
              <text x="0" y="-3" fontSize="9" fontWeight="bold">
                ҚОЛА ҮШІН (1)
              </text>
              <rect
                width="180"
                height="35"
                fill="none"
                stroke="#000"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="17.5"
                x2="180"
                y2="17.5"
                stroke="#000"
                strokeWidth="1"
              />
            </g>

            <g transform="translate(200, 60)">
              <text x="0" y="-3" fontSize="9" fontWeight="bold">
                ҚОЛА ҮШІН (2)
              </text>
              <rect
                width="180"
                height="35"
                fill="none"
                stroke="#000"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="17.5"
                x2="180"
                y2="17.5"
                stroke="#000"
                strokeWidth="1"
              />
            </g>
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

export default Olympic16;
