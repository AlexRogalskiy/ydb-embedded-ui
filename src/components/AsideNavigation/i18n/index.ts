import {i18n, I18N} from '../../../utils/i18n';

import en from './en.json';
import ru from './ru.json';

const COMPONENT = 'ydb-embedded-ui';

i18n.registerKeyset(I18N.LANGS.en, COMPONENT, en);
i18n.registerKeyset(I18N.LANGS.ru, COMPONENT, ru);

export default i18n.keyset(COMPONENT);
