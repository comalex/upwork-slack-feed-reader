let currentPath = __dirname;

module.exports = {
	apps: [
		{
			name: 'upwork',
			script: `yarn start`,
			cwd: `${currentPath}`,
			env: {
				NODE_ENV: 'production',
			}
		}
	]
};
