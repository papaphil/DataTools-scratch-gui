import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

import checkIcon from './icon--check.svg';
import xIcon from './icon--x.svg';

import styles from './data-table.css';

class DataTableInput extends Component {
    constructor(props) {
      super(props);

      this.state = {
        inputText: null,
      };

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleAccept = this.handleAccept.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            inputText: e.target.value,
        });
    }

    handleKeyDown(e) {
        if(e.key === "Enter") {
            this.handleAccept();
        }
    }

    handleAccept() {
        if(this.state.inputText && this.state.inputText !== "") {
            this.props.onAccept(this.state.inputText);
        }
        else {
            this.props.onCancel();
        }
    }

    render() {
        let value = this.state.inputText !== null ? this.state.inputText : this.props.defaultValue
        let type = typeof(this.props.defaultValue) === "number" ? "number" : "text";
        return (
            <div className={styles.rowInputContainer}>
                <input 
                    className={styles.rowInput} 
                    value={value} 
                    autoFocus 
                    onFocus={(e) => e.target.select()} 
                    onChange={this.handleInputChange} 
                    onKeyDown={this.handleKeyDown}
                    type={type}
                />
                <img
                    className={classNames(styles.icon, styles.check)}
                    draggable={false}
                    src={checkIcon}
                    onClick={this.handleAccept}
                />
                <img 
                    className={classNames(styles.icon, styles.x)}
                    draggable={false}
                    src={xIcon}
                    onClick={() => this.props.onCancel()}
                />
            </div>
      )
   }
}

DataTableInput.propTypes = {
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onAccept: PropTypes.func,
  onCancel: PropTypes.func
}

export default DataTableInput