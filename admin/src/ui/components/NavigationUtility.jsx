import './NavigationUtility.css';

export default function NavigationUtility({ changed, forceRefresh, commitMenuTree, discardChanges }) {
    return (
        <div className="navigation-utility">
            {changed &&
            <>
            <button className='btn-ok' onClick={commitMenuTree}>Save</button>
            <button className='btn-danger' onClick={discardChanges}>Discard</button>
            </>
            }
            <button onClick={forceRefresh}>Refresh</button>
        </div>
    )
}