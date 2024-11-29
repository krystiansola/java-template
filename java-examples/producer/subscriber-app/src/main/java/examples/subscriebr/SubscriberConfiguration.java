package examples.subscriebr;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import example.producer.app.UserSignedupConsumer;
import example.producer.app.UserSignedupSubscriber;

@Configuration
public class SubscriberConfiguration
{
    @Bean
    public UserSignedupSubscriber userSignedupSubscriber(UserSignedupConsumer userSignedupConsumer)
    {
        return new UserSignedupSubscriber(userSignedupConsumer);
    }
}
