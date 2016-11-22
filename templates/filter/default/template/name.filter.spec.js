import { expect } from 'chai';
import Filter from './<%= name %>.filter';

describe('<%= name %> Filter', () => {
  it('should return given input', () => {
    // Arrange
    const filter = Filter();
    const input = 'ng6-cli is awesome!';

    // Act
    const output = filter(input);

    // Assert
    expect(output).to.equal(input);
  });
});
