import Modal from 'react-modal';

export default function RouteEdit({ id = null, item = null, error, loading, isOpen, onRequestClose }) {
    
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <>
                <button onClick={onRequestClose}>close</button>
                this is a modal for {item ? item.id : 'new route'}
                {item ? JSON.stringify(item, null, 2) : ''}
            </>
        </Modal>
    );
}