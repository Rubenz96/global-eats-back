select
	pro_id,
	pro_name,
	pro_description,
	pro_id_,
	inv_quantity,
	pri_his_price
from
	product.pro_product pp
	join config.con_status cs on cs.sta_id = pp.pro_sta_id
	join product.pro_inventory pi2 on pi2.inv_pro_id = pp.pro_id
	left join product.pro_price_history pph on pph.pri_his_pro_id = pp.pro_id
	and now() :: date between pph.pri_his_start_date
	and pph.pri_his_end_date
where
	true 
	${filtro}
order by
	pp.pro_name asc
LIMIT
	$1 OFFSET (($2 - 1) * $1);