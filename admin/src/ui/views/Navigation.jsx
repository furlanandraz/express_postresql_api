import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';

import RouteItem from '../components/RouteItem';
// import NavigationUtility from '../components/NavigationUtility';
import RouteEdit from '../modals/RouteEdit';
import { useMenuTree } from '../../hooks/useMenuTree';

import './Navigation.css';
import { useState } from 'react';

export default function Navigation() {

  
  const [isOpen, setIsOpen] = useState(false);
  const [editRouteId, setEditRouteId] = useState(null);
  const [editRouteItem, setEditRouteItem] = useState(null);

  function onRequestClose() {
    setEditRouteId(null);
    setEditRouteItem(null);
    setIsOpen(false);
  }

  function onEditRoute(id, item) {
    setEditRouteId(id);
    setEditRouteItem(item)
    setIsOpen(true);
  }

  const {treeLatent, setTreeLatent, changed, setChanged, loading, insertRouteItem, deleteRouteItem, commitMenuTree, discardChanges, forceRefresh} = useMenuTree();
  
  const renderItem = ({ item }) => <RouteItem id={item.id} item={item} title={item.title} hasSiblings={item.hasSiblings} deleteRouteItem={deleteRouteItem} insertRouteItem={insertRouteItem} onEditRoute={onEditRoute} />;

  function getParentByPath(tree, path) {

    tree = [{ ...treeLatent[0], children: tree }];
    path = [0, ...path];

    let current = tree;
    for (let i = 0; i < path.length - 1; i++) {
      const index = path[i];
      if (!current || !Array.isArray(current)) return null;

      const node = current[index];
      if (!node) return null;

      current = node.children || [];
      if (i === path.length - 2) return node;
    }

    return null;
  }


  function updateTree(items, dragItem, targetPath) {
    const parent = getParentByPath(items, targetPath);

    console.log('dragItem:', dragItem.id);
    console.log('newParent:', parent.id);

    if (!changed) setChanged(true);

    setTreeLatent([{ ...treeLatent[0], children: items }]);
  }

  return (
    <>
      <div className='container'>
        {/* <NavigationUtility changed={changed} forceRefresh={forceRefresh} commitMenuTree={commitMenuTree} discardChanges={discardChanges}/> */}
        {(!loading && treeLatent.length > 0) && (
          <div className='wrapper'>
            <RouteItem home={true} id={treeLatent[0].id} item={treeLatent[0]} title={treeLatent[0].title} insertRouteItem={insertRouteItem}  onEditRoute={onEditRoute}/>
          <Nestable
            items={treeLatent[0].children}
            renderItem={renderItem}
            className="pl-nested"
            onChange={({ items, dragItem, targetPath }) => updateTree(items, dragItem, targetPath)}
            />
        </div>
      )}
      </div>
      <RouteEdit id={editRouteId} item={editRouteItem}  isOpen={isOpen} onRequestClose={onRequestClose}></RouteEdit>
  </>
);
}