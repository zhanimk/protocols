import React, { useState, useMemo } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// ЕРЕЖЕЛЕРДІ ИМПОРТТАУ
import { JUDO_RULES, getJudoCategory } from "../rules";

const ParticipantForm = ({ db }) => {
  const [form, setForm] = useState({
    name: "",
    club: "",
    year: "2013",
    weight: "",
  });

  // Салмақтарды есептеу
  const availableWeights = useMemo(() => {
    const y = parseInt(form.year);
    // Топты табу (object keys арқылы)
    const groupKey = Object.keys(JUDO_RULES).find((key) => {
      const [start, end] = key.split("-").map(Number);
      return y >= start && y <= end;
    });

    if (!groupKey) return [];
    const rule = JUDO_RULES[groupKey];
    const standardWeights = rule.weights.map((w) => `-${w}kg`);
    return [...standardWeights, rule.plus];
  }, [form.year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.club || !form.weight) return alert("Толтырыңыз!");

    // Категорияны алу
    const { weightCat } = getJudoCategory(form.year, form.weight);

    try {
      await addDoc(collection(db, "competitors"), {
        name: form.name,
        club: form.club,
        year: form.year,
        weightCat, // Дайын категория
        createdAt: serverTimestamp(),
      });
      alert(`✅ ${form.name} қосылды!`);
      setForm((prev) => ({ ...prev, name: "", weight: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="form-card"
      style={{ padding: "0", border: "none", boxShadow: "none" }}
    >
      <form onSubmit={handleSubmit} className="form-grid">
        {/* ... (Инпуттар сол қалпы) ... */}
        {/* Кодтың қалған бөлігі өзгеріссіз қалады, себеби тек логика бөлігін өзгерттік */}
        <div className="input-group">
          <label>Аты-жөні</label>
          <input
            className="styled-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label>Клуб</label>
          <input
            className="styled-input"
            value={form.club}
            onChange={(e) => setForm({ ...form, club: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label>Жыл</label>
          <select
            className="styled-input"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value, weight: "" })
            }
          >
            {[2011, 2012, 2013, 2014, 2015, 2016].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Салмақ</label>
          <select
            className="styled-input"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
            disabled={availableWeights.length === 0}
          >
            <option value="">Таңдаңыз...</option>
            {availableWeights.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label style={{ visibility: "hidden" }}>Btn</label>
          <button type="submit" className="submit-btn">
            ТІРКЕУ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantForm;
