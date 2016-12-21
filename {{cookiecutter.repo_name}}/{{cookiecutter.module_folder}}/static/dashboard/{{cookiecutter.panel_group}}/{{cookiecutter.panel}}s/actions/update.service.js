/**
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s.update.service
   * @description Service for the {{cookiecutter.panel}} update modal
   */
  angular
    .module('horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s')
    .factory('horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s.update.service', updateService);

  updateService.$inject = [
    '$location',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s.events',
    'horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s.resourceType',
    'horizon.dashboard.{{cookiecutter.panel_group}}.{{cookiecutter.panel}}s.workflow'
  ];

  function updateService(
    $location, policy, actionResult, gettext, $qExtensions, wizardModalService,
    toast, events, resourceType, workflow
  ) {

    var scope;
    var message = {
      success: gettext('{{cookiecutter.panel_func}} %s was successfully updated.')
    };

    var service = {
      initScope: initScope,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initScope($scope) {
      scope = $scope;
      scope.workflow = workflow;
      scope.$on('$destroy', function() {
      });
    }

    function perform(selected) {
      // to use selected item for step controllers
      scope.selected = selected;
      return wizardModalService.modal({
        scope: scope,
        workflow: workflow.init('update', selected.id),
        submit: submit
      }).result;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
      //return policy.ifAllowed({ rules: [['{{cookiecutter.panel}}', 'add_{{cookiecutter.panel}}']] });
    }

    function submit(){
      return workflow.save().then(success);
    }

    function success(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      var result = actionResult.getActionResult()
                   .updated(resourceType, response.data.id);
      if(result.result.failed.length == 0 && result.result.updated.length > 0){
        $location.path('/{{cookiecutter.dashboard}}/{{cookiecutter.panel}}s');
      }else{
        return result.result;
      }
    }
  }
})();