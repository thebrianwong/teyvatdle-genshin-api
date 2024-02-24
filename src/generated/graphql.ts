import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type CharacterData = {
  __typename?: 'CharacterData';
  ascensionBossMaterial?: Maybe<Scalars['String']['output']>;
  ascensionBossMaterialImageUrl?: Maybe<Scalars['String']['output']>;
  ascensionStat: Stat;
  birthday?: Maybe<Scalars['Date']['output']>;
  characterCorrectImageUrl: Scalars['String']['output'];
  characterId: Scalars['ID']['output'];
  characterImageUrl: Scalars['String']['output'];
  characterName: Scalars['String']['output'];
  characterWrongImageUrl: Scalars['String']['output'];
  element: GenshinElement;
  enhancementMaterial: Scalars['String']['output'];
  enhancementMaterialImageUrl: Scalars['String']['output'];
  gender: Gender;
  height: Height;
  localSpecialty: Scalars['String']['output'];
  localSpecialtyImageUrl: Scalars['String']['output'];
  rarity: Scalars['Int']['output'];
  region?: Maybe<Region>;
  talentBook: Array<Scalars['String']['output']>;
  talentBookImageUrl: Array<Scalars['String']['output']>;
  talentBossMaterial: Scalars['String']['output'];
  talentBossMaterialImageUrl: Scalars['String']['output'];
  weaponType: WeaponType;
};

export type ConstellationData = {
  __typename?: 'ConstellationData';
  characterImageUrl: Scalars['String']['output'];
  characterName: Scalars['String']['output'];
  constellationId: Scalars['ID']['output'];
  constellationImageUrl: Scalars['String']['output'];
  constellationLevel: Scalars['Int']['output'];
  constellationName: Scalars['String']['output'];
};

export type DailyRecordData = {
  __typename?: 'DailyRecordData';
  characterId: Scalars['ID']['output'];
  characterSolved: Scalars['Int']['output'];
  constellationId: Scalars['ID']['output'];
  constellationSolved: Scalars['Int']['output'];
  dailyRecordId: Scalars['ID']['output'];
  foodId: Scalars['ID']['output'];
  foodSolved: Scalars['Int']['output'];
  talentId: Scalars['ID']['output'];
  talentSolved: Scalars['Int']['output'];
  weaponId: Scalars['ID']['output'];
  weaponSolved: Scalars['Int']['output'];
};

export type FoodData = {
  __typename?: 'FoodData';
  event: Scalars['Boolean']['output'];
  foodId: Scalars['ID']['output'];
  foodImageUrl: Scalars['String']['output'];
  foodName: Scalars['String']['output'];
  foodType: FoodType;
  purchasable: Scalars['Boolean']['output'];
  rarity: Scalars['Int']['output'];
  recipe: Scalars['Boolean']['output'];
  specialDish: Scalars['Boolean']['output'];
};

export enum FoodType {
  AdventurersDishes = 'ADVENTURERS_DISHES',
  AtkBoostingDishes = 'ATK_BOOSTING_DISHES',
  DefBoostingDishes = 'DEF_BOOSTING_DISHES',
  EssentialOils = 'ESSENTIAL_OILS',
  Potions = 'POTIONS',
  RecoveryDishes = 'RECOVERY_DISHES'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export enum GenshinElement {
  Anemo = 'ANEMO',
  Cryo = 'CRYO',
  Dendro = 'DENDRO',
  Electro = 'ELECTRO',
  Geo = 'GEO',
  Hydro = 'HYDRO',
  Pyro = 'PYRO'
}

export enum Height {
  Medium = 'MEDIUM',
  Short = 'SHORT',
  Tall = 'TALL'
}

export type LocalSpecialtyData = {
  __typename?: 'LocalSpecialtyData';
  imageUrl: Scalars['String']['output'];
  localSpecialty: Scalars['String']['output'];
  region: Region;
};

export type Query = {
  __typename?: 'Query';
  characterData: Array<CharacterData>;
  constellationData: Array<ConstellationData>;
  dailyRecord: DailyRecordData;
  foodData: Array<FoodData>;
  localSpecialtyData: Array<LocalSpecialtyData>;
  regionData: Array<RegionData>;
  talentData: Array<TalentData>;
  weaponData: Array<WeaponData>;
};

export enum Region {
  Fontaine = 'FONTAINE',
  Inazuma = 'INAZUMA',
  Liyue = 'LIYUE',
  Mondstadt = 'MONDSTADT',
  Natlan = 'NATLAN',
  Snezhnaya = 'SNEZHNAYA',
  Sumeru = 'SUMERU'
}

export type RegionData = {
  __typename?: 'RegionData';
  id: Scalars['ID']['output'];
  name: Region;
};

export enum Stat {
  AnemoDmgBonus = 'ANEMO_DMG_BONUS',
  Atk = 'ATK',
  CritDmg = 'CRIT_DMG',
  CritRate = 'CRIT_RATE',
  CryoDmgBonus = 'CRYO_DMG_BONUS',
  Def = 'DEF',
  DendroDmgBonus = 'DENDRO_DMG_BONUS',
  ElectroDmgBonus = 'ELECTRO_DMG_BONUS',
  ElementalMastery = 'ELEMENTAL_MASTERY',
  EnergyRecharge = 'ENERGY_RECHARGE',
  GeoDmgBonus = 'GEO_DMG_BONUS',
  HealingBonus = 'HEALING_BONUS',
  Hp = 'HP',
  HydroDmgBonus = 'HYDRO_DMG_BONUS',
  PhysicalDmgBonus = 'PHYSICAL_DMG_BONUS',
  PyroDmgBonus = 'PYRO_DMG_BONUS'
}

export type TalentData = {
  __typename?: 'TalentData';
  characterImageUrl: Scalars['String']['output'];
  characterName: Scalars['String']['output'];
  talentId: Scalars['ID']['output'];
  talentImageUrl: Scalars['String']['output'];
  talentName: Scalars['String']['output'];
  talentType: TalentType;
};

export enum TalentType {
  AlternateSprint = 'ALTERNATE_SPRINT',
  ElementalBurst = 'ELEMENTAL_BURST',
  ElementalSkill = 'ELEMENTAL_SKILL',
  FirstAscensionPassive = 'FIRST_ASCENSION_PASSIVE',
  FourthAscensionPassive = 'FOURTH_ASCENSION_PASSIVE',
  NormalAttack = 'NORMAL_ATTACK',
  Passive = 'PASSIVE',
  UtilityPassive = 'UTILITY_PASSIVE'
}

export type WeaponData = {
  __typename?: 'WeaponData';
  commonEnemyMaterial: Scalars['String']['output'];
  commonEnemyMaterialImageUrl: Scalars['String']['output'];
  eliteEnemyMaterial: Scalars['String']['output'];
  eliteEnemyMaterialImageUrl: Scalars['String']['output'];
  gacha: Scalars['Boolean']['output'];
  rarity: Scalars['Int']['output'];
  subStat?: Maybe<Stat>;
  weaponDomainMaterial: Scalars['String']['output'];
  weaponDomainMaterialImageUrl: Scalars['String']['output'];
  weaponId: Scalars['ID']['output'];
  weaponImageURL: Scalars['String']['output'];
  weaponName: Scalars['String']['output'];
  weaponType: WeaponType;
};

export enum WeaponType {
  Bow = 'BOW',
  Catalyst = 'CATALYST',
  Claymore = 'CLAYMORE',
  Polearm = 'POLEARM',
  Sword = 'SWORD'
}

export type WebSocketData = {
  __typename?: 'WebSocketData';
  newSolvedValue: Scalars['Int']['output'];
  type: WebSocketDataKeys;
};

export enum WebSocketDataKeys {
  Character = 'CHARACTER',
  Constellation = 'CONSTELLATION',
  Food = 'FOOD',
  Talent = 'TALENT',
  Weapon = 'WEAPON'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CharacterData: ResolverTypeWrapper<CharacterData>;
  ConstellationData: ResolverTypeWrapper<ConstellationData>;
  DailyRecordData: ResolverTypeWrapper<DailyRecordData>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  FoodData: ResolverTypeWrapper<FoodData>;
  FoodType: FoodType;
  Gender: Gender;
  GenshinElement: GenshinElement;
  Height: Height;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LocalSpecialtyData: ResolverTypeWrapper<LocalSpecialtyData>;
  Query: ResolverTypeWrapper<{}>;
  Region: Region;
  RegionData: ResolverTypeWrapper<RegionData>;
  Stat: Stat;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TalentData: ResolverTypeWrapper<TalentData>;
  TalentType: TalentType;
  WeaponData: ResolverTypeWrapper<WeaponData>;
  WeaponType: WeaponType;
  WebSocketData: ResolverTypeWrapper<WebSocketData>;
  WebSocketDataKeys: WebSocketDataKeys;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CharacterData: CharacterData;
  ConstellationData: ConstellationData;
  DailyRecordData: DailyRecordData;
  Date: Scalars['Date']['output'];
  FoodData: FoodData;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LocalSpecialtyData: LocalSpecialtyData;
  Query: {};
  RegionData: RegionData;
  String: Scalars['String']['output'];
  TalentData: TalentData;
  WeaponData: WeaponData;
  WebSocketData: WebSocketData;
};

export type CharacterDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['CharacterData'] = ResolversParentTypes['CharacterData']> = {
  ascensionBossMaterial?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ascensionBossMaterialImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ascensionStat?: Resolver<ResolversTypes['Stat'], ParentType, ContextType>;
  birthday?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  characterCorrectImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  characterImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterWrongImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  element?: Resolver<ResolversTypes['GenshinElement'], ParentType, ContextType>;
  enhancementMaterial?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enhancementMaterialImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Height'], ParentType, ContextType>;
  localSpecialty?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  localSpecialtyImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rarity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  talentBook?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  talentBookImageUrl?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  talentBossMaterial?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  talentBossMaterialImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weaponType?: Resolver<ResolversTypes['WeaponType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConstellationDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConstellationData'] = ResolversParentTypes['ConstellationData']> = {
  characterImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  constellationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  constellationImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  constellationLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  constellationName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailyRecordDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyRecordData'] = ResolversParentTypes['DailyRecordData']> = {
  characterId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  characterSolved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  constellationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  constellationSolved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dailyRecordId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  foodId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  foodSolved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  talentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  talentSolved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  weaponId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  weaponSolved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FoodDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodData'] = ResolversParentTypes['FoodData']> = {
  event?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  foodId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  foodImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foodName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foodType?: Resolver<ResolversTypes['FoodType'], ParentType, ContextType>;
  purchasable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rarity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recipe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  specialDish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocalSpecialtyDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocalSpecialtyData'] = ResolversParentTypes['LocalSpecialtyData']> = {
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  localSpecialty?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['Region'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  characterData?: Resolver<Array<ResolversTypes['CharacterData']>, ParentType, ContextType>;
  constellationData?: Resolver<Array<ResolversTypes['ConstellationData']>, ParentType, ContextType>;
  dailyRecord?: Resolver<ResolversTypes['DailyRecordData'], ParentType, ContextType>;
  foodData?: Resolver<Array<ResolversTypes['FoodData']>, ParentType, ContextType>;
  localSpecialtyData?: Resolver<Array<ResolversTypes['LocalSpecialtyData']>, ParentType, ContextType>;
  regionData?: Resolver<Array<ResolversTypes['RegionData']>, ParentType, ContextType>;
  talentData?: Resolver<Array<ResolversTypes['TalentData']>, ParentType, ContextType>;
  weaponData?: Resolver<Array<ResolversTypes['WeaponData']>, ParentType, ContextType>;
};

export type RegionDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegionData'] = ResolversParentTypes['RegionData']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['Region'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TalentDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['TalentData'] = ResolversParentTypes['TalentData']> = {
  characterImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  characterName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  talentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  talentImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  talentName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  talentType?: Resolver<ResolversTypes['TalentType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeaponDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeaponData'] = ResolversParentTypes['WeaponData']> = {
  commonEnemyMaterial?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commonEnemyMaterialImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eliteEnemyMaterial?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eliteEnemyMaterialImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gacha?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rarity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subStat?: Resolver<Maybe<ResolversTypes['Stat']>, ParentType, ContextType>;
  weaponDomainMaterial?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weaponDomainMaterialImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weaponId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  weaponImageURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weaponName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  weaponType?: Resolver<ResolversTypes['WeaponType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebSocketDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebSocketData'] = ResolversParentTypes['WebSocketData']> = {
  newSolvedValue?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['WebSocketDataKeys'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CharacterData?: CharacterDataResolvers<ContextType>;
  ConstellationData?: ConstellationDataResolvers<ContextType>;
  DailyRecordData?: DailyRecordDataResolvers<ContextType>;
  Date?: GraphQLScalarType;
  FoodData?: FoodDataResolvers<ContextType>;
  LocalSpecialtyData?: LocalSpecialtyDataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegionData?: RegionDataResolvers<ContextType>;
  TalentData?: TalentDataResolvers<ContextType>;
  WeaponData?: WeaponDataResolvers<ContextType>;
  WebSocketData?: WebSocketDataResolvers<ContextType>;
};

