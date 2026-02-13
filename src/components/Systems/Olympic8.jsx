import React, { useEffect, useMemo } from "react";
import MatchBox from "../Shared/MatchBox";
import { generateDraw } from "../Utils/DrawLogic";
import {
  buildSingleEliminationRounds,
  getAutoAdvancePicks,
} from "../Utils/singleElimination";

const Olympic8 = ({ participants = [], category, ageGroup, results = {}, setResults }) => {
  const size = 8;

  const seededSlots = useMemo(() => generateDraw(participants, size), [participants]);

  const rounds = useMemo(
    () => buildSingleEliminationRounds(seededSlots, size, results),
    [seededSlots, size, results]
  );

  useEffect(() => {
    const autoPicks = getAutoAdvancePicks(rounds, results);
    if (!Object.keys(autoPicks).length) return;

    setResults((prev) => ({ ...prev, ...autoPicks }));
  }, [rounds, results, setResults]);

  const handleWin = (matchId, winner, loser) => {
    if (!winner || !matchId) return;

    setResults((prev) => ({
      ...prev,
      [matchId]: winner,
      [`${matchId}_loser`]: loser,
    }));
  };

  const participantsCount = participants.filter((p) => p && (p.name || p.id)).length;

  const CANVAS_W = 1050;
  const CANVAS_H = 550;
  const BOX_W = 200;
  const START_X = 40;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    const r1 = rounds[0].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X,
      y: 30 + i * 90,
      pool: String.fromCharCode(65 + i),
    }));

    const r2 = rounds[1].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X + 300,
      y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
    }));

    const r3 = rounds[2].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X + 600,
      y: i === 0 ? (r2[0].y + r2[1].y) / 2 : 0,
    }));

    return [r1, r2, r3];
  }, [rounds]);

  return (
    <div
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
              {category} КГ {ageGroup ? `(${ageGroup})` : ""}
            </div>

            <div style={{ fontSize: "11px", fontWeight: "1000", marginTop: "2px" }}>
              ҚАТЫСУШЫ САНЫ: {participantsCount}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
          {mainBrackets.map((round, rIdx) =>
            round.map((m, mIdx) => {
              const next = mainBrackets[rIdx + 1]
                ? mainBrackets[rIdx + 1][Math.floor(mIdx / 2)]
                : null;

              return (
                <g key={m.id}>
                  {rIdx === 0 && (
                    <text
                      x={m.x - 15}
                      y={m.y + 25}
                      fontSize="14"
                      fontWeight="1000"
                      fill="#000"
                      transform={`rotate(-90, ${m.x - 15}, ${m.y + 25})`}
                    >
                      {m.pool}
                    </text>
                  )}

                  <MatchBox
                    x={m.x}
                    y={m.y + 25}
                    w={BOX_W}
                    p1={m.p1}
                    p2={m.p2}
                    matchId={m.id}
                    results={results}
                    onWin={handleWin}
                  />

                  <circle cx={m.x + BOX_W + 12} cy={m.y + 25} r="10" fill="#000" />
                  <text
                    x={m.x + BOX_W + 12}
                    y={m.y + 29}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#fff"
                    fontWeight="1000"
                  >
                    {m.num}
                  </text>

                  {next && (
                    <path
                      d={`M ${m.x + BOX_W + 22} ${m.y + 25} H ${next.x - 30} V ${
                        next.y + (mIdx % 2 === 0 ? 37 : 63)
                      } H ${next.x}`}
                      stroke="#000"
                      fill="none"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>

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
