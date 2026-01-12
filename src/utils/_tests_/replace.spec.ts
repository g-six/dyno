import { replaceInJson } from '../replace';

describe('replaceInJson', () => {
  describe('basic functionality (unlimited replacements)', () => {
    it('should replace string values in a simple object', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'cat' };
      const { result, replacementCount } = replaceInJson(payload, 'dog', 'cat');
      
      expect(result).toEqual({ animal: 'cat', pet: 'cat', second_pet: 'cat' });
      expect(replacementCount).toBe(2);
      expect(result).not.toBe(payload); // Should return a new object
    });

    it('should replace number values in an object', () => {
      const payload = { count: 5, total: 10, remaining: 5 };
      const { result, replacementCount } = replaceInJson(payload, 5, 0);
      
      expect(result).toEqual({ count: 0, total: 10, remaining: 0 });
      expect(replacementCount).toBe(2);
    });

    it('should replace boolean values in an object', () => {
      const payload = { active: true, enabled: false, visible: true };
      const { result, replacementCount } = replaceInJson(payload, true, false);
      
      expect(result).toEqual({ active: false, enabled: false, visible: false });
      expect(replacementCount).toBe(2);
    });
  });

  describe('limited replacements', () => {
    it('should stop replacing after reaching the limit', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'dog', fourth: 'dog' };
      const { result, replacementCount } = replaceInJson(payload, 'dog', 'cat', 2);
      
      expect(replacementCount).toBe(2);
      // Should replace first 2 occurrences and leave the rest unchanged
      const replacedValues = Object.values(result).filter(v => v === 'cat');
      const unchangedValues = Object.values(result).filter(v => v === 'dog');
      expect(replacedValues).toHaveLength(2);
      expect(unchangedValues).toHaveLength(2);
    });

    it('should handle zero replacement limit', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'cat' };
      const { result, replacementCount } = replaceInJson(payload, 'dog', 'cat', 0);
      
      expect(result).toEqual(payload);
      expect(replacementCount).toBe(0);
    });

    it('should handle replacement limit larger than available replacements', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'cat' };
      const { result, replacementCount } = replaceInJson(payload, 'dog', 'cat', 5);
      
      expect(result).toEqual({ animal: 'cat', pet: 'cat', second_pet: 'cat' });
      expect(replacementCount).toBe(2);
    });

    it('should handle single replacement limit', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'dog' };
      const { result, replacementCount } = replaceInJson(payload, 'dog', 'cat', 1);
      
      expect(replacementCount).toBe(1);
      const replacedValues = Object.values(result).filter(v => v === 'cat');
      const unchangedValues = Object.values(result).filter(v => v === 'dog');
      expect(replacedValues).toHaveLength(1);
      expect(unchangedValues).toHaveLength(2);
    });
  });

  describe('nested objects with limits', () => {
    it('should respect replacement limits in nested structures', () => {
      const payload = {
        user: { name: 'John', status: 'active' },
        admin: { name: 'Jane', status: 'active' },
        guest: { name: 'Bob', status: 'active' }
      };
      const { result, replacementCount } = replaceInJson(payload, 'active', 'inactive', 2);
      
      expect(replacementCount).toBe(2);
      const allStatuses = [
        result.user.status,
        result.admin.status,
        result.guest.status
      ];
      const inactiveCount = allStatuses.filter(s => s === 'inactive').length;
      const activeCount = allStatuses.filter(s => s === 'active').length;
      
      expect(inactiveCount).toBe(2);
      expect(activeCount).toBe(1);
    });
  });

  describe('immutability', () => {
    it('should not modify the original object', () => {
      const payload = { animal: 'dog', pet: 'dog', second_pet: 'cat' };
      const originalPayload = JSON.parse(JSON.stringify(payload));
      
      replaceInJson(payload, 'dog', 'cat');
      
      expect(payload).toEqual(originalPayload);
    });

    it('should not modify nested objects in the original', () => {
      const payload = {
        pets: {
          primary: 'dog',
          list: ['dog', 'cat']
        }
      };
      const originalPayload = JSON.parse(JSON.stringify(payload));
      
      replaceInJson(payload, 'dog', 'wolf');
      
      expect(payload).toEqual(originalPayload);
    });
  });

});
