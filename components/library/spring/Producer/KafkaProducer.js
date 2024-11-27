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

export function ProducerDeclaration() {
  return `
    private final KafkaTemplate<Integer, Object> kafkaTemplate;
  `;
}

export function SendMessage({ topicName, paramClassName }) {
  return `
    public void send(${paramClassName} event) {
        String jsonString = toJsonString(event);
        kafkaTemplate.send("${topicName}", jsonString);
    }
    
    private static String toJsonString(${paramClassName} event)
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
    `;
}

export function ProducerConstructor({ className }) {
  return `
    public ${className}(KafkaTemplate<Integer, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
`;
}

export function ProducerImports({ params }) {
  return `
import org.springframework.kafka.core.KafkaTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
`;
}
