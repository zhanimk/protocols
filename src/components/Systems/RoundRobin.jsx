import React from "react";

const RoundRobin = ({ participants, category }) => {
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ТАҚЫРЫП */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ textTransform: "uppercase", color: "#0055a4", margin: 0 }}>
          АЙНАЛМАЛЫ ЖҮЙЕ (ROUND ROBIN)
        </h2>
        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
          Барлық қатысушылар бір-бірімен кездеседі
        </p>
      </div>

      {/* КЕСТЕ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "2px solid #000",
        }}
      >
        <thead>
          <tr style={{ background: "#333", color: "#fff", fontSize: "12px" }}>
            <th
              style={{
                padding: "10px",
                border: "1px solid #fff",
                width: "40px",
              }}
            >
              №
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #fff",
                textAlign: "left",
              }}
            >
              АТЫ-ЖӨНІ
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #fff",
                textAlign: "left",
              }}
            >
              КОМАНДАСЫ
            </th>

            {/* Қарсыластар нөмірлері */}
            {participants.map((_, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #fff",
                  width: "40px",
                  textAlign: "center",
                }}
              >
                {i + 1}
              </th>
            ))}

            <th
              style={{
                background: "#d32f2f",
                border: "1px solid #fff",
                width: "60px",
              }}
            >
              ЖЕҢІС
            </th>
            <th
              style={{
                background: "#d32f2f",
                border: "1px solid #fff",
                width: "60px",
              }}
            >
              ҰПАЙ
            </th>
            <th
              style={{
                background: "#0055a4",
                border: "1px solid #fff",
                width: "60px",
              }}
            >
              ОРЫН
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, i) => (
            <tr
              key={p.id}
              style={{ fontSize: "14px", fontWeight: "bold", height: "50px" }}
            >
              {/* Реттік нөмір */}
              <td
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  background: "#f9f9f9",
                }}
              >
                {i + 1}
              </td>

              {/* Аты-жөні */}
              <td style={{ border: "1px solid #000", padding: "0 10px" }}>
                {p.name.toUpperCase()}
              </td>

              {/* Командасы */}
              <td
                style={{
                  border: "1px solid #000",
                  padding: "0 10px",
                  color: "#555",
                  fontSize: "12px",
                }}
              >
                {p.club || "-"}
              </td>

              {/* Нәтиже ұяшықтары */}
              {participants.map((_, j) => (
                <td
                  key={j}
                  style={{
                    border: "1px solid #000",
                    textAlign: "center",
                    background: i === j ? "#ccc" : "#fff", // Өзімен өзі күреспейді (сұр түс)
                  }}
                >
                  {i === j ? "X" : ""}
                </td>
              ))}

              {/* Қорытынды бағандар (Бос, қолмен толтыру үшін) */}
              <td style={{ border: "1px solid #000" }}></td>
              <td style={{ border: "1px solid #000" }}></td>
              <td style={{ border: "1px solid #000" }}></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ЕРЕЖЕЛЕР */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px dashed #999",
          fontSize: "12px",
        }}
      >
        <strong>* Ұпай санау ережесі:</strong>
        <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
          <li>Ippon (Таза жеңіс) = 10 ұпай</li>
          <li>Waza-ari (Жартылай жеңіс) = 7 ұпай</li>
          <li>Hantei (Төреші шешімі) = 1 ұпай</li>
        </ul>
      </div>
    </div>
  );
};

export default RoundRobin;
