from flask import Flask, request, jsonify
import mysql.connector
from dotenv import load_dotenv
import mysql.connector
import os
from dbq import *
from functools import wraps
import requests
from datetime import datetime
from uuid import uuid4
get = os.getenv

load_dotenv()

app = Flask(__name__)


MYSQL_HOST = get("MYSQL_HOST")
MYSQL_USER = get("MYSQL_USER")
MYSQL_PSWD = get("MYSQL_PASSWORD")
MYSQL_PORT = int(get("MYSQL_PORT"))
MYSQL_DATABASE = get("MYSQL_DATABASE")
HOST = get("HOST")
PORT = int(get("PORT"))
DEBUG = get("DEBUG").lower() in  ('true', '1')
GAME_SERVICE_URL = get("GAME_API")


try: 
	database = mysql.connector.connect(
		host=MYSQL_HOST,
		user=MYSQL_USER,
		password=MYSQL_PSWD,
		database=MYSQL_DATABASE,
		port=MYSQL_PORT
	)
	print("[+] Connection successful")
except Exception as e:
	print("[!] Failed to connect to the database. Quitting...", e)
	exit(-1)


tOrder = {
	"email": "email",
	"items": "items",
	"name": "name",
	"surname": "surname",
	"address": "address"
}


# TODO request auth token, not yet JWT but think about this. Frontend  


def gameify(data):
	try:
		r = requests.post(GAME_SERVICE_URL+'/placed-order', data=data)
		
		if r.status_code in range(200, 300):
			return r.content
		else:
			print("Bad response status: ", r.status_code)
			return None
	except Exception as e:
		print(e)
		return None


@app.route('/order', methods=["POST"])
#@log_access
def place_order():
	body = request.get_json()

	# check if all required parameters are in body
	req = [tOrder[key] for key in tOrder.keys()]
	missing = [x for x in req if x not in body.keys()]

	if len(missing):
		msg_ = ", ".join(missing)
		err = f"Missing required parameters {msg_}"
		print(err)
		return jsonify({'error': err}), 400

	#session = body.get(tOrder["session"])
	email = body.get(tOrder["email"])
	dishes = body.get(tOrder["items"])
	name = body.get(tOrder["name"])
	surname = body.get(tOrder["surname"])
	address = body.get(tOrder["address"])


	try: 
		idOrder = insert_order(database, dishes, {"name": name, "surname": surname, "email": email}, address)
		# res = gameify({
		# 		"User_email": email,
		# 		"level": 1,
		# 		"total_expiriance_points": 3
		# 	})

		return jsonify({'status': 'success', 'message': f'New order id {idOrder}'})
	except Exception as e:
		print(str(e))
		#print(dishes)
		return jsonify({'error': 'Something went wrong'}), 500


@app.route('/shippings', methods=["GET", "POST"])
def handle_shipment(): #rename later
	if request.method == "GET":
		try:
			res = fetch_shipped_orders(database)

			return jsonify({ "orders": res, "status": 'success'}), 200
		except Exception as e:
			print(str(e))
			return jsonify({"error": "Something went wrong"}), 500

	else:
		return jsonify({"error": "Not implemented"}), 501

@app.route('/orders/<int:oid>', methods=["GET"])
def get_order(oid):
	try:
		order = fetch_order(database, oid)
	except Exception as e:
		print(e)
		return jsonify({"Something went wrong"}), 500
	if not order:
		return jsonify({"error": f"No record matching id {oid}"}), 400

	return jsonify({"order": order}), 200


@app.route('/orders', methods=["GET"])
def get_all_orders():
	try:
		orders = fetch_orders(database)
	except Exception as e:
		print(e)
		return jsonify({"error": "Something went wrong"}), 500

	return jsonify({"orders": orders}), 200


@app.route('/order-shipped/<int:oid>', methods=["PUT"])
def order_shipped(oid):
	print("Attempting to do stuff")
	try:
		res = update_shipment(database, oid)
		if res == 0:
			return jsonify({"message": "Update successful"})
		if res == 1:
			error = f"Order {oid} doesn't exist"
		elif res == 2:
			error = "Order was already shipped"			
		elif res == 3:
			error = "Order has not been payed yet"

		return jsonify({"error": error}), 400
	except Exception as e:
		print(str(e))
		return jsonify({"error": "Something went wrong"}), 500


@app.route('/dbg-order/<int:oid>', methods=["GET"])
def debug_order(oid):
	rep = dbg_order(database, oid)
	return jsonify({"order": rep}), 200


@app.route('/order-payed/<int:oid>', methods=["PUT"])
def order_payed(oid):
	body = request.get_json()
	payment_id = body.get("pid")
	if not payment_id:
		u = str(uuid4())
		payment_id = f'ag_{u}'
	method = body.get("method")
	if not method:
		return jsonify({"error": "'method' field required"}), 400

	try:
		res = update_payment(database, oid, method, payment_id)
		if res == 0:
			return jsonify({"message": f'Successfully updated order {oid}'}), 200

		if res == 1:
			error = f"Order {oid} doesn't exist"
		elif res == 2:
			error = f"Order {oid} is already payed"
		elif res ==3:
			error = f"Order {oid} was already shipped"
		elif res == 4:
			error = f"{method} is not supported method of payment. Supported methods are: 'Card', 'Cash', 'Paypal', 'GooglePay', 'ApplePay', 'Link', 'Stripe', 'Other'"

		return jsonify({"error": error}), 400

	except Exception as e:
		print(str(e), "payment")
		return jsonify({"error": "Something went wrong"}), 500



if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)







