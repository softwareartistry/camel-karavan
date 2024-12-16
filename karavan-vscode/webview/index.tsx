/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import '@patternfly/patternfly/patternfly.css';
import api from './client/RequestClient';

setInterval(
	() => window?.top?.postMessage({ type: 'ACTION_FROM_WEBVIEW', payload: 'Hello from the webview!' }, '*'),
	5000,
);

window.addEventListener('message', (event) => {
	const message = event.data;
	if (message.command === 'ACTION_FROM_REACT') {
		console.log('Message received from React:', message.payload);
		const baseURL = message.payload.baseURL;
		const authToken = message.payload.access_token;
		sessionStorage.setItem('currentInterface', JSON.stringify(message.payload.currentInterface));
		api.init(baseURL, authToken);
	}
});
const dark = document.body.className.includes('vscode-dark');
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App dark={dark} />);
