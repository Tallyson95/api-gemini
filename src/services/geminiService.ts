import axios from 'axios';

const GEMINI_API_URL = 'https://ai.googleapis.com/v1alpha/gemini';

const geminiService = {
  async extractMeasureValue(imageBase64: string) {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}/vision:analyze`,
        {
          image: { content: imageBase64 },
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        imageUrl: response.data.imageUrl,
        measureValue: response.data.measureValue,
        measureUuid: response.data.measureUuid,
      };
    } catch (error: any) {
      throw new Error('Erro ao chamar a API do Gemini: ' + (error.response?.data?.message || error.message));
    }
  },
};

export default geminiService;
