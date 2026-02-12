import React, { useMemo } from "react";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic16 = ({ participants = [], category, ageGroup }) => {
  const size = 16;
  // DrawLogic-тен 16 слотты аламыз
  const seededSlots = useMemo(
    () => generateDraw(participants, size),
    [participants]
  );
  const participantsCount = participants.filter(
    (p) => p && (p.name || p.id)
  ).length;

  // ГЕОМЕТРИЯ - "Слиплось" болмауы үшін кеңейтілген өлшемдер
  const CANVAS_W = 1200; // Енін тағы сәл ұзарттық
  const CANVAS_H = 500;
  const BOX_W = 160; // Бокс ені сәл жинақы
  const BOX_H = 44;
  const L_START_X = 40; // Сол жақ бастау
  const R_START_X = CANVAS_W - BOX_W - 40; // Оң жақ бастау
  const CENTER_X = CANVAS_W / 2 - BOX_W / 2; // Орта (Финал үшін)

  const brackets = useMemo(() => {
    let matchNum = 1;

    // 1. РАУНД (1/8 ФИНАЛ) - 8 матч
    let r1 = [];
    for (let i = 0; i < 8; i++) {
      const isRight = i >= 4;
      const poolLabel = i < 2 ? "A" : i < 4 ? "B" : i < 6 ? "C" : "D";
      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x: isRight ? R_START_X : L_START_X,
        y: 15 + (i % 4) * 95,
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        side: isRight ? "right" : "left",
        pool: poolLabel,
      });
    }

    // 2. РАУНД (ШИРЕК ФИНАЛ) - 4 матч
    let r2 = [];
    for (let i = 0; i < 4; i++) {
      const isRight = i >= 2;
      r2.push({
        id: `r2-${i}`,
        num: matchNum++,
        // Арақашықтықты 180-нен 190-ға ұзарттық (слиплось болмауы үшін)
        x: isRight ? R_START_X - 190 : L_START_X + 190,
        y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
        side: isRight ? "right" : "left",
      });
    }

    // 3. РАУНД (ЖАРТЫЛАЙ ФИНАЛ) - 2 матч
    let r3 = [];
    for (let i = 0; i < 2; i++) {
      const isRight = i >= 1;
      r3.push({
        id: `r3-${i}`,
        num: matchNum++,
        // Ортаға жақындату
        x: isRight ? R_START_X - 380 : L_START_X + 380,
        y: (r2[i * 2].y + r2[i * 2 + 1].y) / 2,
        side: isRight ? "right" : "left",
      });
    }

    // 4. РАУНД (ФИНАЛ) - 1 матч (Нақ ортада)
    const r4 = [
      {
        id: "r4-0",
        num: matchNum++,
        x: CENTER_X,
        y: (r3[0].y + r3[1].y) / 2,
      },
    ];

    return [r1, r2, r3, r4];
  }, [seededSlots]);

  const MatchBox = ({ x, y, p1, p2, num, pool }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        fill="none"
        stroke="#000"
        strokeWidth="3"
      />
      <line
        x1={x}
        y1={y + BOX_H / 2}
        x2={x + BOX_W}
        y2={y + BOX_H / 2}
        stroke="#000"
        strokeWidth="2"
      />
      <text
        x={x + 5}
        y={y + 16}
        fontSize="11"
        fontWeight="1000"
        fontFamily="Arial Black"
      >
        {p1?.name ? p1.name.toUpperCase() : "---"}
      </text>
      <text
        x={x + 5}
        y={y + 37}
        fontSize="11"
        fontWeight="1000"
        fontFamily="Arial Black"
      >
        {p2?.name ? p2.name.toUpperCase() : "---"}
      </text>
      {/* Матч нөмірі */}
      <circle
        cx={x < CANVAS_W / 2 ? x + BOX_W + 15 : x - 15}
        cy={y + BOX_H / 2}
        r="10"
        fill="#000"
      />
      <text
        x={x < CANVAS_W / 2 ? x + BOX_W + 15 : x - 15}
        y={y + BOX_H / 2 + 4}
        textAnchor="middle"
        fontSize="10"
        fill="#fff"
        fontWeight="1000"
      >
        {num}
      </text>
      {pool && (
        <text x={x} y={y - 5} fontSize="11" fontWeight="1000" fill="#666">
          POOL {pool}
        </text>
      )}
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
      {/* HEADER */}
      <div
        style={{
          borderBottom: "8px solid #000",
          paddingBottom: "8px",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "1000", margin: 0 }}>
              JUDOSHY BALAQAI LIGASY
            </h1>
            <div style={{ fontSize: "12px", fontWeight: "1000" }}>
              Olympic-16 Дзюдо Хаттамасы 2026
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "1000", color: "#d32f2f" }}
            >
              {category} КГ
            </div>
            <div style={{ fontSize: "12px", fontWeight: "1000" }}>
              ҚАТЫСУШЫ САНЫ: {participantsCount}
            </div>
          </div>
        </div>
      </div>

      {/* ТОР (SVG) */}
      <div style={{ flexGrow: 1 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          {brackets.map((round, rIdx) =>
            round.map((m, mIdx) => {
              const next = brackets[rIdx + 1]
                ? brackets[rIdx + 1][Math.floor(mIdx / 2)]
                : null;
              return (
                <g key={m.id}>
                  <MatchBox
                    x={m.x}
                    y={m.y}
                    p1={m.p1}
                    p2={m.p2}
                    num={m.num}
                    pool={rIdx === 0 ? m.pool : null}
                  />
                  {next && (
                    <path
                      d={
                        m.side === "left"
                          ? `M ${m.x + BOX_W + 25} ${m.y + BOX_H / 2} H ${
                              next.x - 30
                            } V ${next.y + (mIdx % 2 === 0 ? 10 : 34)} H ${
                              next.x
                            }`
                          : `M ${m.x - 25} ${m.y + BOX_H / 2} H ${
                              next.x + BOX_W + 30
                            } V ${next.y + (mIdx % 2 === 0 ? 10 : 34)} H ${
                              next.x + BOX_W
                            }`
                      }
                      stroke="#000"
                      fill="none"
                      strokeWidth="2.5"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* ЖҮЛДЕГЕРЛЕР МЕН ЖҰБАНЫШ */}
          <g transform="translate(0, 410)">
            <text
              x={40}
              y={0}
              fontSize="16"
              fontWeight="1000"
              textDecoration="underline"
            >
              ЖАРЫС НӘТИЖЕЛЕРІ
            </text>
            <rect
              x={40}
              y={10}
              width={340}
              height={75}
              fill="none"
              stroke="#000"
              strokeWidth="3"
            />
            {[1, 2, 3, 3].map((pos, i) => (
              <text
                key={i}
                x={50}
                y={28 + i * 15}
                fontSize="10"
                fontWeight="1000"
              >
                {pos}-ОРЫН: _______________________
              </text>
            ))}

            <text
              x={CANVAS_W / 2}
              y={0}
              fontSize="16"
              fontWeight="1000"
              textDecoration="underline"
            >
              ЖҰБАНЫШ (REPECHAGE)
            </text>
            <g transform={`translate(${CANVAS_W / 2}, 10)`}>
              <rect
                x="0"
                y="0"
                width={170}
                height={40}
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
              />
              <rect
                x="185"
                y="0"
                width={170}
                height={40}
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
              />
              <text
                x="85"
                y="-5"
                textAnchor="middle"
                fontSize="10"
                fontWeight="1000"
              >
                ЖҰБАНЫШ A/B
              </text>
              <text
                x="270"
                y="-5"
                textAnchor="middle"
                fontSize="10"
                fontWeight="1000"
              >
                ЖҰБАНЫШ C/D
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",
          borderTop: "6px solid #000",
          paddingTop: "8px",
          display: "flex",
          justifyContent: "space-between",
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

export default Olympic16;
