(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.Category.id; },
        function groupDataSelector(item) { return item.Category; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.

    var apiKey = {
        appId: '7a13bb7f-fd50-4f81-ab48-6369e0feee6f',
        // see https://dashboard.jaystack.com for your real application key
        applicationKey: '7f9100a1-648b-4717-affa-81786bb7b1d3',
        serviceName: 'flowershopdb',
        license: 'business'
    };

    //var credentials = {
    //    user: 'admin',
    //    password: 'admin'
    //};

    var flowershopdb = new window.flowershopdb.flowershopdbService({
        name: 'oData',
        oDataServiceHost: 'https://7a13bb7f-fd50-4f81-ab48-6369e0feee6f.jaystack.net/flowershopdb'/*,
            user: credentials.user,
            password: credentials.password*/
    });
    $data.define('CartItem', {
        ProductName: String,
        ProductID: Number,
        Amount: Number
    });

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,
        flowershopDb: flowershopdb
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.Category.id, item.Name];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.Category.id === group.id; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).id === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.Category.id === reference[0] && item.Name === reference[1]) {
                return item;
            }
        }
    }

    flowershopdb.onReady(function () {
        flowershopdb.Categories.toArray().then(function (categories) {
            flowershopdb.Flowers.toArray(function (flowers) {
                flowers.forEach(function (item) {
                    var f = JSON.parse(JSON.stringify(item));
                    var c = categories.filter(function (item) { return item.id == f.Category_ID; })[0];
                    f.Category = JSON.parse(JSON.stringify(c));
                    list.push(f);
                    //item.Category = c;
                    //list.push(item);
                });
                console.log("Inserted flowers: " + flowers.length);
            });
        });
    });
})();
