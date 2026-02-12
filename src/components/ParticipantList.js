import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
// ЕРЕЖЕЛЕРДІ ИМПОРТТАУ (Жаңа файлдан)
import { getJudoCategory } from "../rules";

const ParticipantList = ({ participants, db }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // РЕДАКТИРОВАНИЕ
  const handleEditClick = (p) => {
    setEditId(p.id);
    setEditForm(p);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    try {
      // Категорияны қайта есептеу
      const { weightCat } = getJudoCategory(editForm.year, editForm.weight);

      const userRef = doc(db, "competitors", id);
      await updateDoc(userRef, {
        ...editForm,
        weightCat, // Жаңартылған категория
      });

      setEditId(null);
    } catch (error) {
      alert("Қате: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Өшіруді растайсыз ба?")) {
      await deleteDoc(doc(db, "competitors", id));
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="list-section"
      style={{ padding: "0", border: "none", boxShadow: "none" }}
    >
      <div style={{ overflowX: "auto" }}>
        <table className="participants-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>№</th>
              <th>Аты-жөні</th>
              <th>Клуб</th>
              <th style={{ width: "80px" }}>Жыл</th>
              <th>Салмақ</th>
              <th>Категория</th>
              <th style={{ width: "100px" }}>Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr
                key={p.id}
                style={{ background: editId === p.id ? "#fff3cd" : "inherit" }}
              >
                <td>{index + 1}</td>

                {/* АТЫ-ЖӨНІ */}
                <td>
                  {editId === p.id ? (
                    <input
                      className="styled-input"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <span style={{ fontWeight: "bold" }}>{p.name}</span>
                  )}
                </td>

                {/* КЛУБ */}
                <td>
                  {editId === p.id ? (
                    <input
                      className="styled-input"
                      name="club"
                      value={editForm.club}
                      onChange={handleChange}
                    />
                  ) : (
                    p.club
                  )}
                </td>

                {/* ЖЫЛ */}
                <td>
                  {editId === p.id ? (
                    <select
                      className="styled-input"
                      name="year"
                      value={editForm.year}
                      onChange={handleChange}
                    >
                      {[2011, 2012, 2013, 2014, 2015, 2016].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  ) : (
                    p.year
                  )}
                </td>

                {/* САЛМАҚ */}
                <td>
                  {editId === p.id ? (
                    <input
                      className="styled-input"
                      name="weight"
                      value={editForm.weight}
                      onChange={handleChange}
                      style={{ width: "80px" }}
                    />
                  ) : // Тек салмақты көрсету (-38kg)
                  p.weightCat ? (
                    p.weightCat.split(" ")[0]
                  ) : (
                    "-"
                  )}
                </td>

                {/* ТОЛЫҚ КАТЕГОРИЯ */}
                <td>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      background: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {p.weightCat}
                  </span>
                </td>

                {/* БАТЫРМАЛАР */}
                <td>
                  <div className="action-btn-group">
                    {editId === p.id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSave(p.id)}
                          title="Сақтау"
                        >
                          💾
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancel}
                          title="Болдырмау"
                        >
                          ✖
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(p)}
                          title="Түзету"
                        >
                          ✎
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(p.id)}
                          title="Өшіру"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#888",
                  }}
                >
                  Тізім бос
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantList;
