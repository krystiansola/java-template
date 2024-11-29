package example.producer.app;

import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import example.producer.app.models.UserSignedupMessage;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class UserLoggedInController
{
    private final UserSignedupProducer userSignedupProducer;

    @PostMapping("/signeUp")
    public void login(@RequestBody SigneUp signeUp)
    {
        userSignedupProducer.send(new UserSignedupMessage(signeUp.getName(), signeUp.getEmail()));
    }

    @Data
    public static class SigneUp
    {
        private String name;
        private String email;
    }

}
