import './RouteItem.css';

export default function RouteItem({ id, title }) {
    return (
        <div>
            <span>{id}</span>
            <div>{title}</div>
            <div>
                <button>Insert</button>
                <button>Edit</button>
                {id !== 1 && <button>Delete</button>}
            </div>
        </div>
    );
}