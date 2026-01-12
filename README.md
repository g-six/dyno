# Dyno - JSON Value Replacement Utility

A TypeScript utility function for recursively replacing values in JSON objects with configurable replacement limits.

## Features

- 🔄 **Recursive replacement** - Works with nested objects and arrays
- 🎯 **Configurable limits** - Control the maximum number of replacements
- 🛡️ **Immutable** - Original objects remain unchanged
-  **Type-safe** - Full TypeScript support as per requirement
- ✅ **Well-tested** - 89% test coverage

## Installation

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## Quick Start

```typescript
import { replaceInJson } from './src/utils/replace';

const payload = { 
  animal: 'dog', 
  pet: 'dog', 
  second_pet: 'cat' 
};

// Replace all occurrences
const result = replaceInJson(payload, 'dog', 'cat');
// Result: { animal: 'cat', pet: 'cat', second_pet: 'cat' }

// Replace with limit
const result = replaceInJson(payload, 'dog', 'cat', 1);
// Result: { animal: 'cat', pet: 'dog', second_pet: 'cat' }
```

## API Reference

### `replaceInJson(payload, targetValue, replacementValue, maxReplacements?)`

Recursively replaces occurrences of a specified value in a JSON object up to a maximum count.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `payload` | `any` | - | The JSON object to process |
| `targetValue` | `any` | - | The value to replace |
| `replacementValue` | `any` | - | The value to replace with |
| `maxReplacements` | `number` | `Infinity` | Maximum number of replacements to make |

#### Returns

Returns the modified object directly (type: `any`).

## Usage Examples

### Basic Object Replacement

```typescript
const data = {
  status: 'active',
  user: { status: 'active' },
  isActive: true
};

const result = replaceInJson(data, 'active', 'enabled');
// Result: { status: 'enabled', user: { status: 'enabled' }, isActive: true }
```

### Array Replacement

```typescript
const animals = ['dog', 'cat', 'dog', 'bird'];

const result = replaceInJson(animals, 'dog', 'wolf');
// Result: ['wolf', 'cat', 'wolf', 'bird']
```

### Nested Structures

```typescript
const complexData = {
  users: [
    { name: 'John', status: 'active' },
    { name: 'Jane', status: 'active' }
  ],
  defaultStatus: 'active'
};

const result = replaceInJson(complexData, 'active', 'enabled');
// All 'active' values replaced with 'enabled'
```

### Limited Replacements

```typescript
const data = {
  first: 'replace',
  second: 'replace',
  third: 'replace',
  fourth: 'keep'
};

// Replace only first 2 occurrences
const result = replaceInJson(data, 'replace', 'changed', 2);
// Result: { first: 'changed', second: 'changed', third: 'replace', fourth: 'keep' }
```

### Different Data Types

```typescript
// Numbers
const numbers = { count: 0, total: 5, remaining: 0 };
replaceInJson(numbers, 0, -1);
// Result: { count: -1, total: 5, remaining: -1 }

// Booleans
const flags = { active: true, enabled: false, visible: true };
replaceInJson(flags, true, false);
// Result: { active: false, enabled: false, visible: false }

// Null/undefined
const nullable = { value: null, other: 'test' };
replaceInJson(nullable, null, 'N/A');
// Result: { value: 'N/A', other: 'test' }
```

## Advanced Usage

### Stopping Early

When the replacement limit is reached, the function stops processing and leaves remaining values unchanged:

```typescript
const largeData = {
  section1: { status: 'old', type: 'old' },
  section2: { status: 'old', type: 'old' },
  section3: { status: 'old', type: 'old' }
};

const result = replaceInJson(largeData, 'old', 'new', 3);
// Only first 3 occurrences are replaced
```

### Zero Replacements

```typescript
const data = { keep: 'original', values: 'unchanged' };
const result = replaceInJson(data, 'target', 'replacement', 0);
// Result: same as input (but new object reference)
```

## Edge Cases

### Empty Structures

```typescript
replaceInJson({}, 'any', 'value');        // Returns: {}
replaceInJson([], 'any', 'value');        // Returns: []
replaceInJson(null, 'any', 'value');      // Returns: null
replaceInJson(undefined, 'any', 'value'); // Returns: undefined
```

### Immutability

The original object is never modified:

```typescript
const original = { value: 'change-me', keep: 'unchanged' };
const result = replaceInJson(original, 'change-me', 'changed');

console.log(original); // { value: 'change-me', keep: 'unchanged' } - unchanged
console.log(result);   // { value: 'changed', keep: 'unchanged' } - new object
console.log(original === result); // false
```

## Testing

The utility includes basic tests covering:

- ✅ Basic functionality with all data types
- ✅ Nested objects and arrays
- ✅ Replacement limits
- ✅ Immutability guarantees

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Project Structure

```
dyno/
├── src/
│   ├── utils/
│   │   ├── replace.ts              # Main utility function
│   │   └── _tests_/
│   │       └── replace.spec.ts     # Test suite
│   └── index.ts                    # Fastify server
├── jest.config.js                  # Jest configuration for unit tests
├── package.json
└── README.md
```
