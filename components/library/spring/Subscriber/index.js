import * as KafkaConsumer from './KafkaConsumer';

const consumerModuleMap = [
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaConsumer
  }
];

function getModule({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const foundModule = consumerModuleMap.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function SubscriberImports({ asyncapi, params}) {
  return getModule({ asyncapi, params }).SubscriberImports();
}
export function ReceiveMessage({ asyncapi, params, className, modelName, topicName, channel }) {
  return getModule({ asyncapi, params }).ReceiveMessage({ asyncapi, className, modelName, topicName, channel });
}
