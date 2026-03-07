const extractJson = async (text) => {
  if (!text) return null;

  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let stack = 0;
    let start = -1;
    let end = -1;

    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (stack === 0) start = i;
        stack++;
      }
      else if (cleaned[i] === "}") {
        stack--;
        if (stack === 0) {
          end = i;
          break;
        }
      }
    }

    if (start === -1 || end === -1) return null;

    const jsonString = cleaned.slice(start, end + 1);

    return JSON.parse(jsonString);

  } catch (err) {
    console.error("JSON extraction failed:", err.message);
    return null;
  }
};

export default extractJson;