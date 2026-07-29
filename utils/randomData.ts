const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateString = (): string => {
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }
    return result;
};