export function generateProjectTitle(): string {
  return `Project ${Date.now()}`;
}

export function generateProjectCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}