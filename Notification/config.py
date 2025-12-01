import os

class Config:
    MYSQL_HOST = "localhost"
    MYSQL_USER = "root"
    MYSQL_PASSWORD = "password"
    MYSQL_DB = "notification_db"

    RABBITMQ_HOST = "localhost"
    RABBITMQ_QUEUE = "notifications"
