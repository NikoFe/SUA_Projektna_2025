from uuid import uuid4
from hashlib import sha256

def get_user(db, email):
	cursor = db.cursor()
	sql = "SELECT `idUser`, `name`, `surname`, `email`, `password_hash` from user where email = %s;";
	cursor.execute(sql, (email, ))
	
	results = cursor.fetchall()
	return results

def fetch_session_data(db, sessionID):
	cursor = db.cursor()

	sql = "SELECT idUser, name, surname, email FROM user JOIN session ON fk_user = idUser where session_uuid = %s AND ttl > CURRENT_TIMESTAMP;"
	cursor.execute(sql,  (sessionID, ))	

	res = cursor.fetchall()

	if len(res) == 0:
		return None
	else:
		user = res[0]
		return {
			"id": user[0],
			"name": user[1],
			"surname": user[2],
			"email": user[3],
			"session_id": sessionID
		} 


def fetch_auth_user(db, email, password):
	cursor = db.cursor()
	passwd = sha256(password.encode('utf-8')).hexdigest()
	sql  = "SELECT idUser, name, surname, email FROM user WHERE email = %s and password_hash = %s;"
	cursor.execute(sql, (email, passwd))
	res = cursor.fetchall()
	if len(res) == 0:
		return None

	user = res[0]
	sid = str(uuid4())


	sqli = "INSERT INTO session (`idSession`, `session_uuid`, `fk_user`) VALUES (NULL, %s, %s);"
	cursor.execute(sqli, (sid, user[0]))


	db.commit()

	return {
		"id": user[0],
		"name": user[1],
		"surname": user[2],
		"email": user[3],
		"sessionID": sid
	}

def insert_into_user(db, name, surname, email, password):
	cursor = db.cursor()
	passwd = sha256(password.encode('utf-8')).hexdigest()

	sql = "INSERT INTO user (`idUser`, `name`, `surname`, `email`, `password_hash`) VALUES(NULL, %s, %s, %s, %s);"
	cursor.execute(sql, (name, surname, email, passwd, ))
	db.commit()

	sid = str(uuid4())

	result_id = cursor.lastrowid


	sqli = "INSERT INTO session (`idSession`, `session_uuid`, `fk_user`) VALUES (NULL, %s, %s);"
	cursor.execute(sqli, (sid, result_id))

	db.commit()


	return sid