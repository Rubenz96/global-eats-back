
export function selPageConfig({ use_id = 0, url = '' }) {
    let queryX = `select
                        distinct on (ppc.pag_com_id_) ppc.pag_com_id_,
                        ppc.pag_com_description as comp_description,
                        ppc.pag_com_key as comp_key
                    from
                        platform.pla_page pp
                        join platform.pla_page_component ppc on ppc.pag_com_pag_id = pp.pag_id
                        and pp.pag_sta_id = 22
                        and ppc.pag_com_sta_id = 36
                        join "user".use_user_permission uup on uup.use_per_sta_id = 9
                        and uup.use_per_per_id = any(ppc.pag_com_permission)
                        and uup.use_per_use_id = ${use_id}
                        and pp.pag_url = '${url}';`;
    return queryX;
}