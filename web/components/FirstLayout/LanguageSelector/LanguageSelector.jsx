import { ActionList, Button, Popover } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import { languages } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectLocalesArray } from '../../../redux/locales/localesSelectors';

const LanguageSelector = () => {
  const [active, setActive] = useState(false);

  const locales=useSelector(selectLocalesArray)

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleSelectAction = useCallback((index) => {
    console.log('Clicked on item at index:', index);
  }, []);

  const primary = locales.find((item) => item.primary)?.locale;

  const secondaryLocales = useMemo(() =>
    locales.filter((item) => item.primary === false)
  );

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
