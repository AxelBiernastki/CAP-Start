sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"cap/start/capstart/test/integration/pages/TasksList",
	"cap/start/capstart/test/integration/pages/TasksObjectPage"
], function (JourneyRunner, TasksList, TasksObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('cap/start/capstart') + '/test/flp.html#app-preview',
        pages: {
			onTheTasksList: TasksList,
			onTheTasksObjectPage: TasksObjectPage
        },
        async: true
    });

    return runner;
});

