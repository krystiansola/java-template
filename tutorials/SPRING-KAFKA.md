# Java template for Spring Boot 2.7.x and 3.1.x

This tutorial explains how to use the generator in an api first approach using the async api specification. Before we start coding lets understand the concept of message owner and message client. Understanding that allows us to decide which project the AsyncAPI specification should be applied to.

## Understanding basic concept of "message owner" and "message client"

Before we start designing the async api we have to define the owner and client of our
message. First explain what I mean with a message owner and client. To 
better understand the concept, let's take a look at the following example:

Let's consider we are building a component responsible for processing orders in 
an online shop. Every time a new order is created in the shop an email have to be sent
to the customer. For sending emails we have another component called notification service.

![alt text](./components.svg "Components")

Now is the question of how the components communicate with each other. To answer the question we have to better understand how will we develop both components.

### Option 1

In the first option the Notification Service was build for a marketing team which wants to send emails to customers when a new order is created. The team which owns  the notification service
is responsible for the email content. The Notification Team knows that when a new order is created then
an email have to be sent to a customers. From the previous sentence we know exactly which service should know about the other service. So the Notification Service knows the concept of an Order. Then the visibility graph looks as follows:

![alt text](./notifications-knows-order.svg "Components")

The Notification Service knows the Order Service but Order Service does not know the Notification Service.
To achieve such visibility the Order Service has to publish a message that a new order is created. The Notification Service has to subscribe to the message and sent an email to the customer.

To achieve that we use some message bus like kafka. The full picture would look like this:

![alt text](./notification-knows-orders-with-event-bus.svg "Components")

Having that picture the owner of our message is Order Service and the client is Notification
Service. In that case the owner is the message "producer" and the client is the "consumer".

### Option 2

Let's consider the case where the Team for the Notification Service is only responsible for sending emails. The Notification Team does not care about the content of the email and 
does not know when the email have to be sent. The Notification Service can only send emails.
In that scenario the Team responsible for the Order Service decides about the content of the
email. In that case the Order Service knows Notification Service but the Notification Service does not know the Order Service.

So the visibility diagram would look like this:

![alt text](./order-knows-notifications.svg "Components")

In that case the Order Service send an event to the Notification Service which then emailed the customer. 
Even the producer of the message is still Order Service and the consumer is
Notification Service, the owner of the message is now Notification Service.

![alt text](./order-knows-notifications-with-event-bus.svg "Components")

### In which component should we put the async api specification?

The async api specification should be put always in the message owner component. In option 1 the async api should be implemented in the Order Service. In option 2 the async api should be implemented in the Notification Service.

Of course in option 1 we could write in the Notification Service an api specification were we consume the message from the Order Service. But would mena we have to duplicate the code for Order   


