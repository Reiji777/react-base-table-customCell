import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { FixedSizeGrid as Grid } from 'react-window';
import Header from './TableHeader';
/**
 * A wrapper of the Grid for internal only
 */

var GridTable = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(GridTable, _React$PureComponent);

  function GridTable(props) {
    var _this;

    _this = _React$PureComponent.call(this, props) || this;
    _this._setHeaderRef = _this._setHeaderRef.bind(_assertThisInitialized(_this));
    _this._setBodyRef = _this._setBodyRef.bind(_assertThisInitialized(_this));
    _this._itemKey = _this._itemKey.bind(_assertThisInitialized(_this));
    _this._handleItemsRendered = _this._handleItemsRendered.bind(_assertThisInitialized(_this));
    _this.renderRow = _this.renderRow.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = GridTable.prototype;

  _proto.forceUpdateTable = function forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
  };

  _proto.scrollToPosition = function scrollToPosition(args) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
  };

  _proto.scrollToTop = function scrollToTop(scrollTop) {
    this.bodyRef && this.bodyRef.scrollTo({
      scrollTop: scrollTop
    });
  };

  _proto.scrollToLeft = function scrollToLeft(scrollLeft) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition({
      scrollLeft: scrollLeft
    });
  };

  _proto.scrollToRow = function scrollToRow(rowIndex, align) {
    if (rowIndex === void 0) {
      rowIndex = 0;
    }

    if (align === void 0) {
      align = 'auto';
    }

    this.bodyRef && this.bodyRef.scrollToItem({
      rowIndex: rowIndex,
      align: align
    });
  };

  _proto.renderRow = function renderRow(args) {
    var _this$props = this.props,
        data = _this$props.data,
        columns = _this$props.columns,
        rowRenderer = _this$props.rowRenderer;
    var rowData = data[args.rowIndex];
    return rowRenderer(_objectSpread({}, args, {
      columns: columns,
      rowData: rowData
    }));
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        containerStyle = _this$props2.containerStyle,
        classPrefix = _this$props2.classPrefix,
        className = _this$props2.className,
        data = _this$props2.data,
        frozenData = _this$props2.frozenData,
        width = _this$props2.width,
        height = _this$props2.height,
        rowHeight = _this$props2.rowHeight,
        headerWidth = _this$props2.headerWidth,
        bodyWidth = _this$props2.bodyWidth,
        useIsScrolling = _this$props2.useIsScrolling,
        onScroll = _this$props2.onScroll,
        hoveredRowKey = _this$props2.hoveredRowKey,
        overscanRowCount = _this$props2.overscanRowCount,
        style = _this$props2.style,
        onScrollbarPresenceChange = _this$props2.onScrollbarPresenceChange,
        rest = _objectWithoutPropertiesLoose(_this$props2, ["containerStyle", "classPrefix", "className", "data", "frozenData", "width", "height", "rowHeight", "headerWidth", "bodyWidth", "useIsScrolling", "onScroll", "hoveredRowKey", "overscanRowCount", "style", "onScrollbarPresenceChange"]);

    var headerHeight = this._getHeaderHeight();

    var frozenRowCount = frozenData.length;
    var frozenRowsHeight = rowHeight * frozenRowCount;
    var cls = cn(classPrefix + "__table", className);
    var containerProps = containerStyle ? {
      style: containerStyle
    } : null;
    return React.createElement("div", _extends({
      role: "table",
      className: cls
    }, containerProps), React.createElement(Grid, _extends({}, rest, {
      className: classPrefix + "__body",
      ref: this._setBodyRef,
      data: data,
      itemKey: this._itemKey,
      frozenData: frozenData,
      width: width,
      height: Math.max(height - headerHeight - frozenRowsHeight, 0),
      rowHeight: rowHeight,
      rowCount: data.length,
      overscanRowCount: overscanRowCount,
      columnWidth: bodyWidth,
      columnCount: 1,
      overscanColumnCount: 0,
      useIsScrolling: useIsScrolling,
      hoveredRowKey: hoveredRowKey,
      onScroll: onScroll,
      onItemsRendered: this._handleItemsRendered,
      children: this.renderRow
    })), headerHeight + frozenRowsHeight > 0 && // put header after body and reverse the display order via css
    // to prevent header's shadow being covered by body
    React.createElement(Header, _extends({}, rest, {
      className: classPrefix + "__header",
      ref: this._setHeaderRef,
      data: data,
      frozenData: frozenData,
      width: width,
      height: Math.min(headerHeight + frozenRowsHeight, height),
      rowWidth: headerWidth,
      rowHeight: rowHeight,
      headerHeight: this.props.headerHeight,
      headerRenderer: this.props.headerRenderer,
      rowRenderer: this.props.rowRenderer,
      hoveredRowKey: frozenRowCount > 0 ? hoveredRowKey : null
    })));
  };

  _proto._setHeaderRef = function _setHeaderRef(ref) {
    this.headerRef = ref;
  };

  _proto._setBodyRef = function _setBodyRef(ref) {
    this.bodyRef = ref;
  };

  _proto._itemKey = function _itemKey(_ref) {
    var rowIndex = _ref.rowIndex;
    var _this$props3 = this.props,
        data = _this$props3.data,
        rowKey = _this$props3.rowKey;
    return data[rowIndex][rowKey];
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

  _proto._handleItemsRendered = function _handleItemsRendered(_ref2) {
    var overscanRowStartIndex = _ref2.overscanRowStartIndex,
        overscanRowStopIndex = _ref2.overscanRowStopIndex,
        visibleRowStartIndex = _ref2.visibleRowStartIndex,
        visibleRowStopIndex = _ref2.visibleRowStopIndex;
    this.props.onRowsRendered({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex
    });
  };

  return GridTable;
}(React.PureComponent);

GridTable.propTypes = {
  containerStyle: PropTypes.object,
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  headerWidth: PropTypes.number.isRequired,
  bodyWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  frozenData: PropTypes.arrayOf(PropTypes.object),
  useIsScrolling: PropTypes.bool,
  overscanRowCount: PropTypes.number,
  hoveredRowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  onScrollbarPresenceChange: PropTypes.func,
  onScroll: PropTypes.func,
  onRowsRendered: PropTypes.func,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired
};
export default GridTable;
//# sourceMappingURL=GridTable.js.map