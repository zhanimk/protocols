import React from "react";

const MatchBox = ({
  x,
  y,
  w,
  p1,
  p2,
  matchId,
  results,
  onWin,
  fontSize = "11",
}) => {
  const winner = results[matchId];
  const BOX_H = 44; // Екі спортшыға арналған биіктік

  const renderCompetitor = (p, isBottom) => {
    const isWinner = winner && p && winner.id === p.id;
    const isLoser = winner && p && winner.id !== p.id;

    return (
      <g
        onClick={() => !isWinner && p && onWin(matchId, p, isBottom ? p1 : p2)}
        style={{ cursor: p ? "pointer" : "default" }}
      >
        {/* Ұяшықтың сыртқы жиегі (Border) */}
        <rect
          x={x}
          y={isBottom ? y : y - BOX_H / 2}
          width={w}
          height={BOX_H / 2}
          fill={isWinner ? "#e3f2fd" : "#fff"}
          stroke={isWinner ? "#0055a4" : "#000"}
          strokeWidth={isWinner ? "2" : "1"}
        />
        {/* Жеңімпазға арналған индикатор (көк сызық) */}
        {isWinner && (
          <line
            x1={x}
            y1={isBottom ? y + BOX_H / 2 : y}
            x2={x + w}
            y2={isBottom ? y + BOX_H / 2 : y}
            stroke="#0055a4"
            strokeWidth="4"
          />
        )}
        {/* Спортшы аты */}
        <text
          x={x + 5}
          y={isBottom ? y + 14 : y - 8}
          fontSize={fontSize}
          fontWeight="900"
          fill={isLoser ? "#999" : "#000"}
          style={{ textTransform: "uppercase" }}
        >
          {p ? p.name : ""}
        </text>
        {/* Клуб аты */}
        <text
          x={x + w - 5}
          y={isBottom ? y + 14 : y - 8}
          fontSize="8"
          textAnchor="end"
          fill="#666"
        >
          {p ? p.club : ""}
        </text>
      </g>
    );
  };

  return (
    <g>
      {renderCompetitor(p1, false)}
      {renderCompetitor(p2, true)}
    </g>
  );
};

export default MatchBox;
