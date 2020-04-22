import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './general-dataTools-modal.css';
import AddColumn from './addColumn.jsx';

// Messages to be displayed in the modal
const messages = defineMessages({
    title: {
        defaultMessage: 'Data Tools',
        description: 'Data file modal title',
        id: 'gui.dataFileModal.title'
    }
});

// The modal component that will switch states depending on a state prop being passed to it
// currently only displays the add column modal
const dataToolsModal = props => {
    
    return(<Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.title)}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            { 
                <AddColumn
                handleNumberButton={props.handleNumberButton}
                handleWordButton={props.handleWordButton}
                columnName={props.columnName}
                handleColumnName={props.handleColumnName}/>
                //going to do a turnary based of a prop to determine which version is displayed
            }
        </Box>

    </Modal>
);
        }

dataToolsModal.propTypes = {
    intl: intlShape.isRequired,
    //modalState: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    handleNumberButton: PropTypes.func,
    handleWordButton: PropTypes.func,
    columnName: PropTypes.bool,
    handleColumnName: PropTypes.func,
};

export default injectIntl(dataToolsModal);