export function updateActions() {
	console.log('update actions')
	let actions = {}

	actions['pressButton'] = {
		name: 'Press Button',
		options: [
			{
				type: 'dropdown',
				label: 'Module',
				allowCustom: true,
				id: 'module',
				choices: this.nodeList,
			},
			{
				type: 'textinput',
				label: 'Button',
				id: 'button',
				default: '',
			},
		],
		callback: ({ options }) => {
			var cmd =
				`<action type="ComposerCtrBoardPressButtonAction" Module="` +
				options.module +
				`" Button="` +
				options.button +
				`" />`
			console.log(cmd)
			this.sendPostCommand(cmd)
		},
	}

	actions['setButton'] = {
		name: 'Set Button',
		options: [
			{
				type: 'dropdown',
				label: 'Module',
				allowCustom: true,
				id: 'module',
				choices: this.nodeList,
			},
			{
				type: 'textinput',
				label: 'Button',
				id: 'button',
				default: '',
			},
			{
				type: 'checkbox',
				label: 'State',
				id: 'state',
				default: false,
			},
		],
		callback: ({ options }) => {
			var cmd =
				`<action type="ComposerCtrBoardSetButtonAction" Module="` +
				options.module +
				`" Button="` +
				options.button +
				`" State="` +
				options.state +
				`" />`
			console.log(cmd)
			this.sendPostCommand(cmd)
		},
	}

	actions['setPinValue'] = {
		name: 'Set Pin Value',
		options: [
			{
				type: 'dropdown',
				label: 'Module',
				allowCustom: true,
				id: 'module',
				choices: this.nodeList,
			},
			{
				type: 'textinput',
				label: 'Pin',
				id: 'pin',
				default: '',
			},
			{
				type: 'textinput',
				label: 'Value',
				id: 'value',
				default: '',
			},
		],
		callback: ({ options }) => {
			var cmd =
				`<action type="ComposerSetPinValueAction" Module="` +
				options.module +
				`" Pin="` +
				options.pin +
				`" Value="` +
				options.value +
				`" />`
			console.log(cmd)
			this.sendPostCommand(cmd)
		},
	}

	actions['findModules'] = {
		name: 'Refresh Module List',
		options: [
			{
				type: 'textinput',
				label: 'Module Root',
				id: 'moduleRoot',
				default: 'Root\\',
			},
			{
				type: 'textinput',
				label: 'Wildcard',
				id: 'wildcard',
				default: '*',
			},
		],
		callback: ({ options }) => {
			var cmd =
				`<action type="ComposerFindModulesAction" Module="` +
				options.moduleRoot +
				`" NamePattern="` +
				options.wildcard +
				`" Recursive="False" />`
			console.log(cmd)
			this.sendPostCommand(cmd)
		},
	}

	this.setActionDefinitions(actions)
}
