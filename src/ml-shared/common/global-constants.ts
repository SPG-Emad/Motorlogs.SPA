import {environment} from '../../environments/environment';

export class GlobalConstants {
    public static apiURL: string = environment.apiURL;
    public static sessionTimeout: number = environment.sessionTimeout;
}
