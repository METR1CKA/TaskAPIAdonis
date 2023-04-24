import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true, //disable or enable swaggerUi route
	uiUrl: 'docs', // url path to swaggerUI
	specEnabled: true, //disable or enable swagger.json route
	specUrl: '/swagger.json',

	middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'API TASKS',
				version: '1.0.0',
				description: 'Api documentation with swagger docs',
				termsOfService: 'http://127.0.0.1:3333/',
				contact: {
					email: 'ferchosalazar054@gmail.com'
				},
				license: {}
			},
			externalDocs: {
				url: 'http://127.0.0.1:3333/docs',
				description: 'About Api Tasks'
			},
			servers: [
				{
					url: 'http://127.0.0.1:3333',
					description: 'Base url'
				},
				{
					url: 'http://127.0.0.1:3333/api/v1',
					description: 'Endpoint'
				}
			],
			tags: [
				{
					name: 'Endpoints',
					description: 'Main routes',
				},
				{
					name: 'Auth',
					description: 'Authentification',
				},
				{
					name: 'Users',
					description: 'Administration for users',
				},
				{
					name: 'Categories',
					description: 'Administration for categories',
				},
				{
					name: 'Views',
					description: 'Administration for views',
				},
				{
					name: 'Roles_views',
					description: 'Administration for roles and views',
				},
				{
					name: 'Passwords',
					description: 'Administration for passwords',
				},
				{
					name: 'Roles',
					description: 'Administration for roles',
				},
				{
					name: 'Files',
					description: 'Use for files',
				},
				{
					name: 'Tasks',
					description: 'Use for tasks',
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
					}
				}
			}
		},

		apis: [
			'app/**/*.ts',
			'app/**/*.yml',
			'docs/swagger/**/*.yml',
			'start/routes.ts'
		],
		basePath: '/'
	},
	mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
	specFilePath: 'docs/swagger.json'
} as SwaggerConfig
