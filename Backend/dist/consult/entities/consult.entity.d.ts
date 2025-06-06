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
export type ConsultListDocument = ConsultList & Document;
export declare class ConsultList {
    consult_id: string;
    date: Date;
    patient_id: Types.ObjectId;
    patient_description: string;
    result: string;
}
export declare const ConsultListSchema: import("mongoose").Schema<ConsultList, import("mongoose").Model<ConsultList, any, any, any, Document<unknown, any, ConsultList> & Omit<ConsultList & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultList, Document<unknown, {}, import("mongoose").FlatRecord<ConsultList>> & Omit<import("mongoose").FlatRecord<ConsultList> & {
    _id: Types.ObjectId;
}, never>>;
