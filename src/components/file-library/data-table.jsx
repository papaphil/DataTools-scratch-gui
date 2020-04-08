/*
Created by: Alex Burroughs, Zachary Fernbaugh, Phillip Carroll, and Nathanael Hood with the KSU Scratch Data Tools group
See LICENSE for more information.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DataTableInput from './data-table-input.jsx';

import skipIcon from './icon--skip.svg';
import largeSkipIcon from './icon--skip-more.svg';

import styles from './data-table.css';

const defaultState = {
  selectedRow: -1,
  selectedCol: -1,
  headerPage: 0
}

const HEADER_PAGE_SIZE = 5;

class DataTable extends Component {
    constructor(props) {
      super(props);

      this.state = {
        ...defaultState,
        highlightedRows: [],
      }

      this.tableCellClicked = this.tableCellClicked.bind(this);
      this.handleTableChange = this.handleTableChange.bind(this);
      this.onEditingCancel = this.onEditingCancel.bind(this);
      this.onHighlightRow = this.onHighlightRow.bind(this);
      this.isInPage = this.isInPage.bind(this);
      this.handleSkip = this.handleSkip.bind(this);
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

    onHighlightRow(rowNum) {
      let rows = this.state.highlightedRows;
      if(rows.includes(rowNum)) {
        rows = rows.filter(x => x !== rowNum);
        this.setState({ highlightedRows: rows });
      }
      else {
        rows.push(rowNum);
        this.setState({ highlightedRows: rows });
      }
    }

    componentDidUpdate(oldProps) {
      if(oldProps.fileName !== this.props.fileName)
          this.setState({ ...defaultState, highlightedRows: [] });
    }

    renderTableData() {
      let { data, header } = this.props;
      let { selectedCol, selectedRow, highlightedRows } = this.state;
      return data.map((obj, row) => {
        return (
            <tr key={row}>
              <td 
                className={highlightedRows.includes(row) ? classNames(styles.rowNum, styles.highlighted) : styles.rowNum} 
                onClick={() => {this.onHighlightRow(row)}}
              >
                {row + 1}
              </td>
              {header.map((prop, col) => {
                if(this.isInPage(col)) {
                  if(selectedRow === row && selectedCol === col) {
                    return (
                      <td key={col} className={classNames(styles.rowData, styles.editing)}>
                        <DataTableInput defaultValue={obj[prop]} onAccept={this.handleTableChange} onCancel={this.onEditingCancel}/>
                      </td>
                    )
                  }
                  else {
                    let cellClass;
                    if(highlightedRows.includes(row)) {
                      cellClass = classNames(styles.rowData, styles.highlighted);
                    }
                    else {
                      cellClass = styles.rowData;
                    }
                    return <td key={col} className={cellClass} onClick={(e) => this.tableCellClicked(row, col)}>{obj[prop]}</td>
                  }
                }
                else return null;
                })
              }
            </tr>
        )
      })
    }

    isInPage(index) {
      let { headerPage } = this.state;
      let pageMin = headerPage * HEADER_PAGE_SIZE;
      let pageMax = pageMin + HEADER_PAGE_SIZE;

      return index >= pageMin && index < pageMax;
    }

    renderTableHeader(showPagination) {
      let { header }  = this.props;
      return header.map((key, index) => {
        if(this.isInPage(index)) {
          return <th className={showPagination ? styles.withPagination : ""} key={index}>{key}</th>
        }
      })
    }

    handleSkip(large, forwards) {
      let { headerPage } = this.state;
      let headerLength = this.props.header.length;
      if(large) {
        if(forwards) {
          while((headerPage * HEADER_PAGE_SIZE) + HEADER_PAGE_SIZE < headerLength) {
            headerPage++;
          }
          this.setState({ headerPage });
        }
        else {
          this.setState({ headerPage: 0 });
        }
      }
      else {
        headerPage = forwards ? headerPage + 1 : headerPage - 1;

        if(headerPage * HEADER_PAGE_SIZE < headerLength && headerPage * HEADER_PAGE_SIZE >= 0) {
          this.setState({ headerPage });
        }
      }
    }

    render() {
      let { headerPage } = this.state;

      let showPagination = this.props.header.length > HEADER_PAGE_SIZE;

      let data = this.renderTableData();
      let header = this.renderTableHeader(showPagination);

      let minPage = headerPage * HEADER_PAGE_SIZE + 1;
      let maxPage = Math.min((minPage + HEADER_PAGE_SIZE - 1), header.length);
      return (
        <div className={styles.dataTableWrapper}>
          {showPagination && (
            <div className={styles.headerPaginator}>
              {minPage > HEADER_PAGE_SIZE && <img
                className={classNames(styles.skipIcon, styles.farLeft)}
                draggable={false}
                src={largeSkipIcon}
                onClick={() => this.handleSkip(true, false)}
              />}
              {minPage > HEADER_PAGE_SIZE && <img
                className={classNames(styles.skipIcon, styles.left)}
                draggable={false}
                src={skipIcon}
                onClick={() => this.handleSkip(false, false)}
              />}
              Showing columns {minPage} - {maxPage} of {header.length}
              {maxPage <= (header.length - HEADER_PAGE_SIZE) && <img
                className={classNames(styles.skipIcon, styles.right)}
                draggable={false}
                src={skipIcon}
                onClick={() => this.handleSkip(false, true)}
              />}
              {maxPage <= (header.length - HEADER_PAGE_SIZE) && <img
                className={classNames(styles.skipIcon, styles.farRight)}
                draggable={false}
                src={largeSkipIcon}
                onClick={() => this.handleSkip(true, true)}
              />}
            </div>
          )}
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={showPagination ? styles.withPagination : ""}> </th>
                {header}
              </tr>
            </thead>
            <tbody>
              {data}
              <tr>
                <td colSpan={HEADER_PAGE_SIZE + 1} className={styles.addRow}>
                  <button title="Add row" onClick={this.props.onAddRow}>+ Add Row</button>
                  <button title="Add Column" onClick={this.props.onAddColumn}>+ Add Column</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
   }
}

DataTable.propTypes = {
  fileName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDataChange: PropTypes.func.isRequired,
  onAddRow: PropTypes.func.isRequired,
  onAddColumn: PropTypes.func.isRequired
}

export default DataTable