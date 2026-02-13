import React, { useState, useMemo } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { JUDO_RULES, getJudoCategory } from "../rules";

const ParticipantForm = ({ db }) => {
  const [form, setForm] = useState({
    name: "",
    club: "",
    gender: "M",
    groupKey: "2013-2014", // Значение по умолчанию
    weight: "",
  });

  // Получаем список весов только для выбранной группы
  const availableWeights = useMemo(() => {
    const rulesSet = form.gender === "F" ? JUDO_RULES.FEMALE : JUDO_RULES.MALE;
    const group = rulesSet[form.groupKey];

    if (!group) return [];

    const list = group.weights.map((w) => ({ value: w, label: `-${w} кг` }));
    if (group.plus) list.push({ value: group.plus, label: `${group.plus} кг` });
    return list;
  }, [form.groupKey, form.gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.club || !form.weight) return alert("Толтырыңыз!");

    // Получаем стандартизированное имя категории из rules.js
    const { weightCat } = getJudoCategory(
      form.gender,
      form.groupKey,
      form.weight
    );

    try {
      await addDoc(collection(db, "competitors"), {
        ...form,
        weightCat: weightCat, // Записываем "-38кг (Ұлдар 2011-2012)"
        createdAt: serverTimestamp(),
      });
      alert(`✅ ${form.name} сәтті тіркелді!`);
      setForm({ ...form, name: "", weight: "" }); // Очищаем только имя и вес
    } catch (error) {
      console.error(error);
      alert("Қате орын алды!");
    }
  };

  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit} style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Аты-жөні (ФИО)</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Спортшының аты"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Жынысы</label>
          <select
            style={styles.input}
            value={form.gender}
            onChange={(e) => {
              const newGender = e.target.value;
              // Устанавливаем первую доступную группу для выбранного пола
              const defaultKey =
                newGender === "F" ? "2011-2012-2013" : "2011-2012";
              setForm({
                ...form,
                gender: newGender,
                groupKey: defaultKey,
                weight: "",
              });
            }}
          >
            <option value="M">Ұлдар (Boys)</option>
            <option value="F">Қыздар (Girls)</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Жас санаты (Группа)</label>
          <select
            style={styles.input}
            value={form.groupKey}
            onChange={(e) =>
              setForm({ ...form, groupKey: e.target.value, weight: "" })
            }
          >
            {Object.keys(
              form.gender === "F" ? JUDO_RULES.FEMALE : JUDO_RULES.MALE
            ).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Клуб</label>
          <input
            style={styles.input}
            value={form.club}
            onChange={(e) => setForm({ ...form, club: e.target.value })}
            placeholder="Клуб атауы"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Салмақ дәрежесі</label>
          <select
            style={styles.input}
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
          >
            <option value="">Таңдаңыз...</option>
            {availableWeights.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={styles.submitBtn}>
          ➕ ТІРКЕУ
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  formGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "13px", fontWeight: "bold", color: "#444" },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "14px",
    background: "#0055a4",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ParticipantForm;
