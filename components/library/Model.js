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

import {setLocalVariables, defineVariablesForProperties, asyncApiToJavaType} from '../../utils/Types.utils';
import { getMessagePayload } from '../../utils/Models.utils';

export function ModelConstructor({ message }) {
  // TODO: Supoort ofMany messages
  return (setLocalVariables(getMessagePayload(message).properties()).join(''));
}

export function ModelClassVariables({ message }) {
  // TODO: Supoort ofMany messages
  const argsString = defineVariablesForProperties(getMessagePayload(message));
  
  return argsString.join(`
`);
}

export function ModelRecordVariables({ message }) {
  const messagePayload = getMessagePayload(message);
  return Object.entries(messagePayload.properties()).map(([name, property]) => {
    return `${asyncApiToJavaType(property.type(), property.format())} ${name}`;
  }).join(`,
`);
}
  