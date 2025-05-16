import Modal from 'react-modal';

export default function RouteEdit({ id = null, error, loading, isOpen, onRequestClose }) {
    
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <>
                <button onClick={onRequestClose}>close</button>
                this is a modal for {id ? id : 'new route'}
            </>
        </Modal>
    );
}