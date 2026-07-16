import { isEmpty as isEmptyLodash, isUndefined } from 'lodash';
import { AnyObj } from '../interfaces';

/**
 * Get the copy of object with only specified attributes.
 *
 * @param {any} obj
 * @param {any[]} attrs
 * @returns {T}
 */
export function withOnlyAttrs<T extends object, K extends keyof T>(obj: T, attrs: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of attrs) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Get the copy of object without attributes.
 *
 * @param {any} obj
 * @param {any[]} attrsToExclude
 * @returns {T}
 */
export function withoutAttrs<T extends object, K extends keyof T>(obj: T, attrsToExclude: K[]): Omit<T, K> {
  const result = {} as Omit<T, K>;

  for (const key of Object.keys(obj)) {
    if (!attrsToExclude.includes(key as K)) {
      result[key as Exclude<keyof T, K>] = (obj as any)[key];
    }
  }

  return result;
}

/**
 * Get the copy of list of objects without attributes.
 *
 * @param {object[]} obj
 * @param {any[]} attrsToExclude
 * @returns {T[]}
 */
export function listWithoutAttrs<T extends object, K extends keyof T>(obj: T[], attrsToExclude: K[]): Omit<T, K>[] {
  return obj.map((item) => withoutAttrs<T, K>(item, attrsToExclude));
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (_e) {
    return false;
  }

  return true;
}

export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const flatObj: Record<string, any> = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        const nestedObj = flattenObject(obj[key], prefixedKey);
        Object.assign(flatObj, nestedObj);
      } else {
        flatObj[prefixedKey] = obj[key];
      }
    }
  }

  return flatObj;
}

export function withoutEmptyValues<T>(obj: AnyObj): T {
  const result: AnyObj = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      result[key] = obj[key];
    }
  }

  return result as T;
}

export function isDefined(value: any) {
  return !isUndefined(value);
}

export function isEmpty(value: any) {
  return isEmptyLodash(value);
}

export function parseToObject(data: any) {
  try {
    return JSON.parse(data);
  } catch (_error) {
    return data;
  }
}

export function mapToPrefixedObject<T extends Record<string, any>>(source: T, keys: (keyof T)[], prefix: string): Record<string, any> {
  return keys.reduce((acc: Record<string, any>, key) => {
    if (source[key] !== undefined) {
      acc[`${prefix}.${String(key)}`] = source[key];
    }
    return acc;
  }, {});
}
