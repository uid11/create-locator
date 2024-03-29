import type {CreateComponentLocator} from './oldTypes';

/**
 * Attributes object.
 */
export type Attributes = Readonly<Record<string, string>> | undefined;

/**
 * Constraint of description of child locators, that is the second argument of `createLocator`.
 */
export type ChildLocatorsConstraint = Readonly<Record<string, Parameters | null>>;

/**
 * Type of `createLocator` function (with overloads).
 */
export type CreateLocatorFunction = (<
  const LocatorId extends string,
  const ChildLocators extends ChildLocatorsConstraint = {},
>(
  this: void,
  locatorId: LocatorId,
  childLocators?: ChildLocators,
) => true extends
  | IsEqual<LocatorId, string>
  | IsEqual<LocatorId, never>
  | IsEqual<ChildLocators, ChildLocatorsConstraint>
  ? unknown
  : Locator<LocatorId, ChildLocators>) &
  CreateComponentLocator;

/**
 * Returns `true` if types are exactly equal, `false` otherwise.
 * `IsEqual<{foo: string}, {foo: string}>` = `true`.
 * `IsEqual<{readonly foo: string}, {foo: string}>` = `false`.
 */
export type IsEqual<X, Y> =
  (<Type>() => Type extends X ? 1 : 2) extends <Type>() => Type extends Y ? 1 : 2 ? true : false;

/**
 * Locator.
 */
export type Locator<LocatorId, ChildLocators extends ChildLocatorsConstraint> = Readonly<
  Record<LocatorIdKey, LocatorId>
> &
  LocatorFunction<AddUndefinedIfRequiredParametersEmpty<GetRootParameters<ChildLocators>>> &
  ChildLocatorsFunctions<Omit<ChildLocators, 'root'>>;

/**
 * Symbol key for locator id.
 */
export declare const LOCATOR_ID: unique symbol;

/**
 * Global locator options. Locators return attributes only after options are set.
 */
export type Options = Readonly<{
  childLocatorIdSeparator: string;
  locatorIdAttribute: string;
  parameterAttributePrefix: string;
}>;

/**
 * Locator parameters.
 */
export type Parameters = Readonly<Record<string, string>>;

/**
 * Adds `undefined` to parameters if there are no required parameters.
 */
type AddUndefinedIfRequiredParametersEmpty<SomeParameters> =
  IsRequiredParametersEmpty<SomeParameters> extends true
    ? SomeParameters | undefined
    : SomeParameters;

/**
 * Child locator functions of root locator.
 */
type ChildLocatorsFunctions<ChildLocators> = {
  readonly [Key in string & keyof ChildLocators]: LocatorFunction<
    AddUndefinedIfRequiredParametersEmpty<ChildLocators[Key]>
  >;
};

/**
 * Get type of root locator parameters from `ChildLocators` type.
 */
type GetRootParameters<
  ChildLocators extends ChildLocatorsConstraint,
  RootParameters = ChildLocators['root'],
> = RootParameters extends Parameters ? RootParameters : undefined;

/**
 * Returns `true` if type includes `undefined`, `false` otherwise.
 * `IsIncludeUndefined<string>` = `false`.
 * `IsIncludeUndefined<number | undefined>` = `true`.
 */
type IsIncludeUndefined<Type> = true extends (Type extends undefined ? true : never) ? true : false;

/**
 * Returns `true` if there are no required parameters, `false` otherwise.
 */
type IsRequiredParametersEmpty<SomeParameters> =
  RequiredKeys<SomeParameters> extends never ? true : false;

/**
 * Returns all keys of type.
 * `Keys<{foo: string}>` = `"foo"`.
 * `Keys<{foo: string} | {bar?: number}>` = `"foo" | "bar"`.
 */
type Keys<Type> = Type extends unknown ? keyof Type : never;

/**
 * Arguments of function part of locator by locator parameters.
 */
type LocatorArguments<SomeParameters> =
  IsIncludeUndefined<SomeParameters> extends true
    ? [parameters?: SomeParameters]
    : [parameters: SomeParameters];

/**
 * The function part of locator.
 */
type LocatorFunction<SomeParameters, Return = Attributes> = (
  this: void,
  ...arguments: LocatorArguments<SomeParameters>
) => Return;
/**
 * Type of symbol key for locator id.
 */
type LocatorIdKey = typeof LOCATOR_ID;

/**
 * Returns required keys of type.
 * `RequiredKeys<{foo: string}>` = `"foo"`.
 * `RequiredKeys<{foo: string, bar?: number}>` = `"foo"`.
 */
type RequiredKeys<Type, TypeKeys = Keys<Type>> =
  TypeKeys extends Keys<Type>
    ? Type extends Required<Pick<Type, TypeKeys>>
      ? TypeKeys
      : never
    : never;
