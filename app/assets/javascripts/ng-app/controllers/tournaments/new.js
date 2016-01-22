(function() {
  'use strict';

  TournamentsNewCtrl.$inject =
    ['$scope', '$state', 'Tournament', 'User', 'TOURNAMENT', 'ROUND', '$rootScope'];

  function TournamentsNewCtrl($scope, $state, Tournament, User, TOURNAMENT, ROUND, $rootScope) {

    var vm = this;
    vm.tournament = new Tournament({
      status: 'Not started'
    });
    vm.users = [];
    vm.selectedPlayers = [];
    vm.rounds = [];
    vm.removeRound = removeRound;
    vm.showAddingRound = false;
    vm.statusButtons = statusButtons();

    vm.create = create;

    vm.selectAll = selectAll;
    vm.unselectAll = unselectAll;

    activate();

    function activate() {

      User.query()
        .then(function(success) {
          vm.users = success;
        }, function(error) {
          $rootScope.$emit('error', error)
        });
    };

    function create() {
      Tournament.createTournament({
          tournament: vm.tournament,
          rounds: vm.rounds,
          players: vm.selectedPlayers
        })
        .then(function(success) {
          $state.go('tournaments')
          // TODO: Could not resolve
          // $state.go('showTournament({id: '+success.id+'})');
        }, function(error){
          $rootScope.$emit('error', error.data)
        });
    };

    function setRounds(){
      vm.rounds = [];
      if(vm.tournament.roundsType == TOURNAMENT.ROUNDS_TYPES.CHAMPIONSHIP) {
        var round = new Round(ROUND.STAGES['CHAMPIONSHIP'], 1)
        vm.rounds.push(round)
      } else if(vm.tournament.roundsType == TOURNAMENT.ROUNDS_TYPES.PLAY_OFF) {
        for (var stageName in ROUND.STAGES) {
          if (stageName == 'CHAMPIONSHIP') { continue; }
          var round = new Round(ROUND.STAGES[stageName], 1)
          vm.rounds.push(round);
        }
      } else if(vm.tournament.roundsType == TOURNAMENT.ROUNDS_TYPES.CHAMPIONSHIP_AND_PLAYOFF) {
        for (var stageName in ROUND.STAGES) {
          var round = new Round(ROUND.STAGES[stageName], 1)
          vm.rounds.push(round);
        }
      };
    };

    function removeRound(round) {
      var idx = vm.rounds.indexOf(round);
      if (idx != -1) {
        vm.rounds.splice(idx, 1)
      }
    };

    function selectAll() {
      vm.selectedPlayers = angular.copy(vm.users)
    };

    function unselectAll() {
      vm.selectedPlayers = angular.copy([])
    };

    function statusButtons() {
      return [{
        name: 'Tournament',
        state: 'newTournament.tournament'
      }, {
        name: 'Players',
        state: 'newTournament.players'
      }, {
        name: 'Rounds',
        state: 'newTournament.rounds'
      }, ]
    };

    function Round(stage, sets) {
      this.name = stage.value;
      this.stage = stage;
      this.sets = sets;
      this.prevRound = null;
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (fromState.name == 'newTournament.tournament') {
        setRounds();
      }
    })

  };

  angular.module('app').controller('TournamentsNewCtrl', TournamentsNewCtrl);
})();
