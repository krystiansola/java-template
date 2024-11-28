/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { RenderJava } from '../components/library/java/JavaGenerator';
import { RenderSpring } from '../components/library/spring/SpringGenerator';
// Import custom components from file 

function determineLibrary(params, asyncapi, channels, server) {
  switch (params.library) {
  case 'java':
    return RenderJava(asyncapi, channels, server, params);
  case 'spring':
    return RenderSpring(asyncapi, channels, server, params);
  default:
    return [];
  }
}

export default function({ asyncapi, params }) {
  const channels = asyncapi.allChannels().all();
  const server = asyncapi.allServers().get(params.server);
  const toRender = determineLibrary(params, asyncapi, channels, server);

  // Schemas is an instance of the Map
  return Object.entries(toRender).map(([name, renderFunction]) => {
    return renderFunction;
  }).flat();
}

