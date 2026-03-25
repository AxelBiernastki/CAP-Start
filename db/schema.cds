namespace cap.start;

using {
    cuid,
    managed
} from '@sap/cds/common';

type TaskStatus : String enum {
    OPEN;
    IN_PROGRESS;
    DONE;
}

type TaskPriority : String enum {
    LOW;
    MEDIUM;
    HIGH;
}

entity Tasks : cuid, managed {
    title       : localized String(111);
    description : localized String(1000);
    status      : TaskStatus default 'OPEN';
    priority    : TaskPriority default 'MEDIUM';
    dueDate     : Date;
    isArchived  : Boolean default false;
}
