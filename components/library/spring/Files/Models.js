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

import { File } from '@asyncapi/generator-react-sdk';
import {PackageDeclaration, ImportDeclaration, AddAnnotation, Record} from '../../Common';
import {ModelRecordVariables} from '../../Model';
import { javaPackageToPath } from '../../../../utils/String.utils';
import { Indent, IndentationTypes } from '@asyncapi/generator-react-sdk';
import {collateModels} from '../../../../utils/Models.utils';

export function Models(asyncapi, params) {
  const models = collateModels(asyncapi);

  return Object.entries(models).map(([messageName, message]) => {
    return Model(messageName, message, params);
  });
}

export function Model(messageName, message, params) {
  const messageNameUpperCase = messageName.charAt(0).toUpperCase() + messageName.slice(1);
  const packagePath = javaPackageToPath(params.package);

  console.log(messageNameUpperCase);
  return (
    <File name={`${packagePath}models/${messageNameUpperCase}.java`}>
      <PackageDeclaration path={`${params.package}.models`}/>
      <ImportDeclaration path={'lombok.Builder'}/>
      <AddAnnotation name='Builder'/>
      <Record className={messageNameUpperCase}>
        <Indent size={1} type={IndentationTypes.TABS}>
          <ModelRecordVariables message={message}></ModelRecordVariables>
        </Indent>
      </Record>
    </File>
  );
}