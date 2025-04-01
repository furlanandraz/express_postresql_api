import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';

import RouteItem from '../components/RouteItem';
import { useMenuTree } from '../hooks/useMenuTree';

import './Navigation.css';

export default function Navigation() {

  const {treeLatent: items, setTreeLatent, loading, commitMenuTree, discardChanges} = useMenuTree();
  
  const renderItem = ({ item }) => <RouteItem id={item.id} title={item.title} />;

  return (
  <>
    {(!loading && items.length > 0) && (
      <>
        <RouteItem id={items[0].id} title={items[0].title} />
        <Nestable
          items={items[0].children}
          renderItem={renderItem}
          className="pl-40px"
        />
        <button onClick={commitMenuTree}>Save</button>
        <button onClick={discardChanges}>Discard</button>
      </>
    )}
  </>
);
}