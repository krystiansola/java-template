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

export function ConsumerDeclaration({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ConsumerDeclaration();
}
export function ConsumerImports({ asyncapi, params}) {
  return getModule({ asyncapi, params }).ConsumerImports();
}
export function ReceiveMessage({ asyncapi, params, message, className }) {
  return getModule({ asyncapi, params }).ReceiveMessage({ message, className });
}
export function ConsumerClose({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ConsumerClose();
}
export function ConsumerConstructor({ asyncapi, params, name }) {
  return getModule({ asyncapi, params }).ConsumerConstructor({ name });
}
