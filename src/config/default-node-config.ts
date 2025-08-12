export const defaultNodeConfig = {
  autoRestart: true,
  currentNetwork: 'testnet',
  lastStopped: undefined,
};

export type nodeConfigType = {
  autoRestart: boolean;
  currentNetwork: string;
  lastStopped?: number;
};

export const nodeConfigSchema = {
  type: 'object',
  properties: {
    autoRestart: {
      type: 'boolean',
    },
    currentNetwork: {
      type: 'string',
    },
    lastStopped: {
      type: 'number',
    },
  },
  required: ['autoRestart', 'currentNetwork'],
};
