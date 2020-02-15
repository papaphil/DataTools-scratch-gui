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
            'handleAddRow'
        ]);

        this.state = {
            fileNames: [],
            fileData: [],
            filterQuery: '',
            selectedFileIndex: 0,
            loaded: false
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
 
    render () {
        let noFiles = this.state.fileNames.length === 0;
        
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
                        header={this.getColumns()} 
                        onDataChange={this.handleDataChange}
                        onAddRow={this.handleAddRow}/>
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
            </div>
        </Modal>
        );
    }
}

FileLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(FileLibrary);
