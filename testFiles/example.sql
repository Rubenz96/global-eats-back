INSERT INTO
	product.pro_inventory (inv_pro_id, inv_quantity, inv_last_update)
VALUES
($1, $2, now());