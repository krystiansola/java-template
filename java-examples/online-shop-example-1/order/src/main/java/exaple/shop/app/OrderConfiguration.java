package exaple.shop.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;

import example.producer.app.OrderCreatedProducer;

@Configuration
public class OrderConfiguration
{
    @Bean
    OrderCreatedProducer orderCreatedProducer(KafkaTemplate<Integer, Object> kafkaTemplate)
    {
        return new OrderCreatedProducer(kafkaTemplate);
    }
}
