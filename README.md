# Özel Ders Planı Uygulaması

Bu uygulama, öğretmenlerin özel ders planlarını oluşturmasına ve yönetmesine yardımcı olan bir web uygulamasıdır.

## Özellikler

- 📝 Özel ders planı oluşturma ve düzenleme
- 🤖 AI destekli ders planı önerileri
- 📚 Detaylı plan içeriği (müfredat, kazanımlar, etkinlikler vb.)
- 🔍 Plan arama ve filtreleme
- 👤 Kullanıcı kimlik doğrulama ve yetkilendirme
- 📱 Responsive tasarım

## Teknolojiler

- React
- Supabase (Veritabanı ve Kimlik Doğrulama)
- Tailwind CSS
- Shadcn/ui
- React Router
- date-fns

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repository-url]
cd dersplani3
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Ortam Değişkenleri

Projenin çalışması için aşağıdaki ortam değişkenlerini `.env` dosyasında tanımlamanız gerekmektedir:

```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 