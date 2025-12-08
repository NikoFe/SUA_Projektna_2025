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

	print(injection)

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


def update_order_items(db, items):
	names = [x["name"] for x in items]
