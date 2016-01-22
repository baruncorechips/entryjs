"use strict";

goog.provide("Entry.RenderView");

goog.require("Entry.Dom");
goog.require("Entry.Utils");

Entry.RenderView = function(dom, align) {
    this._align = align || "CENTER";

    if (typeof dom === "string") dom = $('#' + dom);
    else dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    if (typeof window.Snap !== "function")
        return console.error("Snap library is required");

    this.view = dom;

    this.visible = true;
    this._snapId = 'renderView_' + new Date().getTime();
    this._generateView();

    this.offset = this.svgDom.offset();
    this.setWidth();

    this.snap = Snap('#' + this._snapId);

    this.svgGroup = this.snap.group();

    this.svgThreadGroup = this.svgGroup.group();
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.group();
    this.svgBlockGroup.board = this;
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        closeBlock: null,
        selectedBlockView: null
    };

    p._generateView = function() {
        var parent = this.view;
        var that = this;

        this.renderViewContainer = Entry.Dom('div', {
            'class':'renderViewContainer',
            'parent':parent
        });

        this.svgDom = Entry.Dom(
            $('<svg id="' + this._snapId +'" class="renderView_" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
            { parent: this.renderViewContainer }
        );
    };

    p.changeCode = function(code) {
        if (!(code instanceof Entry.Code))
            return console.error("You must inject code instance");
        var that = this;
        this.code = code;

        code.createView(this);
        this.align();
    };

    p.align = function() {
        var threads = this.code.getThreads();
        if (!threads || threads.length === 0) return;

        var blockView = threads[0].getFirstBlock().view;
        var vPadding = 15,
            marginFromTop = 10,
            hPadding = this._align == 'LEFT' ? 20 : this.svgDom.width()/2;

        blockView._moveTo(hPadding, marginFromTop, false);
    };

    p.hide = function() {this.view.addClass('entryRemove');};

    p.show = function() {this.view.removeClass('entryRemove');};

    p.setWidth = function() {
        this._svgWidth = this.svgDom.width();
        this.offset = this.svgDom.offset();
    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.append(this.svgThreadGroup);
        this.svgGroup.append(this.svgBlockGroup);
    };
})(Entry.RenderView.prototype);
