import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import memoize from 'memoize-one';
import GridTable from './GridTable';
import TableHeaderRow from './TableHeaderRow';
import TableRow from './TableRow';
import TableHeaderCell from './TableHeaderCell';
import TableCell from './TableCell';
import Column, { Alignment, FrozenDirection } from './Column';
import SortOrder from './SortOrder';
import ExpandIcon from './ExpandIcon';
import SortIndicator from './SortIndicator';
import ColumnResizer from './ColumnResizer';
import ColumnManager from './ColumnManager';
import { renderElement, normalizeColumns, getScrollbarSize as defaultGetScrollbarSize, isObjectEqual, callOrReturn, hasChildren, flattenOnKeys, cloneArray, getValue, throttle, noop } from './utils';
var getColumns = memoize(function (columns, children) {
  return columns || normalizeColumns(children);
});

var getContainerStyle = function getContainerStyle(width, maxWidth, height) {
  return {
    width: width,
    maxWidth: maxWidth,
    height: height,
    overflow: 'hidden'
  };
};

var DEFAULT_COMPONENTS = {
  TableCell: TableCell,
  TableHeaderCell: TableHeaderCell,
  ExpandIcon: ExpandIcon,
  SortIndicator: SortIndicator
};
var RESIZE_THROTTLE_WAIT = 50; // used for memoization

var EMPTY_ARRAY = [];
/**
 * React table component
 */

var BaseTable = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(BaseTable, _React$PureComponent);

  function BaseTable(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    var columns = props.columns,
        children = props.children,
        defaultExpandedRowKeys = props.defaultExpandedRowKeys;
    _this.state = {
      scrollbarSize: 0,
      hoveredRowKey: null,
      resizingKey: null,
      resizingWidth: 0,
      expandedRowKeys: cloneArray(defaultExpandedRowKeys)
    };
    _this.columnManager = new ColumnManager(getColumns(columns, children), props.fixed);
    _this._setContainerRef = _this._setContainerRef.bind(_assertThisInitialized(_this));
    _this._setMainTableRef = _this._setMainTableRef.bind(_assertThisInitialized(_this));
    _this._setLeftTableRef = _this._setLeftTableRef.bind(_assertThisInitialized(_this));
    _this._setRightTableRef = _this._setRightTableRef.bind(_assertThisInitialized(_this));
    _this.renderExpandIcon = _this.renderExpandIcon.bind(_assertThisInitialized(_this));
    _this.renderRow = _this.renderRow.bind(_assertThisInitialized(_this));
    _this.renderRowCell = _this.renderRowCell.bind(_assertThisInitialized(_this));
    _this.renderHeader = _this.renderHeader.bind(_assertThisInitialized(_this));
    _this.renderHeaderCell = _this.renderHeaderCell.bind(_assertThisInitialized(_this));
    _this._handleScroll = _this._handleScroll.bind(_assertThisInitialized(_this));
    _this._handleVerticalScroll = _this._handleVerticalScroll.bind(_assertThisInitialized(_this));
    _this._handleRowsRendered = _this._handleRowsRendered.bind(_assertThisInitialized(_this));
    _this._handleRowHover = _this._handleRowHover.bind(_assertThisInitialized(_this));
    _this._handleRowExpand = _this._handleRowExpand.bind(_assertThisInitialized(_this));
    _this._handleColumnResize = throttle(_this._handleColumnResize.bind(_assertThisInitialized(_this)), RESIZE_THROTTLE_WAIT);
    _this._handleColumnResizeStart = _this._handleColumnResizeStart.bind(_assertThisInitialized(_this));
    _this._handleColumnResizeStop = _this._handleColumnResizeStop.bind(_assertThisInitialized(_this));
    _this._handleColumnSort = _this._handleColumnSort.bind(_assertThisInitialized(_this));
    _this._getLeftTableContainerStyle = memoize(getContainerStyle);
    _this._getRightTableContainerStyle = memoize(getContainerStyle);
    _this._flattenOnKeys = memoize(function (tree, keys, dataKey) {
      _this._depthMap = {};
      return flattenOnKeys(tree, keys, _this._depthMap, dataKey);
    });
    _this._resetColumnManager = memoize(function (columns, fixed) {
      _this.columnManager.reset(columns, fixed);
    }, isObjectEqual);
    _this._scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    _this._scrollHeight = 0;
    _this._lastScannedRowIndex = -1;
    _this._hasDataChangedSinceEndReached = true;
    _this._data = props.data;
    _this._depthMap = {};
    _this._horizontalScrollbarSize = 0;
    _this._verticalScrollbarSize = 0;
    _this._scrollbarPresenceChanged = false;
    return _this;
  }
  /**
   * Get the DOM node of the table
   */


  var _proto = BaseTable.prototype;

  _proto.getDOMNode = function getDOMNode() {
    return this.tableNode;
  }
  /**
   * Get the column manager
   */
  ;

  _proto.getColumnManager = function getColumnManager() {
    return this.columnManager;
  }
  /**
   * Get internal `expandedRowKeys` state
   */
  ;

  _proto.getExpandedRowKeys = function getExpandedRowKeys() {
    var expandedRowKeys = this.props.expandedRowKeys;
    return expandedRowKeys !== undefined ? expandedRowKeys || EMPTY_ARRAY : this.state.expandedRowKeys;
  }
  /**
   * Get the expanded state, fallback to normal state if not expandable.
   */
  ;

  _proto.getExpandedState = function getExpandedState() {
    return {
      expandedData: this._data,
      expandedRowKeys: this.getExpandedRowKeys(),
      expandedDepthMap: this._depthMap
    };
  }
  /**
   * Get the total height of all rows, including expanded rows.
   */
  ;

  _proto.getTotalRowsHeight = function getTotalRowsHeight() {
    return this._data.length * this.props.rowHeight;
  }
  /**
   * Get the total width of all columns.
   */
  ;

  _proto.getTotalColumnsWidth = function getTotalColumnsWidth() {
    return this.columnManager.getColumnsWidth();
  }
  /**
   * Forcefully re-render the inner Grid component.
   *
   * Calling `forceUpdate` on `Table` may not re-render the inner Grid since it uses `shallowCompare` as a performance optimization.
   * Use this method if you want to manually trigger a re-render.
   * This may be appropriate if the underlying row data has changed but the row sizes themselves have not.
   */
  ;

  _proto.forceUpdateTable = function forceUpdateTable() {
    this.table && this.table.forceUpdateTable();
    this.leftTable && this.leftTable.forceUpdateTable();
    this.rightTable && this.rightTable.forceUpdateTable();
  }
  /**
   * Scroll to the specified offset.
   * Useful for animating position changes.
   *
   * @param {object} offset
   */
  ;

  _proto.scrollToPosition = function scrollToPosition(offset) {
    this._scroll = offset;
    this.table && this.table.scrollToPosition(offset);
    this.leftTable && this.leftTable.scrollToTop(offset.scrollTop);
    this.rightTable && this.rightTable.scrollToTop(offset.scrollTop);
  }
  /**
   * Scroll to the specified offset vertically.
   *
   * @param {number} scrollTop
   */
  ;

  _proto.scrollToTop = function scrollToTop(scrollTop) {
    this._scroll.scrollTop = scrollTop;
    this.table && this.table.scrollToPosition(this._scroll);
    this.leftTable && this.leftTable.scrollToTop(scrollTop);
    this.rightTable && this.rightTable.scrollToTop(scrollTop);
  }
  /**
   * Scroll to the specified offset horizontally.
   *
   * @param {number} scrollLeft
   */
  ;

  _proto.scrollToLeft = function scrollToLeft(scrollLeft) {
    this._scroll.scrollLeft = scrollLeft;
    this.table && this.table.scrollToPosition(this._scroll);
  }
  /**
   * Scroll to the specified row.
   * By default, the table will scroll as little as possible to ensure the row is visible.
   * You can control the alignment of the row though by specifying an align property. Acceptable values are:
   *
   * - `auto` (default) - Scroll as little as possible to ensure the row is visible.
   * - `smart` - Same as `auto` if it is less than one viewport away, or it's the same as`center`.
   * - `center` - Center align the row within the table.
   * - `end` - Align the row to the bottom side of the table.
   * - `start` - Align the row to the top side of the table.
    * @param {number} rowIndex
   * @param {string} align
   */
  ;

  _proto.scrollToRow = function scrollToRow(rowIndex, align) {
    if (rowIndex === void 0) {
      rowIndex = 0;
    }

    if (align === void 0) {
      align = 'auto';
    }

    this.table && this.table.scrollToRow(rowIndex, align);
    this.leftTable && this.leftTable.scrollToRow(rowIndex, align);
    this.rightTable && this.rightTable.scrollToRow(rowIndex, align);
  }
  /**
   * Set `expandedRowKeys` manually.
   * This method is available only if `expandedRowKeys` is uncontrolled.
   *
   * @param {array} expandedRowKeys
   */
  ;

  _proto.setExpandedRowKeys = function setExpandedRowKeys(expandedRowKeys) {
    // if `expandedRowKeys` is controlled
    if (this.props.expandedRowKeys !== undefined) return;
    this.setState({
      expandedRowKeys: cloneArray(expandedRowKeys)
    });
  };

  _proto.renderExpandIcon = function renderExpandIcon(_ref) {
    var rowData = _ref.rowData,
        rowIndex = _ref.rowIndex,
        depth = _ref.depth,
        onExpand = _ref.onExpand;
    var _this$props = this.props,
        rowKey = _this$props.rowKey,
        expandColumnKey = _this$props.expandColumnKey,
        expandIconProps = _this$props.expandIconProps;
    if (!expandColumnKey) return null;
    var expandable = rowIndex >= 0 && hasChildren(rowData);
    var expanded = rowIndex >= 0 && this.getExpandedRowKeys().indexOf(rowData[rowKey]) >= 0;
    var extraProps = callOrReturn(expandIconProps, {
      rowData: rowData,
      rowIndex: rowIndex,
      depth: depth,
      expandable: expandable,
      expanded: expanded
    });

    var ExpandIcon = this._getComponent('ExpandIcon');

    return React.createElement(ExpandIcon, _extends({
      depth: depth,
      expandable: expandable,
      expanded: expanded
    }, extraProps, {
      onExpand: onExpand
    }));
  };

  _proto.renderRow = function renderRow(_ref2) {
    var _cn;

    var isScrolling = _ref2.isScrolling,
        columns = _ref2.columns,
        rowData = _ref2.rowData,
        rowIndex = _ref2.rowIndex,
        style = _ref2.style;
    var _this$props2 = this.props,
        rowClassName = _this$props2.rowClassName,
        rowRenderer = _this$props2.rowRenderer,
        rowEventHandlers = _this$props2.rowEventHandlers,
        expandColumnKey = _this$props2.expandColumnKey;
    var rowClass = callOrReturn(rowClassName, {
      columns: columns,
      rowData: rowData,
      rowIndex: rowIndex
    });
    var extraProps = callOrReturn(this.props.rowProps, {
      columns: columns,
      rowData: rowData,
      rowIndex: rowIndex
    });
    var rowKey = rowData[this.props.rowKey];
    var depth = this._depthMap[rowKey] || 0;
    var className = cn(this._prefixClass('row'), rowClass, (_cn = {}, _cn[this._prefixClass("row--depth-" + depth)] = !!expandColumnKey && rowIndex >= 0, _cn[this._prefixClass('row--expanded')] = !!expandColumnKey && this.getExpandedRowKeys().indexOf(rowKey) >= 0, _cn[this._prefixClass('row--hovered')] = !isScrolling && rowKey === this.state.hoveredRowKey, _cn[this._prefixClass('row--frozen')] = depth === 0 && rowIndex < 0, _cn[this._prefixClass('row--customized')] = rowRenderer, _cn));

    var rowProps = _objectSpread({}, extraProps, {
      role: 'row',
      key: "row-" + rowKey,
      isScrolling: isScrolling,
      className: className,
      style: style,
      columns: columns,
      rowIndex: rowIndex,
      rowData: rowData,
      rowKey: rowKey,
      expandColumnKey: expandColumnKey,
      depth: depth,
      rowEventHandlers: rowEventHandlers,
      rowRenderer: rowRenderer,
      cellRenderer: this.renderRowCell,
      expandIconRenderer: this.renderExpandIcon,
      onRowExpand: this._handleRowExpand,
      // for fixed table, we need to sync the hover state across the inner tables
      onRowHover: this.columnManager.hasFrozenColumns() ? this._handleRowHover : null
    });

    return React.createElement(TableRow, rowProps);
  };

  _proto.renderRowCell = function renderRowCell(_ref3) {
    var _cn2;

    var isScrolling = _ref3.isScrolling,
        columns = _ref3.columns,
        column = _ref3.column,
        columnIndex = _ref3.columnIndex,
        rowData = _ref3.rowData,
        rowIndex = _ref3.rowIndex,
        expandIcon = _ref3.expandIcon;

    if (column[ColumnManager.PlaceholderKey]) {
      return React.createElement("div", {
        key: "row-" + rowData[this.props.rowKey] + "-cell-" + column.key + "-placeholder",
        className: this._prefixClass('row-cell-placeholder'),
        style: this.columnManager.getColumnStyle(column.key)
      });
    }

    var className = column.className,
        dataKey = column.dataKey,
        dataGetter = column.dataGetter,
        cellRenderer = column.cellRenderer;

    var TableCell = this._getComponent('TableCell');

    var cellData = dataGetter ? dataGetter({
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      rowData: rowData,
      rowIndex: rowIndex
    }) : getValue(rowData, dataKey);
    var cellProps = {
      isScrolling: isScrolling,
      cellData: cellData,
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      rowData: rowData,
      rowIndex: rowIndex,
      container: this
    };
    var cell = renderElement(cellRenderer || React.createElement(TableCell, {
      className: this._prefixClass('row-cell-text')
    }), cellProps);
    var cellCls = callOrReturn(className, {
      cellData: cellData,
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      rowData: rowData,
      rowIndex: rowIndex
    });
    var cls = cn(this._prefixClass('row-cell'), cellCls, (_cn2 = {}, _cn2[this._prefixClass('row-cell--align-center')] = column.align === Alignment.CENTER, _cn2[this._prefixClass('row-cell--align-right')] = column.align === Alignment.RIGHT, _cn2));
    var extraProps = callOrReturn(this.props.cellProps, {
      cellData: cellData,
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      rowData: rowData,
      rowIndex: rowIndex
    });

    var _ref4 = extraProps || {},
        tagName = _ref4.tagName,
        rest = _objectWithoutPropertiesLoose(_ref4, ["tagName"]);

    var Tag = tagName || 'div';
    return React.createElement(Tag, _extends({
      role: "gridcell",
      key: "row-" + rowData[this.props.rowKey] + "-cell-" + column.key
    }, rest, {
      className: cls,
      style: this.columnManager.getColumnStyle(column.key)
    }), expandIcon, cell);
  };

  _proto.renderHeader = function renderHeader(_ref5) {
    var _cn3;

    var columns = _ref5.columns,
        headerIndex = _ref5.headerIndex,
        style = _ref5.style;
    var _this$props3 = this.props,
        headerClassName = _this$props3.headerClassName,
        headerRenderer = _this$props3.headerRenderer;
    var headerClass = callOrReturn(headerClassName, {
      columns: columns,
      headerIndex: headerIndex
    });
    var extraProps = callOrReturn(this.props.headerProps, {
      columns: columns,
      headerIndex: headerIndex
    });
    var className = cn(this._prefixClass('header-row'), headerClass, (_cn3 = {}, _cn3[this._prefixClass('header-row--resizing')] = !!this.state.resizingKey, _cn3[this._prefixClass('header-row--customized')] = headerRenderer, _cn3));

    var headerProps = _objectSpread({}, extraProps, {
      role: 'row',
      key: "header-" + headerIndex,
      className: className,
      style: style,
      columns: columns,
      headerIndex: headerIndex,
      headerRenderer: headerRenderer,
      cellRenderer: this.renderHeaderCell,
      expandColumnKey: this.props.expandColumnKey,
      expandIcon: this._getComponent('ExpandIcon')
    });

    return React.createElement(TableHeaderRow, headerProps);
  };

  _proto.renderHeaderCell = function renderHeaderCell(_ref6) {
    var _cn4, _cn5;

    var columns = _ref6.columns,
        column = _ref6.column,
        columnIndex = _ref6.columnIndex,
        headerIndex = _ref6.headerIndex,
        expandIcon = _ref6.expandIcon;

    if (column[ColumnManager.PlaceholderKey]) {
      return React.createElement("div", {
        key: "header-" + headerIndex + "-cell-" + column.key + "-placeholder",
        className: this._prefixClass('header-cell-placeholder'),
        style: this.columnManager.getColumnStyle(column.key)
      });
    }

    var headerClassName = column.headerClassName,
        headerRenderer = column.headerRenderer;
    var _this$props4 = this.props,
        sortBy = _this$props4.sortBy,
        sortState = _this$props4.sortState,
        headerCellProps = _this$props4.headerCellProps;

    var TableHeaderCell = this._getComponent('TableHeaderCell');

    var SortIndicator = this._getComponent('SortIndicator');

    var cellProps = {
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      headerIndex: headerIndex,
      container: this
    };
    var cell = renderElement(headerRenderer || React.createElement(TableHeaderCell, {
      className: this._prefixClass('header-cell-text')
    }), cellProps);
    var sorting, sortOrder;

    if (sortState) {
      var order = sortState[column.key];
      sorting = order === SortOrder.ASC || order === SortOrder.DESC;
      sortOrder = sorting ? order : SortOrder.ASC;
    } else {
      sorting = column.key === sortBy.key;
      sortOrder = sorting ? sortBy.order : SortOrder.ASC;
    }

    var cellCls = callOrReturn(headerClassName, {
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      headerIndex: headerIndex
    });
    var cls = cn(this._prefixClass('header-cell'), cellCls, (_cn4 = {}, _cn4[this._prefixClass('header-cell--align-center')] = column.align === Alignment.CENTER, _cn4[this._prefixClass('header-cell--align-right')] = column.align === Alignment.RIGHT, _cn4[this._prefixClass('header-cell--sortable')] = column.sortable, _cn4[this._prefixClass('header-cell--sorting')] = sorting, _cn4[this._prefixClass('header-cell--resizing')] = column.key === this.state.resizingKey, _cn4));
    var extraProps = callOrReturn(headerCellProps, {
      columns: columns,
      column: column,
      columnIndex: columnIndex,
      headerIndex: headerIndex
    });

    var _ref7 = extraProps || {},
        tagName = _ref7.tagName,
        rest = _objectWithoutPropertiesLoose(_ref7, ["tagName"]);

    var Tag = tagName || 'div';
    return React.createElement(Tag, _extends({
      role: "gridcell",
      key: "header-" + headerIndex + "-cell-" + column.key,
      onClick: column.sortable ? this._handleColumnSort : null
    }, rest, {
      className: cls,
      style: this.columnManager.getColumnStyle(column.key),
      "data-key": column.key
    }), expandIcon, cell, column.sortable && React.createElement(SortIndicator, {
      sortOrder: sortOrder,
      className: cn(this._prefixClass('sort-indicator'), (_cn5 = {}, _cn5[this._prefixClass('sort-indicator--descending')] = sortOrder === SortOrder.DESC, _cn5))
    }), column.resizable && React.createElement(ColumnResizer, {
      className: this._prefixClass('column-resizer'),
      column: column,
      onResizeStart: this._handleColumnResizeStart,
      onResizeStop: this._handleColumnResizeStop,
      onResize: this._handleColumnResize
    }));
  };

  _proto.renderMainTable = function renderMainTable() {
    var _this$props5 = this.props,
        width = _this$props5.width,
        headerHeight = _this$props5.headerHeight,
        rowHeight = _this$props5.rowHeight,
        fixed = _this$props5.fixed,
        rest = _objectWithoutPropertiesLoose(_this$props5, ["width", "headerHeight", "rowHeight", "fixed"]);

    var height = this._getTableHeight();

    var tableWidth = width - this._verticalScrollbarSize;

    if (fixed) {
      var columnsWidth = this.columnManager.getColumnsWidth(); // make sure `scrollLeft` is always integer to fix a sync bug when scrolling to end horizontally

      tableWidth = Math.max(Math.round(columnsWidth), tableWidth);
    }

    return React.createElement(GridTable, _extends({}, rest, this.state, {
      className: this._prefixClass('table-main'),
      ref: this._setMainTableRef,
      data: this._data,
      columns: this.columnManager.getMainColumns(),
      width: width,
      height: height,
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      headerWidth: tableWidth + (fixed ? this._verticalScrollbarSize : 0),
      bodyWidth: tableWidth,
      headerRenderer: this.renderHeader,
      rowRenderer: this.renderRow,
      onScroll: this._handleScroll,
      onRowsRendered: this._handleRowsRendered
    }));
  };

  _proto.renderLeftTable = function renderLeftTable() {
    if (!this.columnManager.hasLeftFrozenColumns()) return null;

    var _this$props6 = this.props,
        width = _this$props6.width,
        headerHeight = _this$props6.headerHeight,
        rowHeight = _this$props6.rowHeight,
        rest = _objectWithoutPropertiesLoose(_this$props6, ["width", "headerHeight", "rowHeight"]);

    var containerHeight = this._getFrozenContainerHeight();

    var offset = this._verticalScrollbarSize || 20;
    var columnsWidth = this.columnManager.getLeftFrozenColumnsWidth();
    return React.createElement(GridTable, _extends({}, rest, this.state, {
      containerStyle: this._getLeftTableContainerStyle(columnsWidth, width, containerHeight),
      className: this._prefixClass('table-frozen-left'),
      ref: this._setLeftTableRef,
      data: this._data,
      columns: this.columnManager.getLeftFrozenColumns(),
      width: columnsWidth + offset,
      height: containerHeight,
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      headerWidth: columnsWidth + offset,
      bodyWidth: columnsWidth + offset,
      headerRenderer: this.renderHeader,
      rowRenderer: this.renderRow,
      onScroll: this._handleVerticalScroll,
      onRowsRendered: noop
    }));
  };

  _proto.renderRightTable = function renderRightTable() {
    if (!this.columnManager.hasRightFrozenColumns()) return null;

    var _this$props7 = this.props,
        width = _this$props7.width,
        headerHeight = _this$props7.headerHeight,
        rowHeight = _this$props7.rowHeight,
        rest = _objectWithoutPropertiesLoose(_this$props7, ["width", "headerHeight", "rowHeight"]);

    var containerHeight = this._getFrozenContainerHeight();

    var columnsWidth = this.columnManager.getRightFrozenColumnsWidth();
    var scrollbarWidth = this._verticalScrollbarSize;
    return React.createElement(GridTable, _extends({}, rest, this.state, {
      containerStyle: this._getLeftTableContainerStyle(columnsWidth + scrollbarWidth, width, containerHeight),
      className: this._prefixClass('table-frozen-right'),
      ref: this._setRightTableRef,
      data: this._data,
      columns: this.columnManager.getRightFrozenColumns(),
      width: columnsWidth + scrollbarWidth,
      height: containerHeight,
      headerHeight: headerHeight,
      rowHeight: rowHeight,
      headerWidth: columnsWidth + scrollbarWidth,
      bodyWidth: columnsWidth,
      headerRenderer: this.renderHeader,
      rowRenderer: this.renderRow,
      onScroll: this._handleVerticalScroll,
      onRowsRendered: noop
    }));
  };

  _proto.renderResizingLine = function renderResizingLine() {
    var _this$props8 = this.props,
        width = _this$props8.width,
        fixed = _this$props8.fixed;
    var resizingKey = this.state.resizingKey;
    if (!fixed || !resizingKey) return null;
    var columns = this.columnManager.getMainColumns();
    var idx = columns.findIndex(function (column) {
      return column.key === resizingKey;
    });
    var column = columns[idx];
    var columnWidth = column.width,
        frozen = column.frozen;
    var leftWidth = this.columnManager.recomputeColumnsWidth(columns.slice(0, idx));
    var left = leftWidth + columnWidth;

    if (!frozen) {
      left -= this._scroll.scrollLeft;
    } else if (frozen === FrozenDirection.RIGHT) {
      var rightWidth = this.columnManager.recomputeColumnsWidth(columns.slice(idx + 1));

      if (rightWidth + columnWidth > width - this._verticalScrollbarSize) {
        left = columnWidth;
      } else {
        left = width - this._verticalScrollbarSize - rightWidth;
      }
    }

    var style = {
      left: left,
      height: this._getTableHeight() - this._horizontalScrollbarSize
    };
    return React.createElement("div", {
      className: this._prefixClass('resizing-line'),
      style: style
    });
  };

  _proto.renderFooter = function renderFooter() {
    var _this$props9 = this.props,
        footerHeight = _this$props9.footerHeight,
        footerRenderer = _this$props9.footerRenderer;
    if (footerHeight === 0) return null;
    return React.createElement("div", {
      className: this._prefixClass('footer'),
      style: {
        height: footerHeight
      }
    }, renderElement(footerRenderer));
  };

  _proto.renderEmptyLayer = function renderEmptyLayer() {
    var _this$props10 = this.props,
        data = _this$props10.data,
        footerHeight = _this$props10.footerHeight,
        emptyRenderer = _this$props10.emptyRenderer;
    if (data && data.length) return null;

    var headerHeight = this._getHeaderHeight();

    return React.createElement("div", {
      className: this._prefixClass('empty-layer'),
      style: {
        top: headerHeight,
        bottom: footerHeight
      }
    }, renderElement(emptyRenderer));
  };

  _proto.renderOverlay = function renderOverlay() {
    var overlayRenderer = this.props.overlayRenderer;
    return React.createElement("div", {
      className: this._prefixClass('overlay')
    }, !!overlayRenderer && renderElement(overlayRenderer));
  };

  _proto.render = function render() {
    var _cn6;

    var _this$props11 = this.props,
        columns = _this$props11.columns,
        children = _this$props11.children,
        width = _this$props11.width,
        fixed = _this$props11.fixed,
        data = _this$props11.data,
        frozenData = _this$props11.frozenData,
        expandColumnKey = _this$props11.expandColumnKey,
        disabled = _this$props11.disabled,
        className = _this$props11.className,
        style = _this$props11.style,
        footerHeight = _this$props11.footerHeight,
        classPrefix = _this$props11.classPrefix;

    this._resetColumnManager(getColumns(columns, children), fixed);

    if (expandColumnKey) {
      this._data = this._flattenOnKeys(data, this.getExpandedRowKeys(), this.props.rowKey);
    } else {
      this._data = data;
    } // should be after `this._data` assigned


    this._calcScrollbarSizes();

    var containerStyle = _objectSpread({}, style, {
      width: width,
      height: this._getTableHeight() + footerHeight,
      position: 'relative'
    });

    var cls = cn(classPrefix, className, (_cn6 = {}, _cn6[classPrefix + "--fixed"] = fixed, _cn6[classPrefix + "--expandable"] = !!expandColumnKey, _cn6[classPrefix + "--empty"] = data.length === 0, _cn6[classPrefix + "--has-frozen-rows"] = frozenData.length > 0, _cn6[classPrefix + "--has-frozen-columns"] = this.columnManager.hasFrozenColumns(), _cn6[classPrefix + "--disabled"] = disabled, _cn6));
    return React.createElement("div", {
      ref: this._setContainerRef,
      className: cls,
      style: containerStyle
    }, this.renderFooter(), this.renderMainTable(), this.renderLeftTable(), this.renderRightTable(), this.renderResizingLine(), this.renderEmptyLayer(), this.renderOverlay());
  };

  _proto.componentDidMount = function componentDidMount() {
    var scrollbarSize = this.props.getScrollbarSize();

    if (scrollbarSize > 0) {
      this.setState({
        scrollbarSize: scrollbarSize
      });
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var _this$props12 = this.props,
        data = _this$props12.data,
        height = _this$props12.height,
        maxHeight = _this$props12.maxHeight;

    if (data !== prevProps.data) {
      this._lastScannedRowIndex = -1;
      this._hasDataChangedSinceEndReached = true;
    }

    if (maxHeight !== prevProps.maxHeight || height !== prevProps.height) {
      this._maybeCallOnEndReached();
    }

    this._maybeScrollbarPresenceChange();
  };

  _proto._prefixClass = function _prefixClass(className) {
    return this.props.classPrefix + "__" + className;
  };

  _proto._setContainerRef = function _setContainerRef(ref) {
    this.tableNode = ref;
  };

  _proto._setMainTableRef = function _setMainTableRef(ref) {
    this.table = ref;
  };

  _proto._setLeftTableRef = function _setLeftTableRef(ref) {
    this.leftTable = ref;
  };

  _proto._setRightTableRef = function _setRightTableRef(ref) {
    this.rightTable = ref;
  };

  _proto._getComponent = function _getComponent(name) {
    if (this.props.components && this.props.components[name]) return this.props.components[name];
    return DEFAULT_COMPONENTS[name];
  };

  _proto._getHeaderHeight = function _getHeaderHeight() {
    var headerHeight = this.props.headerHeight;

    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce(function (sum, height) {
        return sum + height;
      }, 0);
    }

    return headerHeight;
  };

  _proto._getFrozenRowsHeight = function _getFrozenRowsHeight() {
    var _this$props13 = this.props,
        frozenData = _this$props13.frozenData,
        rowHeight = _this$props13.rowHeight;
    return frozenData.length * rowHeight;
  };

  _proto._getTableHeight = function _getTableHeight() {
    var _this$props14 = this.props,
        height = _this$props14.height,
        maxHeight = _this$props14.maxHeight,
        footerHeight = _this$props14.footerHeight;
    var tableHeight = height - footerHeight;

    if (maxHeight > 0) {
      var frozenRowsHeight = this._getFrozenRowsHeight();

      var totalRowsHeight = this.getTotalRowsHeight();

      var headerHeight = this._getHeaderHeight();

      var totalHeight = headerHeight + frozenRowsHeight + totalRowsHeight + this._horizontalScrollbarSize;
      tableHeight = Math.min(totalHeight, maxHeight - footerHeight);
    }

    return tableHeight;
  };

  _proto._getBodyHeight = function _getBodyHeight() {
    return this._getTableHeight() - this._getHeaderHeight() - this._getFrozenRowsHeight();
  };

  _proto._getFrozenContainerHeight = function _getFrozenContainerHeight() {
    var maxHeight = this.props.maxHeight;
    var tableHeight = this._getTableHeight() - (this._data.length > 0 ? this._horizontalScrollbarSize : 0); // in auto height mode tableHeight = totalHeight

    if (maxHeight > 0) return tableHeight;

    var totalHeight = this.getTotalRowsHeight() + this._getHeaderHeight() + this._getFrozenRowsHeight();

    return Math.min(tableHeight, totalHeight);
  };

  _proto._calcScrollbarSizes = function _calcScrollbarSizes() {
    var _this$props15 = this.props,
        fixed = _this$props15.fixed,
        width = _this$props15.width;
    var scrollbarSize = this.state.scrollbarSize;
    var totalRowsHeight = this.getTotalRowsHeight();
    var totalColumnsWidth = this.getTotalColumnsWidth();
    var prevHorizontalScrollbarSize = this._horizontalScrollbarSize;
    var prevVerticalScrollbarSize = this._verticalScrollbarSize;

    if (scrollbarSize === 0) {
      this._horizontalScrollbarSize = 0;
      this._verticalScrollbarSize = 0;
    } else {
      // we have to set `this._horizontalScrollbarSize` before calling `this._getBodyHeight`
      if (!fixed || totalColumnsWidth <= width - scrollbarSize) {
        this._horizontalScrollbarSize = 0;
        this._verticalScrollbarSize = totalRowsHeight > this._getBodyHeight() ? scrollbarSize : 0;
      } else {
        if (totalColumnsWidth > width) {
          this._horizontalScrollbarSize = scrollbarSize;
          this._verticalScrollbarSize = totalRowsHeight > this._getBodyHeight() - this._horizontalScrollbarSize ? scrollbarSize : 0;
        } else {
          this._horizontalScrollbarSize = 0;
          this._verticalScrollbarSize = 0;

          if (totalRowsHeight > this._getBodyHeight()) {
            this._horizontalScrollbarSize = scrollbarSize;
            this._verticalScrollbarSize = scrollbarSize;
          }
        }
      }
    }

    if (prevHorizontalScrollbarSize !== this._horizontalScrollbarSize || prevVerticalScrollbarSize !== this._verticalScrollbarSize) {
      this._scrollbarPresenceChanged = true;
    }
  };

  _proto._maybeScrollbarPresenceChange = function _maybeScrollbarPresenceChange() {
    if (this._scrollbarPresenceChanged) {
      var onScrollbarPresenceChange = this.props.onScrollbarPresenceChange;
      this._scrollbarPresenceChanged = false;
      onScrollbarPresenceChange({
        size: this.state.scrollbarSize,
        horizontal: this._horizontalScrollbarSize > 0,
        vertical: this._verticalScrollbarSize > 0
      });
    }
  };

  _proto._maybeCallOnEndReached = function _maybeCallOnEndReached() {
    var _this$props16 = this.props,
        onEndReached = _this$props16.onEndReached,
        onEndReachedThreshold = _this$props16.onEndReachedThreshold;
    var scrollTop = this._scroll.scrollTop;
    var scrollHeight = this.getTotalRowsHeight();

    var clientHeight = this._getBodyHeight();

    if (!onEndReached || !clientHeight || !scrollHeight) return;
    var distanceFromEnd = scrollHeight - scrollTop - clientHeight + this._horizontalScrollbarSize;

    if (this._lastScannedRowIndex >= 0 && distanceFromEnd <= onEndReachedThreshold && (this._hasDataChangedSinceEndReached || scrollHeight !== this._scrollHeight)) {
      this._hasDataChangedSinceEndReached = false;
      this._scrollHeight = scrollHeight;
      onEndReached({
        distanceFromEnd: distanceFromEnd
      });
    }
  };

  _proto._handleScroll = function _handleScroll(args) {
    var lastScrollTop = this._scroll.scrollTop;
    this.scrollToPosition(args);
    this.props.onScroll(args);
    if (args.scrollTop > lastScrollTop) this._maybeCallOnEndReached();
  };

  _proto._handleVerticalScroll = function _handleVerticalScroll(_ref8) {
    var scrollTop = _ref8.scrollTop;
    var lastScrollTop = this._scroll.scrollTop;
    this.scrollToTop(scrollTop);
    if (scrollTop > lastScrollTop) this._maybeCallOnEndReached();
  };

  _proto._handleRowsRendered = function _handleRowsRendered(args) {
    this.props.onRowsRendered(args);

    if (args.overscanStopIndex > this._lastScannedRowIndex) {
      this._lastScannedRowIndex = args.overscanStopIndex;

      this._maybeCallOnEndReached();
    }
  };

  _proto._handleRowHover = function _handleRowHover(_ref9) {
    var hovered = _ref9.hovered,
        rowKey = _ref9.rowKey;
    this.setState({
      hoveredRowKey: hovered ? rowKey : null
    });
  };

  _proto._handleRowExpand = function _handleRowExpand(_ref10) {
    var expanded = _ref10.expanded,
        rowData = _ref10.rowData,
        rowIndex = _ref10.rowIndex,
        rowKey = _ref10.rowKey;
    var expandedRowKeys = cloneArray(this.getExpandedRowKeys());

    if (expanded) {
      if (!expandedRowKeys.indexOf(rowKey) >= 0) expandedRowKeys.push(rowKey);
    } else {
      var index = expandedRowKeys.indexOf(rowKey);

      if (index > -1) {
        expandedRowKeys.splice(index, 1);
      }
    } // if `expandedRowKeys` is uncontrolled, update internal state


    if (this.props.expandedRowKeys === undefined) {
      this.setState({
        expandedRowKeys: expandedRowKeys
      });
    }

    this.props.onRowExpand({
      expanded: expanded,
      rowData: rowData,
      rowIndex: rowIndex,
      rowKey: rowKey
    });
    this.props.onExpandedRowsChange(expandedRowKeys);
  };

  _proto._handleColumnResize = function _handleColumnResize(_ref11, width) {
    var key = _ref11.key;
    this.columnManager.setColumnWidth(key, width);
    this.setState({
      resizingWidth: width
    });
    var column = this.columnManager.getColumn(key);
    this.props.onColumnResize({
      column: column,
      width: width
    });
  };

  _proto._handleColumnResizeStart = function _handleColumnResizeStart(_ref12) {
    var key = _ref12.key;
    this.setState({
      resizingKey: key
    });
  };

  _proto._handleColumnResizeStop = function _handleColumnResizeStop() {
    var _this$state = this.state,
        resizingKey = _this$state.resizingKey,
        resizingWidth = _this$state.resizingWidth;
    this.setState({
      resizingKey: null,
      resizingWidth: 0
    });
    if (!resizingKey || !resizingWidth) return;
    var column = this.columnManager.getColumn(resizingKey);
    this.props.onColumnResizeEnd({
      column: column,
      width: resizingWidth
    });
  };

  _proto._handleColumnSort = function _handleColumnSort(event) {
    var key = event.currentTarget.dataset.key;
    var _this$props17 = this.props,
        sortBy = _this$props17.sortBy,
        sortState = _this$props17.sortState,
        onColumnSort = _this$props17.onColumnSort;
    var order = SortOrder.ASC;

    if (sortState) {
      order = sortState[key] === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    } else if (key === sortBy.key) {
      order = sortBy.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    var column = this.columnManager.getColumn(key);
    onColumnSort({
      column: column,
      key: key,
      order: order
    });
  };

  return BaseTable;
}(React.PureComponent);

BaseTable.Column = Column;
BaseTable.PlaceholderKey = ColumnManager.PlaceholderKey;
BaseTable.defaultProps = {
  classPrefix: 'BaseTable',
  rowKey: 'id',
  data: [],
  frozenData: [],
  fixed: false,
  headerHeight: 50,
  rowHeight: 50,
  footerHeight: 0,
  defaultExpandedRowKeys: [],
  sortBy: {},
  useIsScrolling: false,
  overscanRowCount: 1,
  onEndReachedThreshold: 500,
  getScrollbarSize: defaultGetScrollbarSize,
  onScroll: noop,
  onRowsRendered: noop,
  onScrollbarPresenceChange: noop,
  onRowExpand: noop,
  onExpandedRowsChange: noop,
  onColumnSort: noop,
  onColumnResize: noop,
  onColumnResizeEnd: noop
};
BaseTable.propTypes = {
  /**
   * Prefix for table's inner className
   */
  classPrefix: PropTypes.string,

  /**
   * Class name for the table
   */
  className: PropTypes.string,

  /**
   * Custom style for the table
   */
  style: PropTypes.object,

  /**
   * A collection of Column
   */
  children: PropTypes.node,

  /**
   * Columns for the table
   */
  columns: PropTypes.arrayOf(PropTypes.shape(Column.propTypes)),

  /**
   * The data for the table
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * The data be frozen to top, `rowIndex` is negative and started from `-1`
   */
  frozenData: PropTypes.arrayOf(PropTypes.object),

  /**
   * The key field of each data item
   */
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  /**
   * The width of the table
   */
  width: PropTypes.number.isRequired,

  /**
   * The height of the table, will be ignored if `maxHeight` is set
   */
  height: PropTypes.number,

  /**
   * The max height of the table, the table's height will auto change when data changes,
   * will turns to vertical scroll if reaches the max height
   */
  maxHeight: PropTypes.number,

  /**
   * The height of each table row
   */
  rowHeight: PropTypes.number.isRequired,

  /**
   * The height of the table header, set to 0 to hide the header, could be an array to render multi headers.
   */
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,

  /**
   * The height of the table footer
   */
  footerHeight: PropTypes.number,

  /**
   * Whether the width of the columns are fixed or flexible
   */
  fixed: PropTypes.bool,

  /**
   * Whether the table is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Custom renderer on top of the table component
   */
  overlayRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

  /**
   * Custom renderer when the length of data is 0
   */
  emptyRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

  /**
   * Custom footer renderer, available only if `footerHeight` is larger then 0
   */
  footerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

  /**
   * Custom header renderer
   * The renderer receives props `{ cells, columns, headerIndex }`
   */
  headerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

  /**
   * Custom row renderer
   * The renderer receives props `{ isScrolling, cells, columns, rowData, rowIndex, depth }`
   */
  rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

  /**
   * Class name for the table header, could be a callback to return the class name
   * The callback is of the shape of `({ columns, headerIndex }) => string`
   */
  headerClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * Class name for the table row, could be a callback to return the class name
   * The callback is of the shape of `({ columns, rowData, rowIndex }) => string`
   */
  rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * Extra props applied to header element
   * The handler is of the shape of `({ columns, headerIndex }) object`
   */
  headerProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Extra props applied to header cell element
   * The handler is of the shape of `({ columns, column, columnIndex, headerIndex }) => object`
   */
  headerCellProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Extra props applied to row element
   * The handler is of the shape of `({ columns, rowData, rowIndex }) => object`
   */
  rowProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Extra props applied to row cell element
   * The handler is of the shape of `({ cellData, columns, column, columnIndex, rowData, rowIndex }) => object`
   */
  cellProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * Extra props applied to ExpandIcon component
   * The handler is of the shape of `({ rowData, rowIndex, depth, expandable, expanded }) => object`
   */
  expandIconProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

  /**
   * The key for the expand column which render the expand icon if the data is a tree
   */
  expandColumnKey: PropTypes.string,

  /**
   * Default expanded row keys when initialize the table
   */
  defaultExpandedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),

  /**
   * Controlled expanded row keys
   */
  expandedRowKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),

  /**
   * A callback function when expand or collapse a tree node
   * The handler is of the shape of `({ expanded, rowData, rowIndex, rowKey }) => *`
   */
  onRowExpand: PropTypes.func,

  /**
   * A callback function when the expanded row keys changed
   * The handler is of the shape of `(expandedRowKeys) => *`
   */
  onExpandedRowsChange: PropTypes.func,

  /**
   * The sort state for the table, will be ignored if `sortState` is set
   */
  sortBy: PropTypes.shape({
    /**
     * Sort key
     */
    key: PropTypes.string,

    /**
     * Sort order
     */
    order: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC])
  }),

  /**
   * Multiple columns sort state for the table
   *
   * example:
   * ```js
   * {
   *   'column-0': SortOrder.ASC,
   *   'column-1': SortOrder.DESC,
   * }
   * ```
   */
  sortState: PropTypes.object,

  /**
   * A callback function for the header cell click event
   * The handler is of the shape of `({ column, key, order }) => *`
   */
  onColumnSort: PropTypes.func,

  /**
   * A callback function when resizing the column width
   * The handler is of the shape of `({ column, width }) => *`
   */
  onColumnResize: PropTypes.func,

  /**
   * A callback function when resizing the column width ends
   * The handler is of the shape of `({ column, width }) => *`
   */
  onColumnResizeEnd: PropTypes.func,

  /**
   * Adds an additional isScrolling parameter to the row renderer.
   * This parameter can be used to show a placeholder row while scrolling.
   */
  useIsScrolling: PropTypes.bool,

  /**
   * Number of rows to render above/below the visible bounds of the list
   */
  overscanRowCount: PropTypes.number,

  /**
   * Custom scrollbar size measurement
   */
  getScrollbarSize: PropTypes.func,

  /**
   * A callback function when scrolling the table
   * The handler is of the shape of `({ scrollLeft, scrollTop, horizontalScrollDirection, verticalScrollDirection, scrollUpdateWasRequested }) => *`
   *
   * `scrollLeft` and `scrollTop` are numbers.
   *
   * `horizontalDirection` and `verticalDirection` are either `forward` or `backward`.
   *
   * `scrollUpdateWasRequested` is a boolean. This value is true if the scroll was caused by `scrollTo*`,
   * and false if it was the result of a user interaction in the browser.
   */
  onScroll: PropTypes.func,

  /**
   * A callback function when scrolling the table within `onEndReachedThreshold` of the bottom
   * The handler is of the shape of `({ distanceFromEnd }) => *`
   */
  onEndReached: PropTypes.func,

  /**
   * Threshold in pixels for calling `onEndReached`.
   */
  onEndReachedThreshold: PropTypes.number,

  /**
   * A callback function with information about the slice of rows that were just rendered
   * The handler is of the shape of `({ overscanStartIndex, overscanStopIndex, startIndex， stopIndex }) => *`
   */
  onRowsRendered: PropTypes.func,

  /**
   * A callback function when the scrollbar presence state changed
   * The handler is of the shape of `({ size, vertical, horizontal }) => *`
   */
  onScrollbarPresenceChange: PropTypes.func,

  /**
   * A object for the row event handlers
   * Each of the keys is row event name, like `onClick`, `onDoubleClick` and etc.
   * Each of the handlers is of the shape of `({ rowData, rowIndex, rowKey, event }) => object`
   */
  rowEventHandlers: PropTypes.object,

  /**
   * A object for the custom components, like `ExpandIcon` and `SortIndicator`
   */
  components: PropTypes.shape({
    TableCell: PropTypes.func,
    TableHeaderCell: PropTypes.func,
    ExpandIcon: PropTypes.func,
    SortIndicator: PropTypes.func
  })
};
export default BaseTable;
//# sourceMappingURL=BaseTable.js.map