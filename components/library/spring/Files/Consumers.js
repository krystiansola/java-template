import { File } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration} from '../../Common';
import { ConsumerImports, ReceiveMessage } from '../Consumer/index';
import { toJavaClassName, javaPackageToPath } from '../../../../utils/String.utils';

export function Consumers(asyncapi, channels, params) {
  return channels.map((channel) => {
    let filterByReceive;
    if (params.codeType === 'owner') {
      filterByReceive = channel.operations().filterByReceive();
    } else {
      filterByReceive = channel.operations().filterBySend();
    }
    if (filterByReceive.length > 0) {
      const name = channel.id();
      const className = `${toJavaClassName(name)}Consumer`;

      const packagePath = javaPackageToPath(params.package);

      const message = channel.messages().all()[0];

      return (
        <File name={`${packagePath}${className}.java`}>
          <PackageDeclaration path={params.package}></PackageDeclaration>
          <ConsumerImports asyncapi={asyncapi} params={params} message={message}></ConsumerImports>
          <ImportModels asyncapi={asyncapi} params={params} />

          <ReceiveMessage asyncapi={asyncapi} params={params} message={message} className={className} />
        </File> 
      );
    }
  });
}