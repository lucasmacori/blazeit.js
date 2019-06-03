export interface IField {
    translateForMongoose(): object;
    translateForSequelize(): object;
}