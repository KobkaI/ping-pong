function ErrorHandlerInterceptor($q, $rootScope) {
  return {
    // response: function(response) {
    //   return response;
    // },
    responseError: function(response) {
      $rootScope.$emit('responseError', response);
      return $q.reject(response);
    }
  }
}

ErrorHandlerInterceptor.$inject = ['$q', '$rootScope'];
angular.module('app').factory('ErrorHandlerInterceptor', ErrorHandlerInterceptor);
