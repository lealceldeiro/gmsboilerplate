/**
 * Created by Asiel on 11/6/2016.
 */

'use strict';

angular
    .module('gmsBoilerplate')
    .service('paginationSrv', paginationSrv);

/*@ngInject*/
function paginationSrv($rootScope, BROADCAST) {

    var self = this;

    var FIRST_STEP = 8;

    self.core = {
        rest: {
            offset: 0
        },

        itemsPerPage: 5,
        totalItems: 0,
        maxLinks: 7
    };

    self.service = {
        setItemsPerPage: fnSetItemsPerPage,
        setTotalItems: fnSetTotalItems,

        getOffset: getOffset,
        getItemsPerPage: getItemsPerPage,
        getTotalItems: getTotalItems,
        getMaxLinks: getMaxLinks,
        getItemsPerPageSteps: fnGetItemsPerPageSteps,
        //
        resetPagination: fnResetPagination,
        initialise: fnInitialise,
        moveTo: fnMoveTo
    };

    return self.service;

    function fnResetPagination() {
        self.core.rest.offset = 0;
        self.core.totalItems = 0;

        $rootScope.$broadcast(BROADCAST.pagination.RESET_PAGINATION);
    }

    function fnInitialise(totalItems) {
        self.core.totalItems = totalItems;
    }

    function fnSetTotalItems(t) {
        if (typeof t !== 'undefined' && t !== null) {
            self.core.totalItems = t;
        }
        else{
            self.core.totalItems = 0;
        }
    }

    /**
     * Sets a new number of items per page. If the new value of items per page is different to the old one, the
     * pagination values are resetter. After calling this method the 'search' method should be called again.
     * @param ipp
     */
    function fnSetItemsPerPage(ipp) {
        if (self.core.itemsPerPage != ipp) {
            self.service.resetPagination();
        }
        if (typeof ipp === 'undefined' || ipp === null) {
            self.core.itemsPerPage = FIRST_STEP;
        }
        else{
            self.core.itemsPerPage = ipp;
        }
    }

    function fnMoveTo(page) {
        if (typeof page === 'undefined' || page < 1 || page === null) {
            page = 1;
            $rootScope.$broadcast(BROADCAST.pagination.RESET_PAGINATION);
        }

        self.core.rest.offset = (page - 1) * self.core.itemsPerPage;
    }

    function fnGetItemsPerPageSteps() {
        var t = self.core.total <= 50 ? self.core.total : 50;
        var r = [];
        var i = 0;
        do {
            i += FIRST_STEP;
            r.push({value: i, label: i});
            if (i > 20) {
                i += FIRST_STEP;                //first step twice
            }
            if (i > 40) {
                i += FIRST_STEP;                //first step three times
            }
        }while(i <= t);

        return r;
    }

    //getters
    function getOffset() {
        return self.core.rest.offset;
    }
    function getItemsPerPage() {
        return self.core.itemsPerPage;
    }
    function getTotalItems() {
        return self.core.totalItems;
    }
    function getMaxLinks() {
        return self.core.maxLinks;
    }

}