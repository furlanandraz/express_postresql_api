import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';

import RouteItem from '../components/RouteItem';
import RouteItemEdit from '../modals/RouteItemEdit';
import RouteItemInsert from '../modals/RouteItemInsert';
import { useMenuTree } from '../../hooks/useMenuTree';

import './Navigation.css';
import { useState } from 'react';

export default function Navigation() {

  const { tree, item, languageEnabled, moveRouteItem, getRouteItem, deleteRouteItem, updateRouteItem, createRouteItem} = useMenuTree();

  const [loading, setLoading] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenInsert, setIsOpenInsert] = useState(false);
  const [editRouteItem, setEditRouteItem] = useState(null);
  const [editRouteitemHasChildren, setEditRouteitemHasChildren] = useState(false);
  const [insertRouteItemParentId, setInsertRouteItemParentId] = useState(null);

  function onRequestCloseEdit() {
    setEditRouteItem(null);
    setEditRouteitemHasChildren(false);
    setIsOpenEdit(false);
  }

  function onRequestCloseInsert() {
    setIsOpenInsert(false);
  }

  function onEditRoute(id, hasChildren) {
    getRouteItem(id)
    setEditRouteItem(item);
    setEditRouteitemHasChildren(hasChildren);
    setIsOpenEdit(true);
  }

  function onInsertRoute(parentId) {
    setInsertRouteItemParentId(parentId)
    setIsOpenInsert(true);
  }

 
/*
  const {treeLatent, setTreeLatent, changed, setChanged, loading, insertRouteItem, deleteRouteItem, commitMenuTree, discardChanges, forceRefresh} = useMenuTree();
  */
  
 
  /*
  const renderItem = ({ item }) => <RouteItem id={item.id} item={item} title={item.title} hasSiblings={item.hasSiblings} deleteRouteItem={deleteRouteItem} insertRouteItem={insertRouteItem} onEditRoute={onEditRoute} />;
  */
  
  const renderItem = ({ item }) => <RouteItem id={item.id} item={item} title={item.label} onEditRoute={onEditRoute} onInsertRoute={onInsertRoute} deleteRouteItem={deleteRouteItem} />;
  
  function getParentByPath(items, path) {
    if (path.length <= 1) return null; // root level

    let current = items;

    for (let i = 0; i < path.length - 2; i++) {
      const index = path[i];
      current = current[index]?.children ?? [];
    }

    const parentIndex = path[path.length - 2];
    return current[parentIndex] ?? null;
  }

  function updateTree(items, dragItem, targetPath) {
    const parent = getParentByPath(items, targetPath);
    let parent_id = parent?.id ?? null;

    if (parent_id === null && dragItem.id !== 1) {
      parent_id = 1;
    }

    const siblings = parent?.children ?? items;
    const index = siblings.findIndex(item => item.id === dragItem.id);

    const prev_id = index > 0 ? siblings[index - 1].id : null;
    const next_id = index < siblings.length - 1 ? siblings[index + 1].id : null;

    moveRouteItem({
      id: dragItem.id,
      parent_id,
      prev_id,
      next_id,
      render_method: dragItem.render_method,
      render_type: dragItem.render_type
    });
  }


 

  return (
    <>
      <div className='container'>
        {/* <NavigationUtility /> */}
        {(!loading && tree.length) && (
          <div className='wrapper'>
          <Nestable
              items={tree}
              renderItem={renderItem}
              className="pl-nested"
              onChange={({ items, dragItem, targetPath }) => updateTree(items, dragItem, targetPath)}
              disableDrag={({ item }) => item.id !== 1}
            />
          </div>
          
      )}
      </div>
      <RouteItemEdit item={item} languageEnabled={languageEnabled} isOpen={isOpenEdit} onRequestClose={onRequestCloseEdit} editRouteitemHasChildren={editRouteitemHasChildren} onSubmit={updateRouteItem} />
      <RouteItemInsert languageEnabled={languageEnabled} isOpen={isOpenInsert} onRequestClose={onRequestCloseInsert} onInsertRoute={onInsertRoute} parentId={insertRouteItemParentId} onSubmit={createRouteItem} />
  </>
);
}