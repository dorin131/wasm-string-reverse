const expect = require('expect');
const stringReverse = require('./index');

describe('reverse', () => {
  const stringsToReverse = [
    'I love tacos!',
    '1234567890...',
    'webassembly is cool     ',
    ' @@@@@*'
  ];

  for (string of stringsToReverse) {
    it(`should return reverse for ${string}`, async () => {
      const reversedString = string.split('').reverse().join('');
      const result = await stringReverse.reverse(string);
  
      expect(result).toEqual(reversedString);
    });
  };
});
