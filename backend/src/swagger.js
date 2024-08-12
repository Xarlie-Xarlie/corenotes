import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      description: "API endpoints for a notes service documented on swagger",
      contact: {
        name: "Charlie Charlie",
        email: "jeancharles552@gmail.com",
        url: "https://github.com/Xarlie-Xarlie"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server"
      },
    ]
  },
  // looks for configuration in specified directories
  apis: ['./src/routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, _port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs
