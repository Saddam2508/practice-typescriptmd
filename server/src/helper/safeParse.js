function safeParse(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value; // Already array
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

module.exports = safeParse; // <-- export
