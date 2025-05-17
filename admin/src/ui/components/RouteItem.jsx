import styles from './RouteItem.module.css';

export default function RouteItem({ home, id, item, title, hasSiblings, deleteRouteItem, insertRouteItem, onEditRoute }) {
    return (
        <div className={`${styles.routeItem} ${home ? styles.mbNested : ''}`} id={`route_item_${id}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.actions}>
                {/* <button onClick={()=>insertRouteItem(id)}>Insert</button> */}
                <button onClick={()=>onEditRoute()}>Insert</button>
                <button onClick={()=>onEditRoute(id, item)}>Edit</button>
                {(id !== 1 && hasSiblings) && <button className='btn-danger' onClick={()=>deleteRouteItem(id)}>Delete</button>}
            </div>
        </div>
    );
}