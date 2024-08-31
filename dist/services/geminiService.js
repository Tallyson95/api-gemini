var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
const GEMINI_API_URL = 'https://ai.googleapis.com/v1alpha/gemini';
const geminiService = {
    extractMeasureValue(imageBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios.post(`${GEMINI_API_URL}/vision:analyze`, {
                    image: { content: imageBase64 },
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                return {
                    imageUrl: response.data.imageUrl,
                    measureValue: response.data.measureValue,
                    measureUuid: response.data.measureUuid,
                };
            }
            catch (error) {
                throw new Error('Erro ao chamar a API do Gemini: ' + (((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message));
            }
        });
    },
};
export default geminiService;
