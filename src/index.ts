import fastify from 'fastify'
import { replaceInJson, ReplaceResult } from './utils/replace'

const server = fastify({ logger: true })

// Define the request body interface
interface ReplaceRequest {
  payload: any;
  targetValue: any;
  replacementValue: any;
  maxReplacements?: number;
}

server.post<{ Body: ReplaceRequest }>('/replace', async (request, reply) => {
  try {
    const { maxReplacements, ...payload } = request.body;

    // Validate required fields
    if (payload === undefined) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'payload is required'
      });
    }

    // Perform the replacement
    const { result }: ReplaceResult = replaceInJson(
      payload,
      'dog',
      'cat',
      maxReplacements
    );

    // Return the result
    return reply.send(result);

  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the replacement'
    });
  }
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

