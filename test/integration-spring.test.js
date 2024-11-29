const fs = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');
const {existsSync} = require("fs");

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

const readFileContent = (root, filePath) => {
  return fs.readFileSync(path.resolve(root, filePath), 'utf-8');
};

test('Generates Models for spring kafka producer', async () => {
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

test('Generates Models for spring kafka consumer', async () => {
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
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-consumer.yaml'));

  // when
  const message = readFileContent(OUTPUT_DIR, 'com/asyncapi/models/AuditLogCreated.java');
  const consumer = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogCreatedConsumer.java');
  const subscriber = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogCreatedSubscriber.java');

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
public record AuditLogCreated(
	String message
)
{
}
`);
  expect(consumer).toBe(`
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

import cdq.kafka.support.Message;

import com.asyncapi.models.AuditLogCreated;
public interface AuditLogCreatedConsumer
{
    void consume(Message<AuditLogCreated> payload);
}
`);
  expect(subscriber).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.AuditLogCreated;
@RequiredArgsConstructor
public class AuditLogCreatedSubscriber
{
    private final AuditLogCreatedConsumer consumer;

    @KafkaListener(topics = "AuditLogCreated", groupId = "default")
    public void consume(String organizationCreated)
    {
        AuditLogCreated event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static AuditLogCreated fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, AuditLogCreated.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
});

test('Generates Client code for spring kafka consumer', async () => {
  // given
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
  const OUTPUT_DIR = generateFolderName();
  const params = {
    server: 'local',
    library: 'spring',
    codeType: 'client'
  };
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-consumer.yaml'));

  // when
  const message = readFileContent(OUTPUT_DIR, 'com/asyncapi/models/AuditLogCreated.java');
  const producer = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogCreatedProducer.java');
  expect(existsSync(path.join(OUTPUT_DIR, 'com/asyncapi/AditLogCreatedConsumer.java'))).toBe(false);

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
public record AuditLogCreated(
	String message
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

import com.asyncapi.models.AuditLogCreated;
public class AuditLogCreatedProducer  {

    private final KafkaTemplate<Integer, Object> kafkaTemplate;
  
    public AuditLogCreatedProducer(KafkaTemplate<Integer, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void send(AuditLogCreated event) {
        String jsonString = toJsonString(event);
        kafkaTemplate.send("AuditLogCreated", jsonString);
    }
    
    private static String toJsonString(AuditLogCreated event)
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

test('Generates Client code for spring kafka producer', async () => {
  // given
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
  const OUTPUT_DIR = generateFolderName();
  const params = {
    server: 'local',
    library: 'spring',
    codeType: 'client'
  };
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-server.yaml'));

  // when
  const message = readFileContent(OUTPUT_DIR, 'com/asyncapi/models/OrganizationCreated.java');
  const consumer = readFileContent(OUTPUT_DIR, 'com/asyncapi/OrganizationCreatedConsumer.java');
  const subscriber = readFileContent(OUTPUT_DIR, 'com/asyncapi/OrganizationCreatedSubscriber.java');
  expect(existsSync(path.join(OUTPUT_DIR, 'com/asyncapi/OrganizationCreatedProducer.java'))).toBe(false);

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
	String organizationId,
	String organizationName
)
{
}
`);
  expect(consumer).toBe(`
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

import cdq.kafka.support.Message;

import com.asyncapi.models.OrganizationCreated;
public interface OrganizationCreatedConsumer
{
    void consume(Message<OrganizationCreated> payload);
}
`);
  expect(subscriber).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.OrganizationCreated;
@RequiredArgsConstructor
public class OrganizationCreatedSubscriber
{
    private final OrganizationCreatedConsumer consumer;

    @KafkaListener(topics = "OrganizationCreated", groupId = "default")
    public void consume(String organizationCreated)
    {
        OrganizationCreated event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static OrganizationCreated fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, OrganizationCreated.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
});

test('Generates Client code for spring kafka producer with another example', async () => {
  // given
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
  const OUTPUT_DIR = generateFolderName();
  const params = {
    server: 'local',
    library: 'spring',
    codeType: 'client'
  };
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-producer-example.yaml'));

  // when
  const subscriber = readFileContent(OUTPUT_DIR, 'com/asyncapi/UserSignedupSubscriber.java');
  expect(existsSync(path.join(OUTPUT_DIR, 'com/asyncapi/OrganizationCreatedProducer.java'))).toBe(false);

  // then
  expect(subscriber).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.UserSignedupMessage;
@RequiredArgsConstructor
public class UserSignedupSubscriber
{
    private final UserSignedupConsumer consumer;

    @KafkaListener(topics = "user/signedup", groupId = "default")
    public void consume(String organizationCreated)
    {
        UserSignedupMessage event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static UserSignedupMessage fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, UserSignedupMessage.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
});

test('Generates Models for spring kafka consumer with defined operation binding for groupId', async () => {
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
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-consumer-with-groupId-binding.yaml'));

  // when
  const subscriber = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogCreatedSubscriber.java');

  // then
  expect(subscriber).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.AuditLogCreated;
@RequiredArgsConstructor
public class AuditLogCreatedSubscriber
{
    private final AuditLogCreatedConsumer consumer;

    @KafkaListener(topics = "AuditLogCreated", groupId = "audit-log-consumer")
    public void consume(String organizationCreated)
    {
        AuditLogCreated event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static AuditLogCreated fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, AuditLogCreated.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
});

test('Generates Models for spring kafka consumer with 2 channels', async () => {
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
  await generator.generateFromFile(path.resolve('test', 'mocks/kafka-consumer-with-2-chanels.yaml'));

  // when
  const consumer1 = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogCreatedSubscriber.java');
  const consumer2 = readFileContent(OUTPUT_DIR, 'com/asyncapi/AuditLogUpdatedSubscriber.java');

  // then
  expect(consumer1).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.AuditLogCreated;
@RequiredArgsConstructor
public class AuditLogCreatedSubscriber
{
    private final AuditLogCreatedConsumer consumer;

    @KafkaListener(topics = "AuditLogCreated", groupId = "audit-log-consumer")
    public void consume(String organizationCreated)
    {
        AuditLogCreated event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static AuditLogCreated fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, AuditLogCreated.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
  expect(consumer2).toBe(`
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

import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.asyncapi.models.AuditLogCreated;
@RequiredArgsConstructor
public class AuditLogUpdatedSubscriber
{
    private final AuditLogUpdatedConsumer consumer;

    @KafkaListener(topics = "AditLogUpdated", groupId = "audit-log-consumer-2")
    public void consume(String organizationCreated)
    {
        AuditLogCreated event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static AuditLogCreated fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, AuditLogCreated.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`);
});

