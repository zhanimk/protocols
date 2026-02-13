import React, { useEffect, useMemo } from "react";
import MatchBox from "../Shared/MatchBox";
import { generateDraw } from "../Utils/DrawLogic";
import {
  buildSingleEliminationRounds,
  getAutoAdvancePicks,
} from "../Utils/singleElimination";

const Olympic16 = ({ participants = [], results = {}, setResults }) => {
  const size = 16;

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

  const CANVAS_W = 1400;
  const CANVAS_H = 650;
  const BOX_W = 200;
  const START_X = 40;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;

    const r1 = rounds[0].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X,
      y: 20 + i * 70,
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
      y: (r2[i * 2].y + r2[i * 2 + 1].y) / 2,
    }));

    const r4 = rounds[3].map((match, i) => ({
      ...match,
      num: matchNum++,
      x: START_X + 900,
      y: i === 0 ? (r3[0].y + r3[1].y) / 2 : 0,
    }));

    return [r1, r2, r3, r4];
  }, [rounds]);

  return (
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
  );
};

export default Olympic16;
