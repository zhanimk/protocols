import React from "react";

const OfficialResults = ({ podium }) => {
  return (
    <div
      style={{
        marginTop: "40px",
        border: "4px solid #000",
        width: "100%",
        maxWidth: "600px",
        background: "#fff",
      }}
    >
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "12px",
          fontWeight: "900",
          textAlign: "center",
          textTransform: "uppercase",
          fontSize: "18px",
        }}
      >
        OFFICIAL RESULTS
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", borderBottom: "3px solid #000" }}>
            <th
              style={{
                padding: "10px",
                borderRight: "2px solid #000",
                width: "60px",
                color: "#000",
              }}
            >
              Pos
            </th>
            <th style={{ padding: "10px", textAlign: "left", color: "#000" }}>
              Name
            </th>
            <th style={{ padding: "10px", textAlign: "right", color: "#000" }}>
              Club
            </th>
          </tr>
        </thead>
        <tbody>
          {podium.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#999",
                  fontStyle: "italic",
                }}
              >
                Awaiting results...
              </td>
            </tr>
          ) : (
            podium.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "900",
                    borderRight: "2px solid #000",
                    color: "#000",
                  }}
                >
                  {row.pos}
                </td>
                <td
                  style={{ padding: "10px", fontWeight: "900", color: "#000" }}
                >
                  {row.p.name.toUpperCase()}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  {row.p.club}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfficialResults;
