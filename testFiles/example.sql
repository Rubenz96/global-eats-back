select
    uu.use_name as name,
    uu.use_lastname as lastname,
    uu.use_username as email,
    (
        select
            json_agg(t)
        from
            (
                select
                    per_id as id,
                    concat(per_typ_description, ' | ', per_description) as name
                from
                    "user".use_user_permission uup
                    join config.con_permission cp on cp.per_id = uup.use_per_per_id
                    and uup.use_per_use_id = uu.use_id
                    and uup.use_per_sta_id = 9
                    and cp.per_sta_id = 7
                    join config.con_permission_type cpt on cpt.per_typ_id = cp.per_per_typ_id
            ) as t
    ) as permissions
from
    "user".use_user uu
where
    uu.use_id_ = '${user_id_}'