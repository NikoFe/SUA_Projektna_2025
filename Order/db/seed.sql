-------------------------------------------------------
-- INSERT SAMPLE DATA
-------------------------------------------------------

-- Customers (3)
INSERT INTO Customers (name, surname, email) VALUES
('Liam', 'Novak', 'liam@example.com'),
('Emma', 'Kovacic', 'emma@example.com'),
('Noah', 'Horvat', 'noah@example.com');

-- Payments (3)
INSERT INTO Payments (amount, method, external_payment_id) VALUES
(19.99, 'Card', 'PAY_ABC123'),
(49.50, 'Paypal', 'PAY_XYZ789'),
(12.00, 'Cash', NULL);

-- Items (15)
INSERT INTO Items (name, descriptione, price) VALUES
('USB-C Cable', '1 meter durable braided cable', 9.9),
('Wireless Mouse', 'Ergonomic Bluetooth mouse', 24.5),
('Notebook', 'A5 sized notebook 120 pages', 3.5),
('Coffee Mug', 'Ceramic mug 300ml', 7.0),
('Bluetooth Speaker', 'Portable mini speaker', 29.9),
('Desk Lamp', 'LED desk lamp with dimmer', 19.5),
('Gaming Keyboard', 'RGB mechanical keyboard', 59.9),
('Water Bottle', 'Steel insulated 500ml', 12.0),
('Laptop Stand', 'Aluminum ergonomic stand', 27.5),
('HDMI Cable', '2 meters, high speed', 6.9),
('Phone Holder', 'Universal tripod mount', 8.0),
('Backpack', 'Water-resistant laptop bag', 34.0),
('Pen Set', 'Pack of 10 gel pens', 4.5),
('Sticky Notes', 'Pack of 6 colors', 2.5),
('USB Drive 64GB', 'High-speed storage', 14.9);

-- Orders (5)
-- Orders 1, 3, 5 paid; 2, 4 unpaid
INSERT INTO Orders (status, fk_customer, fk_payment, payed_at) VALUES
('payed', 1, 1, NOW()),   -- Order 1
('placed', 2, NULL, NULL), -- Order 2
('payed', 3, 2, NOW()),   -- Order 3
('placed', 1, NULL, NULL), -- Order 4
('payed', 2, 3, NOW());   -- Order 5

-- Order Items (assign items to all 5 orders)
INSERT INTO order_has_item (fk_order, fk_item) VALUES
-- Order 1
(1, 1),
(1, 4),
(1, 15),

-- Order 2
(2, 3),
(2, 10),
(2, 13),
(2, 14),

-- Order 3
(3, 2),
(3, 3),
(3, 7),
(3, 8),

-- Order 4
(4, 5),
(4, 9),
(4, 11),

-- Order 5
(5, 6),
(5, 12),
(5, 14),
(5, 2);




