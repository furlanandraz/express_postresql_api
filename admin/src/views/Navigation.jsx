import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';

import RouteItem from '../components/RouteItem';
import NavigationUtility from '../components/NavigationUtility';
import { useMenuTree } from '../hooks/useMenuTree';

import './Navigation.css';

export default function Navigation() {

  const {treeLatent, setTreeLatent, changed, setChanged, loading, insertRouteItem, deleteRouteItem, commitMenuTree, discardChanges, forceRefresh} = useMenuTree();
  
  const renderItem = ({ item }) => <RouteItem id={item.id} title={item.title} hasSiblings={item.hasSiblings} deleteRouteItem={deleteRouteItem} insertRouteItem={insertRouteItem} />;

  function updateTree(items) {
    if (!changed) setChanged(true);
    setTreeLatent([{ ...treeLatent[0], children: items }])
  }

  return (
    <div className='container'>
      <NavigationUtility changed={changed} forceRefresh={forceRefresh} commitMenuTree={commitMenuTree} discardChanges={discardChanges}/>
      {(!loading && treeLatent.length > 0) && (
      <div className='wrapper'>
        <RouteItem home={true} id={treeLatent[0].id} title={treeLatent[0].title} insertRouteItem={insertRouteItem}/>
        <Nestable
          items={treeLatent[0].children}
          renderItem={renderItem}
            className="pl-nested"
            onChange={({ items }) => updateTree(items)}
          />
      </div>
    )}
  </div>
);
}