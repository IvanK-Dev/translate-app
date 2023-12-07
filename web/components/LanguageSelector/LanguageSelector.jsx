import { ActionList, Button, Popover } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { STATUS, languages } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLocalesArray,
  selectLocalesStatus,
} from '../../redux/locales/localesSelectors';
import { changeLanguage } from '../../redux/locales/localesSlice';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getLocalesThunk } from '../../redux/locales/localesThunk';

const LanguageSelector = () => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  const locales = useSelector(selectLocalesArray);
  const status = useSelector(selectLocalesStatus);

  const app = useAppBridge();

  useEffect(() => {
    if (locales.length === 0) {
      (() => {
        dispatch(getLocalesThunk(app));
      })();
    }
  }, [dispatch, app]);
  console.log('locales', locales);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const primary = locales.find((item) => item.primary)?.locale;

  const secondaryLocales = useMemo(() =>
    locales.filter((item) => item.primary === false)
  );
  const handleSelectAction = useCallback(
    (index) => {
      const tmpLocales = [...locales];
      const fromIndex = tmpLocales.findIndex(
        (locale) => locale.locale === primary
      );
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
        dispatch(changeLanguage(tmpLocales));
      }

      toggleActive();
    },
    [locales]
  );

  const actionListItems = secondaryLocales.map((item, index) => ({
    content: languages[item.locale],
    onAction: () => handleSelectAction(index),
  }));

  const activator = (
    <Button
      loading={status === STATUS.loading}
      onClick={toggleActive}
      disclosure
    >
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
