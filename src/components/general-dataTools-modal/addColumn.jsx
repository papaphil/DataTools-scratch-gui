import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './general-dataTools-modal.css';

// messages to be displayed by the modal
const messages = defineMessages({
    bodyText1: {
        defaultMessage: 'Which type of column would you like to add?',
        description: 'Message choosing a type',
        id: 'gui.addColumn.bodyText1'
    },
    bodyText2: {
        defaultMessage: 'Please enter the name of the column you would like to add.',
        description: 'Message adding the name of a column',
        id: 'gui.addColumn.bodyText2'
    },
    wordButton: {
        defaultMessage: 'Text',
        description: 'Text',
        id: 'gui.addColumn.wordButton'
    },
    numberButton: {
        defaultMessage: 'Number',
        description: 'Number',
        id: 'gui.addColumn.numberButton'
    },
    enterButton: {
        defaultMessage: 'Enter',
        description: 'Enter',
        id: 'gui.addColumn.enterButton'
    }
});

//possibly do a turnary off of a bool that gets updated in the general modal
//have the button call a method that is passed in through the props that then sets the prop for here from false to true and boom


// component for adding a column, 2 states
// first state is asking for the type of column the user would like 
// second state is asking for a name for the column being added
const addColumn = props => {
    if(!props.columnName){
    return(<Box>
            <p> {props.intl.formatMessage(messages.bodyText1)}</p>
            <Box className={styles.buttonRow}>
            <button
                        className={styles.optIn}
                        title={props.intl.formatMessage(messages.wordButton)}
                        onClick={props.handleWordButton}
                    >
                        <FormattedMessage {...messages.wordButton} />
                    </button>
                <button
                        className={styles.optIn}
                        title={props.intl.formatMessage(messages.numberButton)}
                        onClick={props.handleNumberButton}
                    >
                        <FormattedMessage {...messages.numberButton} />
                    </button>
            </Box>
    </Box>);
    }
    else{
        return(
            <Box>
                 <p> {props.intl.formatMessage(messages.bodyText2)}</p>
                 <Box className={styles.buttonRow}>
                 <input type = "text" id='column' className = {styles.url} placeholder=""/>
                 <button
                        className={styles.optIn}
                        title={props.intl.formatMessage(messages.enterButton)}
                        onClick={props.handleColumnName}>
                        <FormattedMessage {...messages.enterButton} />
                 </button>
                 </Box>
            </Box>
        );
    }
}
addColumn.propTypes = {
    intl: intlShape.isRequired,
    handleWordButton: PropTypes.func,
    handleNumberButton: PropTypes.func,
    columnName: PropTypes.bool,
    handleColumnName: PropTypes.func,
};

export default injectIntl(addColumn);