from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from db import db
from models import Notification
from mq import publish_message
import requests

app = Flask(__name__)

# SQLAlchemy povezava
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{Config.MYSQL_USER}:{Config.MYSQL_PASSWORD}@{Config.MYSQL_HOST}/{Config.MYSQL_DB}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# INIT DB TABLES
with app.app_context():
    db.create_all()

# -------------------------
# HELPER – ORDER SERVICE API
# -------------------------

def get_order_details(order_id):
    url = f"http://localhost:5001/order/{order_id}"  # prilagodi port
    response = requests.get(url)
    return response.json()


# ----------------------------------------
# ENDPOINTI, KI JIH ORDER SERVICE KLIČE
# ----------------------------------------

@app.post("/notification/order-created")
def order_created():
    data = request.json

    notif = Notification(
        user_id=data["user_id"],
        order_id=data["order_id"],
        type="order_created",
        payload=data
    )
    db.session.add(notif)
    db.session.commit()

    publish_message({
        "event": "order_created",
        "data": data
    })

    return jsonify({"status": "ok"}), 201


@app.post("/notification/order-paid")
def order_paid():
    data = request.json

    notif = Notification(
        user_id=data["user_id"],
        order_id=data["order_id"],
        type="order_paid",
        payload=data
    )
    db.session.add(notif)
    db.session.commit()

    publish_message({
        "event": "order_paid",
        "data": data
    })

    return jsonify({"status": "ok"}), 201


@app.post("/notification/order-shipped")
def order_shipped():
    data = request.json

    notif = Notification(
        user_id=data["user_id"],
        order_id=data["order_id"],
        type="order_shipped",
        payload=data
    )
    db.session.add(notif)
    db.session.commit()

    publish_message({
        "event": "order_shipped",
        "data": data
    })

    return jsonify({"status": "ok"}), 201


@app.post("/notification/level-up")
def level_up():
    data = request.json

    notif = Notification(
        user_id=data["user_id"],
        order_id=None,
        type="level_up",
        payload=data
    )
    db.session.add(notif)
    db.session.commit()

    publish_message({
        "event": "level_up",
        "data": data
    })

    return jsonify({"status": "ok"}), 201


# -------------------------
# TEST endpoint
# -------------------------
@app.get("/notification/all")
def get_all():
    notifs = Notification.query.all()
    return jsonify([{
        "id": n.id,
        "user_id": n.user_id,
        "order_id": n.order_id,
        "type": n.type,
        "payload": n.payload
    } for n in notifs])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
