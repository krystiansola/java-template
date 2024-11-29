package exaple.shop.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import example.producer.app.OrderCreatedProducer;
import example.producer.app.models.OrderCreatedMessage;

@RestController
public class OrderController
{
    @Autowired
    private OrderCreatedProducer orderCreatedProducer;
    @PostMapping("/order")
    public Order createOrder(@RequestBody Order order)
    {
        OrderCreatedMessage message = OrderCreatedMessage.builder()
                .orderId(order.getOrderId())
                .customerEmail(order.getCustomerEmail())
                .build();
        orderCreatedProducer.send(message);
        return order;
    }


}
