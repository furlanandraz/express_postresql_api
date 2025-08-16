import styles from './RouteItem.module.css';

export default function RouteItem({ item, title, onInsertRoute, onEditRoute, deleteRouteItem }) {
    return (
        <div className={`${styles.routeItem}`} id={`route_item_${item.id}`}>
            <div className={styles.title}>{title}</div>
            <div className={styles.actions}>
                {item.render_type === 'page' && <button onClick={()=>onInsertRoute(item.id)}>Insert</button>}
                <button onClick={()=>onEditRoute(item.id, item.children.length ? true : false)}>Edit</button>
                {(item.id !== 1) && <button className='btn-danger' onClick={()=>deleteRouteItem(item.id)}>Delete</button>}
            </div>
        </div>
    );
}