import en from '../i18n/en.json';
import fa from '../i18n/fa.json';

type Locale = 'en' | 'fa';

const translations: Record<Locale, Record<string, string>> = {
  en,
  fa,
};

export function t(key: string, locale: Locale, params?: Record<string, string>): string {
  let str = translations[locale][key] || key;
  if (params) {
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
  }
  return str;
}

export function formatDateTime(isoString: string, locale: Locale): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
}
