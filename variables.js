export function updateVariables() {
	let variables = []

	variables.push(
		{
			name: 'Last Response',
			variableId: 'response',
		},
		{
			name: 'Last Status',
			variableId: 'status',
		}
	)

	this.setVariableDefinitions(variables)
}
