import { File } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration} from '../../Common';
import { toJavaClassName, javaPackageToPath } from '../../../../utils/String.utils';
import {ReceiveMessage, SubscriberImports} from '../Subscriber/index';

export function Subscriber(asyncapi, channels, params) {
  return channels.map((channel) => {
    if (channel.operations().filterByReceive().length > 0) {
      const topicName = channel.address() || channel.id();
      const className = `${toJavaClassName(channel.id())}Subscriber`;

      const packagePath = javaPackageToPath(params.package);
      const message = channel.messages().all()[0];
      const modelName = toJavaClassName(message.id() || message.name());

      return (
        <File name={`${packagePath}${className}.java`}>
          <PackageDeclaration path={params.package}></PackageDeclaration>
          <SubscriberImports asyncapi={asyncapi} params={params} message={message}></SubscriberImports>
          <ImportModels asyncapi={asyncapi} params={params} />
          <ReceiveMessage asyncapi={asyncapi} params={params} className={className} modelName={modelName} topicName={topicName} channel={channel}/>
        </File>
      );
    }
  });
}