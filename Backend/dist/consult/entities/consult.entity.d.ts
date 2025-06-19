/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from 'mongoose';
export type ConsultDocument = Consult & Document;
export declare class Consult {
    consult_id: string;
    doctorID: Types.ObjectId;
    patientID: Types.ObjectId;
    scheduledTime: Date;
    status: string;
    consultMethod: string;
    notes: string;
    meetingLink: string;
    feedback: string;
    deleted: boolean;
}
export declare const ConsultSchema: import("mongoose").Schema<Consult, import("mongoose").Model<Consult, any, any, any, Document<unknown, any, Consult> & Omit<Consult & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Consult, Document<unknown, {}, import("mongoose").FlatRecord<Consult>> & Omit<import("mongoose").FlatRecord<Consult> & {
    _id: Types.ObjectId;
}, never>>;
