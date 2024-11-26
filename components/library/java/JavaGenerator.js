import {File} from '@asyncapi/generator-react-sdk';

import { PackageDeclaration, EnvJson } from './Common';
import { javaPackageToPath } from '../../../utils/String.utils';

import Connection from './Connection/index';
import ConnectionHelper from './ConnectionHelper/index';
import { LoggingHelper } from './LoggingHelper';
import { Dockerfile } from './Dockerfile';
import { Classpath } from './Classpath';
import { Project } from './Project';
import { PomHelper } from './PomHelper';
import { Demo } from './Demo/Demo';
import { PubSubBaseRender } from './PubSubBase/index';
import { ModelContract } from './ModelContract';
import Readme from './Readme/index';

import { Models } from './Files/Models';
import { Producers } from './Files/Producers';
import { Consumers } from './Files/Consumers';

export function RenderJava(asyncapi, channels, server, params) {
  const toRender = {};
  toRender['connectionHelper'] = ConnectionHelperRenderer(asyncapi, params);
  toRender['loggingHelper'] = LoggingHelperRenderer(params);
  toRender['connectionRender'] = ConnectionRender(asyncapi, params);
  toRender['envJson'] = EnvJsonRenderer(asyncapi, params);
  toRender['pubSubBase'] = PubSubBaseRender(asyncapi, params);
  toRender['pomXml'] = PomXmlRenderer(server, params);
  toRender['demo'] = Demo(asyncapi, params);
  toRender['dockerfile'] = DockerfileRenderer();
  toRender['classpath'] = classpathRender();
  toRender['project'] = projectRender();
  toRender['readmeRenderer'] = ReadmeRenderer(asyncapi, params);
  toRender['producers'] = Producers(asyncapi, channels, params);
  toRender['models'] = Models(asyncapi, params);
  toRender['ModelContract'] = ModelContractRenderer(params);
  toRender['consumers'] = Consumers(asyncapi, channels, params);
  return toRender;
}

function LoggingHelperRenderer(params) {
  const filePath = `${javaPackageToPath(params.package)}LoggingHelper.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <LoggingHelper />
    </File>
  );
}

function ModelContractRenderer(params) {
  const filePath = `${javaPackageToPath(params.package)}models/ModelContract.java`;
  const pkg = `${params.package}.models`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={pkg} />
      <ModelContract />
    </File>
  );
}

function ConnectionRender(asyncapi, params) {
  const filePath = `${javaPackageToPath(params.package)}Connection.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <Connection asyncapi={asyncapi} params={params} />
    </File>
  );
}

function ConnectionHelperRenderer(asyncapi, params) {
  const filePath = `${javaPackageToPath(params.package)}ConnectionHelper.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <ConnectionHelper asyncapi={asyncapi} params={params} />
    </File>
  );
}

function EnvJsonRenderer(asyncapi, params) {
  return (
    <File name='/env.json'>
      <EnvJson asyncapi={asyncapi} params={params} />
    </File>
  );
}

function PomXmlRenderer(server, params) {
  return (
    <File name='/pom.xml'>
      <PomHelper params={params} server={server} />
    </File>
  );
}

function ReadmeRenderer(asyncapi, params) {
  return (
    <File name='/README.md'>
      <Readme asyncapi={asyncapi} params={params} />
    </File>
  );
}

function DockerfileRenderer() {
  return (
    <File name='/Dockerfile'>
      <Dockerfile />
    </File>
  );
}

function projectRender() {
  return (
    <File name='/.project'>
      <Project />
    </File>
  );
}

function classpathRender() {
  return (
    <File name='/.classpath'>
      <Classpath />
    </File>
  );
}