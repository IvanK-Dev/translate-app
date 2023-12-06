import { ActionList, Button, Popover } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import { languages } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocalesArray } from '../../../redux/locales/localesSelectors';
import { changeLanguage } from '../../../redux/locales/localesSlice';

const LanguageSelector = () => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  const locales = useSelector(selectLocalesArray);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  
  const primary = locales.find((item) => item.primary)?.locale;

  const secondaryLocales = useMemo(() =>
    locales.filter((item) => item.primary === false)
  );
  const handleSelectAction = useCallback((index) => {

    const tmpLocales=[...locales]
    const fromIndex = tmpLocales.findIndex((locale) => locale.locale === primary);
    const toIndex = tmpLocales.findIndex(
      (locale) => locale.locale === secondaryLocales[index].locale
    );

    if (fromIndex !== -1 && toIndex !== -1) {
      const temp = { ...tmpLocales[fromIndex] };
      tmpLocales[fromIndex] = {
        ...tmpLocales[toIndex],
        primary: temp.primary,
        published: temp.published,
      };
      tmpLocales[toIndex] = { ...temp, primary: false, published: false };
      console.log(tmpLocales)
      dispatch(changeLanguage(tmpLocales));
    }
  }, [locales]);


  const actionListItems = secondaryLocales.map((item, index) => ({
    content: languages[item.locale],
    onAction: () => handleSelectAction(index),
  }));

  const activator = (
    <Button onClick={toggleActive} disclosure>
      {languages[primary]}
    </Button>
  );

  return (
    <div className="container">
      <Popover
        active={active}
        activator={activator}
        preferredAlignment="center"
        onClose={toggleActive}
      >
        <ActionList actionRole="menuitem" items={actionListItems} />
      </Popover>
    </div>
  );
};
export default LanguageSelector;
