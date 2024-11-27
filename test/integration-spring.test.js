const fs = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

const readFileContent = (root, filePath) => {
  return fs.readFileSync(path.resolve(root, filePath), 'utf-8');
};

test('Generates Models for spring kafka', async () => {
  // given
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
  const OUTPUT_DIR = generateFolderName();
  const params = {
    server: 'local',
    library: 'spring'
  };
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-server.yaml'));

  // when
  const message = readFileContent(OUTPUT_DIR, 'com/asyncapi/models/OrganizationCreated.java');
  const producer = readFileContent(OUTPUT_DIR, 'com/asyncapi/OrganizationCreatedProducer.java');

  // then
  expect(message).toBe(`
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
package com.asyncapi.models;

import lombok.Builder;
@Builder
public record OrganizationCreated(
\tString organizationId,
\tString organizationName
)
{
}
`);
  expect(producer).toBe(`
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
package com.asyncapi;

import org.springframework.kafka.core.KafkaTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.asyncapi.models.OrganizationCreated;
public class OrganizationCreatedProducer  {

    private final KafkaTemplate<Integer, Object> kafkaTemplate;
  
    public OrganizationCreatedProducer(KafkaTemplate<Integer, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(OrganizationCreated event) {
        String jsonString = toJsonString(event);
        kafkaTemplate.send("OrganizationCreated", jsonString);
    }
    
    private static String toJsonString(OrganizationCreated event)
    {
        try
        {
            return new ObjectMapper().writeValueAsString(event);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
    
}
`);
});

