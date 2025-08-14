import { connectToDatabase } from "./connect-to-db";
import dayjs from "dayjs";
import { Db, InsertOneResult, UpdateResult } from "mongodb";

export interface DefaultFields {
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
}

export interface CreateDocumentOptions<T> {
  collectionName: string;
  data: T;
  userId: string;
}

export interface UpdateDocumentOptions<T> {
  collectionName: string;
  filter: Record<string, unknown>;
  data: Partial<T>;
  userId: string;
}

export function addDefaultFields<T>(data: T, userId: string, isUpdate: boolean = false) {
  const now = dayjs().toISOString();
  
  if (isUpdate) {
    return {
      ...data,
      UpdatedAt: now,
      UpdatedBy: userId,
    };
  }
  
  return {
    ...data,
    CreatedAt: now,
    UpdatedAt: now,
    CreatedBy: userId,
    UpdatedBy: userId,
  } as T & DefaultFields;
}

export async function createDocument<T>(
  options: CreateDocumentOptions<T>
): Promise<{ result: InsertOneResult; document: T & DefaultFields & { id: string } }> {
  const { db } = await connectToDatabase();
  
  const documentWithDefaults = addDefaultFields(options.data, options.userId) as T & DefaultFields;
  
  const result = await db
    .collection(options.collectionName)
    .insertOne(documentWithDefaults);
  
  const createdDocument = {
    id: result.insertedId.toString(),
    ...documentWithDefaults,
  };
  
  return { result, document: createdDocument };
}

export async function updateDocument<T>(
  options: UpdateDocumentOptions<T>
): Promise<{ result: UpdateResult; db: Db }> {
  const { db } = await connectToDatabase();
  
  const updateWithDefaults = addDefaultFields(options.data, options.userId, true);
  
  const result = await db
    .collection(options.collectionName)
    .updateOne(options.filter, { $set: updateWithDefaults });
  
  return { result, db };
}