#!/usr/bin/env bash

# API Testing Script for Dyno Replace Endpoint

echo "🚀 Testing Dyno Replace API"
echo "================================"

# Start the server in background
echo "Starting server..."
pnpm start > server.log 2>&1 &
SERVER_PID=$!
sleep 3

echo "✅ Server started (PID: $SERVER_PID)"
echo ""

# Test 1: Basic replacement (from requirements)
echo "📝 Test 1: Basic replacement"
echo "Request: Replace 'dog' with 'cat' in {animal: 'dog', pet: 'dog', second_pet: 'cat'}"
curl -s -X POST http://127.0.0.1:8080/replace \
  -H "Content-Type: application/json" \
  -d '{"animal": "dog", "pet": "dog", "second_pet": "cat"}' | jq .
echo ""

# Test 2: Limited replacements
echo "📝 Test 2: Limited replacements (max 2)"
echo "Request: Replace 'dog' with 'cat' but limit to 2 replacements"
curl -s -X POST http://127.0.0.1:8080/replace \
  -H "Content-Type: application/json" \
  -d '{"animal": "dog", "pet": "dog", "second_pet": "cat", "fourth": "dog", "last": "dog", "maxReplacements": 2}' | jq .
echo ""

# Test 3: Nested objects
echo "📝 Test 3: Nested objects and arrays"
echo "Request: Replace 'dog' with 'cat' in nested structure"
curl -s -X POST http://127.0.0.1:8080/replace \
  -H "Content-Type: application/json" \
  -d '{"pets": [{"name": "Garfield", "type": "dog"}, {"name": "Ajax", "type": "cat"}, {"name": "Jack", "type": "dog"}], "defaultType": "turtle"}' | jq .
echo ""

# Test 4: Error handling
echo "📝 Test 4: Error handling (missing payload)"
curl -s -X POST http://127.0.0.1:8080/replace \
  -H "Content-Type: application/json" \
  -d '{"targetValue": "dog", "replacementValue": "cat"}' | jq .
echo ""

# Test 5: Different data types
echo "📝 Test 5: Different data types (numbers)"
curl -s -X POST http://127.0.0.1:8080/replace \
  -H "Content-Type: application/json" \
  -d '{"count": 0, "total": 5, "remaining": 0}' | jq .
echo ""

echo "🛑 Stopping server..."
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null
rm -f server.log

echo "✅ Tests completed!"