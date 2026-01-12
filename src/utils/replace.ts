/**
 * Result of the replacement operation
 */
export interface ReplaceResult {
  result: any;
  replacementCount: number;
}

/**
 * Recursively replaces occurrences of a specified value in a JSON object up to a maximum count
 * @param payload - The JSON object to process
 * @param targetValue - The value to replace
 * @param replacementValue - The value to replace with
 * @param maxReplacements - Maximum number of replacements to make (default: Infinity for unlimited)
 * @returns An object containing the modified result and the count of replacements made
 */
/**
 * Recursively replaces occurrences of a specified value in a JSON object up to a maximum count
 * Optimized for high-performance scenarios with large datasets
 * @param payload - The JSON object to process
 * @param targetValue - The value to replace
 * @param replacementValue - The value to replace with
 * @param maxReplacements - Maximum number of replacements to make (default: Infinity for unlimited)
 * @returns An object containing the modified result and the count of replacements made
 */
export function replaceInJson(
  payload: any,
  targetValue: any,
  replacementValue: any,
  maxReplacements: number = Infinity
): ReplaceResult {
  // Fast path: if maxReplacements is 0, return immediately
  if (maxReplacements <= 0) {
    return { result: payload, replacementCount: 0 }
  }

  // Use iterative approach with stack for better performance on deep structures
  const stack: Array<{ current: any; parent: any; key: string | number; path: string }> = []
  let replacementCount = 0
  
  // Clone the root to maintain immutability (shallow clone initially)
  let result: any
  if (payload === null || payload === undefined) {
    return { result: payload, replacementCount: 0 }
  }
  
  if (Array.isArray(payload)) {
    result = [...payload]
  } else if (typeof payload === 'object') {
    result = { ...payload }
  } else {
    // Handle primitive values
    return {
      result: payload === targetValue ? replacementValue : payload,
      replacementCount: payload === targetValue ? 1 : 0
    }
  }

  // Initialize stack with root level items
  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i++) {
      stack.push({ current: result[i], parent: result, key: i, path: `[${i}]` })
    }
  } else {
    for (const [key, value] of Object.entries(result)) {
      stack.push({ current: value, parent: result, key, path: key })
    }
  }

  // Process stack iteratively (more memory efficient than recursion)
  while (stack.length > 0 && replacementCount < maxReplacements) {
    const { current, parent, key, path } = stack.pop()!

    // Check if current value should be replaced
    if (current === targetValue) {
      parent[key] = replacementValue
      replacementCount++
      continue // Don't process children of replaced primitive
    }

    // Process children for objects and arrays
    if (current !== null && current !== undefined && replacementCount < maxReplacements) {
      if (Array.isArray(current)) {
        // Clone array to maintain immutability
        const clonedArray = [...current]
        parent[key] = clonedArray
        
        // Add array items to stack (in reverse order for correct processing order)
        for (let i = clonedArray.length - 1; i >= 0; i--) {
          stack.push({
            current: clonedArray[i],
            parent: clonedArray,
            key: i,
            path: `${path}[${i}]`
          })
        }
      } else if (typeof current === 'object') {
        // Clone object to maintain immutability
        const clonedObject = { ...current }
        parent[key] = clonedObject
        
        // Add object properties to stack
        const entries = Object.entries(clonedObject)
        for (let i = entries.length - 1; i >= 0; i--) {
          const [objKey, value] = entries[i]
          stack.push({
            current: value,
            parent: clonedObject,
            key: objKey,
            path: `${path}.${objKey}`
          })
        }
      }
    }
  }

  return { result, replacementCount }
}