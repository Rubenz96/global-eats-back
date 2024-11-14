export const selUseUserLogin = `select
                                    uu.use_id,
                                    uu.use_name,
                                    uu.use_lastname,
                                    uu.use_username,
                                    uup.pas_value,
                                    uu.use_id_,
                                    (
                                        select
                                            json_agg(t)
                                        from
                                            (
                                                select
                                                    uuut.use_use_typ_use_typ_id as user_typ_id
                                                from
                                                    "user".use_user_user_type uuut
                                                where
                                                    uuut.use_use_typ_use_id = uu.use_id
                                                    and uuut.use_use_typ_sta_id = 9
                                            ) as t
                                    ) as user_types
                                from
                                    "user".use_user uu
                                    join "user".use_password uup on uup.pas_use_id = uu.use_id
                                    and uu.use_sta_id = 1
                                    and uup.pas_sta_id = 5
                                where
                                    uu.use_username = $1;`;

export function selUser({ username = '', password = '' }) {
    let queryX = `select
                        use_id,
                        use_id_,
                        use_name,
                        use_lastname,
                        use_username,
                        "user".check_bcrypt_hash('${password}',pas_value) is_valid
                    from
                        "user".use_user uu
                        join "user".use_password up on up.pas_use_id = uu.use_id
                        and uu.use_sta_id = 1
                        and up.pas_sta_id = 5
                        and uu.use_username = '${username}';`;
    //console.log(queryX)
    return queryX;
}

export const insLogin = `INSERT INTO
                            "user".use_login (
                                log_use_id,
                                log_token
                            )
                        VALUES
                            (
                                $1,
                                $2
                            );`;

export const updDeacToken = `UPDATE
                                    "user".use_login
                                SET
                                    log_sta_id = 16,
                                    log_logout_date = now()
                                WHERE
                                    log_id in (
                                        select
                                            ll.log_id
                                        from
                                            "user".use_login ll
                                            left join meeting.log_system ls on ls.log_sys_log_id = ll.log_id
                                            and ls.log_sys_date + interval '1 hours' > now ()
                                        where
                                            ll.log_sta_id = 15
                                            and ls.log_sys_id is null
                                    );`;

export const updRevToken = `UPDATE
                                    "user".use_login
                                SET
                                    log_sta_id = 17
                                WHERE
                                    log_id in (
                                        select
                                            ll.log_id
                                        from
                                            "user".use_login ll
                                        where
                                            ll.log_sta_id = 15
                                            and ll.log_revoke_date < now()
                                    );`;

export const updDeacSpecToken = `UPDATE
                                        "user".use_login
                                    SET
                                        log_sta_id = 16,
                                        log_logout_date = now()
                                    WHERE
                                        log_token = $1;`;


export const selSidebarConfig = `select
                                    cs.sid_route,
                                    cs.sid_icon,
                                    cs.sid_user_restriction,
                                    (
                                        select
                                            array_agg(sid_use_typ_use_typ_id)
                                        from
                                            meeting.con_sid_user_type csut
                                        where
                                            csut.sid_use_typ_sid_id = cs.sid_id
                                    ) as user_types,
                                    (
                                        select
                                            jsonb_agg(t)
                                        from
                                            (
                                                select
                                                    cs2.sid_route,
                                                    cs2.sid_icon,
                                                    cs2.sid_user_restriction,
                                                    (
                                                        select
                                                            array_agg(csut2.sid_use_typ_use_typ_id)
                                                        from
                                                            meeting.con_sid_user_type csut2
                                                        where
                                                            csut2.sid_use_typ_sid_id = cs2.sid_id
                                                    ) as user_types
                                                from
                                                    meeting.con_sidebar cs2
                                                where
                                                    cs2.sid_sid_id = cs.sid_id
                                            ) t
                                    ) as subsidebar
                                    from
                                    meeting.con_sidebar cs;`;

export function updUsePassword({ username = '', use_id = 0 }) {
    let filter = username ? ` and uu.use_username = '${username}' ` : `  and uu.use_id = ${use_id} `;
    let queryX = `UPDATE
                        "user".use_password
                    SET
                        pas_sta_id = 6
                    WHERE
                        pas_use_id in (
                            select
                                uu.use_id
                            from
                                "user".use_user uu
                            where
                                uu.use_sta_id = 1
                                ${filter}
                            limit
                                1
                        )
                        and pas_sta_id = 5 
                    returning pas_sta_id;`;
    console.log(queryX);

    return queryX;
}

export function insUsePassword({ username = '', newPass = '', use_id = 0 }) {
    let filter = username ? ` and uu.use_username = '${username}' ` : `  and uu.use_id = ${use_id} `;
    let queryX = `INSERT INTO
                        "user".use_password (pas_value, pas_use_id) (
                            select
                                "user".generate_bcrypt_hash('${newPass}') as pas_value,
                                uu.use_id as pas_use_id
                            from
                                "user".use_user uu
                                left join "user".use_password up on up.pas_sta_id = 5
                                and up.pas_use_id = uu.use_id
                            where
                                uu.use_sta_id = 1
                                ${filter}
                                and up.pas_id is null
                            limit
                                1
                        ) returning (
                                        select
                                            uu.use_username
                                        from
                                            "user".use_user uu
                                        where
                                            uu.use_id = pas_use_id
                                    ) as mail;`;
    return queryX;
}


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