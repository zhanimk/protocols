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

  useEffect(() => {
    const qf = rounds[0] || [];
    const rep1p1 = results[`${qf[0]?.id}_loser`] || null;
    const rep1p2 = results[`${qf[1]?.id}_loser`] || null;
    const rep2p1 = results[`${qf[2]?.id}_loser`] || null;
    const rep2p2 = results[`${qf[3]?.id}_loser`] || null;

    const updates = {};

    if (!results["rep-1"]) {
      if (rep1p1 && !rep1p2) {
        updates["rep-1"] = rep1p1;
        updates["rep-1_loser"] = null;
      } else if (!rep1p1 && rep1p2) {
        updates["rep-1"] = rep1p2;
        updates["rep-1_loser"] = null;
      }
    }

    if (!results["rep-2"]) {
      if (rep2p1 && !rep2p2) {
        updates["rep-2"] = rep2p1;
        updates["rep-2_loser"] = null;
      } else if (!rep2p1 && rep2p2) {
        updates["rep-2"] = rep2p2;
        updates["rep-2_loser"] = null;
      }
    }

    const bronzeP1 = results["rep-1"] || null;
    const bronzeP2 = results["rep-2"] || null;
    if (!results["bronze-1"]) {
      if (bronzeP1 && !bronzeP2) {
        updates["bronze-1"] = bronzeP1;
        updates["bronze-1_loser"] = null;
      } else if (!bronzeP1 && bronzeP2) {
        updates["bronze-1"] = bronzeP2;
        updates["bronze-1_loser"] = null;
      }
    }

    if (Object.keys(updates).length) {
      setResults((prev) => ({ ...prev, ...updates }));
    }
  }, [results, rounds, setResults]);

  const handleWin = (matchId, winner, loser) => {
    if (!winner || !matchId) return;

    setResults((prev) => ({
      ...prev,
      [matchId]: winner,
      [`${matchId}_loser`]: loser,
    }));
  };

  const participantsCount = participants.filter((p) => p && (p.name || p.id)).length;

  const CANVAS_W = 1080;
  const CANVAS_H = 680;
  const BOX_W = 180;
  const START_X = 30;

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
      x: START_X + 280,
      y: (r1[i * 2].y + r1[i * 2 + 1].y) / 2,
    }));

    const r3 = rounds[2].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X + 560,
      y: i === 0 ? (r2[0].y + r2[1].y) / 2 : 0,
    }));

    return [r1, r2, r3];
  }, [rounds]);

  const qf = rounds[0] || [];
  const repechageMatches = [
    {
      id: "rep-1",
      label: "ЖҰБАНЫШ 1",
      p1: results[`${qf[0]?.id}_loser`] || null,
      p2: results[`${qf[1]?.id}_loser`] || null,
      x: START_X,
      y: 460,
    },
    {
      id: "rep-2",
      label: "ЖҰБАНЫШ 2",
      p1: results[`${qf[2]?.id}_loser`] || null,
      p2: results[`${qf[3]?.id}_loser`] || null,
      x: START_X + 240,
      y: 460,
    },
    {
      id: "bronze-1",
      label: "3-ОРЫН ҮШІН",
      p1: results["rep-1"] || null,
      p2: results["rep-2"] || null,
      x: START_X + 520,
      y: 460,
    },
  ];

  const champion = mainBrackets[2]?.[0] ? results[mainBrackets[2][0].id] : null;
  const silver = mainBrackets[2]?.[0] ? results[`${mainBrackets[2][0].id}_loser`] : null;
  const bronze = results["bronze-1"] || null;

  return (
    <div
      style={{
        background: "#fff",
        color: "#000",
        width: "297mm",
        height: "210mm",
        padding: "8mm 10mm",
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
                      x={m.x - 12}
                      y={m.y + 22}
                      fontSize="13"
                      fontWeight="1000"
                      fill="#000"
                      transform={`rotate(-90, ${m.x - 12}, ${m.y + 22})`}
                    >
                      {m.pool}
                    </text>
                  )}

                  <MatchBox
                    x={m.x}
                    y={m.y + 22}
                    w={BOX_W}
                    p1={m.p1}
                    p2={m.p2}
                    matchId={m.id}
                    results={results}
                    onWin={handleWin}
                  />

                  <circle cx={m.x + BOX_W + 10} cy={m.y + 22} r="9" fill="#000" />
                  <text
                    x={m.x + BOX_W + 10}
                    y={m.y + 26}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#fff"
                    fontWeight="1000"
                  >
                    {m.num}
                  </text>

                  {next && (
                    <path
                      d={`M ${m.x + BOX_W + 20} ${m.y + 22} H ${next.x - 24} V ${
                        next.y + (mIdx % 2 === 0 ? 33 : 57)
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

          <line
            x1={START_X}
            y1={420}
            x2={CANVAS_W - 20}
            y2={420}
            stroke="#bbb"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text x={START_X} y={440} fontSize="14" fontWeight="1000">
            ЖҰБАНЫШ СЕТКАСЫ ЖӘНЕ 3-ОРЫН
          </text>

          {repechageMatches.map((m) => (
            <g key={m.id}>
              <text x={m.x} y={m.y - 12} fontSize="10" fontWeight="1000">
                {m.label}
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
            </g>
          ))}

          <g transform="translate(760, 470)">
            <rect x="0" y="0" width="290" height="130" fill="none" stroke="#000" strokeWidth="3" />
            <text x="145" y="22" textAnchor="middle" fontSize="14" fontWeight="1000">
              НӘТИЖЕ
            </text>
            <text x="12" y="48" fontSize="11" fontWeight="1000">
              1-ОРЫН: {champion?.name || "________________"}
            </text>
            <text x="12" y="73" fontSize="11" fontWeight="1000">
              2-ОРЫН: {silver?.name || "________________"}
            </text>
            <text x="12" y="98" fontSize="11" fontWeight="1000">
              3-ОРЫН: {bronze?.name || "________________"}
            </text>
          </g>
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
