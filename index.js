// aximmetry composer module
// Peter Daniel

import { InstanceBase, Regex, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { updateActions } from './actions.js'
import { updatePresets } from './presets.js'
import { updateVariables } from './variables.js'
import http from 'http'
import xml2js from 'xml2js'

class aximmetry extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		// this.updatePresets = updatePresets.bind(this)
		this.updateVariables = updateVariables.bind(this)
	}

	getConfigFields() {
		// console.log('config fields')
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module will allow you to control Aximetry Composer Broadcast or Professional.',
			},
			{
				type: 'textinput',
				id: 'ipAddress',
				label: 'IP Address',
				width: 6,
				required: true,
				default: '127.0.0.1',
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 6,
				required: true,
				default: '21463',
				regex: Regex.Port,
			},
		]
	}

	async destroy() {
		console.log('destroy', this.id)
	}

	async init(config) {
		console.log('--- init aximmetry ---')

		this.config = config
		this.nodeList = []

		this.updateVariables()
		this.getModuleList()
		this.updateActions()
	}

	async configUpdated(config) {
		console.log('config updated')
		this.config = config

		this.getModuleList()
		this.updateActions()
		this.updateVariables()
	}

	async getModuleList() {
		// get list of modules
		console.log('Get module list')
		var cmd = `<action type="ComposerFindModulesAction" Module="Root" NamePattern="*" Recursive="False" />`
		console.log(cmd)
		this.sendPostCommand(cmd)
	}

	async sendPostCommand(body) {
		// Aximmetry requires http headers to be capitalised, which is incorrect

		var bodyXML = `<?xml version="1.0" encoding="utf-8"?>` + body
		var result = ''

		const options = {
			hostname: this.config.ipAddress,
			port: this.config.port,
			path: '/',
			method: 'POST',

			// use an Array instead of Object to avoid lowercase transformation
			headers: [
				['Content-Type', 'application/xml'],
				['Content-Length', Buffer.byteLength(bodyXML)],
			],
		}

		const req = http.request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`)
			this.setVariableValues({ status: res.statusCode })

			if (res.statusCode == '200') {
				this.updateStatus(InstanceStatus.Ok)
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, res.statusCode)
			}

			console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				// console.log(`Chunk: ${chunk}`)
				result = result + `${chunk}`
			})
			res.on('end', () => {
				console.log('No more data in response.')
				console.log('Result:')
				console.log(result)
				if (result.search('<ReturnValue>') != -1) {
					this.nodeList = this.processData(result)
					this.updateActions()
				}
			})
		})

		req.on('error', (e) => {
			console.error(`problem with request: ${e.message}`)
		})

		// Write data to request body
		req.write(bodyXML)
		req.end()
	}

	processData(dataString) {
		console.log('Process Data:')
		// console.log(dataString)
		var parseString = xml2js.parseString
		var nodeList = []

		parseString(dataString, function (err, result) {
			if (err) {
				console.log('XML parse error:')
				console.log(err)
				return
			} else if (result != undefined && result != null) {
				if (result.response.ReturnValue != undefined) {
					// console.log(result.response.ReturnValue[0])
					var modules = result.response.ReturnValue[0]
					// console.log(items.item[0].$.value)
					for (var a = 0; a < modules.item.length; a++) {
						var moduleName = modules.item[a].$.value
						var displayName = moduleName // .replace(/\/\//, "/")
						// console.log(a + ':' + moduleName)
						nodeList.push({ id: moduleName, label: displayName })
					}
				}
			}
		})
		console.log('items:')
		console.log(nodeList)
		return nodeList
	}
}

runEntrypoint(aximmetry, [])
