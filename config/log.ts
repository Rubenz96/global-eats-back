////////////////////////////////////////////////////////////////////////
///////////////////////////////Producción///////////////////////////////
////////////////////////////////////////////////////////////////////////
import log4js from 'log4js';
import path from 'path';

log4js.configure({
  appenders: {
    general: { type: 'dateFile', pattern: '.yyyy-MM-dd', filename: path.join(__dirname, "../logs/general/general.log") },
  },
  categories: {
    general: { appenders: ["general"], level: "info" },
    default: { appenders: ["general"], level: "info" }
  },
});

const generalLog = log4js.getLogger("general");

export function log({ type = '', route = '', method = '', method_type = '', description = '', use_id = 0, value }: any): void {
  let var_type = typeof value;
  let message = '';
  // console.log(var_type);
  if(var_type.toLowerCase() == 'object'){
    message = JSON.stringify(value);
  }else if(var_type.toLowerCase() == 'boolean'){
    message = value.toString();
  }else if(var_type.toLowerCase() == 'string'){
    message = value;
  }else{
    message = value;
  }
  console.log('---------------------------------------------');
  console.log(`USUARIO  - ${use_id ? use_id : 'SIN INFORMACIÓN'}`);
  console.log(`TIPO  - ${type ? type : 'INFO'}`);
  console.log(`RUTA  - ${route ? route : 'SIN INFORMACIÓN'}`); 
  console.log(`METODO  - ${method ? method : 'SIN INFORMACIÓN'}`);
  console.log(`TIPO METODO  - ${method_type ? method_type : 'SIN INFORMACIÓN'}`);
  console.log(`DESCRIPCION  - ${description ? description : 'SIN INFORMACIÓN'}`);
  console.log(`VALOR  - ${message ? message : 'SIN INFORMACIÓN'}`);

  generalLog.info('---------------------------------------------');
  generalLog.info(`USUARIO  - ${use_id ? use_id : 'SIN INFORMACIÓN'}`);
  generalLog.info(`TIPO  - ${type ? type : 'INFO'}`);
  generalLog.info(`RUTA  - ${route ? route : 'SIN INFORMACIÓN'}`);
  generalLog.info(`METODO  - ${method ? method : 'SIN INFORMACIÓN'}`);
  generalLog.info(`TIPO METODO  - ${method_type ? method_type : 'SIN INFORMACIÓN'}`);
  generalLog.info(`DESCRIPCION  - ${description ? description : 'SIN INFORMACIÓN'}`);
  generalLog.info(`VALOR  - ${message ? message : 'SIN INFORMACIÓN'}`);
}