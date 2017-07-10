/**
 * Created by Asiel on 12/21/2016.
 */

(function() {

    'use strict';

    angular
        .module('gmsBoilerplate')
        .service('searchSrv', searchSrv);

    /*@ngInject*/
    function searchSrv() {

        var self = this;

        var R_IDX_BASED = {
            NOT_FOUND: -1
        };
        var R_OBJ_BASED = {
            NOT_FOUND: null
        };


        self.service = {
            find: fnFind,
            findCollection: fnFindCollection,
            findConditionally: fnFindConditionally,
            indexOf: fnIndexOf,
            indexOfConditionally: fnIndexOfConditionally
        };

        return self.service;

        //fn

        /**
         * Finds an element in a collection of objects. It must be provided a key-value pair or an object to match
         * against every object in the collection.
         * @param collection Collection of object where the object will be searched in.
         * @param key [Optional] Object's key to search for.
         * @param value [Optional] Key value to match against.
         * @param object [Optional] If not key-value are provided, then you can pass and entire object to match against.
         * @returns {*} Object in the collection or null If not found.
         */
        function fnFind(collection, key, value, object) {
            //asserts
            //check for key value

            var isKeyValue = (typeof key !== 'undefined' && key !== null) && (typeof value !== 'undefined' && value !== null);
            //check for entire object
            var isObject = (typeof object !== 'undefined' && object !== null);
            //check for collection
            var isCollection = (typeof collection !== 'undefined' && collection !== null) && angular.isArray(collection);

            if (isCollection && (isKeyValue || isObject)) {
                var l = collection.length;
                for (var i = 0; i < l; i++){
                    if (isKeyValue) {
                        if (collection[i][key] == value) {
                            return collection[i];
                        }
                    }
                    else if (collection[i] == object){
                        return collection[i];
                    }
                }
            }

            return R_OBJ_BASED.NOT_FOUND;
        }

        /**
         * Finds a collection of elements in a collection of objects. It must be provided a key-value pair or an object to match
         * against every object in the collection.
         * @param collection Collection of object where the object will be searched in.
         * @param key [Optional] Object's key to search for.
         * @param values [Optional] Key value to match against.
         * @param objects [Optional] If not key-value are provided, then you can pass and entire object to match against.
         * @returns {*} Object in the collection or null If not found.
         */
        function fnFindCollection(collection, key, values, objects) {
            //asserts
            //check for key value

            var isKeyValue = (typeof key !== 'undefined' && key !== null) && (typeof values !== 'undefined' && values !== null);
            //check for entire object
            var isObject = (typeof objects !== 'undefined' && objects !== null);
            //check for collection
            var isCollection = (typeof collection !== 'undefined' && collection !== null) && angular.isArray(collection);

            if (isCollection && (isKeyValue || isObject)) {
                var r = [];
                var l = collection.length;
                for (var i = 0; i < l; i++){
                    if (isKeyValue) {
                        if (values.indexOf(collection[i][key]) !== -1) {
                            r.push(collection[i]);
                        }
                    }
                    else if (objects.indexOf(collection[i]) !== -1){
                        r.push(collection[i]);
                    }
                }
                return r;
            }

            return R_OBJ_BASED.NOT_FOUND;
        }

        /**
         * Finds an element in a collection of objects. It must be provided a collection of key-value pairs or an object to match
         * against every object in the collection.
         * @param collection Collection of object where the object will be searched in.
         * @param conditionals [Optional] Conditionals to search for. It must be an array of objects which contains properties
         * (keys) with the associated values that the object must fulfil, in the format
         * [{key: "key1", value: "value1"}, {key: "key2", value: "value2"}, ... {key: "keyN", value: "valueN"}]
         * @param object [Optional] If the parameter 'conditionals' is not provided, then you can pass and entire object to match against to.
         * @returns {*} Object in the collection or null If not found.
         */
        function fnFindConditionally(collection, conditionals, object) {
            //asserts
            //check for conditionals values
            var isConditionals = (typeof conditionals !== 'undefined' && conditionals !== null) && angular.isArray(conditionals);
            //check for entire object
            var isObject = (typeof object !== 'undefined' && object !== null);
            //check for collection
            var isCollectionOK = (typeof collection !== 'undefined' && collection !== null) && angular.isArray(collection) && collection.length > 0;

            if (isCollectionOK && (isConditionals || isObject)) {

                var l = collection.length;
                var cl, k, kKey, kValue, flag;
                for (var i = 0; i < l; i++){

                    if (isConditionals) {
                        flag = true;
                        k = 0;
                        cl = conditionals.length;
                        while (k < cl && flag){
                            kKey = conditionals[k]["key"];
                            kValue = conditionals[k]["value"];
                            if (collection[i][kKey] != kValue) {
                                flag = false;
                            }
                            k++;
                        }

                        if (flag){
                            return collection[i];
                        }

                    }
                    else if (collection[i] == object){
                        return collection[i];
                    }

                }

            }
            return R_OBJ_BASED.NOT_FOUND;

        }

        /**
         * Finds an element's position in a collection of objects. It must be provided a key-value pair or an object to match
         * against every object in the collection.
         * @param collection Collection of object where the object will be searched in.
         * @param key [Optional] Object's key to search for.
         * @param value [Optional] Key value to match against.
         * @param object [Optional] If not key-value are provided, then you can pass and entire object to match against.
         * @returns {*} Index of the object in the collection. -1 If not found.
         */
        function fnIndexOf(collection, key, value, object) {
            //asserts
            //check for key value
            var isKeyValue = (typeof key !== 'undefined' && key !== null) && (typeof value !== 'undefined' && value !== null);
            //check for entire object
            var isObject = (typeof object !== 'undefined' && object !== null);
            //check for collection
            var isCollection = (typeof collection !== 'undefined' && collection !== null) && angular.isArray(collection);

            if (isCollection && (isKeyValue || isObject)) {
                var l = collection.length;
                for (var i = 0; i < l; i++){
                    if (isKeyValue) {
                        if (collection[i][key] == value) {
                            return i;
                        }
                    }
                    else if (collection[i] == object){
                        return i;
                    }
                }
            }

            return R_IDX_BASED.NOT_FOUND;
        }

        /**
         * Finds an element's index in a collection of objects. It must be provided a collection of key-value pairs or an object to match
         * against every object in the collection.
         * @param collection Collection of object where the object will be searched in.
         * @param conditionals [Optional] Conditionals to search for. It must be an array of objects which contains properties
         * (keys) with the associated values that the object must fulfil, in the format
         * [{key: "key1", value: "value1"}, {key: "key2", value: "value2"}, ... {key: "keyN", value: "valueN"}]
         * @param object [Optional] If the parameter 'conditionals' is not provided, then you can pass and entire object to match against to.
         * @returns {*} Object in the collection. -1 If not found.
         */
        function fnIndexOfConditionally(collection, conditionals, object) {
            //asserts
            //check for conditionals values
            var isConditionals = (typeof conditionals !== 'undefined' && conditionals !== null) && angular.isArray(conditionals);
            //check for entire object
            var isObject = (typeof object !== 'undefined' && object !== null);
            //check for collection
            var isCollectionOK = (typeof collection !== 'undefined' && collection !== null) && angular.isArray(collection) && collection.length > 0;

            if (isCollectionOK && (isConditionals || isObject)) {

                var l = collection.length;
                var cl, k, kKey, kValue, flag;
                for (var i = 0; i < l; i++){

                    if (isConditionals) {
                        flag = true;
                        k = 0;
                        cl = conditionals.length;
                        while (k < cl && flag){
                            kKey = conditionals[k]["key"];
                            kValue = conditionals[k]["value"];
                            if (collection[i][kKey] != kValue) {
                                flag = false;
                            }
                            k++;
                        }

                        if (flag){
                            return i;
                        }

                    }
                    else if (collection[i] == object){
                        return i;
                    }

                }

            }
            return R_IDX_BASED.NOT_FOUND;

        }

    }

}());
