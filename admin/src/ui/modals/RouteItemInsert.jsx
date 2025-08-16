import Modal from 'react-modal';

import RouteItemForm from '../components/RouteItemForm';

export default function RouteItemInsert({ parentId, languageEnabled, isOpen, onRequestClose, onSubmit}) {
    
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <>
                <button onClick={onRequestClose}>close</button>
                <RouteItemForm languageEnabled={languageEnabled} parentId={parentId} onSubmit={onSubmit} />
            </>
        </Modal>
    );
}