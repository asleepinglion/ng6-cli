import { expect } from 'chai';
import Controller from './<%= name %>.controller';

describe('<%= name %> Controller', () => {
  it('Should be constructed', () => {
    // Arrange
    const controller = new Controller();

    // Act

    // Assert
    expect(controller).not.to.be.undefined;
  });
});
