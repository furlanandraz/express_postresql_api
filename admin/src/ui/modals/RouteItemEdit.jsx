import Modal from 'react-modal';

import RouteItemForm from '../components/RouteItemForm';

export default function RouteItemEdit({ item, languageEnabled, isOpen, onRequestClose, editRouteitemHasChildren, onSubmit}) {
    
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <>
                <button onClick={onRequestClose}>close</button>
                <RouteItemForm item={item} languageEnabled={languageEnabled} editRouteitemHasChildren={editRouteitemHasChildren} onSubmit={onSubmit} />
            </>
        </Modal>
    );
}