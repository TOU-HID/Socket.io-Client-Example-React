import React, { Component } from 'react'
import { Row, Col, Input, Button } from 'antd'
import AceEditor from 'react-ace'
import { io } from 'socket.io-client'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import styles from './styles'

// dev.backend.butterflymatrimonial.com

const Search = Input.Search
// eslint-disable-next-line no-useless-escape
const secureURLRegex = /^https:\/\/?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const validateJSON = text => {
	// eslint-disable-next-line no-useless-escape
	return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
		// eslint-disable-next-line no-useless-escape
		.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
		.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
}


class componentName extends Component {
	constructor(props) {
		super(props)
		this.state = {
			logs: '',
			isConnected: false,
			url: 'https://',
			event: '',
			payload: '{}',
			showStop: false
		}
		this.socket = {}
	}

	onChangeAddress = e => {
		this.setState({
			url: e.target.value
		})
	}

	onChangePayload = (value, event) => {
		this.setState({
			payload: value
		})
	}

	onConnect = () => {
		if (!this.socket.id && !this.state.showStop) {
			var logs = this.state.logs;
			if (validateJSON(this.state.payload)) {
				if (secureURLRegex.test(this.state.url)) {
					this.setState({
						logs: logs + `STATUS: Connecting to socket\n`,
						showStop: true
					})
					// connect to the socket server
					this.socket = io(this.state.url, JSON.parse(this.state.payload))
					// on connect
					this.socket.on('connect', () => {
						var logs = this.state.logs
						this.setState({
							logs: logs + `STATUS: Socket Connection Successful\nSocket ID: "${this.socket.id}"\n`,
							isConnected: true,
							payload: '{}',
							showStop: false
						})
					})
					// on disconnect
					this.socket.on('disconnect', () => {
						var logs = this.state.logs
						this.setState({
							logs: logs + 'STATUS: Socket connection disconnected\n'
						})
					})
					// on connect error
					this.socket.on('connect_error', () => {
						var logs = this.state.logs
						if (this.state.isConnected) {
							logs += 'STATUS: Socket connection dropped. Reconnecting ...\n'
						} else {
							logs += 'STATUS: Socket connection failed. Retrying ...\n'
						}
						this.setState({
							logs: logs,
							isConnected: false,
							showStop: true
						})
					})
					// register for all events
					this.socket.onAny(this.onEventReceived)
				} else {
					this.setState({
						logs: logs + `WARNING: <${this.state.url === '' ? 'EMPTY' : this.state.url}> is not valid url\n`
					})
				}
			} else {
				this.setState({
					logs: logs + `WARNING: Invalid option\n`
				})
			}
		}
	}

	onChangeEventName = e => {
		this.setState({
			event: e.target.value
		})
	}

	onEmit = () => {
		if (this.socket.id) {
			var logs = this.state.logs;
			if (validateJSON(this.state.payload)) {
				if (this.state.event !== '') {
					this.setState({
						logs: logs + `STATUS: Emitting event\n`
					})
					this.socket.emit(this.state.event, JSON.parse(this.state.payload))
				} else {
					this.setState({
						logs: logs + `WARNING: Invalid event name\n`
					})
				}
			} else {
				this.setState({
					logs: logs + `WARNING: Invalid payload\n`
				})
			}
		}
	}

	onStop = () => {
		if (this.state.showStop) {
			this.socket.disconnect()
			this.setState({
				showStop: false
			})
		}
	}

	onDisconnect = () => {
		if (this.socket.id) {
			this.socket.disconnect()
			this.setState({
				isConnected: false,
				event: '',
				payload: '{}'
			})
		}
	}

	onClearLog = () => {
		this.setState({
			logs: ''
		})
	}

	onEventReceived = (eventName, ...args) => {
		var logs = this.state.logs
		this.setState({
			logs: logs + `STATUS: Received Event "${eventName}"\npayload: ${JSON.stringify(args.length > 1 ? args : args[0], undefined, 2)}\n`
		})
	}

	render() {
		return (
			<Row>
				<Col style={styles.leftContainer}
					xxl={9} xl={10} lg={12} md={24} sm={24} xs={24} >
					<h4 style={styles.headerTitle} >Socket.io Client</h4>
					{this.state.isConnected ?
						<Search
							placeholder='message:send'
							enterButton='Emit'
							size='large'
							autoComplete
							value={this.state.event}
							onChange={this.onChangeEventName}
							onSearch={this.onEmit}
						/> :
						<Search
							placeholder='https://example.com'
							enterButton='Connect'
							size='large'
							autoComplete
							value={this.state.url}
							onChange={this.onChangeAddress}
							onSearch={this.onConnect}
						/>
					}
					<h4 style={styles.payloadEditorTitle}>
						{this.state.isConnected ? 'Event Payload (JSON)' : 'Socket.io Option (JSON)'}
					</h4>
					<AceEditor
						name='SocketOption'
						mode='json'
						theme='monokai'
						fontSize={16}
						tabSize={2}
						style={styles.payloadEditor}
						showGutter={true}
						highlightActiveLine={true}
						enableSnippets={true}
						enableBasicAutocompletion={true}
						enableLiveAutocompletion={true}
						value={this.state.payload}
						onChange={this.onChangePayload}
					/>
					{this.state.isConnected
						? <Button style={styles.disconnectButton}
							onClick={this.onDisconnect}
							danger >Disconnect</Button>
						: null}
					{this.state.showStop
						? <Button style={styles.stopButton}
							onClick={this.onStop}
							danger >Stop</Button>
						: null}
				</Col>
				<Col style={styles.rightContainer}
					xxl={15} xl={14} lg={12} md={24} sm={24} xs={24} >
					<h4 style={styles.logConsoleTitle}>Socket.io Log</h4>
					<AceEditor
						name='SocketLog'
						mode='json'
						theme='monokai'
						fontSize={16}
						style={styles.logConsole}
						showGutter={true}
						highlightActiveLine={true}
						readOnly={true}
						value={this.state.logs}
					/>
					{this.state.logs !== '' ? <Button style={styles.clearLogButton}
						onClick={this.onClearLog}
						danger >Clear Log</Button> : null}
				</Col>
			</Row>
		);
	}
}

export default componentName;