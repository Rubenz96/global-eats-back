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
    log({ value: queryX });
    return queryX;

}