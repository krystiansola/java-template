import * as KafkaProducer from './KafkaProducer';

const producerModuleMapJava = [
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaProducer
  }
];

function getModule({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const foundModule = producerModuleMapJava.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function SendMessage({ asyncapi, params, topicName, paramClassName }) {
  return getModule({ asyncapi, params }).SendMessage({ topicName, paramClassName });
}
export function ProducerImports({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ProducerImports({ params });
}
export function ProducerDeclaration({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ProducerDeclaration();
}
export function ProducerClose({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ProducerClose();
}
export function ProducerConstructor({ asyncapi, params, className }) {
  return getModule({ asyncapi, params }).ProducerConstructor({ className });
}
