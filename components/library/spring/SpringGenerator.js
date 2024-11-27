import {Models} from './Files/Models';
import {Producers} from './Files/Producers';

export function RenderSpring(asyncapi, channels, server, params) {
  const toRender = {};
  toRender['models'] = Models(asyncapi, params);
  toRender['producers'] = Producers(asyncapi, channels, params);
  return toRender;
}
