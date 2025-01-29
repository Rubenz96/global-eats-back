select
    uu.use_id,
    concat(uu.use_name, ' ', uu.use_lastname) as nombre,
    uu.use_sta_id,
    uu.use_username,
    uu.use_creation_date,
    cs.sta_value
from
    "user".use_user uu
    join config.con_status cs on cs.sta_id = uu.use_sta_id