import React, { useMemo, useEffect } from "react";
import MatchBox from "../Shared/MatchBox";
import OfficialResults from "../Shared/OfficialResults";
import { generateDraw } from "../Utils/DrawLogic";

const Olympic8 = ({ participants, category, results, setResults }) => {
  const size = 8;
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
    for (let i = 0; i < 4; i++) {
      const matchId = `r1-${i}`;
      if (!results[matchId]) {
        const p1 = seededSlots[i * 2],
          p2 = seededSlots[i * 2 + 1];
        if (p1 && !p2) handleWin(matchId, p1, null);
        else if (!p1 && p2) handleWin(matchId, p2, null);
      }
    }
  }, [seededSlots]);

  // --- ГЕОМЕТРИЯ (A4 COMPACT) ---
  const CANVAS_W = 1300;
  const CENTER_X = CANVAS_W / 2;
  const BOX_W = 145;
  const BOX_H = 40;
  const START_Y = 80;
  const POOL_GAP = 50;

  const mainBrackets = useMemo(() => {
    let matchNum = 1;
    let r1 = [];

    // --- 1-АЙНАЛЫМ (ШИРЕК ФИНАЛ) ---
    for (let i = 0; i < 4; i++) {
      const isRight = i >= 2; // 4 адам: 2 солда, 2 оңда
      const x = isRight ? CANVAS_W - BOX_W - 20 : 20;
      // Пулдарды ажырату
      const poolOffset = (Math.floor(i / 1) % 2) * POOL_GAP;

      r1.push({
        id: `r1-${i}`,
        num: matchNum++,
        x,
        y: START_Y + (i % 2) * BOX_H * 3.5 + poolOffset,
        p1: seededSlots[i * 2],
        p2: seededSlots[i * 2 + 1],
        side: isRight ? "right" : "left",
      });
    }

    let data = [r1];

    // --- ҚАЛҒАН АЙНАЛЫМДАР (1/2, FINAL) ---
    for (let r = 1; r <= 2; r++) {
      let prev = data[r - 1],
        next = [];
      for (let i = 0; i < prev.length; i += 2) {
        const isRight = prev[i].side === "right";

        let x;
        if (r === 2) {
          // ФИНАЛ (r=2)
          x = CENTER_X - BOX_W / 2;
        } else {
          // ЖАРТЫЛАЙ ФИНАЛ (r=1)
          const semiGap = 120;
          x = isRight
            ? CENTER_X + BOX_W / 2 + semiGap
            : CENTER_X - BOX_W / 2 - BOX_W - semiGap;
        }

        next.push({
          id: `r${r + 1}-${i / 2}`,
          num: matchNum++,
          x,
          y: (prev[i].y + prev[i + 1].y) / 2,
          p1: results[prev[i].id] || null,
          p2: results[prev[i + 1].id] || null,
          isFinal: r === 2,
          side: prev[i].side,
        });
      }
      data.push(next);
    }
    return data;
  }, [results, seededSlots, CANVAS_W]);

  const repechageBrackets = useMemo(() => {
    // 8 адамда Жұбаныш жоқ.
    // 1/4 (r1) жеңілгендер тікелей Қола үшін күреседі.
    // Cross-over ережесі:
    // Bronze 1: r1[0] loser vs r1[1] loser (A/B тобы ішінде емес, Cross-over!)
    // Шындығында 8 адамда жүйе қарапайым:
    // Жартылай финалда жеңілгендер бірден қола алады (екі 3-орын).
    // БІРАҚ, егер толық жұбаныш керек болса (IJF):
    // Ширек финал жеңілгендері бір-бірімен күресіп, жеңгені қолаға шығады.
    // Біз стандартты "Жартылай финалда жеңілгендер = Қола" жүйесін қолданамыз ба,
    // әлде "Ширек финал жеңілгендері -> Қола үшін" бе?

    // IJF ережесі бойынша 8 адамда ширек финалда жеңілгендер Қола үшін күреседі.
    // A тобының жеңілгені vs B тобының жеңілгені => Жеңімпаз vs SF Loser.
    // Бірақ 8 адамда ол тым қысқа.
    // Сондықтан көбінесе: SF Losers = 3rd Place (екі қола).
    // Ал егер 3-орын үшін күрес керек болса:

    const sf = mainBrackets[1] || []; // Semi-Finals
    const qf = mainBrackets[0] || []; // Quarter-Finals (r1)

    const repY = 500;
    const spacing = 160;

    // Бұл жерде 8 адамдық арнайы жүйе (Simple Repechage):
    // QF Loser 1 vs QF Loser 2 -> Winner gets Bronze? No.
    // Стандарт: QF Losers go directly to Bronze Match against SF Loser from opposite side?
    // 8 адамда Repechage раунды болмайды.
    // Тікелей: Loser of QF A vs Loser of QF B -> Winner fights Loser of SF (C/D).

    return [
      // Мұнда QF жеңілгендері бір-бірімен күреседі (Repechage)
      {
        id: "rep-1",
        label: "ЖҰБАНЫШ 1",
        sub: "(A/B ширек финал жеңілгендері)",
        p1: results[`${qf[0]?.id}_loser`],
        p2: results[`${qf[1]?.id}_loser`],
        x: CENTER_X - BOX_W - spacing,
        y: repY,
      },
      {
        id: "rep-2",
        label: "ЖҰБАНЫШ 2",
        sub: "(C/D ширек финал жеңілгендері)",
        p1: results[`${qf[2]?.id}_loser`],
        p2: results[`${qf[3]?.id}_loser`],
        x: CENTER_X + spacing,
        y: repY,
      },
      // Оның жеңімпазы Жартылай финал жеңілгенімен күреседі
      {
        id: "bronze-1",
        label: "ҚОЛА ҮШІН",
        sub: "Жұбаныш 1 жеңімпазы vs Жартылай финал 2 жеңілгені",
        p1: results["rep-1"],
        p2: results[`${sf[1]?.id}_loser`],
        x: CENTER_X - BOX_W - spacing,
        y: repY + 100,
      },
      {
        id: "bronze-2",
        label: "ҚОЛА ҮШІН",
        sub: "Жұбаныш 2 жеңімпазы vs Жартылай финал 1 жеңілгені",
        p1: results["rep-2"],
        p2: results[`${sf[0]?.id}_loser`],
        x: CENTER_X + spacing,
        y: repY + 100,
      },
    ];
  }, [mainBrackets, results, CENTER_X]);

  return (
    <div style={{ background: "#fff", padding: "0" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_W} 700`}>
        {/* --- НЕГІЗГІ ТОР --- */}
        {mainBrackets.map((round, rIdx) =>
          round.map((m, mIdx) => {
            const next = mainBrackets[rIdx + 1]
              ? mainBrackets[rIdx + 1][Math.floor(mIdx / 2)]
              : null;

            let title = "";
            let color = "#333";

            if (rIdx === 0) {
              title = `${String.fromCharCode(65 + mIdx)} ТОБЫНЫҢ ФИНАЛЫ`; // POOL FINAL (1/4)
              color = "#0055a4";
            }
            if (rIdx === 1) {
              title =
                m.side === "left" ? "ЖАРТЫЛАЙ ФИНАЛ 1" : "ЖАРТЫЛАЙ ФИНАЛ 2";
              color = "#d32f2f";
            }
            if (rIdx === 2) {
              title = "ФИНАЛ";
              color = "#d32f2f";
            }

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

                {rIdx === 0 && (
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
                {rIdx === 1 && (
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

        {/* --- ЖҰБАНЫШ --- */}
        <g>
          <line
            x1="20"
            y1="480"
            x2={CANVAS_W - 20}
            y2="480"
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text
            x={CENTER_X}
            y={495}
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

        {mainBrackets[2][0] && results[mainBrackets[2][0].id] && (
          <text x={CENTER_X - 15} y={mainBrackets[2][0].y - 45} fontSize="35">
            🥇
          </text>
        )}
      </svg>
      <OfficialResults podium={[]} />
    </div>
  );
};

export default Olympic8;
