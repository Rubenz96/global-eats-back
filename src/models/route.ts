
export interface Route {
    gat_uri: string;
    gat_token_valid: boolean;
    gat_permission_valid: boolean;
    gat_condition_valid: boolean;
    req_typ_method: string;
    conditions: Condition[];
}

export interface Condition {
    gat_con_aditional: string | null;
    gat_con_condition: string;
}