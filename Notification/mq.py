import pika
from config import Config
import json

def publish_message(message: dict):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(Config.RABBITMQ_HOST)
    )
    channel = connection.channel()

    channel.queue_declare(queue=Config.RABBITMQ_QUEUE, durable=True)

    channel.basic_publish(
        exchange='',
        routing_key=Config.RABBITMQ_QUEUE,
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)
    )

    connection.close()
