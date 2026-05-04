import Ajv from "ajv";
import addFormats from "ajv-formats";
import schemas from "./schemas.json";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validate(type: string, data: any) {
  const schema = schemas[type];
  if (!schema) return true;

  const validateFn = ajv.compile(schema);
  return validateFn(data);
}
