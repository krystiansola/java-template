package example.producer.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class AppConfiguration
{
    @Bean
    UserSignedupProducer userSignedupProducer(KafkaTemplate<Integer, Object> kafkaTemplate)
    {
        return new UserSignedupProducer(kafkaTemplate);
    }

}
