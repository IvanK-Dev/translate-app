import { ActionList, Button, Popover } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import { STATUS, languages } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLocalesArray,
  selectLocalesStatus,
} from '../../redux/locales/localesSelectors';
import { changeLanguage } from '../../redux/locales/localesSlice';

const LanguageSelector = () => {
  const [opened, setOpened] = useState(false);
  const dispatch = useDispatch();

  const locales = useSelector(selectLocalesArray);
  const status = useSelector(selectLocalesStatus);

  const toggleOpened = useCallback(() => setOpened((open) => !open), []);

  const primary = locales.find((item) => item.active)?.locale;

  const secondaryLocales = useMemo(() =>
    locales.filter((item) => item.active === false)
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
          active: temp.active,
          published: temp.published,
        };
        tmpLocales[toIndex] = { ...temp, active: false, published: false };
        dispatch(changeLanguage(tmpLocales));
      }

      toggleOpened();
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
      onClick={toggleOpened}
      disclosure
    >
      {languages[primary]}
    </Button>
  );

  return (
    <div className="container">
      <Popover
        active={opened}
        activator={activator}
        preferredAlignment="center"
        onClose={toggleOpened}
      >
        <ActionList actionRole="menuitem" items={actionListItems} />
      </Popover>
    </div>
  );
};
export default LanguageSelector;
