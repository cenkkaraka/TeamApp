# TeamApp
# Takım Arkadaşı Bulma Platformu – Tamamlanan Özellikler ve Geliştirme Özeti

### **Teknoloji Yığını**
- **Frontend:** React Native (mobil uygulama)
- **Backend:** FastAPI (Python)
- **Veritabanı:** PostgreSQL

---

## 1. Kullanıcı Kayıt ve Giriş
- Kullanıcılar e-posta (ve istenirse telefon numarası) ile kolayca kayıt ve giriş yapabiliyor.
- JWT tabanlı kimlik doğrulama ile güvenli oturum yönetimi sağlandı.
- Kayıt ve login ekranları, backend ile entegre şekilde çalışıyor.

---

## 2. Profil Yönetimi
- Kullanıcılar profil bilgilerini ekleyip güncelleyebiliyor (ad, soyad, rol, okul, yetkinlikler, biyografi).
- Profil bilgilerinin API ve mobil arayüzde güncellenmesi sağlandı.

---

## 3. CV & Portfolio Yükleme
- Kullanıcılar profiline CV veya portfolyo dosyası ekleyebiliyor.
- Dosya yükleme için backend ve frontendde gerekli alanlar oluşturuldu.

---

## 4. Proje Oluşturma
- Kullanıcılar yeni proje oluşturabiliyor.
- Proje başlığı, açıklaması, kategori ve aşama gibi detayları tanımlayabiliyor.

---

## 5. Proje İçin Rol İlanı Oluşturma
- Proje oluşturulurken veya sonradan, proje için gerekli roller ve bu rollerin aranan yetkinlikleri eklenebiliyor.

---

## 6. Projeye Başvuru ve Eşleşme
- Kullanıcılar projelerdeki uygun rollere başvuru yapabiliyor.
- Başvurular proje sahibi tarafından görüntülenebiliyor.
- Proje sahibi uygun gördüğü başvuruları “matched (eşleşti)” olarak işaretleyebiliyor.
- Eşleşen kullanıcılar, projenin takımına ekleniyor.

---

## 7. Proje ile İlgilenmiyorum Özelliği
- Kullanıcılar ilgilenmediği projeleri “ilgilenmiyorum” olarak işaretleyebiliyor.
- Bu projeler, kullanıcının listesinde tekrar gösterilmiyor.

---

## 8. Proje İlanını Kaydetme
- Kullanıcılar projeleri “kaydedilmiş” olarak işaretleyip, istedikleri zaman kolayca tekrar erişebiliyor.

---

## 9. Proje Profili ve Takım Üyeleri
- Proje detay ekranında, projede yer alan ekip üyeleri ve rolleri görüntülenebiliyor.

---

## 10. Matching (Eşleşme) Algoritması
- Başvurularda, adayın yetkinlikleri ve ilanda aranan yetkinlikler karşılaştırılıyor.
- “Eşleşme skoru” otomatik hesaplanıyor ve sıralamada kullanılıyor.
- Skoru yüksek adaylar başvurular listesinde üstte gösteriliyor.

---

## 11. Mesajlaşma (Chat) Sistemi
- Eşleşen kullanıcılar (proje sahibi ve takım üyeleri) arasında mesajlaşma mümkün.
- Sadece aynı projede eşleşmiş olanlar birbirleriyle chat yapabiliyor.
- Mesaj geçmişi ve yeni mesaj gönderimi çalışıyor.

---

## 12. Proje Başvurularını Görüntüleme
- Proje sahibi, kendi projesine başvuran herkesi ve başvuru detaylarını görebiliyor.
- Başvuranların profili, başvuru durumu ve eşleşme skoru gösteriliyor.

---

## 13. Kullanıcı Deneyimi ve Ek Fonksiyonlar
- “İlgilenmiyorum” ve “kaydet” gibi fonksiyonlar entegrasyonu ile kullanıcı deneyimi güçlendirildi.
- Proje, başvuru ve ekip süreçleri uçtan uca yönetilebiliyor.

---

## **Kısa Özet**
- Tüm temel özellikler (kayıt, giriş, profil, proje oluşturma, başvuru, eşleştirme, ekip yönetimi, mesajlaşma, kaydetme vs.) hem backend hem frontend tarafında tamamlandı.
- Kullanıcı deneyimini artıran ek fonksiyonlar (ilgilenmiyorum, eşleşme skoru vb.) entegre edildi.
- Platform, proje yönetimi, başvuru ve ekip kurma süreçlerini uçtan uca yönetebilecek durumda.

---

> **Ek Not:**  
> Proje şu anda temel işlevlerin tamamını yerine getiriyor. İleri düzey özellikler ve geliştirmeler için altyapı hazır.
