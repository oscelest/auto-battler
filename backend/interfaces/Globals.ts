export interface SchemaResponse {
  __schema: Schema;
}

export interface TypeResponse {
  __type: SchemaType;
}

export interface Schema {
  types: SchemaType[];
  queryType: SchemaField[];
  mutationType: SchemaField[];
}

export interface SchemaType {
  kind: SchemaTypeKind;
  name: string;
  description: string;
  fields: SchemaField[];
  interfaces: SchemaType[];
  possibleTypes: SchemaType[];
  enumValues: SchemaEnumValue[];
  inputFields: SchemaInputValue[];
  ofType: SchemaType;
}

export interface SchemaField {
  name: string;
  description: string;
  args: SchemaInputValue[];
  type: SchemaType;
  isDeprecated: boolean;
  deprecationReason: string;
}

export interface SchemaEnumValue {
  name: string;
  description: string;
  isDeprecated: boolean;
  deprecationReason: string;
}

export interface SchemaInputValue {
  name: string;
  description: string;
  type: SchemaType;
  defaultValue: string;
}

export enum SchemaTypeKind {
  SCALAR       = "SCALAR",
  OBJECT       = "OBJECT",
  INTERFACE    = "INTERFACE",
  UNION        = "UNION",
  ENUM         = "ENUM",
  INPUT_OBJECT = "INPUT_OBJECT",
  LIST         = "LIST",
  NON_NULL     = "NON_NULL",
}
