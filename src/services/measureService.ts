import pool from '../db';

class MeasureService {
  async createMeasure(data: any) {
    // Lógica para criar uma nova medida
    const { customer_code, measure_datetime, measure_type, measure_value, image_url } = data;

    // Verifique se já existe uma leitura no mês atual
    const existingMeasure = await pool.query(
      `SELECT * FROM measures WHERE customer_code = $1 AND measure_type = $2 AND date_trunc('month', measure_datetime) = date_trunc('month', $3)`,
      [customer_code, measure_type, measure_datetime]
    );

    if (existingMeasure.rows.length > 0) {
      throw { status: 409, code: 'DOUBLE_REPORT', message: 'Leitura do mês já realizada' };
    }

    const result = await pool.query(
      `INSERT INTO measures (uuid, customer_code, measure_datetime, measure_type, measure_value, image_url) 
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [customer_code, measure_datetime, measure_type, measure_value, image_url]
    );

    return result.rows[0];
  }

  async confirmMeasure(data: any) {
    const { measure_uuid, confirmed_value } = data;

    const existingMeasure = await pool.query(`SELECT * FROM measures WHERE uuid = $1`, [measure_uuid]);

    if (existingMeasure.rows.length === 0) {
      throw { status: 404, code: 'MEASURE_NOT_FOUND', message: 'Leitura não encontrada' };
    }

    if (existingMeasure.rows[0].has_confirmed) {
      throw { status: 409, code: 'CONFIRMATION_DUPLICATE', message: 'Leitura já confirmada' };
    }

    await pool.query(
      `UPDATE measures SET measure_value = $1, has_confirmed = TRUE WHERE uuid = $2`,
      [confirmed_value, measure_uuid]
    );
  }

  async listMeasures(customer_code: string, measure_type?: string) {
    let query = `SELECT * FROM measures WHERE customer_code = $1`;
    const params: any[] = [customer_code];

    if (measure_type) {
      query += ` AND LOWER(measure_type) = LOWER($2)`;
      params.push(measure_type);
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      throw new Error('Nenhuma leitura encontrada');
    }

    return result.rows;
  }
}

export default new MeasureService();
