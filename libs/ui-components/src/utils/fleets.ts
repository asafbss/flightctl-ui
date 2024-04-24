import { Fleet, ObjectMeta } from '@flightctl/types';
import { FlightCtlLabel } from '../types/extraTypes';

export type SourceItem = {
  type: 'git' | 'inline' | 'secret';
  name: string;
  displayText: string;
};

const getSourceItems = (fleet: Fleet): SourceItem[] => {
  const templateSpecConfig = fleet.spec?.template?.spec?.config || [];
  return templateSpecConfig
    .map((config) => {
      let sourceItem: SourceItem;
      if ('gitRef' in config) {
        sourceItem = { type: 'git', name: config.gitRef.repository, displayText: config.name };
      } else if ('secretRef' in config) {
        sourceItem = {
          type: 'secret',
          name: config.name,
          displayText: `${config.secretRef.namespace || ''}/${config.secretRef.name || ''}`,
        };
      } else {
        sourceItem = { type: 'inline', name: config.name, displayText: config.name };
      }
      return sourceItem;
    })
    .filter((repoName) => !!repoName);
};

const getUpdatedFleet = (fleet: Fleet, newLabels: FlightCtlLabel[]): Fleet => {
  const fleetLabels: ObjectMeta['labels'] = newLabels.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
  return {
    ...fleet,
    spec: {
      ...fleet.spec,
      selector: {
        ...fleet.spec.selector,
        matchLabels: fleetLabels,
      },
    },
  };
};

export { getSourceItems, getUpdatedFleet };
