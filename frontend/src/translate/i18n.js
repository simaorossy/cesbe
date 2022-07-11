import i18n from 'i18next'
import messages from './languages/index';
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
    debug:false,
    defaultNS:['translations'],
    fallbackLng:"pt",
    ns:['translations'],
    resources:messages
})

export default i18n;
