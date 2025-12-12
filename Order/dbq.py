def insert_order(db, items, user, address):
	cursor = db.cursor()

	names = "', '".join([x["name"] for x in items])
	sqlii = f"SELECT idItem, price from Items WHERE name in ('{names}');"

	cursor.execute(sqlii);
	results_ii = []

	# Optionally, fetch additional data from menu 

	res_ii = cursor.fetchall()
	for i, item in enumerate(res_ii):
		results_ii.append({
			"id": item[0],
			"quantity": items[i]["quantity"]
		})



	sql_u = "SELECT idCustomer from Customers WHERE email = %s;"
	cursor.execute(sql_u, (user["email"], ))
	res = cursor.fetchone()
	if len(res) == 0: # new customer 
		sql_iu = "INSERT INTO Customers (`name`, `surname`, `email`) VALUES (%s, %s, %s);"
		cursor.execute(sql, (user["name"], user["surname"], user["email"]))
		db.commit()
		id_ = cursor.lastrowid
	else:
		id_ = res[0]
	

	sql = "INSERT INTO Orders(`idOrder`, `status`, `shipping_address`, `fk_customer`) VALUES (NULL, 'placed', %s, %s);"
	cursor.execute(sql, (address, id_ ))
	db.commit()
	idOrder = cursor.lastrowid

	print(idOrder)


	injection = []
	for i in results_ii: 
		injection.append(f"({idOrder}, {i['id']}, {i['quantity']})")

	injection = ', '.join(injection)


	sql_it  = f"INSERT INTO order_has_item(`fk_order`, `fk_item`, `quantity`) VALUES {injection}";
	cursor.execute(sql_it)
	db.commit()

	return idOrder
	
	
def fetch_shipped_orders(db):
	cursor = db.cursor()

	sql = """ 
		SELECT c.Name, c.Surname, c.Email, COUNT(idOrder), SUM(price) FROM Orders
			JOIN Customers c on fk_customer = idCustomer
			JOIN order_has_item ON fk_order = idOrder
			JOIN Items on fk_item = idItem
		GROUP BY idOrder
		WHERE status = `payed`;
	"""

	cursor.execute(sql)

	res = cursor.fetchall()

	resultt = [] 

	for row in res:
		resultt.append({
			"name": row[0],
			"surname": row[1],
			"email": row[2],
			"quantity": row[3],
			"price": row[4]
		})

	return resultt


def fetch_order(db, oid):
	cursor = db.cursor()
	sql = """ 
		SELECT I.name, I.price, c.name, c.surname, c.email, ohi.quantity, o.placed_at from Items I 
			JOIN order_has_item ohi ON fk_item = idItem 
			JOIN Orders o on idOrder = fk_order
			JOIN Customers c ON fk_customer = idCustomer
	WHERE fk_order = %s
	"""
	cursor.execute(sql, (oid, ))

	res = cursor.fetchall()

	if not len(res) > 0:
		return None 
	
	user = {
		"name": res[0][2],
		"surname": res[0][3],
		"email": res[0][4]
	}

	order = {
		"id": oid,
		"customer": user,
		"items": [],
		"placed_at": res[0][6]
	}

	for item in res:
		order["items"].append({
			"name": item[0],
			"price": item[1],
			"quantity": item[5]
		})

	return order

def fetch_orders(db):
	cursor = db.cursor()

	def split_orders(orders):
		groups = {}	
		for item in orders:
			group_id = item[0]
			groups.setdefault(group_id, []).append(item)
		result = list(groups.values())
		return result	    	

	sql = """ 
		SELECT o.idOrder, I.name, I.price, c.name, c.surname, c.email, ohi.quantity, o.placed_at from Items I 
			JOIN order_has_item ohi ON fk_item = idItem 
			JOIN Orders o on idOrder = fk_order
			JOIN Customers c ON fk_customer = idCustomer
	"""

	cursor.execute(sql)
	res = cursor.fetchall()

	order_split = split_orders(res)

	orders = []

	for split in order_split:
		order = {
				"id": split[0][0],
				"user": {"name": split[0][3], "surname": split[0][4], "email": split[0][5]},
				"placed_at": split[0][7],
				"items": []
			}
		for item in split:
			order["items"].append({
			"name": item[1],
			"price": item[2],
			"quantity": item[6]
		})
		orders.append(order)

	return orders


def update_shipment(database, oid):
	cursor = database.cursor()
	sql_v = "SELECT idOrder, status FROM Orders where idOrder = %s"
	cursor.execute(sql_v, (oid, ))
	res = cursor.fetchall()
	if not len(res):
		return 1
	if res[0][1] == "shipped":
		return 2
	if res[0][1] != 'payed':
		return 3

	sql = "UPDATE Orders set shipped_at = CURRENT_TIMESTAMP, status = 'shipped' WHERE idOrder = %s;"

	cursor.execute(sql, (oid, ))

	database.commit()
	return 0

def update_shipment(database, oid):
	cursor = database.cursor()
	sql_v = "SELECT idOrder, status FROM Orders where idOrder = %s"
	cursor.execute(sql_v, (oid, ))
	res = cursor.fetchall()
	if not len(res):
		return 1
	if res[0][1] == "shipped":
		return 2
	if res[0][1] != 'payed':
		return 3

	sql = "UPDATE Orders set shipped_at = CURRENT_TIMESTAMP, status = 'shipped' WHERE idOrder = %s;"

	cursor.execute(sql, (oid, ))

	database.commit()
	return 0

def update_payment(database, oid, method, payment_id):
	cursor = database.cursor()
	sql_v = "SELECT idOrder, status, fk_customer FROM Orders where idOrder = %s"
	
	if method not in ['Card', 'Cash', 'Paypal', 'GooglePay', 'ApplePay', 'Link', 'Stripe', 'Other']:
		return 4


	cursor.execute(sql_v, (oid, ))
	res = cursor.fetchall()
	if not len(res):
		return 1
	
	if res[0][1] == "payed":
		return 2
	
	if res[0][1] == 'shipped':
		return 3


	sql_s = """SELECT price, quantity FROM Items
				JOIN order_has_item ON fk_item = idItem
				JOIN Orders ON fk_order = idOrder
				WHERE idOrder = %s;
			"""

	cursor.execute(sql_s, (oid, ))

	reslt = cursor.fetchall()
	amount = 0

	for item in reslt:
		print(item)
		amount += item[0]*item[1]


	sql_p = "INSERT INTO Payments (`idPayment`, `amount`, `method`, `external_payment_id`) VALUES (NULL, %s, %s, %s);"
	cursor.execute(sql_p, (amount, method, payment_id))
	database.commit()
	pid = cursor.lastrowid
	print("new payment id", pid)

	sql = "UPDATE Orders SET status='payed', payed_at=CURRENT_TIMESTAMP, fk_payment=%s;"
	cursor.execute(sql, (pid, ))

	return 0


