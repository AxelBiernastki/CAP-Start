sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'cap.start.capstart',
            componentId: 'TasksObjectPage',
            contextPath: '/Tasks'
        },
        CustomPageDefinitions
    );
});