 (function ($data) {

    $data.Class.define('$data.Deferred', $data.PromiseHandlerBase, null, {
        constructor: function () {
            var self = this;
            var counter = 20;
            function argWaiter(args, fn) {
                setTimeout(function () {
                    if (fn) {
                        fn.apply(self.deferred.promise, args);
                    } else if(counter-- > 0) {
                        argWaiter(args, fn);
                    }
                }, 100);
            }

            self.deferred = {
                resolve: function () {
                    argWaiter(arguments, self.deferred.complete);
                },
                reject: function () {
                    argWaiter(arguments, self.deferred.error);
                }
            };
            self.deferred.promise = new WinJS.Promise(function (complete, error) {
                self.deferred.complete = complete;
                self.deferred.error = error;
            });
        },
        deferred: {},
        createCallback: function (callBack) {
            callBack = $data.typeSystem.createCallbackSetting(callBack);
            var self = this;

            return cbWrapper = {
                success: function () {
                    callBack.success.apply(self.deferred, arguments);
                    self.deferred.resolve.apply(self.deferred, arguments);
                },
                error: function () {
                    Array.prototype.push.call(arguments, self.deferred);
                    callBack.error.apply(self.deferred, arguments);
                }
            };
        },
        getPromise: function () {
            return this.deferred.promise;
        }
    }, null);

    $data.PromiseHandler = $data.Deferred;

})($data)