import React, { Component } from 'react'
import { Row, Col, Card, Input, Button } from 'antd'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import styles from './styles'

const Search = Input.Search



class componentName extends Component {
	constructor() {
		super()
	}

	onConnect(value) {
		console.log(value)
	}

	onChangeAddress(value) {
		console.log(value)
	}

	onRegister(value) {
		console.log(value)
	}

	onDeRegister(value) {
		console.log(value)
	}
	render() {
		return (
			<Row>
				<Col xxl={9} xl={10} lg={12} md={24} sm={24} xs={24} >
					<Card>
						<h4 style={{ marginBottom: '15px' }}>Socket.io Client</h4>
						<Search
							placeholder='https://example.com'
							allowClear
							enterButton='Connect'
							size='large'
							onChange={this.onChangeAddress}
							onSearch={this.onConnect}
						/>
						<Search
							placeholder='message:send'
							allowClear
							enterButton='Emit'
							size='large'
							onChange={this.onChangeEventName}
							onSearch={this.onRegister}
						/>
						<h4 style={{ margin: '15px' }}>Socket.io Option</h4>
						<AceEditor
							name='SocketOption'
							mode='javascript'
							theme='monokai'
							fontSize={16}
							tabSize={2}
							style={{ width: '100%', height: '300px' }}
							showGutter={true}
							highlightActiveLine={true}
							enableSnippets={true}
							enableBasicAutocompletion={true}
							enableLiveAutocompletion={true}
							onChange={this.onChangeOption}
						/>
						<Button style={{ marginTop: '15px' }} danger>Disconnect</Button>
					</Card>
				</Col>
				<Col xxl={15} xl={14} lg={12} md={24} sm={24} xs={24} >
					<h4 style={{ margin: '15px' }}>Socket.io Log</h4>
					<AceEditor
						name='SocketLog'
						mode='javascript'
						theme='monokai'
						fontSize={16}
						style={{ width: '100%', height: '460px' }}
						showGutter={true}
						highlightActiveLine={true}
						readOnly={true}
					/>
				</Col>
			</Row>
		);
	}
}

export default componentName;