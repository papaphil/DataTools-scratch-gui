import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';
import VM from "scratch-vm";
import {handleDataFileUpload, handleWebFileUpload} from '../../lib/data-file-uploader'
import Box from '../box/box.jsx';
import styles from './file-modal.css';
import CloseButton from '../close-button/close-button.jsx';
import { file } from '@babel/types';

const messages = defineMessages({
    label: {
        id: 'gui.telemetryOptIn.label',
        defaultMessage: 'Report statistics to improve Scratch',
        description: 'Scratch 3.0 telemetry modal label - for accessibility'
    },
    bodyText1: {
        defaultMessage: 'This extension allows you to upload data files to help ' + 'you learn about big data!',
        description: 'First paragraph of body text for telemetry opt-in modal',
        id: 'gui.fileModal.body1'
    },
    noButton: {
        defaultMessage: 'Upload a local file',
        description: 'Text for the upload a local file button',
        id: 'gui.fileModal.buttonLocalFileUpload'
    },
    cancelButton: {
        defaultMessage: 'Go Back',
        description: 'Text for the cancelButton',
        id: 'gui.fileModal.buttonCancel'
    },
    noTooltip: {
        defaultMessage: 'Upload a data file from your computer',
        description: 'Tooltip for upload a local file button',
        id: 'gui.telemetryOptIn.buttonToolTipUploadLocalFile'
    },
    yesButton: {
        defaultMessage: "Upload a file from the web",
        description: 'Text for web upload button',
        id: 'gui.telemetryOptIn.buttonTextWebUpload'
    },
    yesTooltip: {
        defaultMessage: 'Upload a data file from anywhere on the web!',
        description: 'Tooltip for upload web file button',
        id: 'gui.telemetryOptIn.TooltipWebFile'
    },
    enterButton: {
        defaultMessage: 'Enter',
        description: 'enter button',
        id: 'gui.fileModal.Enter'
    }
});

class FileModal extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleLocalFile',
            'handleWebFile',
            'handleFileUpload',
            'handleClose',
            'handleCancel',
            'setFileInputRef'
        ]);
            this.state = {
                uploadingWeb: false,
            }
        this.fileInput = null;
    }

    setFileInputRef(input) {
        this.fileInput = input;
    }

    handleLocalFile () {
        this.fileInput.click();
    }

    handleWebFile (e) {
        if(this.state.uploadingWeb)
        {
            console.log(document.getElementById("url").value);
            this.setState({uploadingWeb: false});
            handleWebFileUpload(document.getElementById("url").value, this.props.vm.addDataFile, (msg) => alert("Error uploading file: " + mssg));
            this.handleCancel();
        }
        else{
            this.setState({ uploadingWeb: true });
        }
    }

    handleFileUpload(e) {
        handleDataFileUpload(e.target, this.props.vm.addDataFile, (msg) => alert("Error uploading file: " + msg));
        this.handleClose();
    }

    handleClose() {
        this.setState({ uploadingWeb: false });
        this.props.onRequestClose();
    }

    handleCancel () {
        this.handleClose();
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render () {
        var content = "";
        if(this.state.uploadingWeb) {
            content = (
                <Box className={styles.buttonRow}>
                    <input type = "url" id='url' className = {styles.url} placeholder="www.example.com/mycsv.csv"/>
                    <button
                        className={styles.optIn}
                        title={this.props.intl.formatMessage(messages.noTooltip)}
                        onClick={this.handleWebFile}
                    >
                        <FormattedMessage {...messages.enterButton} />
                    </button>
                </Box>
            );//this will change to be what we need for the web file upload
        }
        else {
            content = (
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.optIn}
                        title={this.props.intl.formatMessage(messages.noTooltip)}
                        onClick={this.handleLocalFile}
                    >
                        <FormattedMessage {...messages.noButton} />
                    </button>
                    <button
                        className={styles.optIn}
                        title={this.props.intl.formatMessage(messages.yesTooltip)}
                        onClick={this.handleWebFile}
                    >
                        <FormattedMessage {...messages.yesButton} />
                    </button>
                </Box>
            );
        }
    
        return (
            <ReactModal
                isOpen
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(messages.label)}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.handleCancel}
            >
                <div dir={this.props.isRtl ? 'rtl' : 'ltr'} >
                    <Box className={styles.illustration} >
                    <CloseButton
                                className={styles.closeButton}
                                size={CloseButton.SIZE_LARGE}
                                onClick={this.handleCancel}
                            />
                    </Box>
                    <Box className={styles.body}>
                        <input ref={this.setFileInputRef} className={styles.fileInput} type="file" accept=".csv,.xml,.json" onChange={this.handleFileUpload} multiple />
                        <p><FormattedMessage {...messages.bodyText1} /></p>
                        {content}
                    </Box>
                </div>
            </ReactModal>
        );
    }
}

FileModal.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    webFile: PropTypes.bool,
    onRequestClose: PropTypes.func,//necessary to close out of the popup
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(FileModal);
