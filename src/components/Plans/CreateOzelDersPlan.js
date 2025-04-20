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

const CreateOzelDersPlan = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    class_level: '',
    subject: '',
    curriculum_topic: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    kazanimlar: '',
    tasavvurat: '',
    tasdikat: '',
    model_sahsiyet: '',
    deliller: '',
    atolye_uretimi: '',
    futuvet: '',
    etkinlikler: '',
    sozlu_kultur: '',
    oyun_tasarimi: ''
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

      const planData = {
        ...formData,
        user_id: user.user.id,
        duration: parseInt(formData.duration)
      };

      const { error } = await supabase
        .from('ozel_ders_planlari')
        .insert([planData]);

      if (error) throw error;

      navigate('/ozel-plans');
    } catch (error) {
      setError(error.message);
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.class_level || !formData.subject)) {
      setError('Lütfen sınıf ve ders seçimini yapınız.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Temel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Tarih
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Süre (dakika)
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="15"
                max="180"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Ders Planı Detayları</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plan Başlığı
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ders planı için kısa ve açıklayıcı bir başlık"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
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
                placeholder="İşlenecek müfredat konusu"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kazanımlar
              <textarea
                name="kazanimlar"
                value={formData.kazanimlar}
                onChange={handleChange}
                rows="3"
                placeholder="Öğrencilerin edinmesi beklenen kazanımlar"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">İçerik ve Etkinlikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tasavvurat
              <textarea
                name="tasavvurat"
                value={formData.tasavvurat}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tasdikat
              <textarea
                name="tasdikat"
                value={formData.tasdikat}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model Şahsiyet
              <textarea
                name="model_sahsiyet"
                value={formData.model_sahsiyet}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deliller
              <textarea
                name="deliller"
                value={formData.deliller}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Etkinlik ve Üretim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Atölye Üretimi
              <textarea
                name="atolye_uretimi"
                value={formData.atolye_uretimi}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fütüvvet
              <textarea
                name="futuvet"
                value={formData.futuvet}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Etkinlikler
              <textarea
                name="etkinlikler"
                value={formData.etkinlikler}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sözlü Kültür
              <textarea
                name="sozlu_kultur"
                value={formData.sozlu_kultur}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Oyun Tasarımı
              <textarea
                name="oyun_tasarimi"
                value={formData.oyun_tasarimi}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Yeni Özel Ders Planı Oluştur</h1>
        <div className="mt-4 flex justify-center">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/ozel-plans')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            İptal
          </button>
          
          <div className="space-x-2">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Geri
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                İleri
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Planı Kaydet'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateOzelDersPlan; 