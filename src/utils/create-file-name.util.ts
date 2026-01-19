export default function createFileName(): string {
  return new Date().toDateString().replace(/\s/g, "-").trim();
};