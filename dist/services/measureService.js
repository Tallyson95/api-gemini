var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../db';
class MeasureService {
    createMeasure(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lógica para criar uma nova medida
            const { customer_code, measure_datetime, measure_type, measure_value, image_url } = data;
            // Verifique se já existe uma leitura no mês atual
            const existingMeasure = yield pool.query(`SELECT * FROM measures WHERE customer_code = $1 AND measure_type = $2 AND date_trunc('month', measure_datetime) = date_trunc('month', $3)`, [customer_code, measure_type, measure_datetime]);
            if (existingMeasure.rows.length > 0) {
                throw { status: 409, code: 'DOUBLE_REPORT', message: 'Leitura do mês já realizada' };
            }
            const result = yield pool.query(`INSERT INTO measures (uuid, customer_code, measure_datetime, measure_type, measure_value, image_url) 
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`, [customer_code, measure_datetime, measure_type, measure_value, image_url]);
            return result.rows[0];
        });
    }
    confirmMeasure(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { measure_uuid, confirmed_value } = data;
            const existingMeasure = yield pool.query(`SELECT * FROM measures WHERE uuid = $1`, [measure_uuid]);
            if (existingMeasure.rows.length === 0) {
                throw { status: 404, code: 'MEASURE_NOT_FOUND', message: 'Leitura não encontrada' };
            }
            if (existingMeasure.rows[0].has_confirmed) {
                throw { status: 409, code: 'CONFIRMATION_DUPLICATE', message: 'Leitura já confirmada' };
            }
            yield pool.query(`UPDATE measures SET measure_value = $1, has_confirmed = TRUE WHERE uuid = $2`, [confirmed_value, measure_uuid]);
        });
    }
    listMeasures(customer_code, measure_type) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM measures WHERE customer_code = $1`;
            const params = [customer_code];
            if (measure_type) {
                query += ` AND LOWER(measure_type) = LOWER($2)`;
                params.push(measure_type);
            }
            const result = yield pool.query(query, params);
            if (result.rows.length === 0) {
                throw new Error('Nenhuma leitura encontrada');
            }
            return result.rows;
        });
    }
}
export default new MeasureService();
