/**
 * @author Purushottam <purushottamgour.314ecorp.com>
 * @description Component utils
 */
import api from '../client/RequestClient';
import _ from 'lodash';

const currentInterface = JSON.parse(sessionStorage.getItem('currentInterface') || '{}');

export const getScriptKeysForNode = (dataNode: any, scriptKeys: string[], interfaceName: string): void => {
	_.forEach(dataNode.children, (item) => {
		if (item.isLeaf) {
			scriptKeys.push(_.toString(item.key).replace(`${interfaceName}/scripts/`, ''));
		} else {
			getScriptKeysForNode(item, scriptKeys, interfaceName);
		}
	});
};

export const getScriptKeys = (dataNodes: any, scriptKeys: string[], interfaceName: string): void => {
	_.forEach(dataNodes, (item) => {
		if (item.isLeaf) {
			scriptKeys.push(_.toString(item.key).replace(`${interfaceName}/scripts/`, ''));
		} else {
			getScriptKeysForNode(item, scriptKeys, interfaceName);
		}
	});
};

export const zsegmentTransformerComponent = async () => {
	const scriptResult = await api.RepositoryControllerApi.fileTree(`${currentInterface?.name}/scripts`);
	if (scriptResult) {
		const scriptKeys: string[] = [];
		getScriptKeys(scriptResult.data, scriptKeys, currentInterface?.name ?? '');
		const zsegmentTransformer = _.setWith(
			require('../../metadata/zsegment-transformer.json'),
			'[properties][scriptName][enum]',
			scriptKeys,
			Object,
		);
		return JSON.stringify(zsegmentTransformer);
	}
};

export const zsegmentAtlasComponent = async () => {
	const admResult = await api.RepositoryControllerApi.fileTree(`${currentInterface?.name}/visual_mappings`);
	if (admResult.data) {
		const scriptKeys: string[] = [];
		getScriptKeys(admResult.data, scriptKeys, currentInterface?.name ?? '');
		const zsegmentAtlas = _.setWith(
			require('../../metadata/atlasmap.json'),
			'[properties][resourceUri][enum]',
			scriptKeys,
			Object,
		);
		return JSON.stringify(zsegmentAtlas);
	}
};

export const zsegmentSourceComponent = async () => {
	const sourceResult = await api.InterfaceControllerApi.getSources(currentInterface?.id);
	if (sourceResult.data) {
		const sourceComponent = _.map(sourceResult.data, (record) => {
			return {
				component: {
					kind: 'component',
					name: record.name,
					title: record.name,
					description: record.description,
					syntax: 'zsegment:name:protocol',
					label: 'messaging',
					consumerOnly: true,
					producerOnly: false,
					lenientProperties: false,
					type: 'SOURCE',
					parameters: { protocol: record.id, name: record.name },
				},
				properties: {
					name: {
						index: 0,
						kind: 'path',
						displayName: 'Source Name',
						group: 'common',
						label: 'Source Name',
						required: true,
						type: 'string',
						javaType: 'java.lang.String',
						deprecated: false,
						autowired: false,
						secret: false,
						description: 'The Name of Interface Source',
					},
					protocol: {
						index: 1,
						kind: 'path',
						displayName: 'Source Id',
						group: "'common'",
						label: 'Source Id',
						required: true,
						type: 'string',
						javaType: 'java.lang.String',
						deprecated: false,
						autowired: false,
						secret: false,
						description: 'The ID of Interface Source',
					},
				},
			};
		});
		return sourceComponent;
	}
};

export const zsegmentDestinationComponents = async () => {
	const destinationResult = await api.InterfaceControllerApi.getDestinations(currentInterface?.id);
	if (destinationResult.data) {
		const destinationComponent = _.map(destinationResult.data, (record) => {
			return {
				component: {
					kind: 'component',
					name: record.name,
					title: record.name,
					description: record.description,
					syntax: 'zsegment:name:protocol',
					label: 'messaging',
					consumerOnly: false,
					producerOnly: true,
					lenientProperties: false,
					type: 'TARGET',
					parameters: { protocol: record.id, name: record.name },
				},
				properties: {
					name: {
						index: 0,
						kind: 'path',
						displayName: 'Target Name',
						group: 'common',
						label: 'Target Name',
						required: true,
						type: 'string',
						javaType: 'java.lang.String',
						deprecated: false,
						autowired: false,
						secret: false,
						description: "'The Name of Interface Target'",
					},
					protocol: {
						index: 1,
						kind: 'path',
						displayName: 'Target Id',
						group: "'common'",
						label: 'Target Id',
						required: true,
						type: 'string',
						javaType: 'java.lang.String',
						deprecated: false,
						autowired: false,
						secret: false,
						description: "'The ID of Interface Target'",
					},
				},
			};
		});
		return destinationComponent;
	}
};
