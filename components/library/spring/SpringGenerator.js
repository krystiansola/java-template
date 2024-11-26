import {Models} from './Files/Models';

export function RenderSpring(asyncapi, channels, server, params) {
  const toRender = {};
  toRender['models'] = Models(asyncapi, params);
  return toRender;
}
