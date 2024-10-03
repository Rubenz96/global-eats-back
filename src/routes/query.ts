import { log } from "../../config/log";

export const insLogMiddleware = `INSERT INTO
                                        logger.log_system (
                                            log_sys_route,
                                            log_sys_route_method,
                                            log_sys_origin,
                                            log_sys_log_id
                                        )
                                    VALUES
                                        (
                                            $1,
                                            $2,
                                            $3,
                                            (
                                                select
                                                    ll.log_id
                                                from
                                                    "user".use_login ll
                                                where
                                                    ll.log_token = $4
                                                limit
                                                    1
                                            )
                                        );`;

export const selRoutes = `select
                                ag.gat_uri,
                                ag.gat_token_valid,
                                ag.gat_permission_valid,
                                ag.gat_condition_valid,
                                crt.req_typ_method,
                                (
                                    select
                                        jsonb_agg(t)
                                    from
                                        (
                                            select
                                                agc.gat_con_condition,
                                                gat_con_aditional
                                            from
                                                api.api_gateway_condition agc
                                            where
                                                ag.gat_id = agc.gat_con_gat_id
                                                and agc.gat_con_sta_id = 20
                                            order by gat_con_weight desc
                                        ) t
                                ) conditions
                            from
                                api.api_gateway ag
                                join config.con_request_type crt on crt.req_typ_id = ag.gat_req_typ_id
                            where
                                ag.gat_sta_id = 11;`;


export function selApi({ token = '', url = '', httpMethod = '' }) {
    let queryX = `select
                    gat_uri,
                    gat_token_valid,
                    gat_permission_valid,
                    gat_condition_valid,
                    (
                        case
                            when gat_permission_valid = true
                            and gat_token_valid = true then (
                                case
                                    when (
                                        select
                                            count(*)
                                        from
                                            "user".use_user uu
                                            join "user".use_login ul on uu.use_id = ul.log_use_id
                                            join api.api_gateway_permission agp on agp.gat_per_gat_id = ag.gat_id
                                            and agp.gat_per_sta_id = 13
                                            and uu.use_sta_id = 1
                                            and ul.log_sta_id = 15
                                            and ul.log_deactivation_date > now()
                                            and ul.log_token = '${token}'
                                            join "user".use_user_permission uup on uup.use_per_per_id = agp.gat_per_per_id
                                            and uup.use_per_sta_id = 9
                                            and uu.use_id = uup.use_per_use_id
                                        limit
                                            1
                                    ) > 0 then true
                                    else false
                                end
                            )
                            else true
                        end
                    ) as has_permission,
                    (
                        select
                            ROW_TO_JSON(uu.*)
                        from
                            "user".use_user uu
                            join "user".use_login ul on uu.use_id = ul.log_use_id
                            and uu.use_sta_id = 1
                            and ul.log_sta_id = 15
                            and ul.log_deactivation_date > now()
                            and ul.log_token = '${token}'
                        limit
                            1
                    ) as token_info
                from
                    api.api_gateway ag
                    join config.con_request_type crt on crt.req_typ_id = ag.gat_req_typ_id
                where
                    ag.gat_uri = '${url}'
                    and upper('${httpMethod}') = crt.req_typ_method
                    and gat_sta_id = 11;`;
    // log({value: queryX });
    return queryX;

}