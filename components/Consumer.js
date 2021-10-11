import { getMqValues, URLtoHost, URLtoPort, createJavaArgs } from './Common';

export function ConsumerDeclaration({name}) {
    return `
      private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");
    
      public static final String CONSUMER_SUB = "topic";
      public static final String CONSUMER_GET = "queue";
    
      private JMSContext context = null;
      private Destination destination = null;
      private JMSConsumer consumer = null;
      private ConnectionHelper ch = null;
    `
    }
     

export function ConsumerImports({ asyncApi, messageNames }) {
return `
    import java.util.logging.*;
    
    import javax.jms.Destination;
    import javax.jms.JMSConsumer;
    import javax.jms.JMSContext;
    import javax.jms.Message;
    import javax.jms.TextMessage;
    import javax.jms.JMSRuntimeException;
    import javax.jms.JMSException;
    
    import com.fasterxml.jackson.databind.ObjectMapper; ß
    import com.fasterxml.jackson.databind.ObjectWriter; 
    import com.fasterxml.jackson.core.JsonProcessingException;
    import com.fasterxml.jackson.annotation.JsonView;
    
    
    import com.ibm.mq.samples.jms.ConnectionHelper;
    import com.ibm.mq.samples.jms.LoggingHelper;
    import com.ibm.mq.samples.jms.Connection;
        
    `
}

export function ReceiveMessage({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?
    let properties = channel.subscribe().message().payload().properties();
  
    let args = createJavaArgs(properties);
  
    let message = channel.subscribe().message();
    
    console.log("name", channel.subscribe().message())
  
    //TODO remove hardcode
    
    return `
    public void receive(int requestTimeout) {
      boolean continueProcessing = true;
  
      consumer = context.createConsumer(destination);
      logger.info("consumer created");
  
      while (continueProcessing) {
          try {
              Message receivedMessage = consumer.receive(requestTimeout);
              if (receivedMessage == null) {
                  logger.info("No message received from this endpoint");
                //    continueProcessing = false;       THIS IS COMMENTED FOR TESTING PURPOSES, UNCOMMENT WHEN DONE
              } else {
                if (receivedMessage instanceof TextMessage) {
                    TextMessage textMessage = (TextMessage) receivedMessage;
                    try {
                        logger.info("Received message: " + textMessage.getText());
                        Single receivedSingleObject = new ObjectMapper().readValue(textMessage.getText(), Single.class); // HARDCODED, REACTIFY
  
                        System.out.println("TYPE: " + receivedSingleObject.getClass().getName()); // REMOVE THIS EVENTUALLY BUT GOOD FOR DEMO
                        System.out.println(receivedSingleObject.toString()); // REMOVE EITHER THIS OR logger.info(Received...
  
                    } catch (JMSException jmsex) {
                        recordFailure(jmsex);
                    } catch (JsonProcessingException jsonproex) {
                        recordFailure(jsonproex);
                    }
                } else if (receivedMessage instanceof Message) {
                    logger.info("Message received was not of type TextMessage.");
                } else {
                    logger.info("Received object not of JMS Message type!");
                }
              }
          } catch (JMSRuntimeException jmsex) {
              jmsex.printStackTrace();
              try {
                  Thread.sleep(1000);
              } catch (InterruptedException e) {
              }
          }
       }
    }
  `
  }
  
  export function ConsumerConstructor({asyncapi, name, params}) {
    const url = asyncapi.server('production1').url() 
    let qmgr = getMqValues(url,'qmgr')
    let mqChannel = getMqValues(url,'mqChannel')
    let host = URLtoHost(url)
    let domain = host.split(':', 1)
    return `
      String id = null;
      id = "Basic sub";
  
      LoggingHelper.init(logger);
      logger.info("Sub application is starting");
  
      Connection myConnection = new Connection(
        "${domain}",
        ${ URLtoPort(url, 1414) },
        "${mqChannel}",
        "${qmgr}",
        "${params.user}",
        "${params.password}",
        "${name}",
        "${name}",
        null);
  
      ch = new ConnectionHelper(id, myConnection);
  
      logger.info("created connection factory");
  
      context = ch.getContext();
      logger.info("context created");
  
      destination = ch.getTopicDestination();
  
  
      logger.info("destination created");
  `
  }