export default function createTimeString(): string {
  return new Date().toTimeString().replace(/\s.*/, "").trim();
};