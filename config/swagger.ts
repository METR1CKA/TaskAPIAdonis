import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true, //disable or enable swaggerUi route
	uiUrl: 'docs', // url path to swaggerUI
	specEnabled: true, //disable or enable swagger.json route
	specUrl: '/swagger.json',

	middleware: ['lang'], // middlewares array, for protect your swagger docs and spec endpoints

	// Options to swagger
	options: {
		definition: {
			openapi: '3.0.0', // Version to openapi
			info: { // Info docs
				title: 'API TASKS',
				version: '1.0.0',
				description: 'Api documentation with swagger docs',
				termsOfService: 'http://127.0.0.1:3333/', // not terms of service
				contact: {
					email: 'ferchosalazar054@gmail.com'
				},
				license: {} // Not license
			},
			externalDocs: {
				url: 'http://127.0.0.1:3333/docs', // not external docs
				description: 'About Api Tasks'
			},
			servers: [
				{
					url: 'http://127.0.0.1:3333',
					description: 'Base url'
				}
			],
			tags: [
				{
					name: 'Endpoints',
					description: 'Main routes',
				},
				{
					name: 'Auth',
					description: 'Auth group',
				},
				{
					name: 'Users',
					description: 'Users group',
				},
				{
					name: 'Categories',
					description: 'Categories group',
				},
				{
					name: 'Views',
					description: 'Views group',
				},
				{
					name: 'Roles_views',
					description: 'Roles and views group',
				},
				{
					name: 'Passwords',
					description: 'Passwords group',
				},
				{
					name: 'Roles',
					description: 'Roles group',
				},
				{
					name: 'Files',
					description: 'Files group',
				},
				{
					name: 'Tasks',
					description: 'Tasks group',
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
			'docs/swagger/**/*.ts',
			'docs/swagger/**/*.yml',
			'start/**/*.ts',
			'start/routes.ts',
		],
		basePath: '/'
	},
	mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
	specFilePath: 'docs/swagger.json'
} as SwaggerConfig
