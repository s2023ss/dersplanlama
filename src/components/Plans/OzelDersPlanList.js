import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';

const MarkdownContent = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className="prose prose-sm max-w-none prose-indigo">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

const OzelDersPlanList = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const { data, error } = await supabase
        .from('ozel_ders_planlari')
        .select('*')
        .eq('user_id', user.user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      setError('Planlar yüklenirken bir hata oluştu');
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu planı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ozel_ders_planlari')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Silinen plan seçili plandıysa seçimi kaldır
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }

      // Planları yeniden yükle
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Plan silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPlans}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 mb-4">Henüz hiç özel ders planı oluşturmadınız.</p>
        <button
          onClick={() => navigate('/create-plan')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Yeni Plan Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Özel Ders Planları</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/ai-plan')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <span className="mr-2">✨</span>
            AI ile İyileştir
          </button>
          <button
            onClick={() => navigate('/create-plan')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <span className="mr-2">+</span>
            Yeni Plan Oluştur
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {!loading && !error && plans.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Henüz hiç özel ders planı oluşturulmamış.</p>
          <button
            onClick={() => navigate('/create-plan')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            İlk Planı Oluştur
          </button>
        </div>
      )}
      
      {!loading && !error && plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-plan/${plan.id}`)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>Sınıf: {plan.class_level}</p>
                  <p>Ders: {plan.subject}</p>
                  <p>Tarih: {format(new Date(plan.date), 'd MMMM yyyy', { locale: tr })}</p>
                  <p>Süre: {plan.duration} dakika</p>
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => navigate(`/plan/${plan.id}`)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    Detayları Göster
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedPlan && (
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Müfredat Konusu:</h4>
            <MarkdownContent content={selectedPlan.curriculum_topic} />
          </div>
          {selectedPlan.kazanimlar && (
            <div>
              <h4 className="font-medium mb-2">Kazanımlar:</h4>
              <MarkdownContent content={selectedPlan.kazanimlar} />
            </div>
          )}
          {selectedPlan.tasavvurat && (
            <div>
              <h4 className="font-medium mb-2">Tasavvurat:</h4>
              <MarkdownContent content={selectedPlan.tasavvurat} />
            </div>
          )}
          {selectedPlan.tasdikat && (
            <div>
              <h4 className="font-medium mb-2">Tasdikat:</h4>
              <MarkdownContent content={selectedPlan.tasdikat} />
            </div>
          )}
          {selectedPlan.model_sahsiyet && (
            <div>
              <h4 className="font-medium mb-2">Model Şahsiyet:</h4>
              <MarkdownContent content={selectedPlan.model_sahsiyet} />
            </div>
          )}
          {selectedPlan.deliller && (
            <div>
              <h4 className="font-medium mb-2">Deliller:</h4>
              <MarkdownContent content={selectedPlan.deliller} />
            </div>
          )}
          {selectedPlan.atolye_uretimi && (
            <div>
              <h4 className="font-medium mb-2">Atölye Üretimi:</h4>
              <MarkdownContent content={selectedPlan.atolye_uretimi} />
            </div>
          )}
          {selectedPlan.futuvet && (
            <div>
              <h4 className="font-medium mb-2">Fütüvvet:</h4>
              <MarkdownContent content={selectedPlan.futuvet} />
            </div>
          )}
          {selectedPlan.etkinlikler && (
            <div>
              <h4 className="font-medium mb-2">Etkinlikler:</h4>
              <MarkdownContent content={selectedPlan.etkinlikler} />
            </div>
          )}
          {selectedPlan.sozlu_kultur && (
            <div>
              <h4 className="font-medium mb-2">Sözlü Kültür:</h4>
              <MarkdownContent content={selectedPlan.sozlu_kultur} />
            </div>
          )}
          {selectedPlan.oyun_tasarimi && (
            <div>
              <h4 className="font-medium mb-2">Oyun Tasarımı:</h4>
              <MarkdownContent content={selectedPlan.oyun_tasarimi} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OzelDersPlanList; 