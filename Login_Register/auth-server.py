from flask import Flask, request, Response, jsonify
from functools import wraps
from dbq import *
import os
from dotenv import load_dotenv
import mysql.connector
app = Flask(__name__)


load_dotenv()
get = os.getenv

app = Flask(__name__)


MYSQL_HOST = get("MYSQL_HOST")
MYSQL_USER = get("MYSQL_USER")
MYSQL_PSWD = get("MYSQL_PASSWORD")
MYSQL_PORT = int(get("MYSQL_PORT"))
MYSQL_DATABASE = get("MYSQL_DATABASE")
HOST = get("HOST")
PORT = int(get("PORT"))
DEBUG = get("DEBUG").lower() in  ('true', '1')

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


@app.before_request
def handle_preflight():
	if request.method == "OPTIONS":
		res = Response()
		res.headers['X-Content-Type-Options'] = '*'
		return res


def log_access(action_type, target_table=None, target_id=None):
	def decorator(func):
		@wraps(func)
		def wrapper(*args, **kwargs):
			user_email = getattr(request, 'email', 'anonymous')  # Customize this
			ip = request.remote_addr
			ua = request.headers.get('User-Agent')

			sql = "INSERT INTO AccessLog (user_email, action_type, target_table, target_id, ip_address, user_agent) VALUES (%s, %s, %s, %s, %s, %s)"
			cursor = database.cursor()
			cursor.execute(sql, (user_email, action_type, target_table, target_id, ip, ua))
			database.commit()
			return func(*args, **kwargs)

		return wrapper
	return decorator


@app.route('/login', methods=['POST'])
@log_access(action_type="POST", target_table="user")
def login():
	body = request.get_json()
	email = body.get("email")
	password = body.get("password")

	if not email:
		return jsonify({"error": "Missing required parameter 'email'"}), 400

	if not password:
		return jsonify({"error": "Missing required parameter 'password'"}), 400
	
	try:
		user = fetch_auth_user(database, email, password)
		if user:
			return jsonify({'data': user}), 200
		return jsonify({'error': 'wrong credentials'}), 401
	except Exception as e:
		print(e)
		return jsonify({'error': "Something went wrong"}), 500



@log_access(action_type="POST", target_table="user")
@app.route('/register', methods=["POST"])
def create_user():
	body = request.get_json()
	name = body.get("name")
	surname = body.get("surname")
	email = body.get("email")
	password = body.get("password")
	
	if not email:
		return jsonify({"error": "Missing required parameter 'email'"}), 400
	if not name:
		return jsonify({"error": "Missing required parameter 'name'"}), 40
	if not surname:
		return jsonify({"error": "Missing required parameter 'surname'"}), 400
	if not password:
		return jsonify({"error": "Missing required parameter 'password'"}), 400

	try:
		sid = insert_into_user(database, name, surname, email, password);
		if not sid:
			return jsonify({'error': 'something went wrong'}), 500
		return jsonify({"data": sid}), 200

	except Exception as e:
		print(e)
		return jsonify({'error': "Something went wrong"}), 500
		

@log_access(action_type="POST", target_table="session")
@app.route('/session-login', methods=['POST'])
def session_login():
	body = request.get_json()
	sid = body.get("sessionID")

	if not sid:
		return jsonify({'error': "Missing required parameter 'session' "}), 400

	try:
		session = fetch_session_data(database, sessionID)
		if not session:
			return jsonify({'error': "invalid session"}), 401
		return jsonify({'data': session}), 200

	except Exception as e:
		print(e)
		return jsonify({'error': 'Something went wrong'}), 500		


if __name__ == "__main__":
	app.run(host=HOST, port=PORT, debug=DEBUG)