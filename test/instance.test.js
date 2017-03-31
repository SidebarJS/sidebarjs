/* global test, beforeEach, describe, expect */
const SidebarJS = require('./../src/sidebarjs').default;

describe('Instance creation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should create instance', () => {
    document.body.innerHTML = '<div sidebarjs></div>';
    const sidebarjs = new SidebarJS();
    expect(sidebarjs).toBeDefined();
  });

  test('Should not create instance', () => {
    expect(() => new SidebarJS()).toThrowError('You must define an element with [sidebarjs] attribute');
  });
});
