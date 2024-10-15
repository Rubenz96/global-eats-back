import { log } from "../../config/log";

// export function selUserSideBarPermission({ use_id = 0 }) {
//     let queryX = ``;
//     // log({ value: queryX });
//     return queryX;

// }

export const insProduct = `INSERT INTO
                                product.pro_product (
                                    pro_name,
                                    pro_description
                                )
                            VALUES
                                (
                                    $1,
                                    $2
                                ) returning pro_id;`;

export const insProductPrice = `INSERT INTO
                                    product.pro_price_history (
                                        pri_his_pro_id,
                                        pri_his_price,
                                        pri_his_start_date,
                                        pri_his_end_date,
                                        pri_his_created_by
                                    )
                                VALUES
                                ($1, $2, $3, $4, $5);`;
                            
export const insProductInventory = `INSERT INTO
                                    product.pro_inventory (inv_pro_id, inv_quantity, inv_last_update)
                                VALUES
                                ($1, $2, now());`;
                                