import { log } from "../../config/log";

// export function selUserSideBarPermission({ use_id = 0 }) {
//     let queryX = ``;
//     // log({ value: queryX });
//     return queryX;

// }

export const insClient = `INSERT INTO
                                product.pro_product (
                                    pro_name,
                                    pro_description
                                )
                            VALUES
                                (
                                    $1,
                                    $2
                                ) returning pro_id;`;

export const insClientPrice = `INSERT INTO
                                    product.pro_price_history (
                                        pri_his_pro_id,
                                        pri_his_price,
                                        pri_his_start_date,
                                        pri_his_end_date,
                                        pri_his_created_by
                                    )
                                VALUES
                                ($1, $2, $3, $4, $5);`;

export const insClientInventory = `INSERT INTO
                                    product.pro_inventory (inv_pro_id, inv_quantity, inv_last_update)
                                VALUES
                                ($1, $2, now());`;


export function selClients(filter = '') {
    filter = filter ? filter.toLowerCase() : '';
    let filtro = filter ? ` (lower(pro_name) like '%${filter}%' or lower(cs.sta_value) like '%${filter}%' or lower(pro_description) like '%${filter}%') ` : ` true `;
    let queryX = `select
                        pro_id,
                        pro_name,
                        pro_description,
                        pro_id_,
                        inv_quantity,
                        pri_his_price,
                        upper(cs.sta_value) as sta_value
                    from
                        product.pro_product pp
                        join config.con_status cs on cs.sta_id = pp.pro_sta_id
                        left join product.pro_inventory pi2 on pi2.inv_pro_id = pp.pro_id
                        left join product.pro_price_history pph on pph.pri_his_pro_id = pp.pro_id
                        and now() :: date between pph.pri_his_start_date
                        and pph.pri_his_end_date
                    where 
                        ${filtro}
                    order by
                        pp.pro_name asc
                    LIMIT
                        $1 OFFSET (($2 - 1) * $1);`;
                        console.log(queryX);
                        return queryX;
}

export function countClients(filter ='') {
    filter = filter ? filter.toLowerCase() : '';
    let filtro = filter ? ` (lower(pro_name) like '%${filter}%' or lower(cs.sta_value) like '%${filter}%' or lower(pro_description) like '%${filter}%') ` : ` true `;
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
                                product.pro_product pp
                                join config.con_status cs on cs.sta_id = pp.pro_sta_id
                                left join product.pro_inventory pi2 on pi2.inv_pro_id = pp.pro_id
                                left join product.pro_price_history pph on pph.pri_his_pro_id = pp.pro_id
                                and now() :: date between pph.pri_his_start_date
                                and pph.pri_his_end_date
                            where 
                                ${filtro}
                        ) t;`;
    return queryX;
}

export function updateClient({use_id = 0, pro_id = 0, comment = 'UPDATE'}) {
    let queryX = `INSERT INTO
                        product.pro_product_history (
                            pro_his_old_price,
                            pro_his_new_price,
                            pro_his_use_id,
                            pro_his_pro_id,
                            pro_his_comment
                        )
                    VALUES
                    (
                            '{}' :: json,
                            '{}' :: json,
                            0,
                            0,
                            '' :: character varying
                        );`;
    return queryX;
}

export const delClientQue = `UPDATE
                                product.pro_product
                            SET
                                pro_sta_id = 33
                            WHERE
                                pro_id_ = $1;`;