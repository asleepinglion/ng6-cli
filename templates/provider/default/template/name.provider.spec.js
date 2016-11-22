import { expect } from 'chai';
import Provider from './<%= name %>.provider';

describe('<%= name %> Provider', () => {
  it('Should be constructed', () => {
    // Arrange
    const provider = new Provider();

    // Act

    // Assert
    expect(provider).not.to.be.undefined;
  });

  it('Should have $get method', () => {
    // Arrange
    const provider = new Provider();

    // Act

    // Assert
    expect(provider.$get).not.to.be.undefined;
  });
});
