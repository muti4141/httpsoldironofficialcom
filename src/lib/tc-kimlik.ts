/**
 * TC Kimlik No resmi algoritma kontrolü (11 hane, checksum). iyzico ödeme
 * isteklerini bu algoritmayı geçmeyen numaralarla "Geçersiz istek" gibi
 * anlaşılmaz bir hatayla reddediyor — burada erkenden, net bir mesajla
 * yakalıyoruz.
 */
export function isValidTcKimlik(value: string): boolean {
  if (!/^\d{11}$/.test(value)) return false;
  if (value[0] === "0") return false;
  const digits = value.split("").map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const d10 = ((oddSum * 7 - evenSum) % 10 + 10) % 10;
  if (d10 !== digits[9]) return false;
  const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const d11 = sumFirst10 % 10;
  return d11 === digits[10];
}
