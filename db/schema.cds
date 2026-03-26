namespace cap.start;

using {
    cuid,
    managed
} from '@sap/cds/common';

type TaskStatus : String enum {
    Aberta;
    Fazendo;
    Concluida;
}

type TaskPriority : String enum {
    Baixa;
    Média;
    Alta;
}

entity Tasks : cuid, managed {
    title       : localized String(111);
    description : localized String(1000);
    @assert.range: true
    status      : TaskStatus default 'Aberta';
    @assert.range: true
    priority    : TaskPriority default 'Média';
    dueDate     : Date;
    isArchived  : Boolean default false;
}
