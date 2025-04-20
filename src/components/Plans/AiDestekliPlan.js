import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CLASS_LEVELS = [
  '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf',
  '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf',
  '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'
];

const SUBJECTS = [
  'Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler',
  'İngilizce', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih',
  'Coğrafya', 'Edebiyat', 'Geometri'
];

const AiDestekliPlan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    class_level: '',
    subject: '',
    curriculum_topic: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('Kullanıcı oturumu bulunamadı');

      const webhookData = {
        user_id: user.user.id,
        class_level: formData.class_level,
        subject: formData.subject,
        curriculum_topic: formData.curriculum_topic
      };

      const response = await fetch('https://n8n.prodatalab.net/webhook/488cbb55-e1b7-4cd9-a4c6-4862c2037098', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error('Webhook isteği başarısız oldu');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/ozel-plans');
      }, 5000); // 5 saniye sonra liste sayfasına yönlendir

    } catch (error) {
      setError(error.message);
      console.error('Error creating AI plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-green-800 mb-2">Ders Planı Oluşturma İşlemi Başladı</h2>
          <p className="text-green-700">
            Bir kaç dk içinde Öneri Ders Planınız Oluşturulduğunda Ders Planları Listenizden ulaşabilirsiniz.
          </p>
          <button
            onClick={() => navigate('/ozel-plans')}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Ders Planları Listesine Git
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">AI Destekli Ders Planı Oluştur</h1>
        <p className="mt-2 text-gray-600">
          Sınıf, ders ve müfredat bilgilerini girerek AI destekli ders planı oluşturabilirsiniz.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sınıf Seviyesi
            <select
              name="class_level"
              value={formData.class_level}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seçiniz</option>
              {CLASS_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ders
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Seçiniz</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Müfredat Konusu
            <input
              type="text"
              name="curriculum_topic"
              value={formData.curriculum_topic}
              onChange={handleChange}
              required
              placeholder="Örn: Doğal Sayılarla Toplama İşlemi"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/ozel-plans')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            İptal
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                İşleniyor...
              </>
            ) : (
              'Öneri Al'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiDestekliPlan; 