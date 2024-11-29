package cdq.kafka.support;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Message<T>
{
    private final T payload;
}
