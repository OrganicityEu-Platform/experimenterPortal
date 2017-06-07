(function() {
    'use strict';

    function findByUrn(urn, array) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i].urn === urn) {
                return array[i];
            }
        }
        return null;
    }

    function newTags(news, olds) {
        var aux = [];
        for (var i = 0; i < news.length; ++i) {
            var p = false;
            for (var j = 0; j < olds.length; ++j) {
                if (olds[j].urn === news[i].urn) {
                    p = true;
                    break;
                }
            }
            if (p === false) {
                aux.push(news[i]);
            }
        }
        return aux;
    }

    function removedTags(news, olds) {
        var aux = [];
        for (var i = 0; i < olds.length; ++i) {
            var p = true;
            for (var j = 0; j < news.length; ++j) {
                if (news[j].urn === olds[i].urn) {
                    p = false;
                    break;
                }
            }
            if (p === true) {
                aux.push(olds[i].urn);
            }
        }
        return aux;
    }

    angular.module('app.components').factory('Annotations', [
        'NewTagsAPI',
        Annotations
    ]);

    function Annotations(
        NewTagsAPI
    ) {
        var allDomains = [];
        var selectedDomains = [];
        var service = {
            loadAllDomains: loadAllDomains,
            getAllDomains: getAllDomains,
            loadSelectedDomains: loadSelectedDomains,
            ///////////////////////////////////////
            getSelectedDomains: getSelectedDomains,
            ///////////////////////////////////////
            updateTags: updateTags,
            createDomain: createDomain,
            updateDomains: updateDomains                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        };

        return service;

        function updateDomains(expId, doms, s, f) {
            var urn = 'urn:oc:entity:experiments:' + expId;

            var adds = newTags(doms, selectedDomains);
            var rems = removedTags(doms, selectedDomains);

            if (adds.length === 0 && rems.length === 0) {
                return s(doms);
            }

            if (adds.length > 0) {
                var toaddStr = '';
                var fdel = true;
                for (var i = 0; i < adds.length; ++i) {
                    if (fdel) {
                        toaddStr += adds[i].urn;
                        fdel = false;
                    } else {
                        toaddStr += ',' + adds[i].urn;
                    }
                }
                NewTagsAPI.addDomains(urn, toaddStr, function() {
                    if (rems.length > 0) {
                        selectedDomains += adds;
                        NewTagsAPI.deleteDomains(urn, rems.join(','), function() {
                            selectedDomains = doms;
                            return s(angular.copy(selectedDomains));
                        }, function() {
                            return f(angular.copy(selectedDomains));
                        });
                    } else {
                        selectedDomains = doms;
                        return s(angular.copy(selectedDomains));
                    }
                }, function() {
                    f(angular.copy(selectedDomains));
                });

            } else if (rems.length > 0) {
                NewTagsAPI.deleteDomains(urn, rems.join(','), function() {
                    selectedDomains = doms;
                    return s(angular.copy(selectedDomains));
                }, function() {
                    return f(angular.copy(selectedDomains));
                });
            }
        }

        function loadAllDomains(success, fail) {
            NewTagsAPI.getAllDomains(function (doms) {
                allDomains = doms instanceof Array ? doms : [];
                return success();
            }, function () {
                allDomains = [];
                return fail();
            });
        }

        function getAllDomains() {
            return allDomains;
        }

        function loadSelectedDomains(expId, success, fail) {
            var urn = 'urn:oc:entity:experiments:' + expId;
            NewTagsAPI.getDomains(urn, function(doms) {
                selectedDomains = doms instanceof Array ? doms : [];
                return success();
            }, function() {
                selectedDomains = [];
                return fail();
            });
        }

        function getSelectedDomains() {
            return selectedDomains;
        }

        function createDomain(expId, dom, success, fail) {
            var expUrn = 'urn:oc:entity:experiments:' + expId;
            NewTagsAPI.createDomain(dom, function() {
                allDomains.push(dom);
                NewTagsAPI.addDomains(expUrn, dom.urn, function() {
                    selectedDomains.push(dom);
                    return success();
                }, fail);
            }, fail);
        }

        function updateTags(dom, s, f) {
            var prevDom = findByUrn(dom.urn, allDomains);
            if (prevDom === null) {
                return f();
            }

            var toAdd = newTags(dom.tags, prevDom.tags);
            var toRemove = removedTags(dom.tags, prevDom.tags);

            if (toAdd.length === 0 && toRemove.length === 0) {
                return s(angular.copy(prevDom.tags));
            }

            if (toAdd.length > 0) {
                NewTagsAPI.addTags(dom.urn, toAdd, function() {
                    prevDom.tags = prevDom.tags.concat(toAdd);
                    if (toRemove.length === 0) {
                        return s(angular.copy(prevDom.tags));
                    }
                    return NewTagsAPI.deleteTags(dom.urn, toRemove.join(','),
                        function() {
                            prevDom.tags = dom.tags;
                            return s(angular.copy(prevDom.tags));
                        },
                        function() {
                            return f(angular.copy(prevDom.tags));
                        }
                    );
                }, function () {
                    return f(angular.copy(prevDom.tags));
                });
            } else if (toRemove.length > 0) {
                NewTagsAPI.deleteTags(dom.urn, toRemove.join(','),
                    function() {
                        prevDom.tags = dom.tags;
                        return s(angular.copy(prevDom.tags));
                    },
                    function() {
                        return f(angular.copy(prevDom.tags));
                    });
            }
        }


    }
})();
