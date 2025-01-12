export function removeDuplicateSolutions(optimalSolutions: {[key: number]: string}[]) {
  const seen = new Set();
  return optimalSolutions.filter(sol => {
    const key = JSON.stringify(Object.entries(sol).filter(([_, val]) => val !== "0"));
    return seen.has(key) ? false : seen.add(key);
  });
}