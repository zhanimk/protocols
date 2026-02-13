import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getJudoCategory, getRulesByGender } from "../rules";

const ParticipantForm = ({ db }) => {
  const [form, setForm] = useState({
    name: "",
    club: "",
    gender: "M",
    year: "2013",
    weight: "",
  });

  const availableWeights = useMemo(() => {
    const rules = getRulesByGender(form.gender);
    const y = parseInt(form.year, 10);

    let group = null;
    for (const key in rules) {
      const parts = key.split("-").map(Number);
      const start = parts[0];
      const end = parts[parts.length - 1];
      if (y >= start && y <= end) {
        group = rules[key];
        break;
      }
    }

    if (!group) return [];
    return [...group.weights.map((w) => `${w}`), group.plus];
  }, [form.year, form.gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.club || !form.weight) return alert("Толтырыңыз!");

    const { weightCat } = getJudoCategory(form.gender, form.year, form.weight);

    try {
      await addDoc(collection(db, "competitors"), {
        ...form,
        weightCat,
        createdAt: serverTimestamp(),
      });
      alert(`✅ ${form.name} сәтті тіркелді!`);
      setForm((prev) => ({ ...prev, name: "", weight: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-content animate-fade-in">
      <form onSubmit={handleSubmit} className="form-grid">
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
          <label>Жынысы</label>
          <select
            className="styled-input"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value, weight: "" })
            }
          >
            <option value="M">Ұлдар (Boys)</option>
            <option value="F">Қыздар (Girls)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Туған жылы</label>
          <select
            className="styled-input"
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value, weight: "" })
            }
          >
            {[2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
          <label>Салмақ</label>
          <select
            className="styled-input"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
          >
            <option value="">Таңдаңыз...</option>
            {availableWeights.map((w) => (
              <option key={w} value={w}>
                {w.includes("+") ? w : `${w} кг`}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <button type="submit" className="submit-btn">
            ТІРКЕУ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantForm;
