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

import { RenderJava } from '../Components/library/java/JavaGenerator';
// Import custom components from file 

export default function({ asyncapi, params }) {
  const channels = asyncapi.allChannels().all();
  const server = asyncapi.allServers().get(params.server);
  const toRender = RenderJava(asyncapi, channels, server, params);

  // Schemas is an instance of the Map
  return Object.entries(toRender).map(([name, renderFunction]) => {
    return renderFunction;
  }).flat();
}

