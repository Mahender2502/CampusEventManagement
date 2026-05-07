import swaggerJSDoc from 'swagger-jsdoc'

export function swaggerSpec() {
  return swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'CCEMS API',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:5000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: [],
  })
}
