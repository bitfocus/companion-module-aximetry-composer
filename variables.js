export function updateVariables() {
	let variables = []

	variables.push({
		name: 'Last Status',
		variableId: 'status',
	})

	this.setVariableDefinitions(variables)
}
