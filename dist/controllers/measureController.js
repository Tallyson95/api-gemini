var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import measureService from '../services/measureService';
class MeasureController {
    uploadMeasure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const measure = yield measureService.createMeasure(req.body);
                res.status(200).json(measure);
            }
            catch (error) {
                const err = error;
                res.status(400).json({ error_code: 'INVALID_DATA', error_description: err.message });
            }
        });
    }
    confirmMeasure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield measureService.confirmMeasure(req.body);
                res.status(200).json({ success: true });
            }
            catch (error) {
                const err = error;
                res.status(err.status || 400).json({ error_code: err.code, error_description: err.message });
            }
        });
    }
    listMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const measures = yield measureService.listMeasures(req.params.customer_code, req.query.measure_type);
                res.status(200).json({ customer_code: req.params.customer_code, measures });
            }
            catch (error) {
                const err = error;
                res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: err.message });
            }
        });
    }
}
export default new MeasureController();
