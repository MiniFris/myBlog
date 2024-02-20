import { plainToClass } from 'class-transformer';

type NonConstructorKeys<T> = ({[P in keyof T]: T[P] extends new () => any ? never : P })[keyof T];
type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>;
type ThisConstructor<T> = NonConstructor<typeof HttpResponse> & { new(): T };

export class HttpResponse {

    static createFromArray<T extends HttpResponse>(this: ThisConstructor<T>, obj: Promise<{ [k in keyof T]?: T[k] }[]>): Promise<T[]>
    static createFromArray<T extends HttpResponse>(this: ThisConstructor<T>, obj: { [k in keyof T]?: T[k] }[]): T[]
    static createFromArray<T extends HttpResponse>(this: ThisConstructor<T>, obj: Promise<{ [k in keyof T]?: T[k] }[]> | { [k in keyof T]?: T[k] }[]): Promise<T[]> | T[] {
        const create = HttpResponse.create.bind(this);
        if(!HttpResponse.isPromise(obj)) return (<{ [k in keyof T]?: T[k] }[]>obj).map(create);
        return new Promise((res, rej) => (<Promise<{ [k in keyof T]?: T[k] }[]>>obj)
            .then(v => {
                try { res(v.map(create)) } catch(e) { rej(e) }
            }).catch(rej));
    }

    static create<T extends HttpResponse>(this: ThisConstructor<T>, obj: Promise<{ [k in keyof T]?: T[k] }>): Promise<T>
    static create<T extends HttpResponse>(this: ThisConstructor<T>, obj: { [k in keyof T]?: T[k] }): T
    static create<T extends HttpResponse>(this: ThisConstructor<T>, obj: Promise<{ [k in keyof T]?: T[k] }> | { [k in keyof T]?: T[k] } = {}): Promise<T> | T {
        const objToClass = HttpResponse.objToClass.bind(this);
        if(!HttpResponse.isPromise(obj)) return objToClass(obj);
        return new Promise((res, rej) => (<Promise<{ [k in keyof T]?: T[k] }>>obj)
            .then(v => {
                try { res(objToClass(v)) } catch(e) { rej(e) }
            }).catch(rej));
    }

    private static isPromise(p) {
        return typeof p?.then === 'function';
    }

    private static objToClass<T extends HttpResponse>(this: ThisConstructor<T>, obj: any = {}): T {
        obj = JSON.parse(JSON.stringify(obj));
        return plainToClass(this, obj, { excludeExtraneousValues: true });
    }
}