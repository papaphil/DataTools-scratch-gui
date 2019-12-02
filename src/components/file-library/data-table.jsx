import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DataTableInput from './data-table-input.jsx';

import styles from './data-table.css';

const defaultState = {
  selectedRow: -1,
  selectedCol: -1
}

class DataTable extends Component {
    constructor(props) {
      super(props);

      this.state = defaultState

      this.tableCellClicked = this.tableCellClicked.bind(this);
      this.handleTableChange = this.handleTableChange.bind(this);
      this.onEditingCancel = this.onEditingCancel.bind(this);
    }

    handleTableChange(value) {
      let { selectedRow, selectedCol } = this.state;
      this.props.onDataChange(selectedRow, selectedCol, value);
      this.setState(defaultState);
    }

    tableCellClicked(row, col) {
      this.setState({
        selectedRow: row,
        selectedCol: col
      });
    }

    onEditingCancel() {
      this.setState(defaultState);
    }

    renderTableData() {
      let { data, header } = this.props;
      return data.map((obj, row) => {
        return (
            <tr key={row}>
              <td className={styles.rowNum}>{row + 1}</td>
              {header.map((prop, col) => {
                  if(this.state.selectedRow === row && this.state.selectedCol === col) {
                    return (
                      <td key={col} className={classNames(styles.rowData, styles.editing)}>
                        <DataTableInput defaultValue={obj[prop]} onAccept={this.handleTableChange} onCancel={this.onEditingCancel}/>
                      </td>
                    )
                  }
                  else {
                    return <td key={col} className={styles.rowData} onClick={(e) => this.tableCellClicked(row, col)}>{obj[prop]}</td>
                  }
                })
              }
            </tr>
        )
      })
    }

    renderTableHeader() {
      let { header }  = this.props;
      return header.map((key, index) => {
        return <th key={index}>{key}</th>
      })
    }

    render() {
      let data = this.renderTableData();
      let header = this.renderTableHeader();
      return (
        <div className={styles.dataTableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th> </th>
                {header}
              </tr>
            </thead>
            <tbody>
              {data}
            </tbody>
          </table>
        </div>
      )
   }
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDataChange: PropTypes.func.isRequired
}

export default DataTable