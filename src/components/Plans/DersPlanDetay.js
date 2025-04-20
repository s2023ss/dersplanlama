import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const MarkdownContent = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className="prose prose-sm max-w-none prose-indigo">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

const DersPlanDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) {
        throw new Error('Kullanıcı oturumu bulunamadı');
      }

      const { data, error } = await supabase
        .from('ozel_ders_planlari')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Plan bulunamadı');

      setPlan(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching plan details:', error);
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => navigate('/ozel-plans')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Listeye Dön
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-600">Plan bulunamadı.</p>
          <button
            onClick={() => navigate('/ozel-plans')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Listeye Dön
          </button>
        </div>
      </div>
    );
  }

  const planSections = [
    { id: 'curriculum_topic', title: 'Müfredat Konusu', content: plan.curriculum_topic },
    { id: 'kazanimlar', title: 'Kazanımlar', content: plan.kazanimlar },
    { id: 'tasavvurat', title: 'Tasavvurat', content: plan.tasavvurat },
    { id: 'tasdikat', title: 'Tasdikat', content: plan.tasdikat },
    { id: 'model_sahsiyet', title: 'Model Şahsiyet', content: plan.model_sahsiyet },
    { id: 'deliller', title: 'Deliller', content: plan.deliller },
    { id: 'atolye_uretimi', title: 'Atölye Üretimi', content: plan.atolye_uretimi },
    { id: 'futuvet', title: 'Fütüvvet', content: plan.futuvet },
    { id: 'etkinlikler', title: 'Etkinlikler', content: plan.etkinlikler },
    { id: 'sozlu_kultur', title: 'Sözlü Kültür', content: plan.sozlu_kultur },
    { id: 'oyun_tasarimi', title: 'Oyun Tasarımı', content: plan.oyun_tasarimi }
  ].filter(section => section.content);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{plan.title}</h1>
        <button
          onClick={() => navigate('/ozel-plans')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Listeye Dön
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Sınıf Seviyesi</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{plan.class_level}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Ders</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{plan.subject}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Tarih</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {format(new Date(plan.date), 'd MMMM yyyy', { locale: tr })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Süre</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{plan.duration} dakika</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {planSections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-lg font-semibold text-gray-800">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <MarkdownContent content={section.content} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DersPlanDetay; 