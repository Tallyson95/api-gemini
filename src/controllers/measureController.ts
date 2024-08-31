import { Request, Response } from 'express';
import measureService from '../services/measureService';

class MeasureController {
  async uploadMeasure(req: Request, res: Response) {
    try {
      const measure = await measureService.createMeasure(req.body);
      res.status(200).json(measure);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error_code: 'INVALID_DATA', error_description: err.message });
    }
  }

  async confirmMeasure(req: Request, res: Response) {
    try {
      await measureService.confirmMeasure(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      const err = error as any;
      res.status(err.status || 400).json({ error_code: err.code, error_description: err.message });
    }
  }

  async listMeasures(req: Request, res: Response) {
    try {
      const measures = await measureService.listMeasures(req.params.customer_code, req.query.measure_type as string);
      res.status(200).json({ customer_code: req.params.customer_code, measures });
    } catch (error) {
      const err = error as Error;
      res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: err.message });
    }
  }
}

export default new MeasureController();
