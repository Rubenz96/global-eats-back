select
    per_id as id,
    concat(per_typ_description, ' | ', per_description) as name
from
    config.con_permission cp
    join config.con_permission_type cpt on cpt.per_typ_id = cp.per_per_typ_id
    and cp.per_sta_id = 7
order by
    cpt.per_typ_description asc,
    cp.per_description asc;