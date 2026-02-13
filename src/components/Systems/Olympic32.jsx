import React, { useMemo, useEffect } from "react";
import MatchBox from "../Shared/MatchBox";
import OfficialResults from "../Shared/OfficialResults";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic32 = ({ participants, category, results, setResults }) => {
  const size = 32;
  const seededSlots = useMemo(
    () => generateDraw(participants, size),
    [participants]
  );

  const handleWin = (matchId, winner, loser) => {
    if (!winner || !matchId) return;
    setResults((prev) => ({
      ...prev,
      [matchId]: winner,
      [`${matchId}_loser`]: loser,
    }));
  };

  useEffect(() => {
    const autoPicks = {};
    for (let i = 0; i < 16; i++) {
      const matchId = `r1-${i}`;
      if (!results[matchId]) {
        const p1 = seededSlots[i * 2];
        const p2 = seededSlots[i * 2 + 1];
        if (p1 && !p2) {
          autoPicks[matchId] = p1;
          autoPicks[`${matchId}_loser`] = null;
        } else if (!p1 && p2) {
          autoPicks[matchId] = p2;
          autoPicks[`${matchId}_loser`] = null;
        }
      }
    }

    if (Object.keys(autoPicks).length) {
      setResults((prev) => ({ ...prev, ...autoPicks }));
    }
  }, [results, seededSlots, setResults]);

  // --- ГЕОМЕТРИЯ (A4 ЖИНАҚЫ) ---
  const CANVAS_W = 1300;
  const CENTER_X = CANVAS_W / 2;
  const BOX_W = 145;
  const BOX_H = 34;
  const START_Y = 40;
  const POOL_GAP = 15;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;
    let r1 = [];

    // --- 1-АЙНАЛЫМ ---
    for (let i = 0; i < 16; i++) {
      const isRight = i >= 8;
      const x = isRight ? CANVAS_W - BOX_W - 20 : 20;
      const poolOffset = (Math.floor(i / 4) % 2) * POOL_GAP;
      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x,
        y: START_Y + (i % 8) * BOX_H * 2.1 + poolOffset,
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        side: isRight ? "right" : "left",
      });
    }

    let data = [r1];

    // --- ҚАЛҒАН АЙНАЛЫМДАР ---
    for (let r = 1; r <= 4; r++) {
      let prev = data[r - 1],
        next = [];
      for (let i = 0; i < prev.length; i += 2) {
        const isRight = prev[i].side === "right";

        let x;
        if (r === 4) {
          x = CENTER_X - BOX_W / 2; // Финал
        } else if (r === 3) {
          const semiGap = 110;
          x = isRight
            ? CENTER_X + BOX_W / 2 + semiGap
            : CENTER_X - BOX_W / 2 - BOX_W - semiGap;
        } else {
          const gap = 55;
          const xOffset = (BOX_W + gap) * r;
          x = isRight ? CANVAS_W - BOX_W - 20 - xOffset : 20 + xOffset;
        }

        next.push({
          id: `r${r + 1}-${i / 2}`,
          num: matchNum++,
          x,
          y: (prev[i].y + prev[i + 1].y) / 2,
          p1: results[prev[i].id] || null,
          p2: results[prev[i + 1].id] || null,
          isFinal: r === 4,
          side: prev[i].side,
        });
      }
      data.push(next);
    }
    return data;
  }, [results, seededSlots, CANVAS_W]);

  const repechageBrackets = useMemo(() => {
    const qf = mainBrackets[2] || [],
      sf = mainBrackets[3] || [];
    const repY = 700;
    const spacing = 160;

    return [
      {
        id: "rep-1",
        label: "ЖҰБАНЫШ 1",
        sub: "(A және B тобынан жеңілгендер)",
        p1: results[`${qf[0]?.id}_loser`],
        p2: results[`${qf[1]?.id}_loser`],
        x: CENTER_X - BOX_W - spacing,
        y: repY,
      },
      {
        id: "rep-2",
        label: "ЖҰБАНЫШ 2",
        sub: "(C және D тобынан жеңілгендер)",
        p1: results[`${qf[2]?.id}_loser`],
        p2: results[`${qf[3]?.id}_loser`],
        x: CENTER_X + spacing,
        y: repY,
      },
      {
        id: "bronze-1",
        label: "ҚОЛА ҮШІН",
        sub: "Жұбаныш 1 жеңімпазы vs Жартылай финал 2 жеңілгені",
        p1: results["rep-1"],
        p2: results[`${sf[1]?.id}_loser`],
        x: CENTER_X - BOX_W - spacing,
        y: repY + 90,
      },
      {
        id: "bronze-2",
        label: "ҚОЛА ҮШІН",
        sub: "Жұбаныш 2 жеңімпазы vs Жартылай финал 1 жеңілгені",
        p1: results["rep-2"],
        p2: results[`${sf[0]?.id}_loser`],
        x: CENTER_X + spacing,
        y: repY + 90,
      },
    ];
  }, [mainBrackets, results, CENTER_X]);

  const finalMatch = mainBrackets[4]?.[0];
  const podium = [
    finalMatch && results[finalMatch.id]
      ? { pos: 1, p: results[finalMatch.id] }
      : null,
    finalMatch && results[`${finalMatch.id}_loser`]
      ? { pos: 2, p: results[`${finalMatch.id}_loser`] }
      : null,
    results["bronze-1"] ? { pos: 3, p: results["bronze-1"] } : null,
    results["bronze-2"] ? { pos: 3, p: results["bronze-2"] } : null,
  ].filter(Boolean);

  return (
    <div style={{ background: "#fff", padding: "0" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} 850`}>
        {/* --- НЕГІЗГІ ТОР --- */}
        {mainBrackets.map((round, rIdx) =>
          round.map((m, mIdx) => {
            const next = mainBrackets[rIdx + 1]
              ? mainBrackets[rIdx + 1][Math.floor(mIdx / 2)]
              : null;

            // --- ҚАЗАҚША ТАҚЫРЫПТАР ---
            let title = "";
            let color = "#333";

            if (rIdx === 1) {
              title = "1/8 ФИНАЛ";
              color = "#666";
            }
            if (rIdx === 2) {
              title = `${String.fromCharCode(65 + mIdx)} ТОБЫНЫҢ ФИНАЛЫ`;
              color = "#0055a4";
            }
            if (rIdx === 3) {
              title =
                m.side === "left" ? "ЖАРТЫЛАЙ ФИНАЛ 1" : "ЖАРТЫЛАЙ ФИНАЛ 2";
              color = "#d32f2f";
            }
            // ТЕК "ФИНАЛ" ДЕГЕН СӨЗ
            if (rIdx === 4) {
              title = "ФИНАЛ";
              color = "#d32f2f";
            }

            // --- СЫЗЫҚТАР ---
            let startX, endX, midX;
            if (next) {
              if (m.side === "left") {
                startX = m.x + BOX_W;
                endX = next.x;
              } else {
                startX = m.x;
                endX = next.x + BOX_W;
              }
              midX = (startX + endX) / 2;
            }

            return (
              <g key={m.id}>
                {/* ТАҚЫРЫП (Тура ұяшықтың үстінде) */}
                {title && (
                  <text
                    x={m.side === "left" ? m.x : m.x + BOX_W}
                    y={m.y - 12}
                    fontSize="9"
                    fontWeight="900"
                    fill={color}
                    textAnchor={m.side === "left" ? "start" : "end"}
                    style={{ textTransform: "uppercase" }}
                  >
                    {title}
                  </text>
                )}

                {/* МАТЧ НӨМІРІ */}
                <text
                  x={m.side === "left" ? m.x : m.x + BOX_W}
                  y={m.y - 3}
                  fontSize="8"
                  fill="#aaa"
                  textAnchor={m.side === "left" ? "start" : "end"}
                >
                  #{m.num}
                </text>

                <MatchBox
                  x={m.x}
                  y={m.y}
                  w={BOX_W}
                  p1={m.p1}
                  p2={m.p2}
                  matchId={m.id}
                  results={results}
                  onWin={handleWin}
                />

                {/* ЕСКЕРТУЛЕР */}
                {rIdx === 2 && (
                  <text
                    x={m.x + BOX_W / 2}
                    y={m.y + 48}
                    textAnchor="middle"
                    fontSize="7"
                    fill="#d32f2f"
                    fontWeight="bold"
                  >
                    ↓ Жұбанышқа
                  </text>
                )}
                {rIdx === 3 && (
                  <text
                    x={m.x + BOX_W / 2}
                    y={m.y + 48}
                    textAnchor="middle"
                    fontSize="7"
                    fill="#d32f2f"
                    fontWeight="bold"
                  >
                    ↓ Қолаға
                  </text>
                )}

                {/* СЫЗЫҚТАР */}
                {next && !m.isFinal && (
                  <path
                    d={`M ${startX} ${m.y} H ${midX} V ${next.y} H ${endX}`}
                    stroke="#000"
                    strokeWidth="1.5"
                    fill="none"
                  />
                )}
              </g>
            );
          })
        )}

        {/* --- ЖҰБАНЫШ ЖӘНЕ ҚОЛА --- */}
        <g>
          <line
            x1="20"
            y1="680"
            x2={CANVAS_W - 20}
            y2="680"
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text
            x={CENTER_X}
            y={695}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
          >
            ЖҰБАНЫШ БЕЛДЕСУЛЕРІ ЖӘНЕ ҚОЛА
          </text>

          {repechageBrackets.map((m) => (
            <g key={m.id}>
              <text
                x={m.x}
                y={m.y - 12}
                fontSize="9"
                fontWeight="bold"
                fill="#000"
              >
                {m.label}
              </text>
              <text x={m.x} y={m.y - 2} fontSize="7" fill="#555">
                {m.sub}
              </text>
              <MatchBox
                x={m.x}
                y={m.y}
                w={BOX_W}
                p1={m.p1}
                p2={m.p2}
                matchId={m.id}
                results={results}
                onWin={handleWin}
              />
              {m.id.startsWith("bronze") && results[m.id] && (
                <text x={m.x + BOX_W + 5} y={m.y + 10} fontSize="24">
                  🥉
                </text>
              )}
            </g>
          ))}
        </g>

        {/* АЛТЫН */}
        {mainBrackets[4][0] && results[mainBrackets[4][0].id] && (
          <text x={CENTER_X - 15} y={mainBrackets[4][0].y - 45} fontSize="35">
            🥇
          </text>
        )}
      </svg>
      <OfficialResults podium={podium} />
    </div>
  );
};

export default Olympic32;
