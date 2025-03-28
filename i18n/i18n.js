import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      searchPlants: 'Search plants...',
      error: 'Error',
      initializationFailed: 'Failed to initialize',
      permissionRequired: 'Permission Required',
      enableCameraAccess: 'Please enable camera access',
      enableGalleryAccess: 'Please enable gallery access',
      cameraNotReady: 'Camera is not ready',
      failedToTakePicture: 'Failed to take picture',
      failedToPickImage: 'Failed to pick image',
      noImageData: 'No image data available',
      recognitionFailed: 'Recognition Failed',
      unableToIdentifyPlant: 'Unable to identify plant',
      translationFailed: 'Translation Failed',
      unableToTranslate: 'Unable to translate content',
      speechError: 'Speech Error',
      unableToSpeak: 'Unable to speak text',
      stopVoice: 'Stop Voice',
      playVoice: 'Play Voice',
      chat: 'Chat',
      details: 'Details',
      close: 'Close'
    }
  },
  hi: {
    translation: {
      searchPlants: 'पौधे खोजें...',
      error: 'त्रुटि',
      initializationFailed: 'प्रारंभ करने में विफल',
      permissionRequired: 'अनुमति आवश्यक',
      enableCameraAccess: 'कृपया कैमरा एक्सेस सक्षम करें',
      enableGalleryAccess: 'कृपया गैलरी एक्सेस सक्षम करें',
      cameraNotReady: 'कैमरा तैयार नहीं है',
      failedToTakePicture: 'तस्वीर लेने में विफल',
      failedToPickImage: 'छवि चुनने में विफल',
      noImageData: 'कोई छवि डेटा उपलब्ध नहीं',
      recognitionFailed: 'पहचान विफल',
      unableToIdentifyPlant: 'पौधे की पहचान करने में असमर्थ',
      translationFailed: 'अनुवाद विफल',
      unableToTranslate: 'सामग्री का अनुवाद करने में असमर्थ',
      speechError: 'वाणी त्रुटि',
      unableToSpeak: 'टेक्स्ट बोलने में असमर्थ',
      stopVoice: 'आवाज़ रोकें',
      playVoice: 'आवाज़ चलाएं',
      chat: 'चैट',
      details: 'विवरण',
      close: 'बंद करें'
    }
  },
  mr: {
    translation: {
      searchPlants: 'वनस्पती शोधा...',
      error: 'त्रुटी',
      initializationFailed: 'प्रारंभ करण्यात अयशस्वी',
      permissionRequired: 'परवानगी आवश्यक',
      enableCameraAccess: 'कृपया कॅमेरा ऍक्सेस सक्षम करा',
      enableGalleryAccess: 'कृपया गॅलरी ऍक्सेस सक्षम करा',
      cameraNotReady: 'कॅमेरा तयार नाही',
      failedToTakePicture: 'फोटो काढण्यात अयशस्वी',
      failedToPickImage: 'प्रतिमा निवडण्यात अयशस्वी',
      noImageData: 'प्रतिमा डेटा उपलब्ध नाही',
      recognitionFailed: 'ओळख अयशस्वी',
      unableToIdentifyPlant: 'वनस्पती ओळखण्यात असमर्थ',
      translationFailed: 'अनुवाद अयशस्वी',
      unableToTranslate: 'मजकूर अनुवाद करण्यात असमर्थ',
      speechError: 'वाणी त्रुटी',
      unableToSpeak: 'मजकूर बोलण्यात असमर्थ',
      stopVoice: 'आवाज थांबवा',
      playVoice: 'आवाज चालू करा',
      chat: 'चॅट',
      details: 'तपशील',
      close: 'बंद करा'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;