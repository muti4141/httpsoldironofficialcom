/**
 * Supabase/GoTrue gibi üçüncü taraf servislerin İngilizce hata metinlerini
 * kullanıcıya gösterilecek Türkçe karşılıklarına çevirir. Eşleşme yoksa
 * orijinal mesajı olduğu gibi döndürür (sessizce yutmak yerine).
 */
const RULES: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/invalid login credentials/i, () => "E-posta veya şifre hatalı."],
  [/email not confirmed/i, () => "E-posta adresini henüz onaylamadın. Gelen kutunu kontrol et."],
  [/user already registered|already registered/i, () => "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene."],
  [/password should be at least (\d+) characters/i, (m) => `Şifre en az ${m[1]} karakter olmalı.`],
  [/password is known to be weak and easy to guess/i, () => "Bu şifre çok yaygın ve kolay tahmin edilebilir. Lütfen harf, rakam ve sembol içeren daha güçlü, özgün bir şifre seç."],
  [/password.*weak/i, () => "Şifre çok zayıf. Daha güçlü bir şifre seç."],
  [/unable to validate email address/i, () => "Geçersiz e-posta adresi."],
  [/signup requires a valid password/i, () => "Geçerli bir şifre gir."],
  [/email rate limit exceeded/i, () => "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene."],
  [/for security purposes, you can only request this after (\d+) seconds/i, (m) => `Güvenlik nedeniyle ${m[1]} saniye sonra tekrar deneyebilirsin.`],
  [/user not found/i, () => "Bu e-posta ile kayıtlı bir hesap bulunamadı."],
  [/network error|failed to fetch/i, () => "Bağlantı hatası. İnternetini kontrol edip tekrar dene."],
  [/invalid api key/i, () => "Sunucu yapılandırma hatası. Lütfen daha sonra tekrar dene."],
];

export function translateError(message: string | null | undefined): string {
  if (!message) return "Bir hata oluştu. Lütfen tekrar dene.";
  for (const [pattern, toTurkish] of RULES) {
    const match = message.match(pattern);
    if (match) return toTurkish(match);
  }
  return message;
}
