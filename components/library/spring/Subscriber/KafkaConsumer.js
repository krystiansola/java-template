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

export function SubscriberImports() {
  return `
import org.springframework.kafka.annotation.KafkaListener;
  
import cdq.kafka.support.Message;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
`;
}

export function ReceiveMessage({asyncapi, className, modelName, topicName, channel, consumerName }) {
  const operations = asyncapi.allOperations().filterBy(operation => {
    // an operation has a required channel
    return operation.channels()[0].id() === channel.id();
  });
  let groupId = 'default';
  if (operations.length === 1) {
    const kafka = operations[0].bindings().get('kafka');
    if (kafka) {
      groupId = kafka.value().groupId.enum[0];
    }
  }
  return `
@RequiredArgsConstructor
public class ${className}
{
    private final ${consumerName} consumer;

    @KafkaListener(topics = "${topicName}", groupId = "${groupId}")
    public void consume(String organizationCreated)
    {
        ${modelName} event = fromJson(organizationCreated);
        consumer.consume(new Message<>(event));
    }

    private static ${modelName} fromJson(String event)
    {
        try
        {
            return new ObjectMapper().readValue(event, ${modelName}.class);
        }
        catch (JsonProcessingException e)
        {
            throw new RuntimeException(e);
        }
    }
}
`;
}
