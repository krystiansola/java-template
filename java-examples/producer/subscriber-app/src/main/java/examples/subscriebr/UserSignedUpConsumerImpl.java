package examples.subscriebr;


import org.springframework.stereotype.Component;

import cdq.kafka.support.Message;
import example.producer.app.UserSignedupConsumer;
import example.producer.app.models.UserSignedupMessage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class UserSignedUpConsumerImpl implements UserSignedupConsumer
{
    @Override
    public void consume(Message<UserSignedupMessage> payload)
    {
        log.info("Received message: {}", payload);
    }
}
