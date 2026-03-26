sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ui/test/Opa5",
    "./pages/JourneyRunner"
], function (opaTest, Opa5, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            When.onTheTasksList.onFilterBar().iExecuteSearch();
            Then.onTheTasksList.onTable().iCheckRows();
        });

        opaTest("Navigate to ObjectPage", function (When, Then) {
            When.onTheTasksList.onTable().iPressRow(0);

            Then.waitFor({
                controlType: "sap.uxap.ObjectPageLayout",
                success: function () {
                    Opa5.assert.ok(true, "A Object Page foi carregada");
                },
                errorMessage: "A Object Page nao foi carregada"
            });
        });

        opaTest("Teardown", function (Given) {
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});