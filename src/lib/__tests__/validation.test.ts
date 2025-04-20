import { describe, it, expect } from 'vitest';
import { validateEmail, sanitizeInput } from '../validation';

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.com',
      '123.456@domain.com',
      'email@subdomain.domain.com'
    ];

    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  it('rejects invalid email addresses', () => {
    const invalidEmails = [
      'test@',
      '@domain.com',
      'test@.com',
      'test@domain.',
      'test@domain',
      'test.domain.com',
      'test@domain@com',
      'test..test@domain.com',
      'test@domain..com',
      ' test@domain.com',
      'test@domain.com ',
      'test@@domain.com'
    ];

    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});

describe('sanitizeInput', () => {
  describe('Input Type Handling', () => {
    it('handles null and undefined inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('converts non-string inputs to strings', () => {
      expect(sanitizeInput(123)).toBe('123');
      expect(sanitizeInput(true)).toBe('true');
      expect(sanitizeInput({})).toBe('[object Object]');
    });
  });

  describe('HTML and Script Injection Prevention', () => {
    it('removes HTML tags', () => {
      expect(sanitizeInput('<p>Hello</p>')).toBe('Hello');
      expect(sanitizeInput('<div class="test">Content</div>')).toBe('Content');
    });

    it('removes script tags and content', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello');
      expect(sanitizeInput('Text<script>malicious()</script>More')).toBe('TextMore');
    });

    it('removes javascript: protocols', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('Click javascript:void(0)')).toBe('Click void(0)');
    });

    it('removes event handlers', () => {
      expect(sanitizeInput('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('onmouseover="malicious()"')).toBe('malicious()');
    });
  });

  describe('Control Character Handling', () => {
    it('removes control characters', () => {
      expect(sanitizeInput('Hello\x00World')).toBe('HelloWorld');
      expect(sanitizeInput('Test\x1FData')).toBe('TestData');
    });

    it('removes extended control characters', () => {
      expect(sanitizeInput('Text\x7FMore')).toBe('TextMore');
      expect(sanitizeInput('Data\x9FEnd')).toBe('DataEnd');
    });
  });

  describe('SQL Injection Prevention', () => {
    it('removes SQL keywords', () => {
      expect(sanitizeInput('SELECT * FROM users')).toBe('* FROM users');
      expect(sanitizeInput('DROP TABLE students')).toBe('TABLE students');
    });

    it('removes SQL comment markers', () => {
      expect(sanitizeInput('data -- comment')).toBe('data comment');
      expect(sanitizeInput('prefix /* comment */ suffix')).toBe('prefix suffix');
    });
  });

  describe('Whitespace Normalization', () => {
    it('normalizes multiple spaces', () => {
      expect(sanitizeInput('Hello    World')).toBe('Hello World');
    });

    it('trims leading and trailing whitespace', () => {
      expect(sanitizeInput('  Hello World  ')).toBe('Hello World');
    });

    it('normalizes various whitespace characters', () => {
      expect(sanitizeInput('Hello\n\t\rWorld')).toBe('Hello World');
    });
  });

  describe('Length Limiting', () => {
    it('limits output length to 5000 characters', () => {
      const longInput = 'a'.repeat(6000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(5000);
    });
  });

  describe('Safe Input Preservation', () => {
    it('preserves safe characters and formatting', () => {
      expect(sanitizeInput('Hello, World! How are you?')).toBe('Hello, World! How are you?');
      expect(sanitizeInput('12345-67890')).toBe('12345-67890');
      expect(sanitizeInput('email@domain.com')).toBe('email@domain.com');
    });

    it('preserves unicode characters', () => {
      expect(sanitizeInput('Hello 世界')).toBe('Hello 世界');
      expect(sanitizeInput('Café ☕')).toBe('Café ☕');
    });
  });
}); 