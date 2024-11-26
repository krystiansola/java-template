import * as MQProducer from './MQProducer';
import * as KafkaProducer from './KafkaProducer';
import * as KafkaSpringProducer from './KafkaSpringProducer';

const producerModuleMapJava = [
  {
    protocols: ['ibmmq', 'ibmmq-secure'],
    module: MQProducer
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaProducer
  }
];

const producerModuleMapSpring = [
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaSpringProducer
  }
];

const library = {
  java: producerModuleMapJava,
  spring: producerModuleMapSpring
};

function getModule({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const producerModules = library[params.library];
  const protocol = server.protocol();
  const foundModule = producerModules.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function SendMessage({ asyncapi, params }) {
  return getModule({ asyncapi, params }).SendMessage();
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
export function ProducerConstructor({ asyncapi, params, name }) {
  return getModule({ asyncapi, params }).ProducerConstructor({ name });
}
