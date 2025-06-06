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
import { Document } from 'mongoose';
export type DiagnoseListDocument = DiagnoseList & Document;
export declare class DiagnoseList {
    diagnose_list_id: string;
    lesion_type: string;
    date: Date;
    image: string;
    accuracy: number;
    rating: number;
}
export declare const DiagnoseListSchema: import("mongoose").Schema<DiagnoseList, import("mongoose").Model<DiagnoseList, any, any, any, Document<unknown, any, DiagnoseList> & Omit<DiagnoseList & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DiagnoseList, Document<unknown, {}, import("mongoose").FlatRecord<DiagnoseList>> & Omit<import("mongoose").FlatRecord<DiagnoseList> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
