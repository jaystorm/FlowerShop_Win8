(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById("addBtn").addEventListener("click", function () {
                document.getElementById("addBtn").style.display = "none";
                document.getElementById("prgBar").style.display = "block";
                console.log("almafa");
                $data("CartItem").save({ ProductName: 'alma', Amount: 1, ProductId: 'lkj' }).then(function () {
                    $data("CartItem").readAll().then(function (a) {
                        console.log(a.length);
                        document.getElementById("addBtn").style.display = "block";
                        document.getElementById("prgBar").style.display = "none";
                        document.getElementById("adToCartFlyout").winControl.show(document.body, "top", "center");
                    });
                });
            }, false);
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.Category.Name;
            element.querySelector("article .item-title").textContent = item.Name;
            element.querySelector("article .item-subtitle").textContent = item.Price;
            element.querySelector("article .item-image").src = item.ImageUrl;
            element.querySelector("article .item-image").alt = item.Name;
            element.querySelector("article .item-content").innerHTML = item.Description;
            element.querySelector(".content").focus();
        }
    });
})();
