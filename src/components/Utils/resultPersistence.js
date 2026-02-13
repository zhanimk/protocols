/**
 * src/components/Utils/resultPersistence.js
 * Базамен (Firebase) жұмыс істеуге арналған утилиталар
 */

const safeSnapshot = (athlete) => {
  if (!athlete || typeof athlete !== "object") return null;
  return {
    id: athlete.id || null,
    name: athlete.name || "",
    club: athlete.club || "",
  };
};

// Салмақ дәрежесіне қарап базадағы құжаттың (Document) атын құрастыру
export const buildResultDocId = (category = "") => {
  const normalized = String(category).trim();
  if (!normalized) return "uncategorized";

  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gi, "-") // Тек әріп, сан және сызықша қалдыру
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "uncategorized";
};

// Нәтижелерді базаға сақтау үшін жеңілдету
export const serializeResults = (results = {}) => {
  const out = {};
  Object.entries(results).forEach(([key, value]) => {
    if (value === null) {
      out[key] = null;
      return;
    }
    out[key] = safeSnapshot(value);
  });
  return out;
};

// Базадан келген деректерді қатысушылар тізімімен қайта біріктіру
export const hydrateResults = (storedResults = {}, participants = []) => {
  const byId = new Map((participants || []).map((p) => [p.id, p]));
  const out = {};

  Object.entries(storedResults || {}).forEach(([key, value]) => {
    if (value === null) {
      out[key] = null;
      return;
    }
    // Егер базадағы ID қатысушылар тізімінде болса, толық объектіні аламыз
    const fromList = value?.id ? byId.get(value.id) : null;
    out[key] = fromList || value;
  });

  return out;
};