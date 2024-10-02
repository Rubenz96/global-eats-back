import { Pool } from 'pg';

//////////////////////////////////////////////////////////////////
////////////////////////    desarrollo    ////////////////////////
//////////////////////////////////////////////////////////////////

export const pool = new Pool({
  user: 'globaleats',
  host: 'ec2-44-196-34-68.compute-1.amazonaws.com',
  database: 'develop',
  password: '%Global.2024%',
  port: 5432,
});

export const poolSelect = new Pool({
  user: 'globaleats',
  host: 'ec2-44-196-34-68.compute-1.amazonaws.com',
  database: 'develop',
  password: '%Global.2024%',
  port: 5432,
});

//////////////////////////////////////////////////////////////////
////////////////////////    Produccion    ////////////////////////
//////////////////////////////////////////////////////////////////

// export const pool = new Pool({
//   user: 'globaleats',
//   host: 'ec2-44-196-34-68.compute-1.amazonaws.com',
//   database: 'develop',
//   password: '%Global.2024%',
//   port: 5432,
// });

// export const poolSelect = new Pool({
//   user: 'globaleats',
//   host: 'ec2-44-196-34-68.compute-1.amazonaws.com',
//   database: 'develop',
//   password: '%Global.2024%',
//   port: 5432,
// });
