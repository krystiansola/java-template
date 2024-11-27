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

import {File} from '@asyncapi/generator-react-sdk';
import { ImportModels, PackageDeclaration, Class } from '../../Common';
import { ProducerConstructor, SendMessage, ProducerImports, ProducerDeclaration } from '../Producer/index';
import { toJavaClassName, javaPackageToPath } from '../../../../utils/String.utils';

export function Producers(asyncapi, channels, params) {
  return channels.map((channel) => {
    if (channel.operations().filterBySend().length > 0) {
      const name = channel.address() || channel.id();
      const className = `${toJavaClassName(name)}Producer`;
      const packagePath = javaPackageToPath(params.package);
      const messagesInChanel = channel.messages().all();
      if (messagesInChanel.length !== 1) {
        // TODO should be an error message
        console.log('Only one message is supported');
        return;
      }
      const javaClassName = toJavaClassName(messagesInChanel[0].id());
      return (
        <File name={`${packagePath}${className}.java`}>
            
          <PackageDeclaration path={params.package} />
          <ProducerImports asyncapi={asyncapi} params={params} />
          <ImportModels asyncapi={asyncapi} params={params} />

          <Class name={className}>
            <ProducerDeclaration asyncapi={asyncapi} params={params} />

            <ProducerConstructor asyncapi={asyncapi} params={params} className={className}  />

            <SendMessage asyncapi={asyncapi} params={params} topicName={name} paramClassName={javaClassName}/>
          </Class>
        </File>
      );
    }
  });
}
