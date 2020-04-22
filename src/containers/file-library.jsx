/*
Created by: Alex Burroughs, Zachary Fernbaugh, Phillip Carroll, and Nathanael Hood with the KSU Scratch Data Tools group
See LICENSE for more information.
*/
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';
import Modal from './modal.jsx';
import Divider from '../components/divider/divider.jsx';
import Filter from '../components/filter/filter.jsx';
import TagButton from './tag-button.jsx';
import Spinner from '../components/spinner/spinner.jsx';
import DataTable from '../components/file-library/data-table.jsx';

import styles from '../components/library/library.css';
import tableStyles from '../components/file-library/data-table.css';
import DataFileModal from './dataFileModal.jsx';
import {openDataFileModal} from '../reducers/modals';

import {connect} from 'react-redux';
const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Sprite',
        description: 'Heading for the sprite library',
        id: 'gui.fileLibrary.chooseASprite'
    }
});

class FileLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setFilteredDataRef',
            'handleFileNameClick',
            'getColumns',
            'handleDataChange',
            'handleAddRow',
            'handleAddColumn',
            'handleNumberButton',
            'handleWordButton',
            'handleDataFileModalClose'
        ]);

        this.state = {
            fileNames: [],
            fileData: [],
            filterQuery: '',
            selectedFileIndex: 0,
            loaded: false,
            DataFileModalVisible: false,
            word: false,
            number: false,
            columnName: '',
        };
    }

    componentDidMount () {
        // Allow the spinner to display before loading the content
        let names = this.props.vm.performExtensionAction('datatools', 'getDataFileNames');
        let data = [];
        if(names[0].tag !== "NO FILES UPLOADED") {
            data = this.props.vm.performExtensionAction('datatools', 'getDataFileContents', {name: names[0].tag});
        }
        else {
            names = [];
        }
        this.setState({
            fileNames: names,
            fileData: data
        });

        setTimeout(() => {
            this.setState({loaded: true});
        });
    }

    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }

    handleFileNameClick(name) {
        let index = this.state.fileNames.map(tag => tag.tag).indexOf(name);

        let data = this.props.vm.performExtensionAction('datatools', 'getDataFileContents', {name});

        this.setState({
            selectedFileIndex: index,
            fileData: data
        });
    }

    getColumns() {
        let columns = [];

        let first = this.state.fileData[0];
        if(first) {
            return Object.keys(first);
        }
        return columns;
    }

    handleDataChange(row, col, value) {
        let fileName = this.state.fileNames[this.state.selectedFileIndex].tag;
        let colName = this.getColumns()[col];

        let newData = this.props.vm.performExtensionAction('datatools', 'updateDataFile', {fileName, row, colName, value});

        this.setState({ fileData: newData });
    }

    handleAddRow() {
        let { fileData } = this.state;
        let fileName = this.state.fileNames[this.state.selectedFileIndex].tag;

        let first = fileData[0];
        let newRow = {};
        Object.keys(first).map(key => {
            if(typeof(first[key]) === 'number')
                newRow[key] = 0;
            else {
                newRow[key] = '';
            }
        });

        fileData.push(newRow);
        this.setState({ fileData });
        this.props.vm.performExtensionAction('datatools', 'addDataFileRow', {fileName})
        this.forceUpdate();
    }
    /**
     * sets the state for the user wanting the column to be a number column to be true to be passed to the vm
     */
    handleNumberButton(){
        this.state.number = true;
        this.forceUpdate();
    }
    
    /**
     * closes the data file modal when the user is done
     */
    handleDataFileModalClose(){
        this.setState({DataFileModalVisible: false});
        this.forceUpdate();
    }

    /**
     * sets the state for the user wanting the column to be a text column to be true to be passed to the vm
     */
    handleWordButton(){
        this.state.word = true;

        this.forceUpdate();
    }

    /**
     * handler for adding a column
     * updates the column on the gui side and then sends a request to the vm to update the backend as well to keep consistency 
     */
    handleAddColumn(){
        if(!this.state.DataFileModalVisible)
        {
            this.state.DataFileModalVisible = true;
            this.forceUpdate();
            return;
        }    
        let { fileData } = this.state;
        let fileName = this.state.fileNames[this.state.selectedFileIndex].tag;
        let type = this.state.word ? 'text' : 'number';
        let name = document.getElementById("column").value; //want to change this to a modal
        if(type !='text' && type!='number')
            return;
        if(fileData.length === 0){
            fileData[0]={};
            if(type == 'text'){
                fileData[0][name] = '';
            } 
            else {
                fileData[0][name] = 0;
            }
        }
        else {
            if(fileData[0][name]){
                alert("Column already exists, please try again with a different name");
                return;
            }
            let i;
            let rowCount = fileData.length;
            if(type == 'text'){
                for(i = 0; i < rowCount; i++){
                    fileData[i][name] = '';
                }
            }
            else{
                for(i =0; i<rowCount; i++){
                    fileData[i][name] = 0;
                }
            }
        }
        
        this.setState({ fileData });
        this.props.vm.performExtensionAction('datatools', 'addDataFileColumn', {type, name, fileName});
        this.state.DataFileModalVisible = false;
        this.state.columnName = '';
        this.state.word = false;
        this.state.number = false;
        this.forceUpdate();
    }
 
    render () {
        let noFiles = this.state.fileNames.length === 0;
        let cols = this.getColumns();
        return (
            <Modal
                fullScreen
                contentLabel={"View File"}
                id={"fileLibrary"}
                onRequestClose={this.props.onRequestClose}
            >
            <div className={styles.filterBar}>
                <div className={styles.tagWrapper}>
                    {this.state.fileNames.map((tagProps, id) => (
                        <TagButton
                            active={this.state.selectedFileIndex === id}
                            className={classNames(
                                styles.filterBarItem,
                                styles.tagButton,
                                tagProps.className
                            )}
                            key={`tag-button-${id}`}
                            onClick={this.handleFileNameClick}
                            {...tagProps}
                        />
                    ))}
                </div>
            </div>
            <div
                className={classNames(styles.libraryScrollGrid, styles.withFilterBar)}
                ref={this.setFilteredDataRef}
            >
                {this.state.loaded && !noFiles && (
                    <DataTable 
                        fileName={this.state.fileNames[this.state.selectedFileIndex].tag}
                        data={this.state.fileData} 
                        header={cols.length == 0?["NO COLUMNS"]: cols} 
                        onDataChange={this.handleDataChange}
                        onAddRow={this.handleAddRow}
                        onAddColumn={this.handleAddColumn}/>
                )}
                {this.state.loaded && noFiles && (
                    <div className={tableStyles.noFiles}>
                        <p>No files have been uploaded.</p>
                        <button
                            title="Go back"
                            onClick={this.props.onRequestClose}
                        >
                            Go back
                        </button>
                    </div>
                )}
                {!this.state.loaded && (
                    <div className={styles.spinnerWrapper}>
                        <Spinner
                            large
                            level="primary"
                        />
                    </div>
                )}
                {this.state.DataFileModalVisible ? <DataFileModal 
                handleNumberButton={this.handleNumberButton}
                handleWordButton={this.handleWordButton}
                columnName={(this.state.word || this.state.number)? true: false}
                handleColumnName={this.handleAddColumn}
                onClose={this.handleDataFileModalClose}/> : null}
            </div>
        </Modal>
        );
    }
}

FileLibrary.propTypes = {
    intl: intlShape.isRequired,
    handleOpenDataFileModal: PropTypes.func.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapDispatchToProps = dispatch => ({
    handleOpenDataFileModal: () => {
        dispatch(openDataFileModal());
    }
});

export default injectIntl(connect(
    mapDispatchToProps)(FileLibrary));
