import { log } from "../../config/log";

export function selUserSideBarPermission({ use_id = 0 }) {
    let queryX = `select
                        *
                    from
                        (
                            select
                                distinct on (sid_com_id_) *
                            from
                                (
                                    --Rutas sin sumbcomponentes
                                    select
                                        sid_com_id_,
                                        sid_com_title,
                                        sid_com_url,
                                        sid_com_icon,
                                        psc.sid_com_weight,
                                        pag_url,
                                        null as subpages
                                    from
                                        platform.pla_sidebar_component psc
                                        join platform.pla_page pp on pp.pag_id = psc.sid_com_url
                                        and psc.sid_com_sta_id = 24
                                        and sid_com_sid_com_id is null
                                        join platform.pla_page_permission ppp on ppp.pag_per_pag_id = pp.pag_id
                                        and ppp.pag_per_sta_id = 26
                                        join config.con_permission cp on cp.per_id = ppp.pag_per_per_id
                                        and cp.per_sta_id = 7
                                        join "user".use_user_permission uup on uup.use_per_per_id = cp.per_id
                                        and uup.use_per_sta_id = 9
                                        and uup.use_per_use_id = ${use_id}
                                    union
                                    all --Rutas con sumbcomponentes
                                    select
                                        psc.sid_com_id_,
                                        psc.sid_com_title,
                                        psc.sid_com_url,
                                        psc.sid_com_icon,
                                        psc.sid_com_weight,
                                        null as pag_url,
                                        (
                                            select
                                                jsonb_agg(t)
                                            from
                                                (
                                                    select
                                                        psc2.sid_com_id_,
                                                        psc2.sid_com_title,
                                                        psc2.sid_com_url,
                                                        psc2.sid_com_icon,
                                                        psc2.sid_com_weight,
                                                        pp2.pag_url
                                                    from
                                                        "user".use_user_permission uup2
                                                        join config.con_permission cp2 on cp2.per_id = uup2.use_per_per_id
                                                        and cp2.per_sta_id = 7
                                                        and uup2.use_per_use_id = ${use_id}
                                                        and uup2.use_per_sta_id = 9
                                                        join platform.pla_page_permission ppp2 on ppp2.pag_per_per_id = cp2.per_id
                                                        and ppp2.pag_per_sta_id = 26
                                                        join platform.pla_page pp2 on pp2.pag_id = ppp2.pag_per_pag_id
                                                        and pp2.pag_sta_id = 22
                                                        join platform.pla_sidebar_component psc2 on psc2.sid_com_url = pp2.pag_id
                                                        and psc2.sid_com_sid_com_id = psc.sid_com_id
                                                        and psc2.sid_com_sta_id = 24
                                                    group by
                                                        psc2.sid_com_id_,
                                                        psc2.sid_com_title,
                                                        psc2.sid_com_url,
                                                        psc2.sid_com_icon,
                                                        psc2.sid_com_weight,
                                                        pp2.pag_url
                                                    order by
                                                        psc2.sid_com_weight desc
                                                ) t
                                        ) as subpages
                                    from
                                        platform.pla_sidebar_component psc
                                        join platform.pla_sidebar_component psc2 on psc2.sid_com_sid_com_id = psc.sid_com_id
                                        and psc.sid_com_sta_id = 24
                                        and psc2.sid_com_sta_id = 24
                                ) t
                        ) t2
                    order by
                        sid_com_weight desc`;
    // log({ value: queryX });
    return queryX;

}


export const selUser = `select
                        uu.use_name as "name",
                        uu.use_lastname as lastname,
                        uu.use_username as username
                    from
                        "user".use_user uu
                    where
                        uu.use_id_ = $1
                        and uu.use_sta_id = 1;`;


export const updUser = `UPDATE
                            "user".use_user
                            SET
                                use_name = $1,
                                use_lastname = $2,
                                use_username = $3
                            WHERE
                            use_id_ = $4;`;


export function selPageConfig({ use_id = 0 }) {
    let queryX = `select
                        distinct on (ppc.pag_com_id_) ppc.pag_com_id_,
                        ppc.pag_com_description as comp_description,
                        ppc.pag_com_key as comp_key
                    from
                        platform.pla_page_component ppc 
                        join "user".use_user_permission uup on uup.use_per_sta_id = 9
                        and ppc.pag_com_sta_id = 36
                        and uup.use_per_per_id = any(ppc.pag_com_permission)
                        and uup.use_per_use_id = ${use_id};`;
    return queryX;
}

export function selUsers(filter = '') {
    filter = filter ? filter.toLowerCase() : '';
    let filtro = filter ? ` (lower(use_name) like '%${filter}%' or lower(use_lastname) like '%${filter}%' or lower(use_username) like '%${filter}%') ` : ` true `;
    let queryX = `select
                        uu.use_id,
                        concat(uu.use_name, ' ', uu.use_lastname) as name,
                        uu.use_sta_id,
                        uu.use_username,
                        uu.use_creation_date,
                        upper(cs.sta_value) sta_value
                    from
                        "user".use_user uu
                        join config.con_status cs on cs.sta_id = uu.use_sta_id
                    where 
                        ${filtro}
                    order by
                        uu.use_name asc
                    LIMIT
                        $1 OFFSET (($2 - 1) * $1);`;
    console.log(queryX);
    return queryX;
}

export function countUsers(filter = '') {
    filter = filter ? filter.toLowerCase() : '';
    let filtro = filter ? ` (lower(use_name) like '%${filter}%' or lower(use_lastname) like '%${filter}%' or lower(use_username) like '%${filter}%') ` : ` true `;
    let queryX = `select
                        quantity,
                        (
                        case
                            when quantity / $1 :: numeric > round(quantity / $1, 0) then round(quantity / $1, 0) + 1
                            else round(quantity / $1, 0)
                        end
                        ) as pages
                    from
                        (
                            select
                                count(*) as quantity
                            from
                                "user".use_user uu
                                join config.con_status cs on cs.sta_id = uu.use_sta_id
                            where 
                                ${filtro}
                        ) t;`;
    return queryX;
}