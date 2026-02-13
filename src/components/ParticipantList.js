import React, { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getJudoCategory } from "../rules";

const ParticipantList = ({ participants, db }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSave = async (id) => {
    const hasCategoryParams = editForm.year && editForm.weight;
    const weightCat = hasCategoryParams
      ? getJudoCategory(editForm.gender, editForm.year, editForm.weight).weightCat
      : editForm.weightCat;

    await updateDoc(doc(db, "competitors", id), { ...editForm, weightCat });
    setEditId(null);
  };

  return (
    <div className="list-section">
      <div className="table-wrapper">
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
                <td data-label="№">{index + 1}</td>
                <td data-label="Аты-жөні">
                  {editId === p.id ? (
                    <input
                      className="styled-input"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      style={{ fontSize: "13px" }}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td data-label="Клуб">
                  {editId === p.id ? (
                    <input
                      className="styled-input"
                      value={editForm.club}
                      onChange={(e) =>
                        setEditForm({ ...editForm, club: e.target.value })
                      }
                      style={{ fontSize: "13px" }}
                    />
                  ) : (
                    p.club
                  )}
                </td>
                <td data-label="Жыл">{p.year}</td>
                <td data-label="Салмақ">
                  <span className="badge-category">{p.weightCat}</span>
                </td>
                <td data-label="Әрекет">
                  <div className="action-btn-group">
                    {editId === p.id ? (
                      <button className="edit-btn" onClick={() => handleSave(p.id)}>
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
    </div>
  );
};

export default ParticipantList;
