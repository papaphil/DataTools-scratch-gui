import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import DataFileModalComponent from '../components/general-dataTools-modal/general-dataTools-modal.jsx';
import {closeDataFileModal} from '../reducers/modals';
class DataFileModal extends React.Component {
    constructor(props){
        super(props);
        bindAll(this, [
            'handleCancel',
        ]);

        this.state = {

        };
    }
    handleCancel(){
        this.props.onClose();
    }
    //all behavior is defined here and passed as a prop to the components
    render () {
        return(
            <DataFileModalComponent 
                onCancel={this.props.onClose}
                handleNumberButton={this.props.handleNumberButton}
                handleWordButton={this.props.handleWordButton}
                columnName={this.props.columnName}
                handleColumnName={this.props.handleColumnName}/>
        );
    };
}
DataFileModal.propTypes = {
    onClose: PropTypes.func,
    handleWordButton: PropTypes.func,
    handleNumberButton: PropTypes.func,
    columnName: PropTypes.bool,
    handleColumnName: PropTypes.func,
}

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

// const mapDispatchToProps = dispatch => ({
//     onClose: () => {
//         dispatch(closeDataFileModal());
//     }
// });
export default connect(mapStateToProps)(DataFileModal);