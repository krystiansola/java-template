const path = require('path');
const Generator = require('@asyncapi/generator');
const { existsSync, readFileSync } = require('fs');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

describe('kafka integration tests using the generator', () => {
  jest.setTimeout(30000);

  const generateJavaProject = async (PACKAGE, params, asyncApiDoc, expectedFiles, expectedConnectionHelperLines) => {
    const OUTPUT_DIR = path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));

    // try running the generator
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, {
      forceWrite: true,
      templateParams: { ...params, package: PACKAGE }
    });
    await generator.generateFromFile(path.resolve('test', asyncApiDoc));

    // check that the files specific to this AsyncAPI doc are generated
    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/${file}`))).toBe(true);
    }

    // check that standard files common to every project are generated
    const commonFiles = [
      'pom.xml',
      'Dockerfile',
      'env.json',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
    ];
    for (const file of commonFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }

    // check that the expected connection parameters are found
    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    for (const expectedLine of expectedConnectionHelperLines) {
      expect(connectionHelper.includes(expectedLine)).toBe(true);
    }
    const connectionEnv = readFileSync(path.join(OUTPUT_DIR, 'env.json'), 'utf-8');
    const foundStreetlightsScram = connectionEnv.includes('"BOOTSTRAP_ADDRESS": "test.mykafkacluster.org:18092"');
    const foundStreetlightsMtls = connectionEnv.includes('"BOOTSTRAP_ADDRESS": "test.mykafkacluster.org:28092"');
    const foundRecordLabelKafka = connectionEnv.includes('"BOOTSTRAP_ADDRESS": "my-kafka-hostname:9092"');
    expect(foundStreetlightsScram || foundStreetlightsMtls || foundRecordLabelKafka).toBe(true);

    return true;
  };

  const generateSpringProject = async (PACKAGE, params, asyncApiDoc, expectedFiles) => {
    const OUTPUT_DIR = path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));

    // try running the generator
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, {
      forceWrite: true,
      templateParams: { ...params, package: PACKAGE }
    });
    await generator.generateFromFile(path.resolve('test', asyncApiDoc));

    // check that the files specific to this AsyncAPI doc are generated
    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/${file}`))).toBe(true);
    }
    return true;
  };

  it('should generate Java for a secured, encrypted Kafka', async () => {
    const verified = await generateJavaProject(
      'com.asyncapi',
      {
        server: 'production'
      },
      'mocks/kafka-example.yml',
      [
        'DemoProducer.java',
        'DemoSubscriber.java',
        'SongReleasedProducer.java',
        'SongReleasedSubscriber.java',
        'models/Song.java',
      ],
      [
        'props.put("security.protocol", "SASL_SSL")',
        'props.put("sasl.mechanism", "SCRAM-SHA-512")'
      ]);
    expect(verified).toBe(true);
  });

  it('should generate Java for an encrypted Kafka', async () => {
    const verified = await generateJavaProject(
      'com.custom.package',
      {
        server: 'production'
      },
      'mocks/kafka-example-encrypt.yml',
      [
        'DemoProducer.java',
        'SongReleasedProducer.java',
        'models/Song.java',
      ],
      [
        'props.put("security.protocol", "SSL")',
      ]);
    expect(verified).toBe(true);
  });

  it('should generate Java for a plain Kafka', async () => {
    const verified = await generateJavaProject(
      'plain',
      {
        server: 'production'
      },
      'mocks/kafka-example-plain.yml',
      [
        'DemoProducer.java',
        'DemoSubscriber.java',
        'SongReleasedProducer.java',
        'SongReleasedSubscriber.java',
        'models/Song.java',
      ],
      [
        'props.put("security.protocol", "PLAINTEXT")',
      ]);
    expect(verified).toBe(true);
  });

  it('should generate Java for a secured Kafka', async () => {
    const verified = await generateJavaProject(
      'secured.kafka.doc',
      {
        server: 'production',
      },
      'mocks/kafka-example-auth.yml',
      [
        'DemoSubscriber.java',
        'SongReleasedSubscriber.java',
        'models/Song.java',
      ],
      [
        'props.put("security.protocol", "SASL_PLAINTEXT")',
        'props.put("sasl.mechanism", "PLAIN")',
      ]);
    expect(verified).toBe(true);
  });

  it('should generate Java for the streetlights example', async () => {
    const verified = await generateJavaProject(
      'com.asyncapi.examples.streetlights.v2',
      {
        server: 'mtls-connections'
      },
      'mocks/kafka-streetlights-v2.yml',
      [
        'DemoSubscriber.java',
        'SmartylightingStreetlights10ActionStreetlightIdDimProducer.java',
        'SmartylightingStreetlights10ActionStreetlightIdTurnOffProducer.java',
        'SmartylightingStreetlights10ActionStreetlightIdTurnOnProducer.java',
        'SmartylightingStreetlights10EventStreetlightIdLightingMeasuredSubscriber.java',
        'models/DimLight.java',
        'models/LightMeasured.java',
        'models/TurnOnOff.java',
      ],
      [
        'props.put("security.protocol", "SSL")',
      ]);
    expect(verified).toBe(true);
  });

  it('should generate Java for a v3 AsyncAPI', async () => {
    const verified = await generateJavaProject(
      'com.asyncapi.examples.streetlights.v3',
      {
        server: 'scram-connections',
      },
      'mocks/kafka-streetlights-v3.yml',
      [
        'DemoSubscriber.java',
        'LightingMeasuredSubscriber.java',
        'LightsDimProducer.java',
        'LightTurnOffProducer.java',
        'LightTurnOnProducer.java',
        'models/DimLight.java',
        'models/LightMeasured.java',
        'models/TurnOn.java',
      ],
      [
        'props.put("security.protocol", "SASL_SSL")',
        'props.put("sasl.mechanism", "SCRAM-SHA-256")',
      ]);
    expect(verified).toBe(true);
  });

  it('should generate code for an AsyncAPI doc without payload schema', async () => {
    const verified = await generateJavaProject(
      'com.eem',
      {
        server: 'gateway-group',
      },
      'mocks/kafka-orders-v3.yml',
      [
        'DemoSubscriber.java',
        'ORDERSJSONSubscriber.java',
        'models/Message.java',
      ],
      [
        'props.put("security.protocol", "SASL_SSL")',
        'props.put("sasl.mechanism", "PLAIN")',
      ]);
    expect(verified).toBe(true);
  });
  
  it('should generate server code for kafka producer with spring and KafkaTemplate', async () => {
    const verified = await generateSpringProject(
      'com.eem',
      {
        server: 'local',
        library: 'spring'
      },
      'mocks/kafka-server.yaml',
      [
        'models/OrganizationCreated.java',
      ]);
    expect(verified).toBe(true);
  });
});
