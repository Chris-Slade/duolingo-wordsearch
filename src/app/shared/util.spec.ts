import { Point } from 'paper';

import { angleBetween, midpoint } from './util';

describe('util', () => {

  describe('midpoint', () => {
    it('should calculate the midpoint correctly', () => {
      const a = new Point(12, 34);
      const b = new Point(56, 78);
      const c = midpoint(a, b);
      expect(c.x).toEqual(34);
      expect(c.y).toEqual(56);
    });
  });

  describe('angleBetween', () => {
    it('should calculate the angle correctly', () => {
      const a = new Point(13, 37);
      const b = new Point(54, 32);
      expect(angleBetween(a, b)).toBeCloseTo(-6.95295746817, 10);
    });
  });

});
