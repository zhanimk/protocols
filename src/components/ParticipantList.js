import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getJudoCategory } from "../rules";

const ParticipantList = ({ participants, db }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSave = async (id) => {
    const { weightCat } = getJudoCategory(editForm.year, editForm.weight);
    await updateDoc(doc(db, "competitors", id), { ...editForm, weightCat });
    setEditId(null);
  };

  return (
    <div className="list-section">
      <table className="participants-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Аты-жөні</th>
            <th>Клуб</th>
            <th>Жыл</th>
            <th>Салмақ</th>
            <th>Әрекет</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>
                {editId === p.id ? (
                  <input
                    className="styled-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <input
                    className="styled-input"
                    value={editForm.club}
                    onChange={(e) =>
                      setEditForm({ ...editForm, club: e.target.value })
                    }
                  />
                ) : (
                  p.club
                )}
              </td>
              <td>{p.year}</td>
              <td>
                <span className="badge-category">{p.weightCat}</span>
              </td>
              <td>
                <div className="action-btn-group">
                  {editId === p.id ? (
                    <button
                      className="edit-btn"
                      onClick={() => handleSave(p.id)}
                    >
                      💾
                    </button>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditId(p.id);
                          setEditForm(p);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteDoc(doc(db, "competitors", p.id))}
                      >
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ParticipantList;
