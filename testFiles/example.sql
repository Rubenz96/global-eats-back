INSERT INTO
    "user".use_user_permission (use_per_per_id, use_per_use_id)
select
    distinct on (cp.per_id) per_id as use_per_per_id,
    ${use_id} as use_per_use_id
from
    config.con_permission cp
where
    cp.per_sta_id = 7
    and cp.per_id in (${permissions});