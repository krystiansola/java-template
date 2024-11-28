import {Models} from './Files/Models';
import {Producers} from './Files/Producers';
import {Consumers} from './Files/Consumers';
import {Subscriber} from './Files/Subscriber';

export function RenderSpring(asyncapi, channels, server, params) {
  const toRender = {};
  toRender['models'] = Models(asyncapi, params);
  toRender['producers'] = Producers(asyncapi, channels, params);
  toRender['consumers'] = Consumers(asyncapi, channels, params);
  toRender['subscriber'] = Subscriber(asyncapi, channels, params);
  return toRender;
}
