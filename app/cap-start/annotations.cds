using TaskService as service from '../../srv/task-service';

annotate service.Tasks with {
    title       @title: '{i18n>Title}';
    description @title: '{i18n>Description}';
    status      @title: '{i18n>Status}';
    priority    @title: '{i18n>Priority}';
    dueDate     @title: '{i18n>DueDate}';
    createdBy   @title: '{i18n>CreatedBy}';
    modifiedAt  @title: '{i18n>ModifiedAt}';
    isArchived  @title: '{i18n>IsArchived}';
};

annotate service.Tasks with @(

    UI.LineItem           : [
        {
            Value                : title,
            ![@HTML5.CssDefaults]: {width: '10rem'}
        },
        {
            Value                : description,
            ![@HTML5.CssDefaults]: {width: '20rem'}
        },
        {
            Value                : status,
            ![@HTML5.CssDefaults]: {width: '10rem'}
        },
        {
            Value                : priority,
            ![@HTML5.CssDefaults]: {width: '8rem'}
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'TaskService.advanceToInProgress',
            Label : '{i18n>Iniciar}',
            Inline: true
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'TaskService.advanceToDone',
            Label : '{i18n>Concluir}',
            Inline: true
        },
        {
            Value                : dueDate,
            ![@HTML5.CssDefaults]: {width: '12rem'}
        },
        {
            Value                : createdBy,
            ![@HTML5.CssDefaults]: {width: '12rem'}
        },
        {
            Value                : modifiedAt,
            ![@HTML5.CssDefaults]: {width: '12rem'}
        }
    ],

    UI.FieldGroup #General: {Data: [
        {Value: title},
        {Value: description},
        {Value: status},
        {Value: priority},
        {Value: dueDate},
        {Value: isArchived}
    ]},

    UI.Identification     : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'TaskService.advanceToInProgress',
            Label : '{i18n>Iniciar}'
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'TaskService.advanceToDone',
            Label : '{i18n>Concluir}'
        }
    ],

    UI.HeaderInfo         : {
        TypeName      : '{i18n>Task}',
        TypeNamePlural: '{i18n>Tasks}',
        Title         : {Value: title},
        Description   : {Value: description}
    },

    UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>GeneralInformation}',
        Target: '@UI.FieldGroup#General'
    }]
);
